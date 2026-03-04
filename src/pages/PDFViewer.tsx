import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion } from "framer-motion";

const mockPDFs: Record<number, { title: string; pages: number; category: string }> = {
  1: { title: "Advanced Machine Learning Guide", pages: 245, category: "Technology" },
  2: { title: "Financial Freedom Blueprint", pages: 180, category: "Finance" },
  3: { title: "The Science of Habits", pages: 156, category: "Self-Help" },
  4: { title: "Business Strategy Masterclass", pages: 320, category: "Business" },
  5: { title: "Quantum Physics Simplified", pages: 200, category: "Science" },
  6: { title: "Digital Marketing Essentials", pages: 175, category: "Business" },
  7: { title: "Python Programming Mastery", pages: 400, category: "Technology" },
  8: { title: "Mindfulness & Meditation", pages: 120, category: "Self-Help" },
  9: { title: "Data Science Handbook", pages: 350, category: "Technology" },
};

const PDFViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const pdfId = Number(id);
  const pdf = mockPDFs[pdfId];

  if (!pdf) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">PDF not found</p>
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-sm font-semibold text-foreground line-clamp-1">{pdf.title}</h1>
              <p className="text-xs text-muted-foreground">{pdf.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="text-muted-foreground hover:text-foreground"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-12 text-center">{zoom}%</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setZoom((z) => Math.min(200, z + 10))}
              className="text-muted-foreground hover:text-foreground"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* PDF Content Area */}
      <main className="flex-1 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card w-full max-w-3xl aspect-[3/4] flex items-center justify-center relative"
          style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center" }}
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.07] pointer-events-none rotate-[-30deg]">
            <p className="text-4xl md:text-6xl font-bold text-foreground select-none">
              AS PDF's
            </p>
          </div>

          <div className="text-center p-8">
            <p className="text-lg font-semibold text-foreground mb-2">{pdf.title}</p>
            <p className="text-sm text-muted-foreground mb-1">Page {currentPage} of {pdf.pages}</p>
            <p className="text-xs text-muted-foreground mt-4">
              PDF content will appear here when connected to backend storage
            </p>
          </div>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <footer className="sticky bottom-0 glass border-t border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentPage} / {pdf.pages}
          </span>
          <Button
            variant="ghost"
            size="icon"
            disabled={currentPage >= pdf.pages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default PDFViewer;
