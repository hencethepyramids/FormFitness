import { useState } from "react";
import { GoogleSignIn } from "../components/auth/GoogleSignIn";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Button } from "../components/ui/button";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [mode, setMode] = useState<'signin' | 'signup'>("signin");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement email/password sign in or sign up
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            {mode === 'signin' ? 'Sign in' : 'Create an account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signin' ? (
              <>
                or <button className="text-blue-600 underline" onClick={() => setMode('signup')}>create an account</button>
              </>
            ) : (
              <>
                or <button className="text-blue-600 underline" onClick={() => setMode('signin')}>sign in</button>
              </>
            )}
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="accent-blue-600"
              />
              Remember me
            </label>
            <a href="#" className="text-blue-600 text-sm hover:underline">Forgotten your password?</a>
          </div>
          <Button type="submit" className="w-full mt-2">
            {mode === 'signin' ? 'Sign in' : 'Sign up'}
          </Button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-gray-400 text-xs">or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
        <div className="space-y-2">
          <GoogleSignIn />
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => alert('Apple sign in coming soon!')}
          >
            <FaApple className="w-5 h-5" />
            <span>Sign in with Apple</span>
          </Button>
        </div>
      </div>
    </div>
  );
} 