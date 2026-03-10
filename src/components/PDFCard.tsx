import { Lock, FileText, Eye, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PDF {
  id: string | number;
  title: string;
  category: string;
  pages: number;
  locked: boolean;
  description: string;
}

interface PDFCardProps {
  pdf: PDF;
  isSubscribed: boolean;
}

const PDFCard = ({ pdf, isSubscribed }: PDFCardProps) => {
  const navigate = useNavigate();
  const isLocked = pdf.locked && !isSubscribed;

  const handleView = () => {
    if (isLocked) {
      toast.error("₹5 pay karke unlock karo!");
      navigate(`/plans?pdf=${pdf.id}`);
    } else {
      navigate(`/pdf/${pdf.id}`);
    }
  };

  return (
    <div className={`glass-card overflow-hidden group transition-all duration-300 hover:glow-gold ${isLocked ? "opacity-80" : ""}`}>
      <div className="relative h-40 bg-secondary flex items-center justify-center overflow-hidden">
        <FileText className="w-16 h-16 text-muted-foreground/30" />
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
            {pdf.category}
          </span>
        </div>
        {isLocked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-6 h-6 text-primary" />
            </div>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{pdf.title}</h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{pdf.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{pdf.pages} pages</span>
            {isLocked && (
              <span className="flex items-center text-sm font-bold gold-text">
                <IndianRupee className="w-3.5 h-3.5" />5
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleView}
            className={isLocked 
              ? "gold-gradient text-primary-foreground hover:opacity-90" 
              : "gold-gradient text-primary-foreground hover:opacity-90"
            }
          >
            {isLocked ? (
              <>
                <Lock className="w-3 h-3 mr-1" /> ₹5 Unlock
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 mr-1" /> View
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;
