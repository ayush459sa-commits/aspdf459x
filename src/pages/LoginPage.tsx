import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap, BookOpen, Zap, Shield, ArrowRight, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const benefits = [
  { icon: BookOpen, text: "All Textbook Chapters", emoji: "📖" },
  { icon: Zap, text: "Instant Access After Payment", emoji: "⚡" },
  { icon: Shield, text: "NCERT-Style Content", emoji: "🎓" },
  { icon: Star, text: "Regular New Chapters", emoji: "✨" },
];

const LoginPage = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Email aur Password dono bharo!");
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Account ban gaya! Login karo 🎉");
        setIsSignUp(false);
        setLoading(false);
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back! 📚");
      }
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-6xl opacity-5">📚</div>
        <div className="absolute top-1/3 right-10 text-6xl opacity-5">🎓</div>
        <div className="absolute bottom-20 left-1/4 text-6xl opacity-5">📖</div>
        <div className="absolute bottom-10 right-1/4 text-6xl opacity-5">✏️</div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 relative z-10">
        {/* Left - Benefits */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex flex-col justify-center space-y-8"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-12 h-12 rounded-xl gold-gradient flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground font-[Poppins]">AS Textbooks</span>
            </motion.div>
            <h1 className="text-4xl font-bold text-foreground leading-tight mb-4 font-[Poppins]">
              Padhai ko banao<br />
              <span className="gold-text">Smart & Easy</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Premium textbook chapters access karo sirf ₹5 mein. NCERT-style content, kabhi bhi, kahin bhi.
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map((b, i) => (
              <motion.div
                key={b.text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex items-center gap-4 glass-card p-4"
              >
                <span className="text-2xl">{b.emoji}</span>
                <span className="text-foreground font-medium">{b.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right - Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="glass-card p-8 md:p-10 glow-gold"
        >
          <div className="text-center mb-8">
            <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground font-[Poppins]">AS Textbooks</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground font-[Poppins]">
              {isSignUp ? "Account Banao 🎓" : "Welcome Back 📚"}
            </h2>
            <p className="text-muted-foreground mt-2 text-sm">
              {isSignUp
                ? "Sign up karke textbooks access karo"
                : "Login karke apni padhai continue karo"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Full Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Apna naam likho"
                  className="bg-secondary border-border h-12"
                />
              </motion.div>
            )}

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="bg-secondary border-border h-12 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-secondary border-border h-12 pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <button type="button" className="text-sm text-primary hover:underline transition-colors">
                  Forgot Password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 gold-gradient text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity"
            >
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSignUp ? "Sign Up Karo" : "Login Karo"}
              {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {isSignUp ? "Already account hai?" : "Account nahi hai?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium transition-colors"
            >
              {isSignUp ? "Login Karo" : "Sign Up Karo"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
