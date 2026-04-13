import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, LogOut, BookOpen, Star, Settings, Loader2, Download, GraduationCap, Library, TrendingUp, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PDFCard from "@/components/PDFCard";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const categories = ["All", "Business", "Technology", "Science", "Education", "Finance", "Self-Help"];

const subjectEmoji: Record<string, string> = {
  All: "📚",
  Business: "💼",
  Technology: "💻",
  Science: "🔬",
  Education: "🎓",
  Finance: "📊",
  "Self-Help": "🧠",
};

interface PDFData {
  id: string;
  title: string;
  category: string;
  pages: number | null;
  locked: boolean;
  description: string | null;
  file_url: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [pdfs, setPdfs] = useState<PDFData[]>([]);
  const [loading, setLoading] = useState(true);
  const isSubscribed = false;

  useEffect(() => {
    const fetchPDFs = async () => {
      const { data, error } = await supabase
        .from("pdfs")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setPdfs(data);
      }
      setLoading(false);
    };
    fetchPDFs();
  }, []);

  const filtered = pdfs.filter((pdf) => {
    const matchesSearch = pdf.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || pdf.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalPdfs = pdfs.length;
  const lockedPdfs = pdfs.filter(p => p.locked).length;
  const unlockedPdfs = totalPdfs - lockedPdfs;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl gold-gradient flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-base font-bold text-foreground font-[Poppins]">AS Textbooks</span>
              <p className="text-[10px] text-muted-foreground leading-none">Learn • Grow • Excel</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isSubscribed && (
              <Button onClick={() => navigate("/plans")} size="sm" className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 text-xs h-8">
                <Lock className="w-3 h-3 mr-1" /> ₹5 Unlock
              </Button>
            )}
            {isSubscribed && (
              <Badge className="bg-accent/10 text-accent border-accent/20 text-xs">
                <Star className="w-3 h-3 mr-1" /> Premium
              </Badge>
            )}
            <Button variant="ghost" size="icon" onClick={() => navigate("/install")} className="text-muted-foreground hover:text-foreground h-8 w-8">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-foreground h-8 w-8">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={async () => {
              const { data: { session } } = await supabase.auth.getSession();
              if (session) {
                await supabase.auth.signOut();
                toast.success("Logout ho gaye! 👋");
              } else {
                navigate("/login");
              }
            }} className="text-muted-foreground hover:text-foreground h-8 w-8">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Hero section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 font-[Poppins]">
            📚 My <span className="gold-text">Textbooks</span>
          </h1>
          <p className="text-sm text-muted-foreground">Apne subjects explore karo aur chapters padhna shuru karo</p>
        </motion.div>

        {/* Stats cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-3 text-center">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-1.5">
              <Library className="w-4 h-4 text-primary" />
            </div>
            <p className="text-lg font-bold text-foreground">{totalPdfs}</p>
            <p className="text-[10px] text-muted-foreground">Total Books</p>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mx-auto mb-1.5">
              <BookOpen className="w-4 h-4 text-accent" />
            </div>
            <p className="text-lg font-bold text-foreground">{unlockedPdfs}</p>
            <p className="text-[10px] text-muted-foreground">Free</p>
          </div>
          <div className="glass-card p-3 text-center">
            <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center mx-auto mb-1.5">
              <Lock className="w-4 h-4 text-destructive" />
            </div>
            <p className="text-lg font-bold text-foreground">{lockedPdfs}</p>
            <p className="text-[10px] text-muted-foreground">₹5 Each</p>
          </div>
        </motion.div>

        {/* Unlock banner */}
        {!isSubscribed && lockedPdfs > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} 
            className="glass-card p-4 mb-6 border-l-4 border-l-primary flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold text-foreground text-sm">Koi bhi chapter ₹5 mein unlock karo</h3>
                <p className="text-xs text-muted-foreground">UPI se instant access paao</p>
              </div>
            </div>
            <Button onClick={() => navigate("/plans")} size="sm" className="gold-gradient text-primary-foreground font-semibold hover:opacity-90 text-xs h-8 flex-shrink-0">
              ₹5 Pay karo
            </Button>
          </motion.div>
        )}

        {/* Search */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chapters..." className="bg-card border-border pl-10 h-10" />
          </div>
        </motion.div>

        {/* Subject tabs */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeCategory === cat
                  ? "gold-gradient text-primary-foreground shadow-md"
                  : "bg-card text-muted-foreground hover:text-foreground border border-border"
              }`}
            >
              <span>{subjectEmoji[cat]}</span>
              {cat}
            </button>
          ))}
        </motion.div>

        {/* PDF Grid */}
        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading textbooks...</p>
          </div>
        ) : (
          <>
            {activeCategory !== "All" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4">
                <h2 className="text-lg font-bold text-foreground font-[Poppins] flex items-center gap-2">
                  {subjectEmoji[activeCategory]} {activeCategory}
                  <Badge variant="secondary" className="text-xs font-normal">{filtered.length} chapters</Badge>
                </h2>
              </motion.div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((pdf, i) => (
                <motion.div key={pdf.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.03 }}>
                  <PDFCard pdf={{ ...pdf, pages: pdf.pages || 0, description: pdf.description || "" }} isSubscribed={isSubscribed} index={i} />
                </motion.div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">No chapters found</p>
                <p className="text-xs text-muted-foreground mt-1">Try searching with different keywords</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
