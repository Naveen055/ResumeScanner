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
      'bg-blue-50 border-blue-200 text-blue-900',
      'bg-green-50 border-green-200 text-green-900',
      'bg-purple-50 border-purple-200 text-purple-900',
      'bg-orange-50 border-orange-200 text-orange-900',
      'bg-pink-50 border-pink-200 text-pink-900'
    ];
    return colors[index % colors.length];
  };

  const getTipNumberColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600'
    ];
    return colors[index % colors.length];
  };

  if (!suggestions || suggestions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
            <Lightbulb className="text-primary mr-2" size={20} />
            Improvement Tips
          </h3>
          <div className="text-center py-8">
            <p className="text-muted-foreground">Great job! Your resume looks well-optimized.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center">
          <Lightbulb className="text-primary mr-2" size={20} />
          Improvement Tips
        </h3>

        <div className="space-y-4">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getTipColor(index)}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${getTipNumberColor(index)}`}>
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <div>
                  <p className="text-sm leading-relaxed">{suggestion}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
