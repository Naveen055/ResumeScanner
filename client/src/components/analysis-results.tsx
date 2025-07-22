import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, CheckCircle, FileText, AlertTriangle } from 'lucide-react';
import { ResumeAnalysis } from '@/types/resume';
import { ATSScorer } from '@/lib/ats-scorer';

interface AnalysisResultsProps {
  analysis: ResumeAnalysis;
}

const scorer = new ATSScorer();

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const { score, foundKeywords, missingKeywords, totalKeywords, formatScore } = analysis;
  const scoreDescription = scorer.getScoreDescription(score);
  const circumference = 2 * Math.PI * 50; // radius = 50
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <TrendingUp className="text-primary mr-2" size={20} />
          ATS Score Analysis
        </h3>

        {/* ATS Score Display */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
            {/* Circular Progress Ring */}
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none"
                className="text-border"
              />
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${
                  score >= 80 ? 'text-success' : 
                  score >= 60 ? 'text-warning' : 'text-error'
                }`}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{score}</div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <h4 className="text-xl font-semibold text-foreground">{scoreDescription}</h4>
            <p className="text-sm text-muted-foreground">
              Your resume matches {score}% of key requirements
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-success-muted rounded-lg border border-success/20">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-success" size={16} />
              <span className="text-sm font-medium text-foreground">Keywords Found</span>
            </div>
            <span className="text-sm font-semibold text-success">
              {foundKeywords.length}/{totalKeywords}
            </span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center space-x-2">
              <FileText className="text-primary" size={16} />
              <span className="text-sm font-medium text-foreground">Resume Format</span>
            </div>
            <span className="text-sm font-semibold text-primary">{formatScore}</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-warning-muted rounded-lg border border-warning/20">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="text-warning" size={16} />
              <span className="text-sm font-medium text-foreground">Missing Keywords</span>
            </div>
            <span className="text-sm font-semibold text-warning">{missingKeywords.length}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
