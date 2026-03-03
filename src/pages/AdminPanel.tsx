import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Upload, Trash2, Lock, Unlock, FileText, Users, CreditCard, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

const mockPDFs = [
  { id: 1, title: "Advanced Machine Learning Guide", category: "Technology", locked: true, downloads: true },
  { id: 2, title: "Financial Freedom Blueprint", category: "Finance", locked: true, downloads: false },
  { id: 3, title: "The Science of Habits", category: "Self-Help", locked: false, downloads: true },
];

const mockUsers = [
  { id: 1, name: "Rahul Sharma", email: "rahul@email.com", plan: "Yearly", status: "Active", expiresAt: "2026-03-01" },
  { id: 2, name: "Priya Patel", email: "priya@email.com", plan: "Monthly", status: "Active", expiresAt: "2026-04-15" },
  { id: 3, name: "Amit Singh", email: "amit@email.com", plan: "Monthly", status: "Expired", expiresAt: "2026-02-10" },
];

const AdminPanel = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = () => {
    if (!title || !category) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success(`PDF "${title}" uploaded successfully!`);
    setTitle("");
    setCategory("");
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-display font-bold text-foreground">Admin Panel</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="pdfs">
          <TabsList className="bg-secondary mb-8">
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

          <TabsContent value="pdfs">
            {/* Upload Form */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Upload New PDF
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="PDF Title" className="bg-secondary border-border" />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Category</label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Technology" className="bg-secondary border-border" />
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" className="bg-secondary border-border" />
              </div>
              <div className="flex items-center gap-4">
                <Button className="gold-gradient text-primary-foreground hover:opacity-90" onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" /> Upload PDF
                </Button>
              </div>
            </motion.div>

            {/* PDF List */}
            <div className="space-y-3">
              {mockPDFs.map((pdf, i) => (
                <motion.div
                  key={pdf.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{pdf.title}</p>
                      <p className="text-xs text-muted-foreground">{pdf.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {pdf.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      <Switch checked={pdf.locked} />
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-3">
              {mockUsers.map((user, i) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium text-foreground text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      user.status === "Active" 
                        ? "bg-success/10 text-success" 
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {user.status}
                    </span>
                    <span className="text-xs text-muted-foreground">{user.plan}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscriptions">
            <div className="glass-card p-8 text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Subscription Management</h3>
              <p className="text-sm text-muted-foreground">
                View and manage user subscriptions. Payment verification and approval will be available with backend integration.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
