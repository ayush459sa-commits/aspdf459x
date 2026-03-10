import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, ArrowLeft, Copy, QrCode, Smartphone, IndianRupee, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UPI_ID = "ayushbhaskar458@okhdfcbank";
const UPI_NAME = "Ayush Bhaskar";

const PlansPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pdfId = searchParams.get("pdf");
  const [paymentOpen, setPaymentOpen] = useState(false);

  const openUPIApp = () => {
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=5&cu=INR&tn=${encodeURIComponent(`AS PDFs - PDF Unlock${pdfId ? ` #${pdfId}` : ""}`)}`;
    window.location.href = upiUrl;
    toast.info("UPI app खुल रहा है...");
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied!");
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=5&cu=INR&tn=${encodeURIComponent(`AS PDFs - PDF Unlock`)}`
  )}`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Unlock <span className="gold-text">PDF</span>
          </h1>
          <p className="text-muted-foreground">Sirf ₹5 mein koi bhi PDF unlock karo</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 glow-gold text-center"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="text-5xl font-bold gold-text flex items-center">
              <IndianRupee className="w-8 h-8" />5
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">Per PDF • Lifetime Access</p>

          <Button
            onClick={() => setPaymentOpen(true)}
            className="w-full h-12 gold-gradient text-primary-foreground font-semibold text-lg hover:opacity-90"
          >
            Pay ₹5 Now
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 mt-6 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">UPI ID</p>
          <p className="text-foreground font-mono font-semibold">{UPI_ID}</p>
          <p className="text-xs text-muted-foreground mt-2">
            Payment ke baad screenshot admin ko bhejo — PDF turant unlock hoga.
          </p>
        </motion.div>
      </div>

      <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
        <DialogContent className="glass-card border-border max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center text-xl font-display">
              Pay ₹5 — PDF Unlock
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <QrCode className="w-4 h-4" /> Scan QR Code to Pay
              </p>
              <div className="bg-white p-3 rounded-xl">
                <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48" loading="lazy" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <Button
              onClick={openUPIApp}
              className="w-full h-12 gold-gradient text-primary-foreground font-semibold hover:opacity-90"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Open UPI App (GPay / PhonePe / Paytm)
            </Button>

            <div className="glass-card p-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">UPI ID</p>
                <p className="text-sm font-mono text-foreground font-semibold">{UPI_ID}</p>
              </div>
              <Button variant="outline" size="sm" onClick={copyUPI} className="border-border text-foreground">
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Payment करने के बाद screenshot admin को भेजें।<br />
              PDF तुरंत unlock हो जाएगी। ✅
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansPage;