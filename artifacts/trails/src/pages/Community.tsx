import { useState, useEffect, useRef } from "react";
import { Heart, MessageCircle, Send, Users, UserPlus, LogOut, X, ChevronDown, Trash2, Search } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface User { id: number; username: string; display_name: string; email?: string; bio?: string; avatar_url?: string | null; }
interface Post { id: number; content: string; image_url?: string | null; trail_name?: string | null; created_at: string; user_id: number; author_username: string; author_display_name: string; author_avatar_url?: string | null; likes_count: number; comments_count: number; is_liked: boolean; }
interface Comment { id: number; content: string; created_at: string; user_id: number; author_username: string; author_display_name: string; }
interface FriendRow { id: number; status: string; requester_id: number; receiver_id: number; other_user: { id: number; username: string; display_name: string; avatar_url?: string | null }; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const api = async (path: string, opts?: RequestInit) => {
  const token = localStorage.getItem("trails_token");
  const res = await fetch(`${BASE}/api${path}`, {
    ...opts,
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(opts?.headers ?? {}) },
  });
  return res;
};

function Avatar({ name, url, size = 40 }: { name: string; url?: string | null; size?: number }) {
  if (url) return <img src={url} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", backgroundColor: "#588157", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: size * 0.4, flexShrink: 0 }}>
      {name[0]?.toUpperCase()}
    </div>
  );
}

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "Éppen most";
  if (diff < 3600) return `${Math.floor(diff / 60)} perce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} órája`;
  return `${Math.floor(diff / 86400)} napja`;
}

