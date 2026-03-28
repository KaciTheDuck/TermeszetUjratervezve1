import { useState } from "react";
import { Edit2, MapPin, TrendingUp, Award } from "lucide-react";

export default function Profile() {
  const [darkMode, setDarkMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("Szenvedélyes túrázó vagyok!");
  const [location, setLocation] = useState("Budapest, Magyarország");

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* header */}
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px 100px 20px",
        position: "relative"
      }}>
        <h1 style={{ color: "white", fontSize: "24px", margin: 0, fontWeight: "bold", textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}>Profilom</h1>
      </div>

      {/* profile card */}
      <div style={{ padding: "0 20px", marginTop: "-50px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "15px" }}>
            <div style={{
              width: "70px", height: "70px", borderRadius: "50%",
              backgroundColor: "#588157",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px", color: "white", flexShrink: 0,
              border: "3px solid white", boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
            }}>🧗</div>
            <div style={{ flex: 1 }}>
              <h2 style={{ margin: 0, color: "#344E41", fontSize: "20px" }}>Túrázó</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
                <MapPin size={14} color="#888" />
                <span style={{ color: "#888", fontSize: "13px" }}>{location}</span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "5px" }}
            >
              <Edit2 size={18} color="#588157" />
            </button>
          </div>

          {isEditing ? (
            <div style={{ marginTop: "15px" }}>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{ width: "100%", border: "1px solid #ddd", borderRadius: "10px", padding: "10px", fontSize: "14px", resize: "none", boxSizing: "border-box" }}
                rows={3}
              />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Helyszín"
                style={{ width: "100%", border: "1px solid #ddd", borderRadius: "10px", padding: "10px", fontSize: "14px", marginTop: "8px", boxSizing: "border-box" }}
              />
              <button
                onClick={() => setIsEditing(false)}
                style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}
              >
                Mentés
              </button>
            </div>
          ) : (
            <p style={{ color: "#666", fontSize: "14px", marginTop: "12px", lineHeight: "1.6" }}>{bio}</p>
          )}
        </div>
      </div>

      {/* stats */}
      <div style={{ padding: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          {[
            { icon: "🏔️", value: "2", label: "Túra" },
            { icon: "📏", value: "20.7", label: "km" },
            { icon: "⭐", value: "3", label: "Kitűző" },
          ].map((stat) => (
            <div key={stat.label} style={{ flex: 1, backgroundColor: "white", borderRadius: "15px", padding: "15px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: "24px" }}>{stat.icon}</div>
              <p style={{ fontSize: "20px", margin: "5px 0 0 0", fontWeight: "bold", color: "#344E41" }}>{stat.value}</p>
              <p style={{ fontSize: "12px", color: "#888", margin: "3px 0 0 0" }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* preferences */}
        <p style={{ color: "#888", fontSize: "12px", marginBottom: "10px" }}>BEÁLLÍTÁSOK</p>
        <div style={{ backgroundColor: "white", borderRadius: "15px", overflow: "hidden" }}>
          {[
            { icon: "🔔", label: "Értesítések" },
            { icon: "📍", label: "Helymeghatározás" },
          ].map((item, i) => (
            <div key={item.label} style={{ padding: "15px", borderBottom: i === 0 ? "1px solid #f0f0f0" : "none", display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "18px" }}>{item.icon}</span>
              <span style={{ flex: 1, color: "#344E41", fontSize: "14px" }}>{item.label}</span>
              <span style={{ color: "#A3B18A", fontSize: "18px" }}>›</span>
            </div>
          ))}
          <div style={{ padding: "15px", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "18px" }}>🌙</span>
            <span style={{ flex: 1, color: "#344E41", fontSize: "14px" }}>Sötét mód</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              style={{
                width: "50px", height: "28px",
                borderRadius: "14px",
                backgroundColor: darkMode ? "#588157" : "#ddd",
                border: "none", cursor: "pointer",
                position: "relative",
                transition: "background-color 0.2s"
              }}
            >
              <div style={{
                width: "22px", height: "22px",
                borderRadius: "50%",
                backgroundColor: "white",
                position: "absolute",
                top: "3px",
                left: darkMode ? "25px" : "3px",
                transition: "left 0.2s"
              }} />
            </button>
          </div>
        </div>

        {/* account */}
        <p style={{ color: "#888", fontSize: "12px", marginTop: "20px", marginBottom: "10px" }}>FIÓK</p>
        <div style={{ backgroundColor: "white", borderRadius: "15px", overflow: "hidden" }}>
          <div style={{ padding: "15px", borderBottom: "1px solid #f0f0f0" }}>
            <span style={{ color: "#344E41", fontSize: "14px" }}>👤 Profil szerkesztése</span>
          </div>
          <div style={{ padding: "15px" }}>
            <span style={{ color: "#344E41", fontSize: "14px" }}>🔒 Adatvédelem</span>
          </div>
        </div>

        <div style={{ backgroundColor: "white", borderRadius: "15px", marginTop: "20px" }}>
          <button style={{ width: "100%", padding: "15px", border: "none", backgroundColor: "transparent", color: "red", cursor: "pointer", textAlign: "left", fontSize: "14px" }}>
            🚪 Kijelentkezés
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#ccc", marginTop: "30px", fontSize: "12px" }}>Természet újratervezve v1.0.0</p>
      </div>
    </div>
  );
}
