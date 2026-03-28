import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

const steps = [
  {
    num: 1,
    title: "A mintavétel célja",
    text: "A mintavétel célja, hogy a vízfolyásban élő, legjellemzőbb apró élőlényeket összegyűjtsük, mert ezek sokat elárulnak a víz tisztaságáról. Ehhez minden elérhető részt megnézünk: a meder alját, a vízinövényeket, a kövek közét, valamint a vízbe lógó gyökereket és egyéb tárgyakat.",
  },
  {
    num: 2,
    title: "A vizsgálat menete",
    text: "A vizsgálat egy körülbelül 10–20 méteres szakaszon történik. Keskeny patakoknál ez nagyjából 3 percig tart, szélesebb vízfolyásoknál akár 5 percig is. A mintát leggyakrabban kézihálóval gyűjtjük, de ahol ez nem megoldható, kézzel vagy csapdával is dolgozhatunk.",
  },
  {
    num: 3,
    title: "Válogatás és feldolgozás",
    text: "A begyűjtött mintát a helyszínen nagyjából megtisztítjuk az iszaptól és a nagyobb törmelékektől, majd a részletes válogatás a laborban történik. Itt sziták és nagyító segítségével különválasztjuk az élőlényeket, és csoportokba rendezzük őket.",
  },
];

export default function WaterQualitySteps() {
  const [, navigate] = useLocation();

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      <div style={{
        backgroundImage: "url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695e6d1e5834f89bd833d7d2/419730444_WhatsAppImage2026-01-27at2217225.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px 30px 20px"
      }}>
        <button
          onClick={() => navigate("/entertainment")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", marginBottom: "15px" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: "white", fontSize: "24px", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Mintavételi lépések</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", marginTop: "5px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>Vízminőség megfigyelés útmutató</p>
      </div>

      <div style={{ padding: "20px" }}>
        {steps.map((step) => (
          <div key={step.num} style={{ backgroundColor: "white", borderRadius: "15px", padding: "20px", marginBottom: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#588157", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", flexShrink: 0 }}>
                {step.num}
              </div>
              <h2 style={{ margin: 0, color: "#344E41", fontSize: "18px" }}>{step.title}</h2>
            </div>
            <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>{step.text}</p>
          </div>
        ))}

        <div style={{ backgroundColor: "#f8f9fa", borderRadius: "15px", padding: "20px", marginBottom: "15px" }}>
          <h3 style={{ margin: "0 0 15px 0", color: "#344E41", fontSize: "16px" }}>💡 Hasznos tippek</h3>
          <ul style={{ margin: 0, paddingLeft: "20px", color: "#666", fontSize: "14px", lineHeight: "1.7" }}>
            <li>Vegyél magaddal kézihálót és átlátszó gyűjtőedényt</li>
            <li>Viselj vízálló cipőt vagy gumicsizmát</li>
            <li>Készíts fényképeket a helyszínről és a mintákról</li>
            <li>Jegyezd fel a pontos helyszínt és időpontot</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
