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
    <Card className="card-enhanced card-hover">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
            <TrendingUp className="text-primary-foreground" size={14} />
          </div>
          ATS Score Analysis
        </h3>

        {/* ATS Score Display */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center w-40 h-40 mb-6">
            {/* Background glow */}
            <div className={`absolute inset-0 rounded-full blur-xl opacity-20 ${
              score >= 80 ? 'bg-success' : 
              score >= 60 ? 'bg-warning' : 'bg-error'
            }`}></div>
            
            {/* Circular Progress Ring */}
            <svg className="w-40 h-40 transform -rotate-90 relative z-10" viewBox="0 0 120 120">
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                stroke="currentColor" 
                strokeWidth="6" 
                fill="none"
                className="text-muted/30"
              />
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                stroke="currentColor" 
                strokeWidth="6" 
                fill="none" 
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`transition-all duration-2000 ease-out drop-shadow-sm ${
                  score >= 80 ? 'text-success' : 
                  score >= 60 ? 'text-warning' : 'text-error'
                }`}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: strokeDashoffset
                }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-1 ${
                  score >= 80 ? 'text-success' : 
                  score >= 60 ? 'text-warning' : 'text-error'
                }`}>{score}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ATS Score</div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className={`text-2xl font-bold ${
              score >= 80 ? 'text-success' : 
              score >= 60 ? 'text-warning' : 'text-error'
            }`}>{scoreDescription}</h4>
            <p className="text-muted-foreground leading-relaxed">
              Your resume matches <span className="font-semibold text-foreground">{score}%</span> of key requirements for this role
            </p>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-success" size={16} />
              </div>
              <span className="font-semibold text-foreground">Keywords Found</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-success">
                {foundKeywords.length}/{totalKeywords}
              </div>
              <div className="text-xs text-muted-foreground">
                {Math.round((foundKeywords.length / totalKeywords) * 100)}% match
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <FileText className="text-primary" size={16} />
              </div>
              <span className="font-semibold text-foreground">Resume Format</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">{formatScore}</div>
              <div className="text-xs text-muted-foreground">ATS Compatible</div>
            </div>
          </div>

          <div className="flex justify-between items-center p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-xl border border-warning/20 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-warning" size={16} />
              </div>
              <span className="font-semibold text-foreground">Missing Keywords</span>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-warning">{missingKeywords.length}</div>
              <div className="text-xs text-muted-foreground">To Improve</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
