import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const bucketListItems = [
  "Állj meg 1 percre, amikor a legfáradtabbnak érzed magad",
  "Figyelj egy élőlényt 1 teljes percig",
  "Fotózz le valamit, amit addig nem vettél észre és kezd el tanulmányozni",
  "Köszönd meg egy fának, hogy árnyékot ad",
  "Ölelj meg egy fát",
  "Csukd be a szemed 30 mp-re – hány különböző hangot hallasz?",
  "Találj egy helyet, aminek erdőszaga van",
  "Érints meg 3 különböző felszínű dolgot (kéreg, kő, levél)",
  "Keresd meg a legnagyobb fát amit eddig láttál",
  "A túra végén válassz ki egy kedvenc fát/követ, fotózd le vagy nevezd el",
];

export default function BucketList() {
  const [, navigate] = useLocation();
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px 30px 20px",
        position: "relative"
      }}>
        <button
          onClick={() => navigate("/NatureExplorer")}
          style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "white", padding: "8px", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ color: "white", fontSize: "24px", margin: 0, textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>🎒 Bakancslista</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", marginTop: "5px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
          Próbálj ki minél többet ezek közül a természeti élmények közül!
        </p>
      </div>

      <div style={{ padding: "20px" }}>
        <div style={{ backgroundColor: "#f8f9fa", borderRadius: "15px", padding: "15px", marginBottom: "20px" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "#666", lineHeight: "1.6" }}>
            📝 Jelöld be, melyeket teljesítetted! ({checked.size}/{bucketListItems.length})
          </p>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "5px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          {bucketListItems.map((item, i) => (
            <button
              key={i}
              onClick={() => toggle(i)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
                width: "100%",
                padding: "14px 15px",
                border: "none",
                background: "none",
                cursor: "pointer",
                textAlign: "left",
                borderBottom: i < bucketListItems.length - 1 ? "1px solid #f0f0f0" : "none"
              }}
            >
              <div style={{
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                border: "2px solid",
                borderColor: checked.has(i) ? "#588157" : "#ddd",
                backgroundColor: checked.has(i) ? "#588157" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: "1px"
              }}>
                {checked.has(i) && <span style={{ color: "white", fontSize: "14px" }}>✓</span>}
              </div>
              <span style={{ fontSize: "14px", color: checked.has(i) ? "#A3B18A" : "#344E41", textDecoration: checked.has(i) ? "line-through" : "none", lineHeight: "1.5" }}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