// ─── PostCard ─────────────────────────────────────────────────────────────────
function PostCard({ post, currentUser, onLike, onDelete }: { post: Post; currentUser: User | null; onLike: (id: number) => void; onDelete: (id: number) => void }) {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      const r = await api(`/posts/${post.id}/comments`);
      if (r.ok) setComments(await r.json());
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    const r = await api(`/posts/${post.id}/comments`, { method: "POST", body: JSON.stringify({ content: commentText }) });
    if (r.ok) {
      const nc: Comment = await r.json();
      setComments((p) => [...p, { ...nc, author_username: currentUser!.username, author_display_name: currentUser!.display_name }]);
      setCommentText("");
    }
  };

  return (
    <div style={{ backgroundColor: "white", borderRadius: "15px", marginBottom: "15px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <div style={{ padding: "15px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <Avatar name={post.author_display_name} url={post.author_avatar_url} size={40} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: "bold", color: "#344E41", fontSize: "14px" }}>{post.author_display_name}</p>
            <p style={{ margin: 0, color: "#888", fontSize: "11px" }}>@{post.author_username} · {timeAgo(post.created_at)}</p>
          </div>
          {currentUser && post.user_id === currentUser.id && (
            <button onClick={() => onDelete(post.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc" }}>
              <Trash2 size={16} />
            </button>
          )}
        </div>
        {post.trail_name && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", backgroundColor: "#e8f0e4", color: "#588157", borderRadius: "20px", padding: "2px 8px", marginBottom: "8px" }}>
            🥾 {post.trail_name}
          </div>
        )}
        <p style={{ margin: 0, color: "#444", fontSize: "14px", lineHeight: "1.6" }}>{post.content}</p>
      </div>

      {post.image_url && (
        <img src={post.image_url} alt="Post" style={{ width: "100%", maxHeight: "280px", objectFit: "cover" }} />
      )}

      <div style={{ padding: "10px 15px", display: "flex", gap: "20px", borderTop: "1px solid #f0f0f0" }}>
        <button
          onClick={() => onLike(post.id)}
          style={{ background: "none", border: "none", color: post.is_liked ? "#e74c3c" : "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}
        >
          <Heart size={17} fill={post.is_liked ? "#e74c3c" : "none"} />
          {post.likes_count}
        </button>
        <button onClick={toggleComments} style={{ background: "none", border: "none", color: showComments ? "#344E41" : "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", fontSize: "13px" }}>
          <MessageCircle size={17} />
          {post.comments_count}
        </button>
      </div>

      {showComments && (
        <div style={{ borderTop: "1px solid #f5f5f5", padding: "10px 15px" }}>
          {loadingComments ? (
            <p style={{ color: "#888", fontSize: "13px", margin: 0 }}>Betöltés...</p>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                <Avatar name={c.author_display_name} size={28} />
                <div style={{ backgroundColor: "#f5f5f5", borderRadius: "10px", padding: "6px 10px", flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: "bold", fontSize: "12px", color: "#344E41" }}>{c.author_display_name}</p>
                  <p style={{ margin: 0, fontSize: "13px", color: "#444" }}>{c.content}</p>
                </div>
              </div>
            ))
          )}
          {currentUser && (
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <Avatar name={currentUser.display_name} url={currentUser.avatar_url} size={28} />
              <div style={{ flex: 1, display: "flex", gap: "6px" }}>
                <input
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitComment()}
                  placeholder="Hozzászólás..."
                  style={{ flex: 1, border: "1px solid #e0e0e0", borderRadius: "20px", padding: "6px 12px", fontSize: "13px", outline: "none" }}
                />
                <button onClick={submitComment} disabled={!commentText.trim()} style={{ background: "none", border: "none", cursor: "pointer", color: commentText.trim() ? "#344E41" : "#ccc" }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── AuthModal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (user: User, token: string) => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ username: "", email: "", password: "", display_name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(""); setLoading(true);
    const path = mode === "login" ? "/auth/login" : "/auth/register";
    const body = mode === "login" ? { username: form.username, password: form.password } : form;
    const r = await api(path, { method: "POST", body: JSON.stringify(body) });
    const data = await r.json();
    setLoading(false);
    if (!r.ok) { setError(data.error ?? "Hiba"); return; }
    localStorage.setItem("trails_token", data.token);
    onAuth(data.user, data.token);
    onClose();
  };

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });
  const inputStyle = { width: "100%", border: "1px solid #ddd", borderRadius: "10px", padding: "10px 12px", fontSize: "14px", outline: "none", boxSizing: "border-box" as const };

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "30px", width: "100%", maxWidth: "380px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ margin: 0, color: "#344E41", fontSize: "20px" }}>{mode === "login" ? "Bejelentkezés" : "Regisztráció"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} color="#888" /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {mode === "register" && (
            <input value={form.display_name} onChange={f("display_name")} placeholder="Megjelenő név" style={inputStyle} />
          )}
          <input value={form.username} onChange={f("username")} placeholder="Felhasználónév" style={inputStyle} />
          {mode === "register" && (
            <input value={form.email} onChange={f("email")} placeholder="Email" type="email" style={inputStyle} />
          )}
          <input value={form.password} onChange={f("password")} placeholder="Jelszó" type="password" style={inputStyle}
            onKeyDown={(e) => e.key === "Enter" && submit()} />
        </div>

        {error && <p style={{ color: "#e74c3c", fontSize: "13px", margin: "10px 0 0 0" }}>{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          style={{ width: "100%", marginTop: "20px", padding: "12px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", fontSize: "15px", fontWeight: "500" }}
        >
          {loading ? "..." : mode === "login" ? "Bejelentkezés" : "Regisztráció"}
        </button>

        <p style={{ textAlign: "center", marginTop: "15px", fontSize: "13px", color: "#888" }}>
          {mode === "login" ? "Még nincs fiókod? " : "Van már fiókod? "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "#588157", cursor: "pointer", fontWeight: "bold", fontSize: "13px" }}>
            {mode === "login" ? "Regisztrálj" : "Lépj be"}
          </button>
        </p>
      </div>
    </div>
  );
}

