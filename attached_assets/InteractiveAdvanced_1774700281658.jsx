// BACKUP - Advanced React Version
import React from 'react';
import { motion } from 'framer-motion';
import { Mountain, Clock, TrendingUp, ChevronRight, Compass } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const hikingRoutes = [
  {
    id: 1,
    name: "Route 1",
    subtitle: "Coming Soon",
    difficulty: "moderate",
    duration: "—",
    elevation: "—",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    available: false
  },
  {
    id: 2,
    name: "Route 2",
    subtitle: "Coming Soon",
    difficulty: "easy",
    duration: "—",
    elevation: "—",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
    available: false
  },
  {
    id: 3,
    name: "Route 3",
    subtitle: "Coming Soon",
    difficulty: "hard",
    duration: "—",
    elevation: "—",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80",
    available: false
  },
  {
    id: 4,
    name: "Route 4",
    subtitle: "Coming Soon",
    difficulty: "moderate",
    duration: "—",
    elevation: "—",
    image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80",
    available: false
  }
];

const difficultyColors = {
  easy: "bg-emerald-100 text-emerald-700",
  moderate: "bg-amber-100 text-amber-700",
  hard: "bg-rose-100 text-rose-700"
};

export default function Interactive() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-28">
      <div className="relative h-64 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B4332]/60 to-[#1B4332]/90" />
        <div className="relative z-10 h-full flex flex-col justify-end p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-light text-white tracking-wide">Explore</h1>
            <p className="text-white/80 mt-1 font-light">Discover your next adventure</p>
          </motion.div>
        </div>
      </div>

      <div className="px-5 -mt-8 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl p-5 shadow-xl shadow-[#1B4332]/5"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-medium text-[#2D3436]">Hiking Routes</h2>
            <Compass className="w-5 h-5 text-[#C17F59]" />
          </div>

          <div className="space-y-4">
            {hikingRoutes.map((route, index) => (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              >
                <Card className={`overflow-hidden border-0 shadow-sm ${!route.available ? 'opacity-75' : ''}`}>
                  <div className="flex">
                    <div className="w-24 h-24 relative flex-shrink-0">
                      <img 
                        src={route.image} 
                        alt={route.name}
                        className="w-full h-full object-cover"
                      />
                      {!route.available && (
                        <div className="absolute inset-0 bg-[#2D3436]/40 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Soon</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-[#2D3436]">{route.name}</h3>
                            <p className="text-xs text-[#2D3436]/50">{route.subtitle}</p>
                          </div>
                          <Badge className={`${difficultyColors[route.difficulty]} text-xs font-normal border-0`}>
                            {route.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-[#2D3436]/60">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {route.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {route.elevation}
                        </span>
                        <ChevronRight className="w-4 h-4 ml-auto text-[#C17F59]" />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-6 grid grid-cols-3 gap-3"
        >
          {[
            { label: "Routes", value: "4", icon: Mountain },
            { label: "Total km", value: "—", icon: TrendingUp },
            { label: "Avg Time", value: "—", icon: Clock }
          ].map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-4 text-center shadow-sm"
            >
              <stat.icon className="w-5 h-5 mx-auto text-[#C17F59] mb-2" />
              <p className="text-xl font-light text-[#2D3436]">{stat.value}</p>
              <p className="text-xs text-[#2D3436]/50">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}