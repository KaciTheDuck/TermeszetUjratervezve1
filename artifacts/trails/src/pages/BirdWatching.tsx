import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function BirdWatching() {
  const [, navigate] = useLocation();

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      <div style={{ backgroundColor: "#344E41", padding: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
        <button
          onClick={() => navigate("/NatureExplorer")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: "white", fontSize: "24px", margin: 0 }}>🦉 Madármegfigyelés</h1>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/60b7181c7_c1e8c1b6-0307-4fd4-bf6c-c08e805794cd.jpg"
            alt="Macskabagoly"
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
        </div>
        <div style={{ backgroundColor: "#f8f9fa", borderRadius: "15px", padding: "15px", marginTop: "15px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
            🦅 Rögzítsd a megfigyelt madarakat a túráid során! A képen egy macskabagoly látható (Strix aluco), amely Magyarország egyik leggyakoribb baglyfaja.
          </p>
        </div>
      </div>
    </div>
  );
}
