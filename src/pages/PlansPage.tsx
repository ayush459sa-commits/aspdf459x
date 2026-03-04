import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Check, ArrowLeft, Star, Copy, ExternalLink, QrCode, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const UPI_ID = "ayushbhaskar458@okhdfcbank";
const UPI_NAME = "Ayush Bhaskar";

const plans = [
  {
    name: "Monthly",
    price: "₹199",
    amount: "199",
    period: "/month",
    features: [
      "Unlimited PDF Access",
      "Built-in Secure Viewer",
      "New PDF Alerts",
      "Email Support",
    ],
    popular: false,
  },
  {
    name: "Yearly",
    price: "₹1,499",
    amount: "1499",
    period: "/year",
    features: [
      "Everything in Monthly",
      "Save 37% vs Monthly",
      "Priority Access to New PDFs",
      "Download Access (if enabled)",
      "Priority Support",
    ],
    popular: true,
  },
];

const PlansPage = () => {
  const navigate = useNavigate();
  const [paymentDialog, setPaymentDialog] = useState<{ open: boolean; plan: string; amount: string }>({
    open: false, plan: "", amount: ""
  });

  const handleSubscribe = (plan: string, amount: string) => {
    setPaymentDialog({ open: true, plan, amount });
  };

  const openUPIApp = () => {
    const { plan, amount } = paymentDialog;
    const upiUrl = `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${amount}&cu=INR&tn=${encodeURIComponent(`AS PDFs - ${plan} Plan`)}`;
    window.location.href = upiUrl;
    toast.info("UPI app खुल रहा है...");
  };

  const openGPay = () => {
    const { plan, amount } = paymentDialog;
    const gpayUrl = `https://pay.google.com/gp/v/save?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${paymentDialog.amount}&cu=INR&tn=${encodeURIComponent(`AS PDFs - ${plan} Plan`)}`;
    window.open(gpayUrl, "_blank");
  };

  const copyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    toast.success("UPI ID copied!");
  };

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
    `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${paymentDialog.amount}&cu=INR&tn=${encodeURIComponent(`AS PDFs - ${paymentDialog.plan} Plan`)}`
  )}`;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
          className="text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
            <Crown className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
            Choose Your <span className="gold-text">Plan</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Unlock all premium PDFs with a single subscription. Cancel anytime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={`glass-card p-8 relative ${plan.popular ? "glow-gold-strong" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="gold-gradient text-primary-foreground text-xs font-semibold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" /> Best Value
                  </span>
                </div>
              )}

              <h3 className="text-xl font-display font-bold text-foreground mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold gold-text">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-secondary-foreground">
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSubscribe(plan.name, plan.amount)}
                className={`w-full h-12 font-semibold ${
                  plan.popular
                    ? "gold-gradient text-primary-foreground hover:opacity-90"
                    : "bg-secondary text-secondary-foreground hover:bg-muted"
                }`}
              >
                Subscribe Now
              </Button>
            </motion.div>
          ))}
        </div>

        {/* UPI Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 mt-8 max-w-3xl mx-auto text-center"
        >
          <p className="text-sm text-muted-foreground mb-2">Pay via UPI</p>
          <p className="text-foreground font-mono font-semibold text-lg">{UPI_ID}</p>
          <p className="text-xs text-muted-foreground mt-2">
            After payment, upload your screenshot in the app for instant verification.
          </p>
        </motion.div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={paymentDialog.open} onOpenChange={(open) => setPaymentDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="glass-card border-border max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground text-center text-xl font-display">
              Pay ₹{paymentDialog.amount} for {paymentDialog.plan} Plan
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* QR Code */}
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <QrCode className="w-4 h-4" /> Scan QR Code to Pay
              </p>
              <div className="bg-white p-3 rounded-xl">
                <img
                  src={qrUrl}
                  alt="UPI QR Code"
                  className="w-48 h-48"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* UPI App Button */}
            <Button
              onClick={openUPIApp}
              className="w-full h-12 gold-gradient text-primary-foreground font-semibold hover:opacity-90"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Open UPI App (GPay / PhonePe / Paytm)
            </Button>

            {/* Copy UPI ID */}
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
              Payment करने के बाद screenshot upload करें या admin को भेजें।<br />
              Subscription तुरंत activate हो जाएगी।
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlansPage;
