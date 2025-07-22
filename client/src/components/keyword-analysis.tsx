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
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Plus className="text-primary mr-2" size={20} />
          Keyword Analysis
        </h3>

        {/* Found Keywords */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Check className="text-success mr-2" size={14} />
            Found Keywords ({foundKeywords.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {foundKeywords.map((keyword, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-success-muted text-success hover:bg-success-muted border-success/20"
              >
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Plus className="text-warning mr-2" size={14} />
            Suggested Keywords ({missingKeywords.length})
          </h4>
          <div className="space-y-2">
            {missingKeywords.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${getPriorityColor(item.priority)}`}
              >
                <div className="flex items-center space-x-3">
                  {getPriorityIcon(item.priority)}
                  <span className="text-sm font-medium text-foreground">{item.keyword}</span>
                </div>
                <span className={`text-xs font-medium ${
                  item.priority === 'High Priority' ? 'text-warning' : 'text-muted-foreground'
                }`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
