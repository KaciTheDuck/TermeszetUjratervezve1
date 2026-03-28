import { useLocation } from "wouter";
import { ArrowLeft, Download } from "lucide-react";

const protocolPdfUrl = "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/ddb352694_bisel-terepi-jegyzokonyv.pdf";

export default function WaterQualityProtocol() {
  const [, navigate] = useLocation();

  const handleDownload = async () => {
    try {
      const response = await fetch(protocolPdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "BISEL_jegyzokonyv.pdf";
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
        <h1 style={{ color: "white", fontSize: "18px", margin: 0 }}>BISEL Jegyzőkönyv</h1>
        <button
          onClick={handleDownload}
          style={{ background: "#588157", border: "none", color: "white", padding: "10px 15px", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: "bold" }}
        >
          <Download size={18} />
          Letöltés
        </button>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/9e8a1d548_ddb352694_bisel-terepi-jegyzokonyv4_page-0001.jpg"
            alt="BISEL Jegyzőkönyv"
            style={{ width: "100%", height: "auto", borderRadius: "10px" }}
          />
        </div>
        <div style={{ marginTop: "15px", backgroundColor: "#f8f9fa", borderRadius: "15px", padding: "15px" }}>
          <p style={{ margin: 0, fontSize: "13px", color: "#666", lineHeight: "1.6" }}>
            📝 Töltsd ki a jegyzőkönyvet a helyszínen, és jegyezd fel a vízfolyás jellemzőit és a megfigyelt élőlényeket.
          </p>
        </div>
      </div>
    </div>
  );
}
