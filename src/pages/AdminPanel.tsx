import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Trash2, Lock, Unlock, FileText, Users, CreditCard, Plus, Crown, BarChart3, Bell, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

interface PDF {
  id: number;
  title: string;
  category: string;
  locked: boolean;
  downloads: boolean;
  description: string;
}

const initialPDFs: PDF[] = [
  { id: 10, title: "The Book Thief", category: "Education", locked: false, downloads: true, description: "A powerful story set during World War II by Markus Zusak" },
  { id: 1, title: "Advanced Machine Learning Guide", category: "Technology", locked: true, downloads: true, description: "Deep dive into ML algorithms" },
  { id: 2, title: "Financial Freedom Blueprint", category: "Finance", locked: true, downloads: false, description: "Guide to financial independence" },
  { id: 3, title: "The Science of Habits", category: "Self-Help", locked: false, downloads: true, description: "Building lasting habits" },
];

const mockUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@email.com", plan: "Yearly", status: "Active", expiresAt: "2026-03-01", amount: "₹1,499" },
  { id: 2, name: "Priya Patel", email: "priya@email.com", plan: "Monthly", status: "Active", expiresAt: "2026-04-15", amount: "₹199" },
  { id: 3, name: "Amit Singh", email: "amit@email.com", plan: "Monthly", status: "Expired", expiresAt: "2026-02-10", amount: "₹199" },
];

const ADMIN_PASSWORD = "ayush0001";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pdfs, setPdfs] = useState<PDF[]>(initialPDFs);

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Welcome, Admin! 🔓");
    } else {
      toast.error("Wrong password!");
      setPasswordInput("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 w-full max-w-sm text-center"
        >
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Admin Access</h2>
          <p className="text-sm text-muted-foreground mb-6">Password enter करो</p>
          <Input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
            placeholder="Password"
            className="bg-secondary border-border mb-4"
          />
          <Button className="w-full gold-gradient text-primary-foreground" onClick={handlePasswordSubmit}>
            <Unlock className="w-4 h-4 mr-2" /> Unlock
          </Button>
          <Button variant="ghost" className="mt-3 text-muted-foreground" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleUpload = () => {
    if (!title || !category) {
      toast.error("Title और Category भरें!");
      return;
    }
    const newPDF: PDF = {
      id: Date.now(),
      title,
      category,
      locked: true,
      downloads: false,
      description,
    };
    setPdfs((prev) => [newPDF, ...prev]);
    toast.success(`"${title}" successfully upload हो गया!`);
    setTitle("");
    setCategory("");
    setDescription("");
  };

  const toggleLock = (id: number) => {
    setPdfs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, locked: !p.locked } : p))
    );
    toast.success("PDF lock status updated!");
  };

  const toggleDownload = (id: number) => {
    setPdfs((prev) =>
      prev.map((p) => (p.id === id ? { ...p, downloads: !p.downloads } : p))
    );
    toast.success("Download permission updated!");
  };

  const deletePDF = (id: number) => {
    setPdfs((prev) => prev.filter((p) => p.id !== id));
    toast.success("PDF deleted!");
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === "Active").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage your PDFs & Users</p>
            </div>
          </div>
          <a
            href="https://instagram.com/ayush_bhaskar_459"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Admin Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-6xl font-display font-black gold-text tracking-tight">
            SA.AYUSH
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">Admin Dashboard</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="glass-card p-4 text-center">
            <FileText className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{pdfs.length}</p>
            <p className="text-xs text-muted-foreground">Total PDFs</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Users className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
            <p className="text-xs text-muted-foreground">Total Users</p>
          </div>
          <div className="glass-card p-4 text-center">
            <Crown className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
            <p className="text-xs text-muted-foreground">Active Subs</p>
          </div>
          <div className="glass-card p-4 text-center">
            <BarChart3 className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">₹{activeUsers * 199}</p>
            <p className="text-xs text-muted-foreground">Revenue</p>
          </div>
        </motion.div>

        <Tabs defaultValue="pdfs">
          <TabsList className="bg-secondary mb-8 w-full justify-start">
            <TabsTrigger value="pdfs" className="data-[state=active]:bg-card">
              <FileText className="w-4 h-4 mr-2" /> PDFs
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-card">
              <Users className="w-4 h-4 mr-2" /> Users
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-card">
              <CreditCard className="w-4 h-4 mr-2" /> Subscriptions
            </TabsTrigger>
          </TabsList>

          {/* PDFs Tab */}
          <TabsContent value="pdfs">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Upload New PDF
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Title *</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="PDF Title" className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Category *</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Technology" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description..." className="bg-secondary border-border min-h-[80px]" />
              </div>
              <Button className="gold-gradient text-primary-foreground hover:opacity-90" onClick={handleUpload}>
                <Upload className="w-4 h-4 mr-2" /> Upload PDF
              </Button>
            </motion.div>

            {/* PDF List */}
            <div className="space-y-3">
              {pdfs.map((pdf, i) => (
                <motion.div
                  key={pdf.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{pdf.title}</p>
                      <p className="text-xs text-muted-foreground">{pdf.category} • {pdf.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{pdf.locked ? "Locked" : "Open"}</span>
                      <Switch checked={pdf.locked} onCheckedChange={() => toggleLock(pdf.id)} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">DL</span>
                      <Switch checked={pdf.downloads} onCheckedChange={() => toggleDownload(pdf.id)} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deletePDF(pdf.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              {pdfs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
                  <p>No PDFs uploaded yet</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <div className="space-y-3">
              {mockUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-bold text-primary">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.status === "Active"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {user.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.plan}</span>
                    <span className="text-xs text-muted-foreground">Exp: {user.expiresAt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions">
            <div className="space-y-3">
              {mockUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold gold-text">{user.amount}</p>
                      <p className="text-xs text-muted-foreground">{user.plan} Plan</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.status === "Active"
                        ? "bg-green-500/10 text-green-400"
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {user.status}
                    </span>
                    {user.status === "Expired" && (
                      <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-xs">
                        <Bell className="w-3 h-3 mr-1" /> Remind
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
