import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";

interface Trail {
  id: number;
  name: string;
  location: string;
  description: string;
  distance: number;
  elevation: number;
  difficulty: string;
  duration: string;
  start_lat: number | null;
  start_lon: number | null;
  tags: string[];
  image_url: string | null;
}

const DIFFICULTIES = ["Könnyű", "Közepes", "Nehéz", "Nagyon nehéz"];

export default function Interactive() {
  const [, navigate] = useLocation();
  const [trails, setTrails] = useState<Trail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  useEffect(() => {
    fetchTrails();
  }, []);

  const fetchTrails = async (params?: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const query = new URLSearchParams(params ?? {}).toString();
      const res = await fetch(`/api/trails${query ? `?${query}` : ""}`);
      if (!res.ok) throw new Error("Nem sikerült betölteni az útvonalakat");
      const data = await res.json();
      setTrails(data);
    } catch (e) {
      setError("Hiba az útvonalak betöltésekor");
    } finally {
      setLoading(false);
    }
  };

  const applySearch = () => {
    const params: Record<string, string> = {};
    if (searchName.trim()) params.name = searchName.trim();
    if (searchLocation.trim()) params.location = searchLocation.trim();
    if (selectedDifficulty) params.difficulty = selectedDifficulty;
    if (maxDistance) params.maxDistance = maxDistance;
    if (selectedTag) params.tags = selectedTag;
    fetchTrails(params);
  };

  const clearFilters = () => {
    setSearchName("");
    setSearchLocation("");
    setSelectedDifficulty("");
    setMaxDistance("");
    setSelectedTag("");
    fetchTrails();
  };

  const hasFilters = searchName || searchLocation || selectedDifficulty || maxDistance || selectedTag;

  const MY_TRAIL_NAMES = ["Nagykőhavas", "Scropoasa tó"];
  const myTrails    = trails.filter((t) => MY_TRAIL_NAMES.some((n) => t.name.includes(n)));
  const otherTrails = trails.filter((t) => !MY_TRAIL_NAMES.some((n) => t.name.includes(n)));

  const difficultyColor: Record<string, string> = {
    "Könnyű": "#588157",
    "Közepes": "#A3B18A",
    "Nehéz": "#E07B39",
    "Nagyon nehéz": "#C0392B",
  };

  const TrailCard = ({ trail }: { trail: Trail }) => (
    <div
      onClick={() => navigate(`/?trailId=${trail.id}`)}
      style={{ backgroundColor: "white", borderRadius: "15px", display: "flex", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer" }}
    >
      <img
        src={trail.image_url ?? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80"}
        alt={trail.name}
        style={{ width: "110px", height: "110px", objectFit: "cover", flexShrink: 0 }}
      />
      <div style={{ padding: "14px", flex: 1, minWidth: 0 }}>
        <h3 style={{ margin: "0 0 4px 0", fontSize: "15px", color: "#344E41", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {trail.name}
        </h3>
        <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          📍 {trail.location}
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#666" }}>📏 {trail.distance} km</span>
          <span style={{ fontSize: "11px", color: "#666" }}>⛰️ {trail.elevation}m</span>
          <span style={{ fontSize: "11px", color: "#666" }}>⏱️ {trail.duration}</span>
        </div>
        <div style={{ marginTop: "6px" }}>
          <span style={{
            fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
            backgroundColor: difficultyColor[trail.difficulty] ?? "#888",
            color: "white", fontWeight: "500"
          }}>
            {trail.difficulty}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* header */}
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "40px 20px 30px 20px",
      }}>
        <h1 style={{ color: "white", fontSize: "28px", margin: 0, textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Felfedezés</h1>
        <p style={{ color: "rgba(255,255,255,0.9)", margin: "5px 0 0 0", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>Találd meg következő kalandod</p>
      </div>

      <div style={{ padding: "16px 20px 0" }}>
        {/* search bar */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
          <div style={{ flex: 1, backgroundColor: "white", borderRadius: "12px", display: "flex", alignItems: "center", gap: "10px", padding: "0 14px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            <Search size={16} color="#888" />
            <input
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applySearch()}
              placeholder="Keress túraútvonalak között..."
              style={{ flex: 1, border: "none", outline: "none", fontSize: "14px", padding: "12px 0", background: "transparent", color: "#344E41" }}
            />
            {searchName && (
              <button onClick={() => { setSearchName(""); fetchTrails(); }} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={14} color="#888" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            style={{
              backgroundColor: showFilters || hasFilters ? "#344E41" : "white",
              color: showFilters || hasFilters ? "white" : "#344E41",
              border: "none", borderRadius: "12px", padding: "0 14px",
              cursor: "pointer", display: "flex", alignItems: "center", gap: "6px",
              fontSize: "13px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", whiteSpace: "nowrap"
            }}
          >
            <SlidersHorizontal size={16} />
            Szűrők
          </button>
        </div>

        {/* filter panel */}
        {showFilters && (
          <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "16px", marginBottom: "12px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
              {/* location */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Helyszín</label>
                <input
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="pl. Brassó"
                  style={{ width: "100%", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              {/* difficulty */}
              <div>
                <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Nehézség</label>
                <div style={{ position: "relative" }}>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    style={{ width: "100%", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", appearance: "none", background: "white", outline: "none", cursor: "pointer" }}
                  >
                    <option value="">Bármelyik</option>
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown size={14} color="#888" style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                </div>
              </div>

              {/* max distance */}
              <div>
                <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Max. távolság (km)</label>
                <input
                  type="number"
                  value={maxDistance}
                  onChange={(e) => setMaxDistance(e.target.value)}
                  placeholder="pl. 15"
                  min="0"
                  style={{ width: "100%", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              {/* tag */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Cimke</label>
                <input
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  placeholder="pl. tó, csúcs, körút..."
                  style={{ width: "100%", border: "1px solid #ddd", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={applySearch}
                style={{ flex: 1, padding: "10px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "14px", fontWeight: "500" }}
              >
                Keresés
              </button>
              {hasFilters && (
                <button
                  onClick={clearFilters}
                  style={{ padding: "10px 16px", backgroundColor: "#f5f5f5", color: "#888", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}
                >
                  Törlés
                </button>
              )}
            </div>
          </div>
        )}

        {/* results count */}
        <p style={{ fontSize: "13px", color: "#888", margin: "0 0 12px 0" }}>
          {loading ? "Betöltés..." : `${trails.length} útvonal megtalálva`}
        </p>
      </div>

      <div style={{ padding: "0 20px" }}>
        {error ? (
          <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "30px", textAlign: "center", color: "#888" }}>
            <p>{error}</p>
            <button onClick={() => fetchTrails()} style={{ marginTop: "10px", padding: "10px 20px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: "10px", cursor: "pointer" }}>
              Újra próbál
            </button>
          </div>
        ) : loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ backgroundColor: "white", borderRadius: "15px", height: "100px", boxShadow: "0 2px 5px rgba(0,0,0,0.08)", opacity: 0.6 }} />
            ))}
          </div>
        ) : trails.length === 0 ? (
          <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "40px 20px", textAlign: "center", color: "#888" }}>
            <p style={{ fontSize: "36px", margin: "0 0 10px 0" }}>🔍</p>
            <p>Nem találtunk útvonalat a megadott feltételekkel</p>
            <button onClick={clearFilters} style={{ marginTop: "12px", padding: "10px 20px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontSize: "13px" }}>
              Összes útvonal
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* ── Saját túrák ── */}
            {myTrails.length > 0 && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#344E41", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    🥾 Saját túrák
                  </span>
                  <div style={{ flex: 1, height: "1px", backgroundColor: "#C5BFB5" }} />
                </div>
                {myTrails.map((trail) => (
                  <TrailCard key={trail.id} trail={trail} />
                ))}
                {otherTrails.length > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "#888", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      Összes túra
                    </span>
                    <div style={{ flex: 1, height: "1px", backgroundColor: "#C5BFB5" }} />
                  </div>
                )}
              </>
            )}
            {/* ── Other trails ── */}
            {otherTrails.map((trail) => (
              <TrailCard key={trail.id} trail={trail} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
