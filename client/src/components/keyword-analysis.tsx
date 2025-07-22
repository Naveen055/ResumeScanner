import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Plus, PlusCircle } from 'lucide-react';
import { ResumeAnalysis } from '@/types/resume';

interface KeywordAnalysisProps {
  analysis: ResumeAnalysis;
}

export function KeywordAnalysis({ analysis }: KeywordAnalysisProps) {
  const { foundKeywords, missingKeywords } = analysis;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High Priority':
        return 'bg-warning-muted text-warning border-warning/20';
      case 'Medium Priority':
        return 'bg-muted text-muted-foreground border-border';
      case 'Low Priority':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityIcon = (priority: string) => {
    return <PlusCircle className={
      priority === 'High Priority' ? 'text-warning' : 'text-muted-foreground'
    } size={16} />;
  };

  return (
    <Card className="card-enhanced card-hover">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
            <Plus className="text-primary-foreground" size={14} />
          </div>
          Keyword Analysis
        </h3>

        {/* Found Keywords */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center">
            <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center mr-2">
              <Check className="text-success" size={12} />
            </div>
            Found Keywords ({foundKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {foundKeywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-gradient-to-br from-success/15 to-success/10 text-success hover:from-success/20 hover:to-success/15 border-success/30 transition-all duration-200 hover:scale-105 font-medium px-3 py-1.5"
              >
                <Check size={12} className="mr-1" />
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center">
            <div className="w-5 h-5 bg-warning/20 rounded-full flex items-center justify-center mr-2">
              <Plus className="text-warning" size={12} />
            </div>
            Suggested Keywords ({missingKeywords.length})
          </h4>
          <div className="space-y-3">
            {missingKeywords.map((item, index) => (
              <div
                key={index}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${getPriorityColor(item.priority)}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    item.priority === 'High Priority' ? 'bg-warning/20' : 'bg-muted/50'
                  }`}>
                    {getPriorityIcon(item.priority)}
                  </div>
                  <span className="font-semibold text-foreground">{item.keyword}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    item.priority === 'High Priority' 
                      ? 'bg-warning/20 text-warning' 
                      : 'bg-muted/50 text-muted-foreground'
                  }`}>
                    {item.priority.replace(' Priority', '')}
                  </span>
                  {item.priority === 'High Priority' && (
                    <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
