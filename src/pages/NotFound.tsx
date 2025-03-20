import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fadeIn">
      <h1 className="text-4xl font-bold text-primary mb-4">404</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Oops! This page doesn't exist
      </p>
      <Button onClick={() => navigate("/")}>Return to Home</Button>
    </div>
  );
};

export default NotFound;