import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Download, Crown, Smartphone, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const InstallPage = () => {
  const navigate = useNavigate();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/dashboard")}
          className="absolute top-4 left-4 text-muted-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="w-24 h-24 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-6">
          <Crown className="w-12 h-12 text-primary-foreground" />
        </div>

        <h1 className="text-3xl font-display font-black gold-text mb-2">AS PDF's</h1>
        <p className="text-muted-foreground mb-8">by SA.AYUSH</p>

        {isInstalled ? (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="glass-card p-6">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">App Installed! ✅</h2>
            <p className="text-muted-foreground text-sm mb-4">
              App आपके phone पर install हो चुका है। Home screen से open करें।
            </p>
            <Button onClick={() => navigate("/dashboard")} className="gold-gradient text-primary-foreground">
              Dashboard पर जाएं
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {deferredPrompt ? (
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                <Button
                  onClick={handleInstall}
                  size="lg"
                  className="gold-gradient text-primary-foreground font-bold text-lg w-full h-14 hover:opacity-90"
                >
                  <Download className="w-5 h-5 mr-2" /> Install App
                </Button>
              </motion.div>
            ) : (
              <div className="glass-card p-6 text-left space-y-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-8 h-8 text-primary flex-shrink-0" />
                  <h2 className="text-lg font-bold text-foreground">App Install करें</h2>
                </div>

                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="font-semibold text-foreground">📱 Android (Chrome):</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Chrome browser में ⋮ (3 dots) menu पर tap करें</li>
                    <li>"Add to Home screen" या "Install app" select करें</li>
                    <li>"Install" पर tap करें</li>
                  </ol>

                  <p className="font-semibold text-foreground mt-4">🍎 iPhone (Safari):</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Safari में Share button (↑) tap करें</li>
                    <li>"Add to Home Screen" select करें</li>
                    <li>"Add" tap करें</li>
                  </ol>
                </div>
              </div>
            )}

            <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full border-border">
              Skip → Dashboard
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default InstallPage;
