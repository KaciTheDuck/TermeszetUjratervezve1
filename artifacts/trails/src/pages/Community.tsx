import { useState } from "react";
import { Heart, MessageCircle, Share2, Send, Users, Plus } from "lucide-react";

const initialPosts = [
  {
    id: 1,
    author_name: "Kovács Péter",
    created_date: "2 órája",
    content: "Ma megmásztuk a Nagykőhavast! A kilátás lélegzetelállító volt! 🏔️",
    likes: 24,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  },
  {
    id: 2,
    author_name: "Nagy Kata",
    created_date: "5 órája",
    content: "Keresnék túratársakat erre a hétvégére! Ki jön a Scropoasa tóhoz? 🏕️",
    likes: 12,
    image: null,
  },
  {
    id: 3,
    author_name: "Szabó Gábor",
    created_date: "1 napja",
    content: "Profi tipp: Mindig vigyél extra vizet és nassolnivalót, még rövidebb túrákra is! 💧🥾",
    likes: 45,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
  },
];

export default function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [postText, setPostText] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const handleCreatePost = () => {
    if (!postText.trim()) return;
    const newPost = {
      id: Date.now(),
      author_name: "Te",
      created_date: "Most",
      content: postText,
      likes: 0,
      image: null,
    };
    setPosts([newPost, ...posts]);
    setPostText("");
  };

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) {
        next.delete(postId);
        setPosts((p) => p.map((post) => post.id === postId ? { ...post, likes: post.likes - 1 } : post));
      } else {
        next.add(postId);
        setPosts((p) => p.map((post) => post.id === postId ? { ...post, likes: post.likes + 1 } : post));
      }
      return next;
    });
  };

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh", paddingBottom: "100px" }}>
      {/* header */}
      <div style={{
        position: "relative",
        overflow: "hidden",
        padding: "40px 20px 30px 20px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
      }}>
        <img
          src="https://images.unsplash.com/photo-1469521669194-babb45599def?w=1200&q=80"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
          alt=""
        />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(52, 78, 65, 0.7)" }} />
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ color: "white", fontSize: "24px", margin: 0 }}>Közösség</h1>
            <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", marginTop: "5px" }}>Kapcsolódj túratársaidhoz</p>
          </div>
          <div style={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: "50%", padding: "12px" }}>
            <Users size={20} color="white" />
          </div>
        </div>
      </div>

      {/* create post */}
      <div style={{ padding: "20px 20px 0" }}>
        <div style={{ backgroundColor: "white", borderRadius: "15px", padding: "15px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
          <textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            placeholder="Oszd meg túraélményedet..."
            style={{
              width: "100%",
              border: "1px solid #e0e0e0",
              borderRadius: "10px",
              padding: "10px",
              fontSize: "14px",
              resize: "none",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit"
            }}
            rows={3}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
            <button
              onClick={handleCreatePost}
              disabled={!postText.trim()}
              style={{
                padding: "10px 20px",
                backgroundColor: postText.trim() ? "#344E41" : "#ccc",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: postText.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "14px"
              }}
            >
              <Send size={16} />
              Közzétesz
            </button>
          </div>
        </div>
      </div>

      {/* posts */}
      <div style={{ padding: "20px" }}>
        {posts.map((post) => (
          <div key={post.id} style={{ backgroundColor: "white", borderRadius: "15px", marginBottom: "15px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
            <div style={{ padding: "15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "#588157", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", flexShrink: 0 }}>
                  {post.author_name[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: "bold", color: "#344E41", fontSize: "14px" }}>{post.author_name}</p>
                  <p style={{ margin: 0, color: "#888", fontSize: "12px" }}>{post.created_date}</p>
                </div>
              </div>
              <p style={{ margin: 0, color: "#444", fontSize: "14px", lineHeight: "1.6" }}>{post.content}</p>
            </div>

            {post.image && (
              <img src={post.image} alt="Post" style={{ width: "100%", height: "200px", objectFit: "cover" }} />
            )}

            <div style={{ padding: "12px 15px", display: "flex", gap: "20px", borderTop: "1px solid #f0f0f0" }}>
              <button
                onClick={() => handleLike(post.id)}
                style={{
                  background: "none", border: "none",
                  color: likedPosts.has(post.id) ? "#e74c3c" : "#888",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px"
                }}
              >
                <Heart size={18} fill={likedPosts.has(post.id) ? "#e74c3c" : "none"} />
                {post.likes}
              </button>
              <button style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <MessageCircle size={18} />
              </button>
              <button style={{ background: "none", border: "none", color: "#888", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}>
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
