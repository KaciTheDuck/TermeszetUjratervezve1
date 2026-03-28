import { useLocation } from "wouter";

const routes = [
  {
    id: "1",
    name: "Nagykőhavas",
    location: "Erdély, Románia",
    distance: "12.5",
    duration: "6 óra",
    elevation: "1849",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    id: "2",
    name: "Scropoasa tó",
    location: "Erdély, Románia",
    distance: "8.2",
    duration: "4 óra",
    elevation: "1200",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  },
];

const trailRoutes = [
  {
    id: "t1",
    name: "Csukás-tető",
    location: "Háromszék",
    distance: "15",
    duration: "7 óra",
    elevation: "1961",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
  },
  {
    id: "t2",
    name: "Királykő",
    location: "Brassó megye",
    distance: "10",
    duration: "5 óra",
    elevation: "2239",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
];

export default function Interactive() {
  const [, navigate] = useLocation();

  const totalKm = routes.reduce((sum, r) => sum + parseFloat(r.distance), 0).toFixed(1);

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "200px",
        display: "flex",
        alignItems: "flex-end",
        padding: "20px"
      }}>
        <div>
          <h1 style={{ color: "white", fontSize: "28px", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Felfedezés</h1>
          <p style={{ color: "rgba(255,255,255,0.9)", margin: "5px 0 0 0", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Találd meg következő kalandod</p>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#344E41" }}>Saját túrák ({routes.length})</h2>

        {routes.map((route) => (
          <div
            key={route.id}
            onClick={() => navigate("/")}
            style={{ backgroundColor: "white", borderRadius: "10px", display: "flex", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: "15px", cursor: "pointer" }}
          >
            <img src={route.image} alt={route.name} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            <div style={{ padding: "15px", flex: 1 }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#344E41", fontWeight: "bold" }}>{route.name}</h3>
              <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#888", flexWrap: "wrap" }}>
                {route.distance && <span>📏 {route.distance} km</span>}
                {route.duration && <span>⏱️ {route.duration}</span>}
                {route.elevation && <span>⛰️ {route.elevation}m</span>}
              </div>
            </div>
          </div>
        ))}

        <h2 style={{ fontSize: "18px", marginBottom: "15px", color: "#344E41" }}>Más túraútvonalak ({trailRoutes.length})</h2>

        {trailRoutes.map((route) => (
          <div
            key={route.id}
            onClick={() => navigate("/")}
            style={{ backgroundColor: "white", borderRadius: "10px", display: "flex", overflow: "hidden", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: "15px", cursor: "pointer" }}
          >
            <img src={route.image} alt={route.name} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
            <div style={{ padding: "15px", flex: 1 }}>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", color: "#344E41", fontWeight: "bold" }}>{route.name}</h3>
              <div style={{ display: "flex", gap: "10px", fontSize: "12px", color: "#888", flexWrap: "wrap" }}>
                {route.distance && <span>📏 {route.distance} km</span>}
                {route.duration && <span>⏱️ {route.duration}</span>}
                {route.elevation && <span>⛰️ {route.elevation}m</span>}
              </div>
            </div>
          </div>
        ))}

        <div style={{ padding: "0", display: "flex", gap: "10px" }}>
          <div style={{ flex: 1, backgroundColor: "white", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
            <p style={{ fontSize: "20px", margin: 0, fontWeight: "bold", color: "#344E41" }}>{routes.length}</p>
            <p style={{ fontSize: "12px", color: "#888", margin: "5px 0 0 0" }}>Útvonal</p>
          </div>
          <div style={{ flex: 1, backgroundColor: "white", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
            <p style={{ fontSize: "20px", margin: 0, fontWeight: "bold", color: "#344E41" }}>{totalKm}</p>
            <p style={{ fontSize: "12px", color: "#888", margin: "5px 0 0 0" }}>Össz. km</p>
          </div>
          <div style={{ flex: 1, backgroundColor: "white", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
            <p style={{ fontSize: "20px", margin: 0, fontWeight: "bold", color: "#344E41" }}>{routes[0]?.duration ?? "–"}</p>
            <p style={{ fontSize: "12px", color: "#888", margin: "5px 0 0 0" }}>Első túra</p>
          </div>
        </div>
      </div>
    </div>
  );
}
