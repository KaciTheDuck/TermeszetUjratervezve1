import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import { Search, X, MapPin, Navigation, NavigationOff, Play, Square, Clock, Ruler } from "lucide-react";

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
  @keyframes hike-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
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
  .hike-gps-dot {
    position: absolute; inset: 0; margin: auto;
    width: 18px; height: 18px; border-radius: 50%;
    background: #22c55e; border: 3px solid white;
    box-shadow: 0 0 12px rgba(34,197,94,0.8), 0 0 0 4px rgba(34,197,94,0.2);
  }
  .hike-gps-ring {
    position: absolute; inset: 0; margin: auto;
    width: 18px; height: 18px; border-radius: 50%;
    background: rgba(34,197,94,0.4);
    animation: gps-pulse 1.4s ease-out infinite;
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
    iconSize: [32, 36], iconAnchor: [16, 36], popupAnchor: [0, -36],
  });
}

const gpsIcon = L.divIcon({
  className: "",
  html: `<div class="gps-dot-wrap"><div class="gps-ring"></div><div class="gps-dot"></div></div>`,
  iconSize: [20, 20], iconAnchor: [10, 10],
});

const hikeGpsIcon = L.divIcon({
  className: "",
  html: `<div class="gps-dot-wrap" style="width:26px;height:26px"><div class="hike-gps-ring"></div><div class="hike-gps-dot"></div></div>`,
  iconSize: [26, 26], iconAnchor: [13, 13],
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
  const hikeStartRef = useRef<number | null>(null);

  const [allTrails,      setAllTrails]      = useState<Trail[]>([]);
  const [selectedTrail,  setSelectedTrail]  = useState<Trail | null>(null);
  const [showPanel,      setShowPanel]      = useState(false);
  const [searchQuery,    setSearchQuery]    = useState("");
  const [searchResults,  setSearchResults]  = useState<Trail[]>([]);
  const [showSearch,     setShowSearch]     = useState(false);
  const [gpsActive,      setGpsActive]      = useState(false);
  const [gpsError,       setGpsError]       = useState<string | null>(null);
  const [hikingMode,     setHikingMode]     = useState(false);
  const [hikeElapsed,    setHikeElapsed]    = useState(0); // seconds

  // ── 1. Init map ──────────────────────────────────────────────────────────
  useEffect(() => {
    injectCSS();
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [45.9432, 24.9668], zoom: 7,
      zoomControl: false, attributionControl: true,
    });

    L.tileLayer("https://tile.opentopomap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenTopoMap", maxZoom: 17,
    }).addTo(map);

    L.tileLayer("https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png", {
      attribution: "&copy; Waymarked Trails", maxZoom: 17, opacity: 0.65,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    const cluster = (L as any).markerClusterGroup({
      chunkedLoading: true, maxClusterRadius: 60,
      spiderfyOnMaxZoom: true, showCoverageOnHover: false, animate: true,
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

  // ── 2. Load trails → cluster markers ────────────────────────────────────
  useEffect(() => {
    fetch("/api/trails").then((r) => r.json()).then((trails: Trail[]) => {
      setAllTrails(trails);
      const cluster = clusterRef.current;
      if (!cluster) return;
      cluster.clearLayers(); markerMapRef.current.clear();
      trails.forEach((trail) => {
        if (!trail.start_lat || !trail.start_lon) return;
        const marker = L.marker([trail.start_lat, trail.start_lon], { icon: trailIcon(trail.difficulty) });
        marker.bindTooltip(trail.name, { direction: "top", offset: [0, -32], opacity: 0.95 });
        marker.on("click", () => handleSelectTrail(trail));
        cluster.addLayer(marker);
        markerMapRef.current.set(trail.id, marker);
      });
    }).catch(console.error);
  }, []);

  // ── 3. Load trail from URL ?trailId= ────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trailId = params.get("trailId");
    if (!trailId) return;
    fetch(`/api/trails/${trailId}`).then((r) => r.json()).then(handleSelectTrail).catch(console.error);
  }, []);

  // ── Hike timer ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hikingMode) return;
    hikeStartRef.current = Date.now();
    setHikeElapsed(0);
    const id = setInterval(() => {
      setHikeElapsed(Math.floor((Date.now() - (hikeStartRef.current ?? Date.now())) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [hikingMode]);

  // ── Select trail ─────────────────────────────────────────────────────────
  const handleSelectTrail = useCallback((trail: Trail) => {
    const map = mapRef.current;
    if (!map) return;

    setSelectedTrail((prev) => {
      if (prev) {
        const old = markerMapRef.current.get(prev.id);
        if (old) old.setIcon(trailIcon(prev.difficulty, false));
      }
      return trail;
    });

    const marker = markerMapRef.current.get(trail.id);
    if (marker) marker.setIcon(trailIcon(trail.difficulty, true));

    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null; }
    if (poiLayerRef.current) poiLayerRef.current.clearLayers();

    if (trail.coordinates?.length > 1) {
      polylineRef.current = L.polyline(trail.coordinates, {
        color: "#344E41", weight: 4, opacity: 0.9, lineCap: "round", lineJoin: "round",
      }).addTo(map);
    }

    if (poiLayerRef.current && trail.points_of_interest?.length) {
      trail.points_of_interest.forEach((poi) => {
        const m = L.marker([poi.lat, poi.lon], {
          icon: L.divIcon({
            className: "",
            html: `<div style="background:#A3B18A;border:2px solid white;border-radius:50%;width:16px;height:16px;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>`,
            iconSize: [16, 16], iconAnchor: [8, 8],
          }),
        });
        m.bindPopup(`<b>${poi.name}</b>${poi.description ? `<br><span style="font-size:12px;color:#666">${poi.description}</span>` : ""}`);
        poiLayerRef.current!.addLayer(m);
      });
    }

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

    setShowPanel(true);
    // exit hiking mode if changing trail
    setHikingMode(false);
    disableTileDim();
  }, []);

  // ── Clear selected trail ─────────────────────────────────────────────────
  const clearTrail = useCallback(() => {
    if (selectedTrail) {
      const m = markerMapRef.current.get(selectedTrail.id);
      if (m) m.setIcon(trailIcon(selectedTrail.difficulty, false));
    }
    if (polylineRef.current) { polylineRef.current.remove(); polylineRef.current = null; }
    if (poiLayerRef.current) poiLayerRef.current.clearLayers();
    setSelectedTrail(null); setShowPanel(false);
    exitHikingModeInternal();
    mapRef.current?.flyTo([45.9432, 24.9668], 7, { animate: true, duration: 1.2 });
  }, [selectedTrail]);

  // ── GPS tracking helpers ─────────────────────────────────────────────────
  const startGPS = useCallback((isHikingMode: boolean) => {
    if (!navigator.geolocation) { setGpsError("GPS nem elérhető"); return; }
    if (watchIdRef.current !== null) return; // already watching
    setGpsError(null);
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        const latlng: L.LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
        const map = mapRef.current;
        if (!map) return;
        const icon = isHikingMode ? hikeGpsIcon : gpsIcon;
        if (!gpsMarkerRef.current) {
          gpsMarkerRef.current = L.marker(latlng, { icon, zIndexOffset: 1000 }).addTo(map);
        } else {
          gpsMarkerRef.current.setLatLng(latlng);
          gpsMarkerRef.current.setIcon(icon);
        }
        if (isHikingMode) {
          map.panTo(latlng, { animate: true, duration: 0.8 });
        }
        setGpsActive(true); setGpsError(null);
      },
      (err) => {
        const msgs: Record<number, string> = { 1: "GPS engedély megtagadva", 2: "Helyzet nem meghatározható", 3: "GPS időtúllépés" };
        setGpsError(msgs[err.code] ?? "GPS hiba"); setGpsActive(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 2000 }
    );
    watchIdRef.current = id;
    setGpsActive(true);
  }, []);

  const stopGPS = useCallback(() => {
    if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
    if (gpsMarkerRef.current) { gpsMarkerRef.current.remove(); gpsMarkerRef.current = null; }
    setGpsActive(false);
  }, []);

  const toggleGPS = useCallback(() => {
    if (gpsActive) stopGPS();
    else startGPS(false);
  }, [gpsActive, startGPS, stopGPS]);

  const centerOnGPS = useCallback(() => {
    if (gpsMarkerRef.current && mapRef.current) {
      mapRef.current.flyTo(gpsMarkerRef.current.getLatLng(), Math.max(mapRef.current.getZoom(), 14), { animate: true, duration: 1 });
    }
  }, []);

  // ── Hiking mode helpers ──────────────────────────────────────────────────
  const enableTileDim = () => {
    const map = mapRef.current;
    if (!map) return;
    const tilePane = map.getPane("tilePane");
    if (tilePane) tilePane.style.filter = "brightness(0.42) saturate(0.4)";
  };

  const disableTileDim = () => {
    const map = mapRef.current;
    if (!map) return;
    const tilePane = map.getPane("tilePane");
    if (tilePane) tilePane.style.filter = "";
  };

  const enterHikingMode = useCallback(() => {
    const map = mapRef.current;
    if (!map || !selectedTrail) return;

    // Darken map tiles
    enableTileDim();

    // Highlight route: thicker + neon green + glow
    if (polylineRef.current) {
      polylineRef.current.setStyle({ color: "#22c55e", weight: 7, opacity: 1 });
      // Also add a glow layer below
      const glowLine = L.polyline((polylineRef.current as any).getLatLngs(), {
        color: "#22c55e", weight: 14, opacity: 0.25, lineCap: "round", lineJoin: "round",
      }).addTo(map);
      (polylineRef.current as any)._glowLine = glowLine;
    }

    // Tight zoom to route
    if (selectedTrail.coordinates?.length > 1 && polylineRef.current) {
      map.fitBounds(polylineRef.current.getBounds(), { padding: [40, 40], animate: true, duration: 1.2 });
    } else if (selectedTrail.start_lat && selectedTrail.start_lon) {
      map.flyTo([selectedTrail.start_lat, selectedTrail.start_lon], 14, { animate: true, duration: 1.2 });
    }

    // Start GPS automatically
    if (!gpsActive) {
      // stop any old watch first
      if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
      startGPS(true);
    } else {
      // update icon
      if (gpsMarkerRef.current) gpsMarkerRef.current.setIcon(hikeGpsIcon);
    }

    setShowPanel(false); // hide the detail panel for full map view
    setHikingMode(true);
  }, [selectedTrail, gpsActive, startGPS]);

  const exitHikingModeInternal = () => {
    disableTileDim();
    // Restore polyline style
    if (polylineRef.current) {
      polylineRef.current.setStyle({ color: "#344E41", weight: 4, opacity: 0.9 });
      const glow = (polylineRef.current as any)._glowLine;
      if (glow) { glow.remove(); delete (polylineRef.current as any)._glowLine; }
    }
    // Downgrade GPS icon back to normal
    if (gpsMarkerRef.current) gpsMarkerRef.current.setIcon(gpsIcon);
    setHikingMode(false);
  };

  const exitHikingMode = useCallback(() => {
    exitHikingModeInternal();
    setShowPanel(true);
    // Zoom back to fit route
    if (polylineRef.current && mapRef.current) {
      mapRef.current.fitBounds(polylineRef.current.getBounds(), { padding: [60, 60], animate: true });
    }
  }, []);

  // ── Search ───────────────────────────────────────────────────────────────
  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim()) {
      setSearchResults(allTrails.filter((t) =>
        t.name.toLowerCase().includes(q.toLowerCase()) || t.location.toLowerCase().includes(q.toLowerCase())
      ));
      setShowSearch(true);
    } else { setSearchResults([]); setShowSearch(false); }
  };

  const pickSearchResult = (trail: Trail) => {
    setShowSearch(false); setSearchQuery("");
    handleSelectTrail(trail);
  };

  // Format hike time
  const fmtTime = (s: number) => {
    const h = Math.floor(s / 3600); const m = Math.floor((s % 3600) / 60); const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden" }}>

      {/* Leaflet map */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0, zIndex: 1 }} />

      {/* ── Hiking HUD ── */}
      {hikingMode && selectedTrail && (
        <>
          {/* Top status bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, zIndex: 1002,
            background: "linear-gradient(180deg, rgba(34,197,94,0.95) 0%, rgba(34,197,94,0.85) 100%)",
            padding: "14px 18px 12px",
            backdropFilter: "blur(6px)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "white", animation: "hike-pulse 1.4s ease-in-out infinite" }} />
              <p style={{ margin: 0, color: "white", fontSize: 13, fontWeight: "700", flex: 1, letterSpacing: "0.04em" }}>
                TÚRA AKTÍV — {selectedTrail.name}
              </p>
              <div style={{ fontSize: 13, color: "white", fontWeight: "700", fontVariantNumeric: "tabular-nums" }}>
                {fmtTime(hikeElapsed)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
              {selectedTrail.distance && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
                  <Ruler size={12} /> {selectedTrail.distance} km
                </div>
              )}
              {selectedTrail.duration && (
                <div style={{ display: "flex", alignItems: "center", gap: 4, color: "rgba(255,255,255,0.9)", fontSize: 12 }}>
                  <Clock size={12} /> {selectedTrail.duration}
                </div>
              )}
              {selectedTrail.elevation && (
                <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 12 }}>⛰ {selectedTrail.elevation} m</div>
              )}
            </div>
          </div>

          {/* End hiking button */}
          <div style={{ position: "absolute", bottom: "90px", left: 0, right: 0, zIndex: 1003, display: "flex", justifyContent: "center" }}>
            <button
              onClick={exitHikingMode}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                backgroundColor: "white", color: "#e74c3c",
                border: "2px solid #e74c3c", borderRadius: "50px",
                padding: "13px 28px", fontSize: 15, fontWeight: "700",
                cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
              }}
            >
              <Square size={16} fill="#e74c3c" />
              Túra befejezése
            </button>
          </div>

          {/* GPS center button */}
          {gpsActive && (
            <button onClick={centerOnGPS}
              style={{
                position: "absolute", bottom: 155, right: 16, zIndex: 1003,
                width: 44, height: 44, borderRadius: 12, backgroundColor: "white",
                color: "#22c55e", border: "2px solid #22c55e",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 2px 12px rgba(0,0,0,0.2)", fontSize: 18,
              }}>⊕
            </button>
          )}
        </>
      )}

      {/* ── Search bar (hidden in hiking mode) ── */}
      {!hikingMode && (
        <div style={{ position: "absolute", top: 20, left: 16, right: 16, zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: 16, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
            <Search size={17} color="#888" />
            <input
              value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
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
            <div style={{ backgroundColor: "white", borderRadius: 14, marginTop: 8, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", maxHeight: 260, overflowY: "auto" }}>
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
            <div style={{ backgroundColor: "white", borderRadius: 14, marginTop: 8, padding: "12px 15px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
              <p style={{ margin: 0, color: "#888", fontSize: "13px" }}>Nincs találat: „{searchQuery}"</p>
            </div>
          )}
        </div>
      )}

      {/* ── GPS controls (hidden in hiking mode) ── */}
      {!hikingMode && (
        <div style={{ position: "absolute", bottom: selectedTrail ? "calc(56vh + 100px)" : "110px", left: 16, zIndex: 1000, display: "flex", flexDirection: "column", gap: 8, transition: "bottom 0.3s ease" }}>
          <button onClick={toggleGPS}
            style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: gpsActive ? "#2563eb" : "white", color: gpsActive ? "white" : "#344E41", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.18)" }}>
            {gpsActive ? <Navigation size={20} /> : <NavigationOff size={20} />}
          </button>
          {gpsActive && (
            <button onClick={centerOnGPS}
              style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: "white", color: "#2563eb", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.18)", fontSize: 18 }}>
              ⊕
            </button>
          )}
        </div>
      )}

      {/* GPS error toast */}
      {gpsError && (
        <div style={{ position: "absolute", bottom: 120, left: 16, right: 16, zIndex: 1001, backgroundColor: "#e74c3c", color: "white", borderRadius: 12, padding: "10px 14px", fontSize: 13, boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
          ⚠️ {gpsError}
        </div>
      )}

      {/* ── Trail detail panel ── */}
      {selectedTrail && !hikingMode && (
        <div style={{
          position: "absolute",
          bottom: showPanel ? "85px" : "-10px",
          left: 0, right: 0, zIndex: 1002,
          backgroundColor: "white",
          borderRadius: "22px 22px 0 0",
          padding: "16px 18px 28px",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.16)",
          transition: "bottom 0.3s ease",
          maxHeight: "56vh", overflowY: "auto",
        }}>
          <button onClick={() => setShowPanel(!showPanel)} style={{ display: "block", margin: "0 auto 12px", background: "none", border: "none", cursor: "pointer", padding: "4px 20px" }}>
            <div style={{ width: 36, height: 4, backgroundColor: "#ddd", borderRadius: 2 }} />
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
            <div style={{ flex: 1, paddingRight: 10 }}>
              <h2 style={{ margin: "0 0 3px", fontSize: 19, color: "#344E41", lineHeight: 1.2 }}>{selectedTrail.name}</h2>
              <p style={{ margin: 0, fontSize: 12, color: "#888" }}>📍 {selectedTrail.location}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, backgroundColor: DIFFICULTY_COLOR[selectedTrail.difficulty] ?? "#888", color: "white", fontWeight: "600" }}>
                {selectedTrail.difficulty}
              </span>
              <button onClick={clearTrail} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                <X size={18} color="#aaa" />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: 18, fontSize: 13, color: "#555", marginBottom: 14, flexWrap: "wrap" }}>
            {selectedTrail.distance && <span>📏 {selectedTrail.distance} km</span>}
            {selectedTrail.duration && <span>⏱ {selectedTrail.duration}</span>}
            {selectedTrail.elevation && <span>⛰ {selectedTrail.elevation} m</span>}
          </div>

          {selectedTrail.description && (
            <p style={{ fontSize: 13, color: "#666", lineHeight: 1.65, marginBottom: 14 }}>{selectedTrail.description}</p>
          )}

          {selectedTrail.points_of_interest?.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: "700", color: "#344E41", textTransform: "uppercase", letterSpacing: "0.05em" }}>🗺 Érdekességek</p>
              {selectedTrail.points_of_interest.map((poi, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                  <MapPin size={13} color="#588157" style={{ flexShrink: 0, marginTop: 3 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: "500", color: "#344E41" }}>{poi.name}</p>
                    {poi.description && <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{poi.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedTrail.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
              {selectedTrail.tags.map((tag) => (
                <span key={tag} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 20, backgroundColor: "#f0f0f0", color: "#666" }}>{tag}</span>
              ))}
            </div>
          )}

          {/* ── Start Hiking button ── */}
          <button
            onClick={enterHikingMode}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              width: "100%", padding: "15px",
              background: "linear-gradient(135deg, #344E41 0%, #588157 100%)",
              color: "white", border: "none", borderRadius: 16,
              cursor: "pointer", fontSize: 16, fontWeight: "700",
              boxShadow: "0 4px 16px rgba(52,78,65,0.4)",
            }}
          >
            <Play size={18} fill="white" />
            Túra indítása
          </button>
        </div>
      )}
    </div>
  );
}
