import { Link } from "wouter";
import { useEffect } from "react";

const navItems = [
  { page: "Entertainment", href: "/entertainment", label: "Szórakozás", icon: "🎮" },
  { page: "Interactive", href: "/interactive", label: "Felfedezés", icon: "🧭" },
  { page: "Map", href: "/", label: "Térkép", icon: "📍" },
  { page: "Community", href: "/community", label: "Közösség", icon: "👥" },
  { page: "Profile", href: "/profile", label: "Profil", icon: "👤" },
];

interface LayoutProps {
  children: React.ReactNode;
  currentPageName: string;
}

export default function Layout({ children, currentPageName }: LayoutProps) {
  useEffect(() => {
    document.title = "Természet újratervezve";
  }, []);

  return (
    <div style={{ backgroundColor: "#DAD7CD", minHeight: "100vh" }}>
      <main>{children}</main>

      <div style={{ position: "fixed", bottom: "20px", left: "20px", right: "20px", zIndex: 1000 }}>
        <nav style={{ backgroundColor: "#344E41", borderRadius: "15px", padding: "10px", display: "flex", justifyContent: "space-around" }}>
          {navItems.map((item) => {
            const isActive = currentPageName === item.page;
            return (
              <Link
                key={item.page}
                href={item.href}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "8px 12px",
                  borderRadius: "10px",
                  backgroundColor: isActive ? "#588157" : "transparent",
                }}
              >
                <span style={{ fontSize: "18px" }}>{item.icon}</span>
                <span style={{ fontSize: "10px", marginTop: "3px", color: isActive ? "#DAD7CD" : "rgba(255,255,255,0.5)" }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
