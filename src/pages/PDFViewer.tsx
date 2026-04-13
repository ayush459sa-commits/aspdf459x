import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ZoomIn, ZoomOut, Loader2, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const PDFViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(100);
  const [pdf, setPdf] = useState<{ title: string; category: string; file_url: string; pages: number | null; downloads: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPDF = async () => {
      if (!id) return;
      const { data, error } = await supabase.from("pdfs").select("*").eq("id", id).single();
      if (!error && data) {
        setPdf(data);
      }
      setLoading(false);
    };
    fetchPDF();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!pdf) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">PDF not found</p>
          <Button onClick={() => navigate("/")} variant="outline">Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  // Use Google Docs viewer as embed URL for better mobile compatibility
  const embedUrl = `${pdf.file_url}#toolbar=0&navpanes=0&scrollbar=1`;
  const googleViewerUrl = `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdf.file_url)}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-sm font-semibold text-foreground line-clamp-1">{pdf.title}</h1>
              <p className="text-xs text-muted-foreground">{pdf.category}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.max(50, z - 10))} className="text-muted-foreground hover:text-foreground h-8 w-8">
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center">{zoom}%</span>
            <Button variant="ghost" size="icon" onClick={() => setZoom((z) => Math.min(200, z + 10))} className="text-muted-foreground hover:text-foreground h-8 w-8">
              <ZoomIn className="w-4 h-4" />
            </Button>
            {pdf.downloads && (
              <a href={pdf.file_url} download target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-2 md:p-4 overflow-auto">
        <div
          className="w-full max-w-4xl bg-card rounded-lg border border-border overflow-hidden"
          style={{
            height: "calc(100vh - 70px)",
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
        >
          {/* Primary: direct embed, fallback: Google Docs viewer */}
          <object
            data={embedUrl}
            type="application/pdf"
            className="w-full h-full"
          >
            <iframe
              src={googleViewerUrl}
              className="w-full h-full border-0"
              title={pdf.title}
              allowFullScreen
            />
          </object>
        </div>
      </main>
    </div>
  );
};

export default PDFViewer;
