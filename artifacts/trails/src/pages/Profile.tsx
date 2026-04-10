import { useState, useEffect, useRef } from "react";
import {
  User, Settings, Lock, Bell, Globe, LogOut, Edit3, Camera,
  ChevronRight, X, Check, Eye, EyeOff, Users, FileText,
  Mountain, AlertCircle,
} from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const TOKEN_KEY = "trails_token";

interface UserData {
  id: number;
  username: string;
  display_name: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  is_public: boolean;
  notifications_enabled: boolean;
  created_at: string;
}

type SettingsView = "main" | "edit-profile" | "change-password" | "privacy" | "notifications";

// ── Helpers ───────────────────────────────────────────────────────────────────
function authHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 48, height: 28, borderRadius: 14,
        backgroundColor: value ? "#588157" : "#ddd",
        border: "none", cursor: "pointer",
        position: "relative", transition: "background-color 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        width: 22, height: 22, borderRadius: "50%", backgroundColor: "white",
        position: "absolute", top: 3, left: value ? 23 : 3,
        transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
      }} />
    </button>
  );
}

function AvatarCircle({ user, size = 80 }: { user: UserData | null; size?: number }) {
  if (user?.avatar_url) {
    return (
      <img
        src={user.avatar_url}
        alt={user.display_name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", border: "3px solid white", boxShadow: "0 2px 12px rgba(0,0,0,0.2)" }}
      />
    );
  }
  const initials = user ? (user.display_name?.[0] ?? user.username?.[0] ?? "?").toUpperCase() : "?";
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      backgroundColor: "#588157", border: "3px solid white",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, color: "white", fontWeight: "700",
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)", flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [user, setUser]           = useState<UserData | null>(null);
  const [stats, setStats]         = useState({ posts: 0, friends: 0 });
  const [loading, setLoading]     = useState(true);
  const [settingsView, setSettingsView] = useState<SettingsView>("main");
  const [toast, setToast]         = useState<{ msg: string; ok: boolean } | null>(null);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");
  const [showLogin, setShowLogin] = useState(false);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  // ── Load user ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) { setLoading(false); return; }
    (async () => {
      try {
        const [meRes, statsRes] = await Promise.all([
          fetch(`${BASE}/api/auth/me`, { headers: authHeaders() }),
          fetch(`${BASE}/api/auth/stats`, { headers: authHeaders() }),
        ]);
        if (!meRes.ok) { localStorage.removeItem(TOKEN_KEY); setLoading(false); return; }
        setUser(await meRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch {}
      setLoading(false);
    })();
  }, []);

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setSettingsView("main");
  };

  // ── Not logged in ──────────────────────────────────────────────────────────
  if (!loading && !user) {
    return (
      <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: 100 }}>
        <div style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80')",
          backgroundSize: "cover", backgroundPosition: "center",
          padding: "60px 20px 80px",
        }}>
          <h1 style={{ color: "white", fontSize: 26, margin: 0, fontWeight: "800", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>Profilom</h1>
        </div>
        <div style={{ padding: "0 20px", marginTop: -40 }}>
          <div style={{ backgroundColor: "white", borderRadius: 20, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,0.12)", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", backgroundColor: "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <User size={32} color="#aaa" />
            </div>
            <h2 style={{ margin: "0 0 8px", color: "#344E41", fontSize: 20 }}>Nem vagy bejelentkezve</h2>
            <p style={{ margin: "0 0 24px", color: "#888", fontSize: 14 }}>Jelentkezz be, hogy megtudd a profilod és beállításaidat kezelni.</p>
            <button onClick={() => { setLoginMode("login"); setShowLogin(true); }}
              style={{ width: "100%", padding: "14px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: 14, cursor: "pointer", fontSize: 15, fontWeight: "600", marginBottom: 10 }}>
              Bejelentkezés
            </button>
            <button onClick={() => { setLoginMode("register"); setShowLogin(true); }}
              style={{ width: "100%", padding: "14px", backgroundColor: "transparent", color: "#344E41", border: "2px solid #344E41", borderRadius: 14, cursor: "pointer", fontSize: 15, fontWeight: "600" }}>
              Regisztráció
            </button>
          </div>
        </div>
        {showLogin && (
          <AuthModal
            mode={loginMode}
            onClose={() => setShowLogin(false)}
            onSuccess={(u) => { setUser(u); setShowLogin(false); }}
            showToast={showToast}
          />
        )}
        {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#588157", fontSize: 14 }}>Betöltés...</div>
      </div>
    );
  }

  // ── Settings sub-views ─────────────────────────────────────────────────────
  if (settingsView !== "main") {
    return (
      <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: 100 }}>
        <div style={{ backgroundColor: "#344E41", padding: "20px 20px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setSettingsView("main")} style={{ background: "none", border: "none", cursor: "pointer", color: "white", display: "flex" }}>
            <ChevronRight size={22} style={{ transform: "rotate(180deg)" }} />
          </button>
          <h2 style={{ margin: 0, color: "white", fontSize: 18, fontWeight: "700" }}>
            {settingsView === "edit-profile" ? "Profil szerkesztése"
              : settingsView === "change-password" ? "Jelszó megváltoztatása"
              : settingsView === "privacy" ? "Adatvédelem"
              : "Értesítések"}
          </h2>
        </div>
        <div style={{ padding: 20 }}>
          {settingsView === "edit-profile" && (
            <EditProfileView user={user!} onSave={(u) => { setUser(u); setSettingsView("main"); showToast("Profil mentve!"); }} showToast={showToast} />
          )}
          {settingsView === "change-password" && (
            <ChangePasswordView onDone={() => { setSettingsView("main"); showToast("Jelszó megváltoztatva!"); }} showToast={showToast} />
          )}
          {settingsView === "privacy" && (
            <PrivacyView user={user!} onUpdate={(u) => setUser({ ...user!, ...u })} showToast={showToast} />
          )}
          {settingsView === "notifications" && (
            <NotificationsView user={user!} onUpdate={(u) => setUser({ ...user!, ...u })} showToast={showToast} />
          )}
        </div>
        {toast && <Toast msg={toast.msg} ok={toast.ok} />}
      </div>
    );
  }

  // ── Main profile view ──────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80')",
        backgroundSize: "cover", backgroundPosition: "center",
        padding: "50px 20px 90px",
      }}>
        <h1 style={{ color: "white", fontSize: 24, margin: 0, fontWeight: "800", textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>Profilom</h1>
      </div>

      <div style={{ padding: "0 16px", marginTop: -60 }}>
        {/* Profile card */}
        <div style={{ backgroundColor: "white", borderRadius: 22, padding: "22px 18px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.12)", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
            <div style={{ position: "relative" }}>
              <AvatarCircle user={user} size={76} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ margin: "0 0 2px", color: "#344E41", fontSize: 20, fontWeight: "700" }}>{user!.display_name}</h2>
              <p style={{ margin: "0 0 4px", color: "#888", fontSize: 13 }}>@{user!.username}</p>
              {user!.email && (
                <p style={{ margin: 0, color: "#A3B18A", fontSize: 12 }}>{user!.email}</p>
              )}
            </div>
            <button
              onClick={() => setSettingsView("edit-profile")}
              style={{ background: "#f5f5f5", border: "none", cursor: "pointer", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 4, color: "#588157", flexShrink: 0 }}
            >
              <Edit3 size={15} />
              <span style={{ fontSize: 12, fontWeight: "600" }}>Szerkeszt</span>
            </button>
          </div>

          {user!.bio && (
            <p style={{ color: "#555", fontSize: 14, marginTop: 14, lineHeight: 1.6, padding: "10px 0 0", borderTop: "1px solid #f5f5f5" }}>
              {user!.bio}
            </p>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          {[
            { icon: <FileText size={20} color="#588157" />, value: stats.posts, label: "Bejegyzés" },
            { icon: <Mountain size={20} color="#588157" />, value: 0, label: "Túra" },
            { icon: <Users size={20} color="#588157" />, value: stats.friends, label: "Barát" },
          ].map((s) => (
            <div key={s.label} style={{ flex: 1, backgroundColor: "white", borderRadius: 16, padding: "16px 10px", textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.07)" }}>
              <div style={{ marginBottom: 6, display: "flex", justifyContent: "center" }}>{s.icon}</div>
              <p style={{ fontSize: 22, margin: "0 0 2px", fontWeight: "800", color: "#344E41" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#999", margin: 0, fontWeight: "500" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Settings list */}
        <p style={{ color: "#888", fontSize: 11, fontWeight: "700", letterSpacing: "0.08em", marginTop: 22, marginBottom: 8 }}>BEÁLLÍTÁSOK</p>
        <div style={{ backgroundColor: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          {[
            { icon: <User size={18} color="#588157" />, label: "Profil szerkesztése", view: "edit-profile" as SettingsView },
            { icon: <Lock size={18} color="#588157" />, label: "Jelszó megváltoztatása", view: "change-password" as SettingsView },
            { icon: <Globe size={18} color="#588157" />, label: "Adatvédelem", view: "privacy" as SettingsView, detail: user!.is_public ? "Nyilvános" : "Privát" },
            { icon: <Bell size={18} color="#588157" />, label: "Értesítések", view: "notifications" as SettingsView, detail: user!.notifications_enabled ? "Bekapcsolva" : "Kikapcsolva" },
          ].map((item, i, arr) => (
            <button
              key={item.label}
              onClick={() => setSettingsView(item.view)}
              style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "15px 18px", border: "none", background: "none", cursor: "pointer", borderBottom: i < arr.length - 1 ? "1px solid #f5f5f5" : "none", textAlign: "left" }}
            >
              <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.icon}
              </div>
              <span style={{ flex: 1, color: "#344E41", fontSize: 14, fontWeight: "500" }}>{item.label}</span>
              {item.detail && <span style={{ fontSize: 12, color: "#A3B18A", marginRight: 4 }}>{item.detail}</span>}
              <ChevronRight size={16} color="#ccc" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <div style={{ backgroundColor: "white", borderRadius: 18, marginTop: 14, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
          <button
            onClick={logout}
            style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", padding: "15px 18px", border: "none", background: "none", cursor: "pointer" }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fff0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LogOut size={18} color="#e74c3c" />
            </div>
            <span style={{ color: "#e74c3c", fontSize: 14, fontWeight: "600" }}>Kijelentkezés</span>
          </button>
        </div>

        <p style={{ textAlign: "center", color: "#ccc", marginTop: 30, fontSize: 11 }}>Természet újratervezve v1.0.0</p>
      </div>

      {toast && <Toast msg={toast.msg} ok={toast.ok} />}
    </div>
  );
}

// ── Edit Profile ──────────────────────────────────────────────────────────────
function EditProfileView({ user, onSave, showToast }: { user: UserData; onSave: (u: UserData) => void; showToast: (m: string, ok?: boolean) => void }) {
  const [name, setName]       = useState(user.display_name);
  const [bio, setBio]         = useState(user.bio ?? "");
  const [avatar, setAvatar]   = useState(user.avatar_url ?? "");
  const [saving, setSaving]   = useState(false);

  const save = async () => {
    if (!name.trim()) { showToast("A név nem lehet üres", false); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/auth/profile`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ display_name: name.trim(), bio: bio.trim(), avatar_url: avatar.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Hiba történt", false); return; }
      onSave(data);
    } catch { showToast("Hálózati hiba", false); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Avatar preview */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, backgroundColor: "white", borderRadius: 18, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
        <AvatarCircle user={{ ...user, display_name: name, avatar_url: avatar || null }} size={80} />
        <p style={{ margin: 0, fontSize: 12, color: "#888", textAlign: "center" }}>Add meg a profilképed URL-jét lentebb</p>
      </div>

      {[
        { label: "Megjelenített név", value: name, setter: setName, placeholder: "Pl. Kovács Péter", multiline: false },
        { label: "Rövid bemutatkozás", value: bio, setter: setBio, placeholder: "Írd le, ki vagy...", multiline: true },
        { label: "Profilkép URL", value: avatar, setter: setAvatar, placeholder: "https://...", multiline: false },
      ].map((f) => (
        <div key={f.label} style={{ backgroundColor: "white", borderRadius: 18, padding: "16px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: "700", color: "#888", letterSpacing: "0.08em", marginBottom: 8 }}>{f.label.toUpperCase()}</label>
          {f.multiline ? (
            <textarea value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder}
              rows={3} style={{ width: "100%", border: "none", outline: "none", fontSize: 14, color: "#344E41", resize: "none", background: "transparent", boxSizing: "border-box", fontFamily: "inherit" }} />
          ) : (
            <input value={f.value} onChange={(e) => f.setter(e.target.value)} placeholder={f.placeholder}
              style={{ width: "100%", border: "none", outline: "none", fontSize: 14, color: "#344E41", background: "transparent", boxSizing: "border-box" }} />
          )}
        </div>
      ))}

      <button onClick={save} disabled={saving}
        style={{ padding: "15px", backgroundColor: saving ? "#A3B18A" : "#344E41", color: "white", border: "none", borderRadius: 14, cursor: saving ? "not-allowed" : "pointer", fontSize: 15, fontWeight: "700" }}>
        {saving ? "Mentés..." : "Mentés"}
      </button>
    </div>
  );
}

// ── Change Password ───────────────────────────────────────────────────────────
function ChangePasswordView({ onDone, showToast }: { onDone: () => void; showToast: (m: string, ok?: boolean) => void }) {
  const [current, setCurrent]   = useState("");
  const [next, setNext]         = useState("");
  const [confirm, setConfirm]   = useState("");
  const [showC, setShowC]       = useState(false);
  const [showN, setShowN]       = useState(false);
  const [saving, setSaving]     = useState(false);

  const save = async () => {
    if (!current || !next || !confirm) { showToast("Minden mező kötelező", false); return; }
    if (next !== confirm) { showToast("Az új jelszavak nem egyeznek", false); return; }
    if (next.length < 6) { showToast("A jelszónak legalább 6 karakter kell", false); return; }
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/auth/change-password`, {
        method: "POST", headers: authHeaders(),
        body: JSON.stringify({ current_password: current, new_password: next }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Hiba", false); return; }
      onDone();
    } catch { showToast("Hálózati hiba", false); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { label: "Jelenlegi jelszó", value: current, setter: setCurrent, show: showC, toggleShow: () => setShowC(!showC) },
        { label: "Új jelszó", value: next, setter: setNext, show: showN, toggleShow: () => setShowN(!showN) },
        { label: "Új jelszó megerősítése", value: confirm, setter: setConfirm, show: showN, toggleShow: () => setShowN(!showN) },
      ].map((f) => (
        <div key={f.label} style={{ backgroundColor: "white", borderRadius: 18, padding: "16px 18px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
          <label style={{ display: "block", fontSize: 11, fontWeight: "700", color: "#888", letterSpacing: "0.08em", marginBottom: 8 }}>{f.label.toUpperCase()}</label>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type={f.show ? "text" : "password"} value={f.value} onChange={(e) => f.setter(e.target.value)}
              style={{ flex: 1, border: "none", outline: "none", fontSize: 14, color: "#344E41", background: "transparent" }} />
            <button onClick={f.toggleShow} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", display: "flex" }}>
              {f.show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
      ))}

      <button onClick={save} disabled={saving}
        style={{ padding: "15px", backgroundColor: saving ? "#A3B18A" : "#344E41", color: "white", border: "none", borderRadius: 14, cursor: saving ? "not-allowed" : "pointer", fontSize: 15, fontWeight: "700" }}>
        {saving ? "Mentés..." : "Jelszó megváltoztatása"}
      </button>
    </div>
  );
}

// ── Privacy View ──────────────────────────────────────────────────────────────
function PrivacyView({ user, onUpdate, showToast }: { user: UserData; onUpdate: (u: Partial<UserData>) => void; showToast: (m: string, ok?: boolean) => void }) {
  const [isPublic, setIsPublic] = useState(user.is_public);
  const [saving, setSaving] = useState(false);

  const save = async (value: boolean) => {
    setIsPublic(value);
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/api/auth/settings`, {
        method: "PATCH", headers: authHeaders(),
        body: JSON.stringify({ is_public: value }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Hiba", false); setIsPublic(!value); return; }
      onUpdate({ is_public: data.is_public });
      showToast(value ? "Profil nyilvánossá téve" : "Profil priváttá téve");
    } catch { showToast("Hálózati hiba", false); setIsPublic(!value); }
    finally { setSaving(false); }
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ padding: "18px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Globe size={18} color="#588157" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 3px", color: "#344E41", fontSize: 15, fontWeight: "600" }}>Nyilvános profil</p>
            <p style={{ margin: 0, color: "#888", fontSize: 13, lineHeight: 1.5 }}>
              {isPublic ? "A profilod mindenki számára látható." : "A profilod csak te láthatod."}
            </p>
          </div>
          <Toggle value={isPublic} onChange={save} />
        </div>
      </div>
    </div>
  );
}

// ── Notifications View ────────────────────────────────────────────────────────
function NotificationsView({ user, onUpdate, showToast }: { user: UserData; onUpdate: (u: Partial<UserData>) => void; showToast: (m: string, ok?: boolean) => void }) {
  const [enabled, setEnabled] = useState(user.notifications_enabled);

  const save = async (value: boolean) => {
    setEnabled(value);
    try {
      const res = await fetch(`${BASE}/api/auth/settings`, {
        method: "PATCH", headers: authHeaders(),
        body: JSON.stringify({ notifications_enabled: value }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Hiba", false); setEnabled(!value); return; }
      onUpdate({ notifications_enabled: data.notifications_enabled });
      showToast(value ? "Értesítések bekapcsolva" : "Értesítések kikapcsolva");
    } catch { showToast("Hálózati hiba", false); setEnabled(!value); }
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.07)" }}>
      <div style={{ padding: "18px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#f0f7f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Bell size={18} color="#588157" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: "0 0 3px", color: "#344E41", fontSize: 15, fontWeight: "600" }}>Push értesítések</p>
            <p style={{ margin: 0, color: "#888", fontSize: 13, lineHeight: 1.5 }}>
              {enabled ? "Értesítések engedélyezve vannak." : "Értesítések kikapcsolva."}
            </p>
          </div>
          <Toggle value={enabled} onChange={save} />
        </div>
      </div>
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ mode, onClose, onSuccess, showToast }: {
  mode: "login" | "register";
  onClose: () => void;
  onSuccess: (user: UserData) => void;
  showToast: (m: string, ok?: boolean) => void;
}) {
  const [tab, setTab]         = useState(mode);
  const [username, setUn]     = useState("");
  const [email, setEmail]     = useState("");
  const [displayName, setDN]  = useState("");
  const [password, setPass]   = useState("");
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    try {
      const url = tab === "login" ? `${BASE}/api/auth/login` : `${BASE}/api/auth/register`;
      const body = tab === "login"
        ? { username, password }
        : { username, email, password, display_name: displayName };
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Hiba"); return; }
      localStorage.setItem(TOKEN_KEY, data.token);
      onSuccess(data.user);
      showToast(tab === "login" ? "Üdvözöllek!" : "Sikeres regisztráció!");
    } catch { setError("Hálózati hiba"); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "flex-end" }}>
      <div style={{ backgroundColor: "white", borderRadius: "24px 24px 0 0", padding: "24px 22px 40px", width: "100%", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 0, backgroundColor: "#f0f0f0", borderRadius: 12, overflow: "hidden" }}>
            {["login", "register"].map((t) => (
              <button key={t} onClick={() => { setTab(t as any); setError(""); }}
                style={{ padding: "8px 18px", border: "none", background: tab === t ? "#344E41" : "transparent", color: tab === t ? "white" : "#888", cursor: "pointer", fontSize: 13, fontWeight: "600", transition: "all 0.2s" }}>
                {t === "login" ? "Bejelentkezés" : "Regisztráció"}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#888" /></button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {tab === "register" && (
            <>
              <input value={displayName} onChange={(e) => setDN(e.target.value)} placeholder="Teljes neved"
                style={{ padding: "13px 15px", border: "1.5px solid #e0e0e0", borderRadius: 12, fontSize: 14, outline: "none", color: "#344E41" }} />
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email cím" type="email"
                style={{ padding: "13px 15px", border: "1.5px solid #e0e0e0", borderRadius: 12, fontSize: 14, outline: "none", color: "#344E41" }} />
            </>
          )}
          <input value={username} onChange={(e) => setUn(e.target.value)} placeholder="Felhasználónév"
            style={{ padding: "13px 15px", border: "1.5px solid #e0e0e0", borderRadius: 12, fontSize: 14, outline: "none", color: "#344E41" }} />
          <input value={password} onChange={(e) => setPass(e.target.value)} placeholder="Jelszó" type="password"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            style={{ padding: "13px 15px", border: "1.5px solid #e0e0e0", borderRadius: 12, fontSize: 14, outline: "none", color: "#344E41" }} />
          {error && (
            <div style={{ display: "flex", gap: 6, alignItems: "center", color: "#e74c3c", fontSize: 13 }}>
              <AlertCircle size={14} />{error}
            </div>
          )}
          <button onClick={submit} disabled={loading}
            style={{ padding: "14px", backgroundColor: loading ? "#A3B18A" : "#344E41", color: "white", border: "none", borderRadius: 12, cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontWeight: "700" }}>
            {loading ? "..." : tab === "login" ? "Bejelentkezés" : "Regisztráció"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  return (
    <div style={{
      position: "fixed", bottom: 100, left: 16, right: 16, zIndex: 9998,
      backgroundColor: ok ? "#344E41" : "#e74c3c", color: "white",
      borderRadius: 14, padding: "12px 16px", fontSize: 14, fontWeight: "500",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 8,
    }}>
      {ok ? <Check size={16} /> : <AlertCircle size={16} />}
      {msg}
    </div>
  );
}
