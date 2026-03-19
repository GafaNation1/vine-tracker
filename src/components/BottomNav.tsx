import { NavLink, useLocation } from "react-router-dom";
import { Home, Activity, Users, BookOpen, User, Heart } from "lucide-react";

const navItems = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/activities", icon: Activity, label: "Activities" },
  { to: "/groups", icon: Users, label: "Groups" },
  { to: "/programs", icon: BookOpen, label: "Programs" },
  { to: "/mentorship", icon: Heart, label: "Mentorship" },
  { to: "/profile", icon: User, label: "Profile" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-xl safe-area-bottom">
      <div className="mx-auto flex max-w-lg items-center justify-around px-1 py-1.5">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/" && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex flex-col items-center gap-0.5 px-2 py-1.5"
            >
              <item.icon
                className={`h-[20px] w-[20px] transition-colors duration-200 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.2 : 1.7}
              />
              <span
                className={`text-[9px] transition-colors duration-200 ${
                  isActive
                    ? "font-semibold text-primary"
                    : "font-medium text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
