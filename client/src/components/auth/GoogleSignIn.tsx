import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";

interface GoogleSignInProps {
  className?: string;
}

export function GoogleSignIn({ className }: GoogleSignInProps) {
  const handleGoogleSignIn = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Button
      variant="outline"
      className={`w-full flex items-center justify-center gap-2 ${className}`}
      onClick={handleGoogleSignIn}
    >
      <FcGoogle className="w-5 h-5" />
      <span>Sign in with Google</span>
    </Button>
  );
} 