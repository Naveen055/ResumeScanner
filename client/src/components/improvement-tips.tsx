import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { ResumeAnalysis } from '@/types/resume';

interface ImprovementTipsProps {
  analysis: ResumeAnalysis;
}

export function ImprovementTips({ analysis }: ImprovementTipsProps) {
  const { suggestions } = analysis;

  const getTipColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800',
      'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800',
      'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20 border-purple-200 dark:border-purple-800',
      'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20 border-orange-200 dark:border-orange-800',
      'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/20 border-pink-200 dark:border-pink-800'
    ];
    return colors[index % colors.length];
  };

  const getTipNumberColor = (index: number) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
      'bg-gradient-to-br from-green-500 to-green-600 text-white',
      'bg-gradient-to-br from-purple-500 to-purple-600 text-white',
      'bg-gradient-to-br from-orange-500 to-orange-600 text-white',
      'bg-gradient-to-br from-pink-500 to-pink-600 text-white'
    ];
    return colors[index % colors.length];
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card className="card-enhanced">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
              <Lightbulb className="text-primary-foreground" size={14} />
            </div>
            Improvement Tips
          </h3>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="text-success" size={24} />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Excellent Work!</h4>
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your resume appears to be well-optimized for ATS systems. Keep up the great work!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-enhanced card-hover">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
            <Lightbulb className="text-primary-foreground" size={14} />
          </div>
          Improvement Tips
        </h3>

        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`group p-5 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${getTipColor(index)}`}
            >
              <div className="flex items-start space-x-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${getTipNumberColor(index)}`}>
                  <span className="text-sm font-bold">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed text-card-foreground font-medium">{suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
