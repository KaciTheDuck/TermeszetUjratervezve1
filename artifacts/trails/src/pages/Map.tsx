import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { Search, X, MapPin, Navigation, NavigationOff } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Trail {
  id: number;
  name: string;
  location: string;
  description: string;
  distance: number;
  elevation: number;
  difficulty: string;
  duration: string;
  start_lat: number | null;
  start_lon: number | null;
  coordinates: [number, number][];
  points_of_interest: { name: string; lat: number; lon: number; description?: string }[];
  tags: string[];
  image_url: string | null;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  "Könnyű": "#588157",
  "Közepes": "#e9a826",
  "Nehéz": "#E07B39",
  "Nagyon nehéz": "#C0392B",
};

// ─── Inject global CSS once ───────────────────────────────────────────────────
const CSS = `
  @keyframes gps-pulse {
    0%   { transform: scale(1);   opacity: 1; }
    70%  { transform: scale(2.8); opacity: 0; }
    100% { transform: scale(1);   opacity: 0; }
  }
  .gps-dot-wrap { position: relative; width: 20px; height: 20px; }
  .gps-dot {
    position: absolute; inset: 0; margin: auto;
    width: 14px; height: 14px; border-radius: 50%;
    background: #2563eb; border: 2px solid white;
    box-shadow: 0 0 6px rgba(37,99,235,0.6);
  }
  .gps-ring {
    position: absolute; inset: 0; margin: auto;
    width: 14px; height: 14px; border-radius: 50%;
    background: rgba(37,99,235,0.35);
    animation: gps-pulse 1.8s ease-out infinite;
  }
  .trail-pin {
    width: 32px; height: 36px;
    display: flex; flex-direction: column; align-items: center;
  }
  .trail-pin-circle {
    width: 28px; height: 28px; border-radius: 50%;
    border: 3px solid white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.35);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; line-height: 1;
  }
  .trail-pin-tail {
    width: 2px; height: 8px;
    background: white; border-radius: 1px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }
  .trail-pin-selected .trail-pin-circle {
    width: 34px; height: 34px;
    box-shadow: 0 0 0 4px rgba(88,129,87,0.4), 0 2px 10px rgba(0,0,0,0.4);
  }
  .marker-cluster-small  { background-color: rgba(88,129,87,0.6) !important; }
  .marker-cluster-small div  { background-color: #344E41 !important; color: white !important; font-weight: bold !important; }
  .marker-cluster-medium { background-color: rgba(163,177,138,0.6) !important; }
  .marker-cluster-medium div { background-color: #588157 !important; color: white !important; font-weight: bold !important; }
  .marker-cluster-large  { background-color: rgba(52,78,65,0.6) !important; }
  .marker-cluster-large div  { background-color: #3A5A40 !important; color: white !important; font-weight: bold !important; }
`;

function injectCSS() {
  if (document.getElementById("trail-map-css")) return;
  const s = document.createElement("style");
  s.id = "trail-map-css";
  s.textContent = CSS;
  document.head.appendChild(s);
}

// ─── Icon factories ───────────────────────────────────────────────────────────
function trailIcon(difficulty: string, selected = false) {
  const color = DIFFICULTY_COLOR[difficulty] ?? "#888";
  const emoji = difficulty === "Könnyű" ? "🟢" : difficulty === "Közepes" ? "🟡" : difficulty === "Nehéz" ? "🟠" : "🔴";
  return L.divIcon({
    className: "",
    html: `<div class="trail-pin ${selected ? "trail-pin-selected" : ""}">
             <div class="trail-pin-circle" style="background:${color}">${emoji}</div>
             <div class="trail-pin-tail"></div>
           </div>`,
    iconSize: [32, 36],
    iconAnchor: [16, 36],
    popupAnchor: [0, -36],
  });
}

