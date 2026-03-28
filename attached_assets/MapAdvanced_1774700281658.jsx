// BACKUP - Advanced React Version
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Layers, Compass } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Map() {
  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-28 relative">
      <div className="absolute inset-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-30"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&q=80')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F1EB]/80 via-transparent to-[#F5F1EB]" />
      </div>

      <div className="relative z-10">
        <div className="px-5 pt-12 pb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div>
              <h1 className="text-2xl font-light text-[#2D3436] tracking-wide">Trail Map</h1>
              <p className="text-[#2D3436]/50 text-sm mt-1">Navigate your adventures</p>
            </div>
            <div className="bg-[#1B4332] rounded-full p-3">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="absolute right-5 top-32 flex flex-col gap-2"
        >
          {[
            { icon: Navigation, label: "Location" },
            { icon: Layers, label: "Layers" },
            { icon: Compass, label: "Compass" }
          ].map((control, index) => (
            <Button
              key={index}
              variant="outline"
              size="icon"
              className="w-11 h-11 bg-white border-0 shadow-lg rounded-xl hover:bg-[#1B4332] hover:text-white transition-all"
            >
              <control.icon className="w-5 h-5" />
            </Button>
          ))}
        </motion.div>

        <div className="px-5 mt-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-3xl p-8 shadow-xl text-center"
          >
            <div className="w-20 h-20 bg-[#1B4332]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="w-10 h-10 text-[#1B4332]" />
            </div>
            <h2 className="text-xl font-medium text-[#2D3436] mb-2">Interactive Map</h2>
            <p className="text-[#2D3436]/60 text-sm leading-relaxed max-w-xs mx-auto">
              An interactive trail map will be available here once the hiking routes are ready. 
              Stay tuned for detailed navigation!
            </p>
            
            <div className="mt-8 flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map((dot) => (
                <motion.div
                  key={dot}
                  className="w-2 h-2 rounded-full bg-[#C17F59]"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1.5,
                    delay: dot * 0.2,
                    repeat: Infinity
                  }}
                />
              ))}
            </div>
            
            <p className="mt-4 text-xs text-[#C17F59] font-medium">4 Routes Coming Soon</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="px-5 mt-6"
        >
          <div className="bg-[#1B4332] rounded-2xl p-5 flex items-center gap-4">
            <div className="bg-white/10 rounded-xl p-3">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium text-sm">GPS Navigation</h3>
              <p className="text-white/60 text-xs mt-0.5">Turn-by-turn directions for all trails</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}