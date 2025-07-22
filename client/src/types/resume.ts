export interface ResumeAnalysis {
  score: number;
  foundKeywords: string[];
  missingKeywords: MissingKeyword[];
  totalKeywords: number;
  formatScore: 'Excellent' | 'Good' | 'Needs Improvement';
  suggestions: string[];
}

export interface MissingKeyword {
  keyword: string;
  priority: 'High Priority' | 'Medium Priority' | 'Low Priority';
}

export interface JobRole {
  id: string;
  name: string;
  keywords: string[];
  priorityKeywords: string[];
}

export interface FileInfo {
  name: string;
  size: number;
  type: string;
  content: string;
}

export interface AnalysisState {
  isAnalyzing: boolean;
  error: string | null;
  results: ResumeAnalysis | null;
  uploadedFile: FileInfo | null;
  selectedRole: string;
}
