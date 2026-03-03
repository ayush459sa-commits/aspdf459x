import { motion } from "framer-motion";
import { Crown, Check, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

  const handleSubscribe = (plan: string) => {
    toast.info(`To subscribe to the ${plan} plan, please make a UPI payment to: ayushbhaskar458@okhdfcbank and upload your screenshot.`);
  };

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
                onClick={() => handleSubscribe(plan.name)}
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
          <p className="text-foreground font-mono font-semibold text-lg">ayushbhaskar458@okhdfcbank</p>
          <p className="text-xs text-muted-foreground mt-2">
            After payment, upload your screenshot in the app for instant verification.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PlansPage;
