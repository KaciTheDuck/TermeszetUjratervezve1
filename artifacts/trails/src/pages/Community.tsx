import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Heart, MessageCircle, Share2, Camera, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const communityPosts = [
  {
    id: 1,
    author: "Sarah M.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    time: "2h ago",
    content:
      "Just completed an amazing sunrise hike! The views were absolutely breathtaking. Can't wait for more routes to be added! 🏔️",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    likes: 24,
    comments: 5,
  },
  {
    id: 2,
    author: "Mike R.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    time: "5h ago",
    content:
      "Looking for hiking buddies this weekend! Anyone interested in exploring some trails together?",
    image: null,
    likes: 12,
    comments: 8,
  },
  {
    id: 3,
    author: "Emma L.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    time: "1d ago",
    content:
      "Pro tip: Always bring extra water and snacks, even for shorter hikes. The mountain weather can be unpredictable! 💧🥾",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    likes: 45,
    comments: 12,
  },
];

export default function Community() {
  const [newPost, setNewPost] = useState("");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-28">
      <div className="bg-[#1B4332] px-5 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-light text-white tracking-wide">Community</h1>
            <p className="text-white/60 text-sm mt-1">Connect with fellow hikers</p>
          </div>
          <div className="bg-white/10 rounded-full p-3">
            <Users className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="px-5 -mt-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-4 border-0 shadow-lg rounded-2xl">
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-[#C17F59] text-white text-xs">You</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Share your hiking experience..."
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  className="border-0 bg-[#F5F1EB]/50 resize-none focus-visible:ring-1 focus-visible:ring-[#C17F59] rounded-xl text-sm"
                  rows={2}
                />
                <div className="flex items-center justify-between mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#2D3436]/50 hover:text-[#C17F59]"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Photo
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#1B4332] hover:bg-[#1B4332]/90 text-white rounded-full px-4"
                    disabled={!newPost.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="px-5 mt-5 space-y-4">
        {communityPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
          >
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={post.avatar} />
                    <AvatarFallback className="bg-[#C17F59] text-white">
                      {post.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-[#2D3436] text-sm">{post.author}</h3>
                    <p className="text-xs text-[#2D3436]/50">{post.time}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-[#2D3436]/80 leading-relaxed">{post.content}</p>
              </div>

              {post.image && (
                <div className="relative h-48">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="p-4 flex items-center gap-6 border-t border-[#F5F1EB]">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 transition-colors ${
                    likedPosts.has(post.id)
                      ? "text-[#C17F59]"
                      : "text-[#2D3436]/60 hover:text-[#C17F59]"
                  }`}
                >
                  <Heart
                    className="w-4 h-4"
                    fill={likedPosts.has(post.id) ? "currentColor" : "none"}
                  />
                  <span className="text-xs">
                    {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                  </span>
                </button>
                <button className="flex items-center gap-2 text-[#2D3436]/60 hover:text-[#C17F59] transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-[#2D3436]/60 hover:text-[#C17F59] transition-colors ml-auto">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