// ─── Friends Tab ──────────────────────────────────────────────────────────────
function FriendsTab({ currentUser }: { currentUser: User }) {
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [msg, setMsg] = useState("");

  useEffect(() => { loadFriends(); }, []);

  const loadFriends = async () => {
    const r = await api("/friends");
    if (r.ok) setFriends(await r.json());
  };

  const doSearch = async (q: string) => {
    setSearchQ(q);
    if (q.length < 2) { setSearchResults([]); return; }
    const r = await api(`/users/search?q=${encodeURIComponent(q)}`);
    if (r.ok) setSearchResults(await r.json());
  };

  const sendRequest = async (receiver_id: number) => {
    const r = await api("/friends/request", { method: "POST", body: JSON.stringify({ receiver_id }) });
    const d = await r.json();
    if (r.ok) { setMsg("Barátság kérés elküldve!"); setSearchQ(""); setSearchResults([]); loadFriends(); }
    else setMsg(d.error ?? "Hiba");
    setTimeout(() => setMsg(""), 3000);
  };

  const accept = async (id: number) => {
    await api(`/friends/${id}/accept`, { method: "POST" });
    loadFriends();
  };

  const reject = async (id: number) => {
    await api(`/friends/${id}/reject`, { method: "POST" });
    loadFriends();
  };

  const pending = friends.filter((f) => f.status === "pending" && f.receiver_id === currentUser.id);
  const accepted = friends.filter((f) => f.status === "accepted");
  const sent = friends.filter((f) => f.status === "pending" && f.requester_id === currentUser.id);

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "14px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#344E41", fontSize: "14px" }}>Barát keresése</p>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid #ddd", borderRadius: "10px", padding: "8px 12px" }}>
          <Search size={16} color="#888" />
          <input value={searchQ} onChange={(e) => doSearch(e.target.value)} placeholder="Keress felhasználónevekre..." style={{ flex: 1, border: "none", outline: "none", fontSize: "14px" }} />
        </div>
        {searchResults.map((u) => {
          const alreadyFriend = friends.some((f) => f.other_user?.id === u.id);
          return (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
              <Avatar name={u.display_name} url={u.avatar_url} size={36} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold", fontSize: "13px", color: "#344E41" }}>{u.display_name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>@{u.username}</p>
              </div>
              {!alreadyFriend && (
                <button onClick={() => sendRequest(u.id)} style={{ padding: "6px 12px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                  <UserPlus size={13} /> Meghívás
                </button>
              )}
            </div>
          );
        })}
        {msg && <p style={{ color: "#588157", fontSize: "13px", margin: "8px 0 0 0" }}>{msg}</p>}
      </div>

      {pending.length > 0 && (
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "14px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#344E41", fontSize: "14px" }}>Bejövő kérések ({pending.length})</p>
          {pending.map((f) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <Avatar name={f.other_user?.display_name ?? "?"} url={f.other_user?.avatar_url} size={36} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#344E41" }}>{f.other_user?.display_name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>@{f.other_user?.username}</p>
              </div>
              <button onClick={() => accept(f.id)} style={{ padding: "5px 10px", backgroundColor: "#588157", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>Elfogad</button>
              <button onClick={() => reject(f.id)} style={{ padding: "5px 8px", backgroundColor: "#f5f5f5", color: "#888", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>✕</button>
            </div>
          ))}
        </div>
      )}

      {accepted.length > 0 && (
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "14px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#344E41", fontSize: "14px" }}>Barátaim ({accepted.length})</p>
          {accepted.map((f) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Avatar name={f.other_user?.display_name ?? "?"} url={f.other_user?.avatar_url} size={36} />
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: "bold", color: "#344E41" }}>{f.other_user?.display_name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#888" }}>@{f.other_user?.username}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {sent.length > 0 && (
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#888", fontSize: "13px" }}>Kiküldött kérések</p>
          {sent.map((f) => (
            <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <Avatar name={f.other_user?.display_name ?? "?"} url={f.other_user?.avatar_url} size={32} />
              <div>
                <p style={{ margin: 0, fontSize: "13px", color: "#344E41" }}>{f.other_user?.display_name}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "#A3B18A" }}>Váróban...</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {pending.length === 0 && accepted.length === 0 && sent.length === 0 && searchQ.length === 0 && (
        <p style={{ textAlign: "center", color: "#888", fontSize: "14px", marginTop: "20px" }}>Még nincsenek barátaid. Keress felhasználókat fent!</p>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Community() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"feed" | "friends">("feed");
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postTrail, setPostTrail] = useState("");
  const [showPostExtras, setShowPostExtras] = useState(false);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("trails_token");
    if (token) {
      api("/auth/me").then(async (r) => {
        if (r.ok) setCurrentUser(await r.json());
        else localStorage.removeItem("trails_token");
      });
    }
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    const r = await api("/posts");
    if (r.ok) setPosts(await r.json());
    setLoading(false);
  };

  const handleAuth = (user: User) => { setCurrentUser(user); loadPosts(); };

  const logout = () => { localStorage.removeItem("trails_token"); setCurrentUser(null); loadPosts(); };

  const handlePost = async () => {
    if (!postText.trim()) return;
    setPosting(true);
    const r = await api("/posts", { method: "POST", body: JSON.stringify({ content: postText, image_url: postImage || null, trail_name: postTrail || null }) });
    if (r.ok) { setPostText(""); setPostImage(""); setPostTrail(""); setShowPostExtras(false); await loadPosts(); }
    setPosting(false);
  };

  const handleLike = async (id: number) => {
    if (!currentUser) { setShowAuth(true); return; }
    await api(`/posts/${id}/like`, { method: "POST" });
    setPosts((prev) => prev.map((p) => p.id === id ? { ...p, is_liked: !p.is_liked, likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1 } : p));
  };

  const handleDelete = async (id: number) => {
    const r = await api(`/posts/${id}`, { method: "DELETE" });
    if (r.ok) setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      {showAuth && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}

      {/* Header */}
      <div style={{ position: "relative", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
        <img src="https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} alt="" />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(52,78,65,0.75)" }} />
        <div style={{ position: "relative", zIndex: 1, padding: "30px 20px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: "white", fontSize: "24px", margin: 0 }}>Közösség</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "13px", margin: "4px 0 0 0" }}>Kapcsolódj túratársaidhoz</p>
          </div>
          {currentUser ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Avatar name={currentUser.display_name} url={currentUser.avatar_url} size={36} />
              <button onClick={logout} style={{ background: "rgba(255,255,255,0.15)", border: "none", borderRadius: "10px", padding: "7px 10px", cursor: "pointer", color: "white" }}>
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button onClick={() => setShowAuth(true)} style={{ padding: "8px 16px", backgroundColor: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "10px", cursor: "pointer", fontSize: "13px", backdropFilter: "blur(4px)" }}>
              Belépés
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", padding: "0 20px 16px" }}>
          {(["feed", "friends"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{ flex: 1, padding: "8px", border: "none", background: activeTab === tab ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.2)", borderRadius: "10px", cursor: "pointer", color: activeTab === tab ? "#344E41" : "rgba(255,255,255,0.9)", fontWeight: activeTab === tab ? "bold" : "normal", fontSize: "13px", margin: "0 4px" }}
            >
              {tab === "feed" ? "📰 Feed" : "👥 Barátok"}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "friends" && currentUser && <FriendsTab currentUser={currentUser} />}

      {activeTab === "friends" && !currentUser && (
        <div style={{ padding: "40px 20px", textAlign: "center" }}>
          <p style={{ color: "#888", marginBottom: "15px" }}>A barátok funkcióhoz be kell lépned.</p>
          <button onClick={() => setShowAuth(true)} style={{ padding: "10px 20px", backgroundColor: "#344E41", color: "white", border: "none", borderRadius: "12px", cursor: "pointer" }}>Belépés</button>
        </div>
      )}

      {activeTab === "feed" && (
        <>
          {/* Create Post */}
          <div style={{ padding: "16px 16px 0" }}>
            <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.08)" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                {currentUser ? <Avatar name={currentUser.display_name} url={currentUser.avatar_url} size={36} /> : <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "#ddd", flexShrink: 0 }} />}
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  onClick={() => !currentUser && setShowAuth(true)}
                  placeholder={currentUser ? "Oszd meg túraélményedet..." : "Lépj be a bejegyzéshez..."}
                  readOnly={!currentUser}
                  style={{ flex: 1, border: "1px solid #e0e0e0", borderRadius: "10px", padding: "10px", fontSize: "14px", resize: "none", outline: "none", fontFamily: "inherit", minHeight: "60px" }}
                  rows={2}
                />
              </div>

              {currentUser && (
                <>
                  <div style={{ marginTop: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button onClick={() => setShowPostExtras(!showPostExtras)} style={{ background: "none", border: "none", cursor: "pointer", color: "#888", fontSize: "12px", display: "flex", alignItems: "center", gap: "4px" }}>
                      <ChevronDown size={14} style={{ transform: showPostExtras ? "rotate(180deg)" : "none" }} />
                      {showPostExtras ? "Kevesebb opció" : "Kép / Útvonal hozzáadása"}
                    </button>
                    <button
                      onClick={handlePost}
                      disabled={!postText.trim() || posting}
                      style={{ padding: "8px 18px", backgroundColor: postText.trim() ? "#344E41" : "#ccc", color: "white", border: "none", borderRadius: "10px", cursor: postText.trim() ? "pointer" : "default", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
                    >
                      <Send size={14} /> {posting ? "..." : "Közzétesz"}
                    </button>
                  </div>

                  {showPostExtras && (
                    <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      <input value={postImage} onChange={(e) => setPostImage(e.target.value)} placeholder="Kép URL (opcionális)" style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", outline: "none" }} />
                      <input value={postTrail} onChange={(e) => setPostTrail(e.target.value)} placeholder="Túraútvonal neve (opcionális)" style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "8px 10px", fontSize: "13px", outline: "none" }} />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Posts feed */}
          <div style={{ padding: "16px" }}>
            {loading ? (
              [1, 2, 3].map((i) => <div key={i} style={{ backgroundColor: "white", borderRadius: "15px", height: "150px", marginBottom: "15px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", opacity: 0.5 }} />)
            ) : posts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
                <p style={{ fontSize: "36px" }}>🏔️</p>
                <p>Még nincs bejegyzés. Légy te az első!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard key={post.id} post={post} currentUser={currentUser} onLike={handleLike} onDelete={handleDelete} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
