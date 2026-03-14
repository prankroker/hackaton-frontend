import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Mock Google authentication
    setTimeout(() => {
      navigate('/dash');
      setIsLoading(false);
    }, 500);
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email');
      setIsLoading(false);
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      setIsLoading(false);
      return;
    }

    // Mock email authentication
    try {
      // Replace with actual API call
      // const response = await fetch('http://localhost:8080/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password })
      // });
      // if (!response.ok) throw new Error('Login failed');

      setTimeout(() => {
        navigate('/dash');
        setIsLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBackToOptions = () => {
    setShowEmailForm(false);
    setEmail('');
    setPassword('');
    setError('');
  };

    return (
        <div className="min-h-screen bg-black flex">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black" />
                <img
                    src="https://images.unsplash.com/photo-1726317219474-7f8a98b53743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt="Product photography"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="relative z-10 flex flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-6 h-6" />
                        <span className="font-semibold text-lg">PhotoAI</span>
                    </div>

                    <div>
                        <h1 className="text-4xl mb-4 font-bold">
                            Turn messy product photos into images that sell
                        </h1>
                        <p className="text-lg text-gray-300">
                            Professional product photography for clothing, shoes, and accessories in seconds
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-12 text-white">
                        <Sparkles className="w-6 h-6" />
                        <span className="font-semibold text-lg">PhotoAI</span>
                    </div>

                    <div className="text-white mb-8">
                        <h2 className="text-3xl font-bold mb-3">Get started</h2>
                        <p className="text-gray-400">Sign in to start transforming your product photos</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
                            {error}
                        </div>
                    )}

                    {!showEmailForm ? (
                        <div className="space-y-4">
                            {/* Google Login - Primary CTA */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={isLoading}
                                className="w-full bg-white text-black px-6 py-4 rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24">
                                    <path
                                        fill="currentColor"
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    />
                                    <path
                                        fill="currentColor"
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    />
                                </svg>
                                {isLoading ? 'Signing in...' : 'Continue with Google'}
                            </button>

                            {/* Email Option - Secondary */}
                            <button
                                onClick={() => setShowEmailForm(true)}
                                disabled={isLoading}
                                className="w-full border border-gray-700 text-white px-6 py-4 rounded-xl hover:bg-gray-900 transition flex items-center justify-center gap-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Mail className="w-5 h-5" />
                                Continue with Email
                            </button>

                            <div className="text-center text-sm text-gray-500 mt-6">
                                By continuing, you agree to our Terms of Service and Privacy Policy
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Email address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-gray-500 transition"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-white text-black px-6 py-4 rounded-xl hover:bg-gray-100 transition font-medium"
                            >
                                Continue
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowEmailForm(false)}
                                className="w-full text-gray-400 hover:text-white transition text-sm"
                            >
                                Back to login options
                            </button>

                            <div className="text-center text-sm text-gray-500 mt-6">
                                By continuing, you agree to our Terms of Service and Privacy Policy
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
