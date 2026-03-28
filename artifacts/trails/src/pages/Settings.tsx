import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  MapPin,
  Moon,
  Globe,
  Shield,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const settingsGroups = [
  {
    title: "Preferences",
    items: [
      { icon: Bell, label: "Notifications", type: "toggle", key: "notifications" },
      { icon: MapPin, label: "Location Services", type: "toggle", key: "location" },
      { icon: Moon, label: "Dark Mode", type: "toggle", key: "darkMode" },
      { icon: Globe, label: "Language", type: "link", value: "English" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", type: "link" },
      { icon: Shield, label: "Privacy & Security", type: "link" },
    ],
  },
  {
    title: "Support",
    items: [{ icon: HelpCircle, label: "Help Center", type: "link" }],
  },
];

export default function Settings() {
  const [toggles, setToggles] = useState({
    notifications: true,
    location: true,
    darkMode: false,
  });

  const handleToggle = (key: string) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
  };

  return (
    <div className="min-h-screen bg-[#F5F1EB] pb-28">
      <div className="bg-[#1B4332] px-5 pt-12 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-light text-white tracking-wide">Settings</h1>
            <p className="text-white/60 text-sm mt-1">Customize your experience</p>
          </div>
          <div className="bg-white/10 rounded-full p-3">
            <SettingsIcon className="w-5 h-5 text-white" />
          </div>
        </motion.div>
      </div>

      <div className="px-5 -mt-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-5 border-0 shadow-lg rounded-2xl">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-[#C17F59] text-white text-xl">H</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="font-medium text-[#2D3436]">Hiker</h2>
                <p className="text-sm text-[#2D3436]/50">Adventure Awaits</p>
              </div>
              <ChevronRight className="w-5 h-5 text-[#2D3436]/30" />
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="px-5 mt-6 space-y-6">
        {settingsGroups.map((group, groupIndex) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + groupIndex * 0.1 }}
          >
            <h3 className="text-xs font-medium text-[#2D3436]/50 uppercase tracking-wider mb-3 px-1">
              {group.title}
            </h3>
            <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <div key={item.label}>
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F5F1EB] flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-[#1B4332]" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#2D3436]">{item.label}</p>
                      {item.value && (
                        <p className="text-xs text-[#2D3436]/50">{item.value}</p>
                      )}
                    </div>
                    {item.type === "toggle" ? (
                      <Switch
                        checked={toggles[item.key as keyof typeof toggles] ?? false}
                        onCheckedChange={() => handleToggle(item.key!)}
                        className="data-[state=checked]:bg-[#1B4332]"
                      />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#2D3436]/30" />
                    )}
                  </div>
                  {itemIndex < group.items.length - 1 && (
                    <Separator className="bg-[#F5F1EB]" />
                  )}
                </div>
              ))}
            </Card>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="border-0 shadow-sm rounded-2xl overflow-hidden">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-red-50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-sm font-medium text-red-500">Log Out</p>
            </button>
          </Card>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="text-center text-xs text-[#2D3436]/30 mt-8"
        >
          Trails v1.0.0
        </motion.p>
      </div>
    </div>
  );
}
