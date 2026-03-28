import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Download, ChevronLeft, ChevronRight } from "lucide-react";

const sheets = [
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/1ecf136cb_bisel-szines-tabla_page-0001.jpg",
    title: "BISEL Táblázat",
    filename: "BISEL_szines_tablazat.jpg",
    description: "📊 A táblázat segít az indikátorcsoportok és a biotikus index meghatározásában.",
  },
  {
    url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/9e26b9f78_hatarozolap1_page-0001.jpg",
    title: "Terepi Határozólap",
    filename: "Terepi_hatarozolap.jpg",
    description: "🔍 Határozd meg a talált élőlényeket a folyamatábra segítségével.",
  },
];

export default function TaskSheet() {
  const [, navigate] = useLocation();
  const [currentSheet, setCurrentSheet] = useState(0);

  const handleDownload = async () => {
    try {
      const response = await fetch(sheets[currentSheet].url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = sheets[currentSheet].filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Letöltési hiba:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      <div style={{ backgroundColor: "#344E41", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button
          onClick={() => navigate("/entertainment")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: "white", fontSize: "18px", margin: 0 }}>{sheets[currentSheet].title}</h1>
        <button
          onClick={handleDownload}
          style={{ background: "#588157", border: "none", color: "white", padding: "10px 15px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "bold" }}
        >
          <Download size={18} />
          Letöltés
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", position: "relative" }}>
          <img
            src={sheets[currentSheet].url}
            alt={sheets[currentSheet].title}
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />

          {currentSheet > 0 && (
            <button
              onClick={() => setCurrentSheet(currentSheet - 1)}
              style={{ position: "absolute", left: "25px", top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
            >
              <ChevronLeft size={24} color="#344E41" />
            </button>
          )}

          {currentSheet < sheets.length - 1 && (
            <button
              onClick={() => setCurrentSheet(currentSheet + 1)}
              style={{ position: "absolute", right: "25px", top: "50%", transform: "translateY(-50%)", backgroundColor: "rgba(255,255,255,0.9)", border: "none", borderRadius: "50%", width: "45px", height: "45px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}
            >
              <ChevronRight size={24} color="#344E41" />
            </button>
          )}
        </div>

        <div style={{ marginTop: "15px", backgroundColor: "#f8f9fa", borderRadius: "15px", padding: "15px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>{sheets[currentSheet].description}</p>
          <div style={{ marginTop: "10px", textAlign: "center", fontSize: "12px", color: "#888" }}>
            {currentSheet + 1} / {sheets.length}
          </div>
        </div>
      </div>
    </div>
  );
}
