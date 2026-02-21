import { useNavigate } from 'react-router-dom';
import { FileText, Zap, Shield, Download, ArrowRight, BarChart3, BookOpen, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  { icon: Zap, title: 'AI-Powered Generation', desc: 'Generate 100+ pages of unique, expert-quality content from a single topic.' },
  { icon: Shield, title: 'Zero Repetition Engine', desc: 'Hierarchical memory ensures every page contains distinct, non-repeating content.' },
  { icon: BarChart3, title: 'Charts & Visualizations', desc: 'Auto-generated pie charts, bar graphs, and data visualizations throughout.' },
  { icon: BookOpen, title: 'Publication-Ready', desc: 'Natural writing style with varied structure, expert reasoning, and proper citations.' },
  { icon: Download, title: 'PDF & DOCX Export', desc: 'Professional formatting with table of contents, page numbers, and references.' },
  { icon: FileText, title: '15-Chapter Structure', desc: 'Comprehensive coverage with 105+ unique sections across 15 thematic chapters.' },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background" style={{ background: 'var(--gradient-hero)' }}>
      {/* Nav */}
      <nav className="border-b border-border/50 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">LongContext Pro</span>
          </div>
          <Button
            onClick={() => navigate('/generate')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Get Started <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="container mx-auto px-6 py-24 md:py-32 text-center">
        <div className="animate-fade-up max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 mb-8">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="text-sm font-medium text-primary">AI Document Generation Engine</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight mb-6">
            Generate <span className="gradient-text">100+ Page</span> Professional Documents
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Publication-ready documents with expert-quality writing, data visualizations, 
            and zero repetition. Every page is unique. Every word matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/generate')}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6 btn-glow glow-primary"
            >
              Start Generating <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-fade-up animation-delay-400">
          {[
            { value: '100+', label: 'Unique Pages' },
            { value: '15', label: 'Chapters' },
            { value: '0', label: 'Repeated Lines' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black gradient-text">{stat.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for <span className="gradient-text">Serious</span> Documents
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every feature designed to produce documents that feel authored by a real expert.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-6 hover:border-primary/30 transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Enter Your Topic', desc: 'Provide any topic — even a single word — and our engine builds a comprehensive outline.' },
            { step: '02', title: 'AI Generates Content', desc: 'Each of 105+ sections is generated with unique content, charts, and expert analysis.' },
            { step: '03', title: 'Export & Download', desc: 'Download as professionally formatted PDF or DOCX with TOC, references, and page numbers.' },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="text-5xl font-black gradient-text mb-4">{item.step}</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="glass-card p-12 max-w-3xl mx-auto glow-primary">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Generate Your Document?
          </h2>
          <p className="text-muted-foreground mb-8">
            Enter any topic and receive a 100+ page, publication-ready professional document in minutes.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/generate')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
          >
            Start Now — It's Free <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} LongContext Pro. AI-Powered Document Generation.
        </div>
      </footer>
    </div>
  );
};

export default Index;
