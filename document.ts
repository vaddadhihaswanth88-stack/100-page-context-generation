export interface DocumentOutline {
  title: string;
  topic: string;
  chapters: ChapterOutline[];
  generatedAt: string;
}

export interface ChapterOutline {
  number: number;
  title: string;
  description: string;
  sections: SectionOutline[];
}

export interface SectionOutline {
  number: string; // e.g., "1.1"
  title: string;
  contentType: ContentType;
  hasChart: boolean;
  chartType?: ChartType;
  keywords: string[];
}

export type ContentType = 
  | 'analysis'
  | 'case-study'
  | 'comparison'
  | 'data-driven'
  | 'recommendation'
  | 'historical'
  | 'methodology'
  | 'implementation'
  | 'evaluation'
  | 'theoretical'
  | 'practical-guide'
  | 'risk-assessment'
  | 'future-outlook'
  | 'executive-summary';

export type ChartType = 'pie' | 'bar' | 'line' | 'area' | 'radar';

export interface DocumentPage {
  pageNumber: number;
  sectionNumber: string;
  chapterNumber: number;
  chapterTitle: string;
  sectionTitle: string;
  content: string;
  contentType: ContentType;
  chart?: ChartData;
  isTitle?: boolean;
  isToc?: boolean;
}

export interface ChartData {
  type: ChartType;
  title: string;
  data: { name: string; value: number; fill?: string }[];
  description: string;
}

export interface GenerationProgress {
  totalChapters: number;
  completedChapters: number;
  currentChapter: string;
  totalPages: number;
  status: 'idle' | 'outline' | 'generating' | 'validating' | 'complete' | 'error';
  error?: string;
}

export interface GeneratedDocument {
  outline: DocumentOutline;
  pages: DocumentPage[];
  metadata: {
    totalPages: number;
    totalWords: number;
    generatedAt: string;
    topic: string;
  };
}
