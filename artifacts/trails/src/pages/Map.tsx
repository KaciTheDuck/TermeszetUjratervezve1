import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { Search, X, ChevronUp, MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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

const difficultyColor: Record<string, string> = {
  "Könnyű": "#588157",
  "Közepes": "#A3B18A",
  "Nehéz": "#E07B39",
  "Nagyon nehéz": "#C0392B",
};

export default function MapPage() {
  const [allTrails, setAllTrails] = useState<Trail[]>([]);
  const [routeData, setRouteData] = useState<Trail | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Trail[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mapKey, setMapKey] = useState("default");

  // Load all trails for search
  useEffect(() => {
    fetch("/api/trails")
      .then((r) => r.json())
      .then(setAllTrails)
      .catch(console.error);
  }, []);

  // Load trail from URL query param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const trailId = params.get("trailId");
    if (trailId) {
      fetch(`/api/trails/${trailId}`)
        .then((r) => r.json())
        .then((trail: Trail) => {
          setRouteData(trail);
          setShowPanel(true);
          setMapKey(trail.id.toString());
        })
        .catch(console.error);
    }
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = allTrails.filter(
        (t) =>
          t.name.toLowerCase().includes(query.toLowerCase()) ||
          t.location.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const selectTrail = (trail: Trail) => {
    setRouteData(trail);
    setShowSearch(false);
    setSearchQuery("");
    setShowPanel(true);
    setMapKey(trail.id.toString());
  };

  const mapCenter: [number, number] =
    routeData?.start_lat && routeData?.start_lon
      ? [routeData.start_lat, routeData.start_lon]
      : [45.9432, 24.9668];
  const mapZoom = routeData ? 11 : 7;

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden", backgroundColor: "#DAD7CD" }}>
      {/* Map */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100vh", width: "100%" }}
          key={mapKey}
          zoomControl={false}
        >
          <TileLayer
            url="https://tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenTopoMap"
            maxZoom={17}
          />
          <TileLayer
            url="https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png"
            attribution="&copy; Waymarked Trails"
            maxZoom={17}
            opacity={0.7}
          />
          {routeData?.coordinates && routeData.coordinates.length > 1 && (
            <Polyline
              positions={routeData.coordinates}
              color="#344E41"
              weight={4}
              opacity={0.85}
            />
          )}
          {routeData?.start_lat && routeData?.start_lon && (
            <Marker position={[routeData.start_lat, routeData.start_lon]}>
              <Popup>
                <b>{routeData.name}</b>
                <br />
                Kiindulópont
              </Popup>
            </Marker>
          )}
          {routeData?.points_of_interest?.map((poi, i) => (
            <Marker key={i} position={[poi.lat, poi.lon]}>
              <Popup>
                <b>{poi.name}</b>
                {poi.description && <><br />{poi.description}</>}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Search bar */}
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", zIndex: 1001 }}>
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
          <Search size={18} color="#888" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Keresés útvonalak között..."
            style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", color: "#344E41", background: "transparent" }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setShowSearch(false); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={16} color="#888" />
            </button>
          )}
        </div>

        {showSearch && searchResults.length > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: "15px", marginTop: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", maxHeight: "280px", overflowY: "auto" }}>
            {searchResults.map((trail) => (
              <button
                key={trail.id}
                onClick={() => selectTrail(trail)}
                style={{ display: "block", width: "100%", padding: "12px 16px", border: "none", background: "none", textAlign: "left", cursor: "pointer", borderBottom: "1px solid #f0f0f0" }}
              >
                <p style={{ margin: 0, fontWeight: "500", color: "#344E41", fontSize: "14px" }}>📍 {trail.name}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#888" }}>{trail.location} · {trail.distance} km · {trail.difficulty}</p>
              </button>
            ))}
          </div>
        )}

        {showSearch && searchResults.length === 0 && searchQuery && (
          <div style={{ backgroundColor: "white", borderRadius: "15px", marginTop: "8px", padding: "12px 16px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>Nincs találat: "{searchQuery}"</p>
          </div>
        )}
      </div>


      {/* Route detail panel */}
      {routeData && (
        <div style={{
          position: "absolute",
          bottom: showPanel ? "90px" : "-300px",
          left: 0, right: 0,
          zIndex: 1002,
          backgroundColor: "white",
          borderRadius: "25px 25px 0 0",
          padding: "20px",
          paddingBottom: "30px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          transition: "bottom 0.3s ease",
          maxHeight: "55vh",
          overflowY: "auto"
        }}>
          <button
            onClick={() => setShowPanel(!showPanel)}
            style={{ display: "block", margin: "0 auto 12px", background: "none", border: "none", cursor: "pointer" }}
          >
            <div style={{ width: "40px", height: "4px", backgroundColor: "#ddd", borderRadius: "2px" }} />
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: "0 0 4px 0", fontSize: "20px", color: "#344E41" }}>{routeData.name}</h2>
              <p style={{ margin: 0, fontSize: "13px", color: "#888" }}>📍 {routeData.location}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                fontSize: "12px", padding: "4px 10px", borderRadius: "20px",
                backgroundColor: difficultyColor[routeData.difficulty] ?? "#888",
                color: "white", fontWeight: "500"
              }}>
                {routeData.difficulty}
              </span>
              <button onClick={() => { setRouteData(null); setShowPanel(false); setMapKey("default"); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={20} color="#888" />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", gap: "16px", fontSize: "14px", color: "#555", marginBottom: "16px", flexWrap: "wrap" }}>
            {routeData.distance && <span>📏 {routeData.distance} km</span>}
            {routeData.duration && <span>⏱️ {routeData.duration}</span>}
            {routeData.elevation && <span>⛰️ {routeData.elevation}m</span>}
          </div>

          {routeData.description && (
            <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6", marginBottom: "16px" }}>
              {routeData.description}
            </p>
          )}

          {routeData.points_of_interest && routeData.points_of_interest.length > 0 && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "13px", fontWeight: "600", color: "#344E41" }}>🗺️ Érdekességek</p>
              {routeData.points_of_interest.map((poi, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", alignItems: "flex-start" }}>
                  <MapPin size={14} color="#588157" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ margin: 0, fontSize: "13px", fontWeight: "500", color: "#344E41" }}>{poi.name}</p>
                    {poi.description && <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>{poi.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          {routeData.tags && routeData.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {routeData.tags.map((tag) => (
                <span key={tag} style={{ fontSize: "12px", padding: "3px 10px", borderRadius: "20px", backgroundColor: "#f0f0f0", color: "#666" }}>
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
