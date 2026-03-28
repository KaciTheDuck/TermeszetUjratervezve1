import { Link } from "wouter";
import { motion } from "framer-motion";
import { Compass, Users, MapPin, Settings } from "lucide-react";

const navItems = [
  { name: "Interactive", href: "/", icon: Compass, label: "Explore" },
  { name: "Community", href: "/community", icon: Users, label: "Community" },
  { name: "Map", href: "/map", icon: MapPin, label: "Map" },
  { name: "Settings", href: "/settings", icon: Settings, label: "Settings" },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <main>{children}</main>

      <div className="fixed bottom-0 left-0 right-0 z-50 px-5 pb-5 pointer-events-none">
        <motion.nav
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pointer-events-auto"
        >
          <div className="bg-[#2D3436] rounded-2xl shadow-2xl shadow-[#2D3436]/30 px-3 py-2">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const isActive = currentPageName === item.name;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative flex flex-col items-center py-2 px-4 group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-[#1B4332] rounded-xl"
                        transition={{ type: "spring", duration: 0.5 }}
                      />
                    )}
                    <div className="relative z-10 flex flex-col items-center">
                      <item.icon
                        className={`w-5 h-5 transition-colors ${
                          isActive
                            ? "text-white"
                            : "text-white/50 group-hover:text-white/80"
                        }`}
                      />
                      <span
                        className={`text-[10px] mt-1 transition-colors ${
                          isActive
                            ? "text-white font-medium"
                            : "text-white/50 group-hover:text-white/80"
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      </div>
    </div>
  );
}
