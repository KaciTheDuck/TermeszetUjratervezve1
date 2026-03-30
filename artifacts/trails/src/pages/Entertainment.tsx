import { useState } from "react";
import { useLocation } from "wouter";

export default function Entertainment() {
  const [, navigate] = useLocation();
  const [showLiterature, setShowLiterature] = useState(false);

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* header */}
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px 30px 20px"
      }}>
        <h1 style={{ color: "white", fontSize: "24px", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Szórakozás</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", marginTop: "5px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Feladatok és kihívások</p>
      </div>

      <div style={{ padding: "20px" }}>

        {/* nature explorer */}
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "30px" }}>🌿</div>
            <div>
              <h2 style={{ margin: 0, color: "#344E41", fontSize: "18px" }}>Fedezd fel a természetet</h2>
              <p style={{ margin: "5px 0 0 0", color: "#3A5A40", fontSize: "12px" }}>Bakancslistád és madármegfigyelés</p>
            </div>
          </div>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", marginBottom: "15px" }}>
            Fedezd fel a természet csodáit! Tudj meg többet a téged körülvevő környezetről
          </p>
          <button
            onClick={() => navigate("/NatureExplorer")}
            style={{ width: "100%", padding: "12px", backgroundColor: "#3A5A40", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}
          >
            Felfedezés indítása
          </button>
        </div>

        {/* forest taste */}
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "30px" }}>🍃</div>
            <div>
              <h2 style={{ margin: 0, color: "#344E41", fontSize: "18px" }}>Erdő íze</h2>
              <p style={{ margin: "5px 0 0 0", color: "#3A5A40", fontSize: "12px" }}>Ehető növények és receptek</p>
            </div>
          </div>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", marginBottom: "15px" }}>
            Ismerj meg ehető növényeket és próbálj ki erdei recepteket a következő túrádon!
          </p>
          <button
            onClick={() => navigate("/ForestTaste")}
            style={{ width: "100%", padding: "12px", backgroundColor: "#3A5A40", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}
          >
            Receptek megtekintése
          </button>
        </div>

        {/* water quality — includes Irodalom */}
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
            <div style={{ fontSize: "30px" }}>💧</div>
            <div>
              <h2 style={{ margin: 0, color: "#344E41", fontSize: "18px" }}>Vízminőség megfigyelés</h2>
              <p style={{ margin: "5px 0 0 0", color: "#3A5A40", fontSize: "12px" }}>Biológiai vízminősítés</p>
            </div>
          </div>
          <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6", marginBottom: "15px" }}>
            Tanulj meg biológiai vízminősítést végezni a BISEL módszerrel!
          </p>

          {/* primary buttons */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button
              onClick={() => navigate("/WaterQualitySteps")}
              style={{ flex: 1, padding: "12px", backgroundColor: "#3A5A40", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}
            >
              Mintavételi lépések
            </button>
            <button
              onClick={() => navigate("/WaterQualityProtocol")}
              style={{ flex: 1, padding: "12px", backgroundColor: "#588157", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px" }}
            >
              BISEL Jegyzőkönyv
            </button>
          </div>

          <button
            onClick={() => navigate("/TaskSheet")}
            style={{ width: "100%", padding: "12px", backgroundColor: "#A3B18A", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", marginBottom: "10px" }}
          >
            📊 BISEL Táblázat
          </button>

          {/* irodalom — expandable, same row as the others */}
          <button
            onClick={() => setShowLiterature(!showLiterature)}
            style={{
              width: "100%", padding: "12px",
              backgroundColor: showLiterature ? "#f0f0f0" : "white",
              color: "#344E41",
              border: "1px solid #ddd",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "background-color 0.2s"
            }}
          >
            <span>📚 Irodalom</span>
            <span style={{ fontSize: "12px", color: "#A3B18A" }}>{showLiterature ? "▲" : "▼"}</span>
          </button>

          {showLiterature && (
            <div style={{ marginTop: "12px", padding: "12px", backgroundColor: "#f8f9fa", borderRadius: "10px" }}>
              <div style={{ marginBottom: "12px" }}>
                <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#344E41", fontWeight: "500" }}>
                  Kriska György: Édesvízi gerinctelen állatok
                </p>
                <a
                  href="https://library.hungaricana.hu/hu/view/VizugyiKonyvek_129/?pg=0&layout=s"
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: "#588157", fontSize: "13px", textDecoration: "underline", wordBreak: "break-all" }}
                >
                  library.hungaricana.hu/hu/view/VizugyiKonyvek_129
                </a>
              </div>
              <div>
                <p style={{ margin: "0 0 6px 0", fontSize: "14px", color: "#344E41", fontWeight: "500" }}>
                  BISEL - A biológiai vízminősítés
                </p>
                <a
                  href="https://bisel.hu/a-bisel-rol-roviden"
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: "#588157", fontSize: "13px", textDecoration: "underline" }}
                >
                  bisel.hu/a-bisel-rol-roviden
                </a>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
