import { Link } from "react-router-dom";
import { Dumbbell } from "lucide-react";
import MainNav from "./MainNav";
import AuthButton from "./AuthButton";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-primary">Gym Buddy</span>
        </Link>
        <div className="mx-6">
          <MainNav />
        </div>
        <AuthButton />
      </div>
    </header>
  );
};

export default Header;