const gpsIcon = L.divIcon({
  className: "",
  html: `<div class="gps-dot-wrap"><div class="gps-ring"></div><div class="gps-dot"></div></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// ─── Component ────────────────────────────────────────────────────────────────
export default function MapPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef       = useRef<L.Map | null>(null);
  const clusterRef   = useRef<L.MarkerClusterGroup | null>(null);
  const gpsMarkerRef = useRef<L.Marker | null>(null);
  const polylineRef  = useRef<L.Polyline | null>(null);
  const poiLayerRef  = useRef<L.LayerGroup | null>(null);
  const watchIdRef   = useRef<number | null>(null);
  const markerMapRef = useRef<Map<number, L.Marker>>(new Map());

  const [allTrails,    setAllTrails]    = useState<Trail[]>([]);
  const [selectedTrail, setSelectedTrail] = useState<Trail | null>(null);
  const [showPanel,    setShowPanel]    = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");
  const [searchResults,setSearchResults]= useState<Trail[]>([]);
  const [showSearch,   setShowSearch]   = useState(false);
  const [gpsActive,    setGpsActive]    = useState(false);
  const [gpsError,     setGpsError]     = useState<string | null>(null);
  const [gpsFollowing, setGpsFollowing] = useState(false);

  // ── 1. Init map ────────────────────────────────────────────────────────────
  useEffect(() => {
    injectCSS();
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [45.9432, 24.9668],
      zoom: 7,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenTopoMap",
      maxZoom: 17,
    }).addTo(map);

    L.tileLayer("https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png", {
      attribution: "&copy; Waymarked Trails",
      maxZoom: 17,
      opacity: 0.65,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const cluster = (L as any).markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 60,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      animate: true,
    }) as L.MarkerClusterGroup;

    cluster.addTo(map);
    clusterRef.current = cluster;

    poiLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // ── 2. Load trails → cluster markers ──────────────────────────────────────
  useEffect(() => {
    fetch("/api/trails")
      .then((r) => r.json())
      .then((trails: Trail[]) => {
        setAllTrails(trails);

        const cluster = clusterRef.current;
        if (!cluster) return;
        cluster.clearLayers();
        markerMapRef.current.clear();

        trails.forEach((trail) => {
          if (!trail.start_lat || !trail.start_lon) return;

          const marker = L.marker([trail.start_lat, trail.start_lon], {
            icon: trailIcon(trail.difficulty),
          });

          marker.bindTooltip(trail.name, { direction: "top", offset: [0, -32], opacity: 0.95 });
          marker.on("click", () => handleSelectTrail(trail));

          cluster.addLayer(marker);
          markerMapRef.current.set(trail.id, marker);
        });
      })
      .catch(console.error);
  }, []);

  // ── 3. Load trail from URL ?trailId= ──────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trailId = params.get("trailId");
    if (!trailId) return;

    fetch(`/api/trails/${trailId}`)
      .then((r) => r.json())
      .then((trail: Trail) => handleSelectTrail(trail))
      .catch(console.error);
  }, []);

  // ── Select trail ──────────────────────────────────────────────────────────
  const handleSelectTrail = useCallback((trail: Trail) => {
    const map = mapRef.current;
    if (!map) return;

    // Reset previously selected marker icon
    setSelectedTrail((prev) => {
      if (prev) {
        const oldMarker = markerMapRef.current.get(prev.id);
        if (oldMarker) oldMarker.setIcon(trailIcon(prev.difficulty, false));
      }
      return trail;
    });

    // Highlight new marker
    const marker = markerMapRef.current.get(trail.id);
    if (marker) marker.setIcon(trailIcon(trail.difficulty, true));

    // Clear old polyline + POIs
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null; }
    if (poiLayerRef.current) poiLayerRef.current.clearLayers();

    // Draw route polyline
    if (trail.coordinates?.length > 1) {
      polylineRef.current = L.polyline(trail.coordinates, {
        color: "#344E41", weight: 4, opacity: 0.9,
        lineCap: "round", lineJoin: "round",
      }).addTo(map);
    }

    // Draw POI markers
    if (poiLayerRef.current && trail.points_of_interest?.length) {
      trail.points_of_interest.forEach((poi) => {
        const poiMarker = L.marker([poi.lat, poi.lon], {
          icon: L.divIcon({
            className: "",
            html: `<div style="background:#A3B18A;border:2px solid white;border-radius:50%;width:16px;height:16px;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
            iconSize: [16, 16], iconAnchor: [8, 8],
          }),
        });
        poiMarker.bindPopup(`<b>${poi.name}</b>${poi.description ? `<br><span style="font-size:12px;color:#666">${poi.description}</span>` : ""}`);
        poiLayerRef.current!.addLayer(poiMarker);
      });
    }

    // Fly to trail
    if (trail.start_lat && trail.start_lon) {
      map.flyTo([trail.start_lat, trail.start_lon], 12, { animate: true, duration: 1 });
    }
    if (trail.coordinates?.length > 1) {
      setTimeout(() => {
        if (polylineRef.current && mapRef.current) {
          mapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [60, 60], animate: true });
        }
      }, 600);
    }

    setGpsFollowing(false);
    setShowPanel(true);
  }, []);

  // ── Clear selected trail ──────────────────────────────────────────────────
  const clearTrail = useCallback(() => {
    if (selectedTrail) {
      const marker = markerMapRef.current.get(selectedTrail.id);
      if (marker) marker.setIcon(trailIcon(selectedTrail.difficulty, false));
    }
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null; }
    if (poiLayerRef.current) poiLayerRef.current.clearLayers();
    setSelectedTrail(null);
    setShowPanel(false);
    mapRef.current?.flyTo([45.9432, 24.9668], 7, { animate: true, duration: 1.2 });
  }, [selectedTrail]);

  // ── GPS tracking ──────────────────────────────────────────────────────────
  const toggleGPS = useCallback(() => {
    if (!navigator.geolocation) { setGpsError("GPS nem elérhető ezen az eszközön"); return; }

    if (gpsActive) {
      if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      if (gpsMarkerRef.current) { gpsMarkerRef.current.remove(); gpsMarkerRef.current = null; }
      setGpsActive(false);
      setGpsFollowing(false);
      setGpsError(null);
      return;
    }

    setGpsError(null);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const latlng: L.LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
        const map = mapRef.current;
        if (!map) return;

        if (!gpsMarkerRef.current) {
          gpsMarkerRef.current = L.marker(latlng, { icon: gpsIcon, zIndexOffset: 1000 }).addTo(map);
        } else {
          gpsMarkerRef.current.setLatLng(latlng);
        }

        if (gpsFollowing || !gpsActive) {
          map.flyTo(latlng, Math.max(map.getZoom(), 13), { animate: true, duration: 1 });
        }

        setGpsActive(true);
        setGpsError(null);
      },
      (err) => {
        const msgs: Record<number, string> = {
          1: "GPS engedély megtagadva",
          2: "Helyzet nem meghatározható",
          3: "GPS időtúllépés",
        };
        setGpsError(msgs[err.code] ?? "GPS hiba");
        setGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 }
    );

    watchIdRef.current = id;
    setGpsActive(true);
    setGpsFollowing(true);
  }, [gpsActive, gpsFollowing]);

  const centerOnGPS = useCallback(() => {
    const marker = gpsMarkerRef.current;
    const map = mapRef.current;
    if (marker && map) {
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 14), { animate: true, duration: 1 });
      setGpsFollowing(true);
    }
  }, []);

  // ── Search ────────────────────────────────────────────────────────────────
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      setSearchResults(allTrails.filter((t) =>
        t.name.toLowerCase().includes(q.toLowerCase()) ||
        t.location.toLowerCase().includes(q.toLowerCase())
      ));
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const pickSearchResult = (trail: Trail) => {
    setShowSearch(false);
    setSearchQuery("");
    handleSelectTrail(trail);
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden" }}>

      {/* Leaflet map mount point */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {/* ── Search bar ── */}
      <div style={{ position: "absolute", top: 20, left: 16, right: 16, zIndex: 1000 }}>
        <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "10px 14px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
          <Search size={17} color="#888" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Keresés túraútvonalak között..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", color: "#344E41", background: "transparent" }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setShowSearch(false); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={15} color="#888" />
            </button>
          )}
        </div>

        {showSearch && searchResults.length > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: "14px", marginTop: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", maxHeight: "260px", overflowY: "auto" }}>
            {searchResults.map((trail) => (
              <button key={trail.id} onClick={() => pickSearchResult(trail)}
                style={{ display: "block", width: "100%", padding: "11px 15px", border: "none", background: "none", textAlign: "left", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}>
                <p style={{ margin: 0, fontWeight: "500", color: "#344E41", fontSize: "13px" }}>📍 {trail.name}</p>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "#888" }}>{trail.location} · {trail.distance} km · {trail.difficulty}</p>
              </button>
            ))}
          </div>
        )}
        {showSearch && !searchResults.length && searchQuery && (
          <div style={{ backgroundColor: "white", borderRadius: "14px", marginTop: "8px", padding: "12px 15px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>Nincs találat: „{searchQuery}"</p>
          </div>
        )}
      </div>

      {/* ── GPS controls (bottom-left) ── */}
      <div style={{ position: "absolute", bottom: selectedTrail ? "calc(55vh + 100px)" : "110px", left: "16px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "8px", transition: "bottom 0.3s ease" }}>
        <button
          onClick={toggleGPS}
          title={gpsActive ? "GPS kikapcsolás" : "GPS bekapcsolás"}
          style={{
            width: 44, height: 44, borderRadius: "12px",
            backgroundColor: gpsActive ? "#2563eb" : "white",
            color: gpsActive ? "white" : "#344E41",
            border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
          }}
        >
          {gpsActive ? <Navigation size={20} /> : <NavigationOff size={20} />}
        </button>
        {gpsActive && (
          <button
            onClick={centerOnGPS}
            title="Középre igazítás"
            style={{ width: 44, height: 44, borderRadius: "12px", backgroundColor: "white", color: "#2563eb", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.18)", fontSize: "18px" }}
          >
            ⊕
          </button>
        )}
      </div>

      {/* GPS error toast */}
      {gpsError && (
        <div style={{ position: "absolute", bottom: "120px", left: "16px", right: "16px", zIndex: 1001, backgroundColor: "#e74c3c", color: "white", borderRadius: "12px", padding: "10px 14px", fontSize: "13px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
          ⚠️ {gpsError}
        </div>
      )}

      {/* ── Trail detail panel ── */}
      {selectedTrail && (
        <div style={{
          position: "absolute",
          bottom: showPanel ? "85px" : "-10px",
          left: 0, right: 0, zIndex: 1002,
          backgroundColor: "white",
          borderRadius: "22px 22px 0 0",
          padding: "16px 18px 28px",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.16)",
          transition: "bottom 0.3s ease",
          maxHeight: "56vh",
          overflowY: "auto",
        }}>
          {/* Drag handle */}
          <button onClick={() => setShowPanel(!showPanel)} style={{ display: "block", margin: "0 auto 12px", background: "none", border: "none", cursor: "pointer", padding: "4px 20px" }}>
            <div style={{ width: "36px", height: "4px", backgroundColor: "#ddd", borderRadius: "2px" }} />
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
            <div style={{ flex: 1, paddingRight: "10px" }}>
              <h2 style={{ margin: "0 0 3px", fontSize: "19px", color: "#344E41", lineHeight: 1.2 }}>{selectedTrail.name}</h2>
              <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>📍 {selectedTrail.location}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <span style={{
                fontSize: "11px", padding: "3px 9px", borderRadius: "20px",
                backgroundColor: DIFFICULTY_COLOR[selectedTrail.difficulty] ?? "#888",
                color: "white", fontWeight: "600",
              }}>
                {selectedTrail.difficulty}
              </span>
              <button onClick={clearTrail} style={{ background: "none", border: "none", cursor: "pointer", padding: "2px" }}>
                <X size={18} color="#aaa" />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "18px", fontSize: "13px", color: "#555", marginBottom: "14px", flexWrap: "wrap" }}>
            {selectedTrail.distance && <span>📏 {selectedTrail.distance} km</span>}
            {selectedTrail.duration && <span>⏱ {selectedTrail.duration}</span>}
            {selectedTrail.elevation && <span>⛰ {selectedTrail.elevation} m</span>}
          </div>

          {selectedTrail.description && (
            <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.65, marginBottom: "14px" }}>
              {selectedTrail.description}
            </p>
          )}

          {selectedTrail.points_of_interest?.length > 0 && (
            <div style={{ marginBottom: "14px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "12px", fontWeight: "700", color: "#344E41", textTransform: "uppercase", letterSpacing: "0.05em" }}>🗺 Érdekességek</p>
              {selectedTrail.points_of_interest.map((poi, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                  <MapPin size={13} color="#588157" style={{ flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "500", color: "#344E41" }}>{poi.name}</p>
                    {poi.description && <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>{poi.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTrail.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {selectedTrail.tags.map((tag) => (
                <span key={tag} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "20px", backgroundColor: "#f0f0f0", color: "#666" }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
