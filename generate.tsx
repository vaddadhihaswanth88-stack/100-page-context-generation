import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, ArrowLeft, Loader2, Download, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { generateDocument } from '@/lib/documentGenerator';
import { exportToPdf, exportToDocx } from '@/lib/exportUtils';
import type { GeneratedDocument, GenerationProgress } from '@/types/document';
import DocumentPageView from '@/components/DocumentPageView';

const Generate = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [progress, setProgress] = useState<GenerationProgress>({
    totalChapters: 0, completedChapters: 0, currentChapter: '', totalPages: 0, status: 'idle',
  });
  const [document, setDocument] = useState<GeneratedDocument | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [exporting, setExporting] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) return;
    setDocument(null);
    setCurrentPage(0);
    setProgress({ totalChapters: 15, completedChapters: 0, currentChapter: 'Building outline...', totalPages: 0, status: 'outline' });

    try {
      const doc = await generateDocument(topic.trim(), setProgress);
      setDocument(doc);
    } catch (e) {
      console.error(e);
      setProgress(p => ({ ...p, status: 'error', error: 'Generation failed. Please try again.' }));
    }
  }, [topic]);

  const handleExportPdf = async () => {
    if (!document) return;
    setExporting('pdf');
    try {
      exportToPdf(document);
    } finally {
      setExporting(null);
    }
  };

  const handleExportDocx = async () => {
    if (!document) return;
    setExporting('docx');
    try {
      await exportToDocx(document);
    } finally {
      setExporting(null);
    }
  };

  const progressPercent = progress.totalChapters > 0
    ? Math.round((progress.completedChapters / progress.totalChapters) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">LongContext Pro</span>
            </div>
          </button>
          {document && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPdf}
                disabled={!!exporting}
                className="border-border text-foreground hover:bg-secondary"
              >
                {exporting === 'pdf' ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportDocx}
                disabled={!!exporting}
                className="border-border text-foreground hover:bg-secondary"
              >
                {exporting === 'docx' ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Download className="w-4 h-4 mr-1" />}
                DOCX
              </Button>
            </div>
          )}
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        {/* Input */}
        {!document && progress.status !== 'generating' && progress.status !== 'outline' && (
          <div className="max-w-2xl mx-auto text-center animate-fade-up">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Generate Your Document
            </h1>
            <p className="text-muted-foreground mb-8">
              Enter any topic to generate a 100+ page professional document with charts and data.
            </p>
            <div className="flex gap-3">
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                placeholder="Enter your topic (e.g., Artificial Intelligence, Climate Change, Blockchain)"
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground text-lg py-6"
              />
              <Button
                onClick={handleGenerate}
                disabled={!topic.trim()}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg shrink-0"
              >
                Generate <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        )}

        {/* Progress */}
        {(progress.status === 'outline' || progress.status === 'generating') && !document && (
          <div className="max-w-xl mx-auto text-center animate-fade-up">
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Generating Document</h2>
            <p className="text-muted-foreground mb-6">{progress.currentChapter}</p>
            <Progress value={progressPercent} className="h-2 mb-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Chapter {progress.completedChapters} / {progress.totalChapters}</span>
              <span>{progress.totalPages} pages generated</span>
            </div>
          </div>
        )}

        {/* Error */}
        {progress.status === 'error' && (
          <div className="max-w-md mx-auto text-center">
            <p className="text-destructive mb-4">{progress.error}</p>
            <Button onClick={handleGenerate} className="bg-primary text-primary-foreground">Retry</Button>
          </div>
        )}

        {/* Document Viewer */}
        {document && (
          <div className="animate-fade-up">
            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-foreground">{document.outline.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {document.metadata.totalPages} pages · {document.metadata.totalWords.toLocaleString()} words
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="border-border text-foreground hover:bg-secondary"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-[100px] text-center">
                  Page {currentPage + 1} of {document.pages.length}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(document.pages.length - 1, currentPage + 1))}
                  disabled={currentPage === document.pages.length - 1}
                  className="border-border text-foreground hover:bg-secondary"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Page display */}
            <div className="flex justify-center">
              <DocumentPageView
                page={document.pages[currentPage]}
                outline={document.outline}
                totalPages={document.pages.length}
              />
            </div>

            {/* Page thumbnails */}
            <div className="mt-8 overflow-x-auto pb-4">
              <div className="flex gap-2 min-w-max">
                {document.pages.map((page, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentPage(idx)}
                    className={`w-16 h-20 rounded border text-[6px] leading-tight p-1 transition-all flex-shrink-0 ${
                      idx === currentPage
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-border bg-secondary hover:border-muted-foreground'
                    }`}
                  >
                    <div className="text-muted-foreground truncate">{page.isTitle ? 'Title' : page.isToc ? 'TOC' : page.sectionNumber}</div>
                    <div className="text-[5px] text-muted-foreground/60 mt-0.5">pg {idx + 1}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Generate;
