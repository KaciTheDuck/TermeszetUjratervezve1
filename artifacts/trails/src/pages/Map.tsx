import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import { Search, X, ChevronUp } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const sampleRoutes = [
  {
    id: "1",
    name: "Nagykőhavas",
    location: "Erdély, Románia",
    distance: "12.5",
    duration: "6 óra",
    elevation: "1849",
    difficulty: "Nehéz",
    description: "A Nagykőhavas (Piatra Mare) egy gyönyörű csúcs Brassó közelében, erdélyi panorámával.",
    start_lat: 45.58,
    start_lon: 25.6,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    id: "2",
    name: "Scropoasa tó",
    location: "Erdély, Románia",
    distance: "8.2",
    duration: "4 óra",
    elevation: "1200",
    difficulty: "Közepes",
    description: "Festői hegyi tó a Dâmbovița forrásvidékén, csodálatos kilátással.",
    start_lat: 45.33,
    start_lon: 25.35,
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
];

export default function MapPage() {
  const [routeData, setRouteData] = useState<typeof sampleRoutes[0] | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof sampleRoutes>([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      const results = sampleRoutes.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.location.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const selectRoute = (route: typeof sampleRoutes[0]) => {
    setRouteData(route);
    setShowSearch(false);
    setSearchQuery("");
    setShowPanel(true);
  };

  const mapCenter: [number, number] = routeData
    ? [routeData.start_lat, routeData.start_lon]
    : [45.9432, 24.9668];
  const mapZoom = routeData ? 12 : 7;

  return (
    <div style={{ position: "relative", height: "100vh", width: "100%", overflow: "hidden", backgroundColor: "#DAD7CD" }}>
      {/* Map */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          style={{ height: "100vh", width: "100%" }}
          key={routeData ? routeData.id : "default"}
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
          {routeData && (
            <Marker position={[routeData.start_lat, routeData.start_lon]}>
              <Popup>{routeData.name}</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Search bar */}
      <div style={{ position: "absolute", top: "20px", left: "20px", right: "20px", zIndex: 1001 }}>
        <div style={{
          backgroundColor: "white",
          borderRadius: "15px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)"
        }}>
          <Search size={18} color="#888" />
          <input
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Keresés útvonalak között..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              color: "#344E41",
              background: "transparent"
            }}
          />
          {searchQuery && (
            <button onClick={() => { setSearchQuery(""); setShowSearch(false); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <X size={16} color="#888" />
            </button>
          )}
        </div>

        {/* Search results */}
        {showSearch && searchResults.length > 0 && (
          <div style={{ backgroundColor: "white", borderRadius: "15px", marginTop: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
            {searchResults.map((route) => (
              <button
                key={route.id}
                onClick={() => selectRoute(route)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  background: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  borderBottom: "1px solid #f0f0f0",
                  color: "#344E41",
                  fontSize: "14px"
                }}
              >
                📍 {route.name} – {route.location}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Route cards list */}
      {!routeData && (
        <div style={{
          position: "absolute",
          bottom: "100px",
          left: "20px",
          right: "20px",
          zIndex: 1001,
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "4px"
        }}>
          {sampleRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => selectRoute(route)}
              style={{
                minWidth: "200px",
                backgroundColor: "white",
                borderRadius: "15px",
                padding: "12px",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
                boxShadow: "0 4px 15px rgba(0,0,0,0.15)",
                flexShrink: 0
              }}
            >
              <img src={route.image} alt={route.name} style={{ width: "100%", height: "100px", objectFit: "cover", borderRadius: "10px", marginBottom: "8px" }} />
              <p style={{ margin: 0, fontWeight: "bold", color: "#344E41", fontSize: "14px" }}>{route.name}</p>
              <p style={{ margin: "4px 0 0 0", color: "#888", fontSize: "12px" }}>📏 {route.distance} km · ⛰️ {route.elevation}m</p>
            </button>
          ))}
        </div>
      )}

      {/* Route detail panel */}
      {routeData && (
        <div style={{
          position: "absolute",
          bottom: showPanel ? "90px" : "-200px",
          left: 0,
          right: 0,
          zIndex: 1002,
          backgroundColor: "white",
          borderRadius: "25px 25px 0 0",
          padding: "20px",
          paddingBottom: "100px",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.15)",
          transition: "bottom 0.3s ease"
        }}>
          <button
            onClick={() => setShowPanel(!showPanel)}
            style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", background: "none", border: "none", cursor: "pointer" }}
          >
            <ChevronUp size={24} color="#888" style={{ transform: showPanel ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s ease" }} />
          </button>

          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h2 style={{ margin: "0 0 10px 0", fontSize: "20px", color: "#344E41" }}>{routeData.name}</h2>
              <button onClick={() => { setRouteData(null); setShowPanel(false); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#888" }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ display: "flex", gap: "15px", fontSize: "14px", color: "#888", marginBottom: "20px", flexWrap: "wrap" }}>
              {routeData.distance && <span>📏 {routeData.distance} km</span>}
              {routeData.duration && <span>⏱️ {routeData.duration}</span>}
              {routeData.elevation && <span>⛰️ {routeData.elevation}m</span>}
              {routeData.difficulty && <span>🎯 {routeData.difficulty}</span>}
            </div>
            {routeData.description && <p style={{ fontSize: "14px", color: "#666", lineHeight: "1.6" }}>{routeData.description}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
