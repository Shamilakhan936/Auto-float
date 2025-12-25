import { Link } from "react-router-dom";

export function AuthTerms() {
  return (
    <p className="text-center text-sm text-muted-foreground mt-6">
      By continuing, you agree to our{" "}
      <Link to="/terms" className="text-accent hover:underline">Terms</Link>
      {" "}and{" "}
      <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
    </p>
  );
}

