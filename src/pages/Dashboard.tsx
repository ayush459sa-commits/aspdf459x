import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Crown, LogOut, BookOpen, Star, User, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import PDFCard from "@/components/PDFCard";
import { Badge } from "@/components/ui/badge";

const categories = ["All", "Business", "Technology", "Science", "Education", "Finance", "Self-Help"];

const mockPDFs = [
  { id: 10, title: "The Book Thief", category: "Education", pages: 584, locked: false, description: "A powerful story set during World War II by Markus Zusak", pdfUrl: "/pdfs/The_Book_Thief.pdf" },
  { id: 1, title: "Advanced Machine Learning Guide", category: "Technology", pages: 245, locked: true, description: "Deep dive into ML algorithms and neural networks" },
  { id: 2, title: "Financial Freedom Blueprint", category: "Finance", pages: 180, locked: true, description: "Step-by-step guide to financial independence" },
  { id: 3, title: "The Science of Habits", category: "Self-Help", pages: 156, locked: false, description: "Understanding and building lasting habits" },
  { id: 4, title: "Business Strategy Masterclass", category: "Business", pages: 320, locked: true, description: "Strategic frameworks for modern businesses" },
  { id: 5, title: "Quantum Physics Simplified", category: "Science", pages: 200, locked: true, description: "Making quantum physics accessible to everyone" },
  { id: 6, title: "Digital Marketing Essentials", category: "Business", pages: 175, locked: false, description: "Complete guide to digital marketing in 2025" },
  { id: 7, title: "Python Programming Mastery", category: "Technology", pages: 400, locked: true, description: "From beginner to advanced Python programming" },
  { id: 8, title: "Mindfulness & Meditation", category: "Self-Help", pages: 120, locked: true, description: "A practical guide to inner peace" },
  { id: 9, title: "Data Science Handbook", category: "Technology", pages: 350, locked: true, description: "Comprehensive data science reference guide" },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const isSubscribed = false;

  const filtered = mockPDFs.filter((pdf) => {
    const matchesSearch = pdf.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || pdf.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg gold-gradient flex items-center justify-center">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-display font-bold text-foreground">AS PDF's</span>
          </div>

          <div className="flex items-center gap-3">
            {!isSubscribed && (
              <Button
                onClick={() => navigate("/plans")}
                size="sm"
                className="gold-gradient text-primary-foreground font-semibold hover:opacity-90"
              >
                <Star className="w-4 h-4 mr-1" />
                Subscribe
              </Button>
            )}
            {isSubscribed && (
              <Badge className="bg-primary/10 text-primary border-primary/20">
                <Crown className="w-3 h-3 mr-1" /> Premium
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/admin")}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
            Explore <span className="gold-text">Premium PDFs</span>
          </h1>
          <p className="text-muted-foreground">
            Browse our curated collection of premium content
          </p>
        </motion.div>

        {/* Subscription Banner */}
        {!isSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 mb-8 glow-gold flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Unlock All PDFs</h3>
                <p className="text-sm text-muted-foreground">
                  Subscribe to access our entire library of premium content
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/plans")}
              className="gold-gradient text-primary-foreground font-semibold hover:opacity-90"
            >
              View Plans
            </Button>
          </motion.div>
        )}

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search PDFs..."
              className="bg-secondary border-border pl-10 h-11"
            />
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "gold-gradient text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* PDF Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((pdf, i) => (
            <motion.div
              key={pdf.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <PDFCard pdf={pdf} isSubscribed={isSubscribed} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No PDFs found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
