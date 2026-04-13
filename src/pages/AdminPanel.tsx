import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Trash2, Lock, FileText, Users, CreditCard, Plus, Crown, BarChart3, Bell, Instagram, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface PDF {
  id: string;
  title: string;
  category: string;
  locked: boolean;
  downloads: boolean;
  description: string | null;
  file_url: string;
  pages: number | null;
}

const mockUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@email.com", plan: "Yearly", status: "Active", expiresAt: "2026-03-01", amount: "₹1,499" },
  { id: 2, name: "Priya Patel", email: "priya@email.com", plan: "Monthly", status: "Active", expiresAt: "2026-04-15", amount: "₹199" },
  { id: 3, name: "Amit Singh", email: "amit@email.com", plan: "Monthly", status: "Expired", expiresAt: "2026-02-10", amount: "₹199" },
];

const ADMIN_EMAIL = "ayush459sa@gmail.com";

const AdminPanel = () => {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPDFs = async () => {
    const { data, error } = await supabase
      .from("pdfs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("PDFs load नहीं हो पाए");
      console.error(error);
    } else {
      setPdfs(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setAuthChecking(false);
        fetchPDFs();
      } else {
        setIsAdmin(false);
        setAuthChecking(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user?.email === ADMIN_EMAIL) {
        setIsAdmin(true);
        setAuthChecking(false);
        fetchPDFs();
      } else {
        setIsAdmin(false);
        setAuthChecking(false);
      }
    });

    checkAdmin();
    return () => subscription.unsubscribe();
  }, []);

  if (authChecking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-8 w-full max-w-sm text-center"
        >
          <Lock className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-6">Sirf admin hi ye page dekh sakta hai. Apne admin Gmail se login karo.</p>
          <Button className="w-full gold-gradient text-primary-foreground" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Login Page
          </Button>
          <Button variant="ghost" className="mt-3 text-muted-foreground" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleUpload = async () => {
    if (!title || !category) {
      toast.error("Title और Category भरें!");
      return;
    }
    if (!selectedFile) {
      toast.error("PDF file select करो!");
      return;
    }
    if (selectedFile.type !== "application/pdf") {
      toast.error("सिर्फ PDF files upload करो!");
      return;
    }

    setUploading(true);
    try {
      const fileName = `${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("pdfs").getPublicUrl(fileName);

      const { error: dbError } = await supabase.from("pdfs").insert({
        title,
        category,
        description,
        file_url: urlData.publicUrl,
        locked: true,
        downloads: false,
      });

      if (dbError) throw dbError;

      toast.success(`"${title}" successfully upload हो गया! 🎉`);
      setTitle("");
      setCategory("");
      setDescription("");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      fetchPDFs();
    } catch (err: any) {
      toast.error("Upload failed: " + (err.message || "Unknown error"));
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const toggleLock = async (id: string, currentLocked: boolean) => {
    const { error } = await supabase.from("pdfs").update({ locked: !currentLocked }).eq("id", id);
    if (error) {
      toast.error("Update failed");
    } else {
      setPdfs((prev) => prev.map((p) => (p.id === id ? { ...p, locked: !currentLocked } : p)));
      toast.success("PDF lock status updated!");
    }
  };

  const toggleDownload = async (id: string, currentDownloads: boolean) => {
    const { error } = await supabase.from("pdfs").update({ downloads: !currentDownloads }).eq("id", id);
    if (error) {
      toast.error("Update failed");
    } else {
      setPdfs((prev) => prev.map((p) => (p.id === id ? { ...p, downloads: !currentDownloads } : p)));
      toast.success("Download permission updated!");
    }
  };

  const deletePDF = async (id: string) => {
    const { error } = await supabase.from("pdfs").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
    } else {
      setPdfs((prev) => prev.filter((p) => p.id !== id));
      toast.success("PDF deleted!");
    }
  };

  const totalUsers = mockUsers.length;
  const activeUsers = mockUsers.filter((u) => u.status === "Active").length;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">Admin Panel</h1>
              <p className="text-xs text-muted-foreground">Manage your PDFs & Users</p>
            </div>
          </div>
          <a href="https://instagram.com/ayush_bhaskar_459" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h2 className="text-4xl md:text-6xl font-display font-black gold-text tracking-tight">SA.AYUSH</h2>
          <p className="text-muted-foreground mt-2 text-sm">Admin Dashboard</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
            <TabsTrigger value="pdfs" className="data-[state=active]:bg-card"><FileText className="w-4 h-4 mr-2" /> PDFs</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-card"><Users className="w-4 h-4 mr-2" /> Users</TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-card"><CreditCard className="w-4 h-4 mr-2" /> Subscriptions</TabsTrigger>
          </TabsList>

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
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-1.5 block">PDF File *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                />
                {selectedFile && (
                  <p className="text-xs text-muted-foreground mt-1.5">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
              <Button className="gold-gradient text-primary-foreground hover:opacity-90" onClick={handleUpload} disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {uploading ? "Uploading..." : "Upload PDF"}
              </Button>
            </motion.div>

            {loading ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              </div>
            ) : (
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
                        <Switch checked={pdf.locked} onCheckedChange={() => toggleLock(pdf.id, pdf.locked)} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">DL</span>
                        <Switch checked={pdf.downloads} onCheckedChange={() => toggleDownload(pdf.id, pdf.downloads)} />
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
            )}
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-3">
              {mockUsers.map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>{user.status}</span>
                    <span className="text-xs text-muted-foreground">{user.plan}</span>
                    <span className="text-xs text-muted-foreground">Exp: {user.expiresAt}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="space-y-3">
              {mockUsers.map((user, i) => (
                <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-semibold gold-text">{user.amount}</p>
                      <p className="text-xs text-muted-foreground">{user.plan} Plan</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${user.status === "Active" ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"}`}>{user.status}</span>
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
