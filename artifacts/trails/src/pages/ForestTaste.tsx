import { useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/9502c32d7_0001.jpg", title: "Navigáció" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/ac58cabd7_0002.jpg", title: "Komló" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/27e016f91_0003.jpg", title: "Édeskömény" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/5fe1b3f41_0004.jpg", title: "Erdei madársóska" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/736f2f134_0005.jpg", title: "Szamóca" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/a84de8009_0006.jpg", title: "Fehér akác" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/a7f932b58_0007.jpg", title: "Ibolya" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/a4a2870b1_0008.jpg", title: "Köszméte" },
  { url: "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/f45a97d10_0009.jpg", title: "Navigáció" },
];

export default function ForestTaste() {
  const [, navigate] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => setCurrentIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setCurrentIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      <div style={{
        backgroundImage: "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/2faf0c57a_matthew-smith-Rfflri94rs8-unsplash.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px 30px 20px"
      }}>
        <button
          onClick={() => navigate("/entertainment")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: "white", fontSize: "24px", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>🌿 Erdő íze</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", marginTop: "5px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Ehető növények és receptek</p>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", marginBottom: "20px" }}>
          <div style={{ textAlign: "center", marginBottom: "15px" }}>
            <h3 style={{ margin: 0, color: "#344E41", fontSize: "16px" }}>{images[currentIndex].title}</h3>
            <p style={{ margin: "5px 0 0 0", color: "#888", fontSize: "13px" }}>{currentIndex + 1} / {images.length}</p>
          </div>

          <div style={{ position: "relative" }}>
            <img
              src={images[currentIndex].url}
              alt={images[currentIndex].title}
              style={{ width: "100%", height: "auto", borderRadius: "10px", display: "block" }}
            />
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <button
              onClick={prev}
              style={{ flex: 1, padding: "12px", backgroundColor: "#f5f5f5", color: "#344E41", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "14px" }}
            >
              <ChevronLeft size={20} />
              Előző
            </button>
            <button
              onClick={next}
              style={{ flex: 1, padding: "12px", backgroundColor: "#588157", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", fontSize: "14px" }}
            >
              Következő
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: "#f8f9fa", borderRadius: "15px", padding: "20px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
            📖 Lapozz a recepteken és ehető növényeken, amelyeket az erdőben találhatsz túrázás közben!
          </p>
        </div>
      </div>
    </div>
  );
}
