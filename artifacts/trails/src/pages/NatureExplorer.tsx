import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function NatureExplorer() {
  const [, navigate] = useLocation();

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px 30px 20px",
        position: "relative"
      }}>
        <button
          onClick={() => navigate("/entertainment")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: "white", fontSize: "24px", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Fedezd fel a természetet</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", marginTop: "5px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Bakancslistád és madármegfigyelés</p>
      </div>

      <div style={{ padding: "20px" }}>
        <div
          onClick={() => navigate("/BucketList")}
          style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "40px" }}>🎒</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, color: "#344E41", fontSize: "18px" }}>Bakancslista</h2>
              <p style={{ margin: "5px 0 0 0", color: "#3A5A40", fontSize: "12px" }}>Tervezd meg álmaid túráit</p>
            </div>
            <div style={{ fontSize: "20px", color: "#A3B18A" }}>→</div>
          </div>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Próbálj ki minél többet ezek közül a természeti élmények közül a következő túrád során!
          </p>
        </div>

        <div
          onClick={() => navigate("/BirdWatching")}
          style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", cursor: "pointer" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "40px" }}>🦅</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, color: "#344E41", fontSize: "18px" }}>Madár megfigyelő</h2>
              <p style={{ margin: "5px 0 0 0", color: "#3A5A40", fontSize: "12px" }}>Fedezd fel a madárvilágot</p>
            </div>
            <div style={{ fontSize: "20px", color: "#A3B18A" }}>→</div>
          </div>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", margin: 0 }}>
            Rögzítsd a túráid során megfigyelt madarakat, tanuld meg felismerni őket és kövesd nyomon, hány fajt láttál már!
          </p>
        </div>
      </div>
    </div>
  );
}
