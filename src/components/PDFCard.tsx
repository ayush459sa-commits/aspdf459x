import { Lock, BookOpen, Eye, IndianRupee, FileText, GraduationCap } from "lucide-react";
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
  index?: number;
}

const subjectColors: Record<string, string> = {
  Business: "subject-orange",
  Technology: "subject-blue",
  Science: "subject-green",
  Education: "subject-purple",
  Finance: "subject-teal",
  "Self-Help": "subject-pink",
};

const subjectIcons: Record<string, typeof BookOpen> = {
  Business: FileText,
  Technology: GraduationCap,
  Science: BookOpen,
  Education: GraduationCap,
  Finance: FileText,
  "Self-Help": BookOpen,
};

const PDFCard = ({ pdf, isSubscribed, index = 0 }: PDFCardProps) => {
  const navigate = useNavigate();
  const isLocked = pdf.locked && !isSubscribed;
  const colorClass = subjectColors[pdf.category] || "subject-blue";
  const IconComp = subjectIcons[pdf.category] || BookOpen;

  const handleView = () => {
    if (isLocked) {
      toast.error("₹5 pay karke unlock karo!");
      navigate(`/plans?pdf=${pdf.id}`);
    } else {
      navigate(`/pdf/${pdf.id}`);
    }
  };

  return (
    <div className="glass-card overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Top color band */}
      <div className={`h-2 ${colorClass}`} />
      
      <div className="p-5">
        {/* Chapter header */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-11 h-11 rounded-xl ${colorClass} flex items-center justify-center flex-shrink-0`}>
            {isLocked ? (
              <Lock className="w-5 h-5 text-primary-foreground" />
            ) : (
              <IconComp className="w-5 h-5 text-primary-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
              Chapter {index + 1} • {pdf.category}
            </p>
            <h3 className="font-semibold text-foreground line-clamp-2 text-sm leading-snug">
              {pdf.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {pdf.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2 pl-14">
            {pdf.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <FileText className="w-3 h-3" /> {pdf.pages} pages
            </span>
            {isLocked && (
              <span className="flex items-center text-xs font-bold text-destructive">
                <IndianRupee className="w-3 h-3" />5
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleView}
            className={isLocked
              ? "bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs h-8 px-3"
              : "gold-gradient text-primary-foreground hover:opacity-90 text-xs h-8 px-3"
            }
          >
            {isLocked ? (
              <>
                <Lock className="w-3 h-3 mr-1" /> ₹5 Unlock
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 mr-1" /> Read
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PDFCard;
