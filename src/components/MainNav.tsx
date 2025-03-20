import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, Calendar, Dumbbell, User } from "lucide-react";

const MainNav = () => {
  const location = useLocation();

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/matches", label: "Matches", icon: Users },
    { href: "/schedule", label: "Schedule", icon: Calendar },
    { href: "/workouts", label: "Workouts", icon: Dumbbell },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
              location.pathname === link.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default MainNav;