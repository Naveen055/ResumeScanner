import { ResumeAnalysis, MissingKeyword } from '../types/resume';

export class ATSScorer {
  calculateScore(
    foundKeywords: string[],
    missingKeywords: MissingKeyword[],
    totalKeywords: number,
    resumeText: string
  ): ResumeAnalysis {
    const keywordScore = this.calculateKeywordScore(foundKeywords, totalKeywords);
    const formatScore = this.calculateFormatScore(resumeText);
    const priorityBonus = this.calculatePriorityBonus(foundKeywords, missingKeywords);
    
    // Overall score calculation
    const score = Math.min(100, Math.round(keywordScore + priorityBonus));
    
    const suggestions = this.generateSuggestions(score, missingKeywords, resumeText);

    return {
      score,
      foundKeywords,
      missingKeywords,
      totalKeywords,
      formatScore,
      suggestions
    };
  }

  private calculateKeywordScore(foundKeywords: string[], totalKeywords: number): number {
    if (totalKeywords === 0) return 0;
    return (foundKeywords.length / totalKeywords) * 70; // 70% weight for keywords
  }

  private calculateFormatScore(resumeText: string): 'Excellent' | 'Good' | 'Needs Improvement' {
    const text = resumeText.toLowerCase();
    let score = 0;

    // Check for common resume sections
    const sections = ['experience', 'education', 'skills', 'projects'];
    sections.forEach(section => {
      if (text.includes(section)) score += 1;
    });

    // Check for formatting indicators
    if (text.includes('•') || text.includes('-') || text.includes('*')) score += 1;
    
    // Check for dates (years)
    if (/\b(19|20)\d{2}\b/.test(text)) score += 1;

    // Check for contact information
    if (/@/.test(text)) score += 1; // Email
    if (/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text)) score += 1; // Phone

    if (score >= 6) return 'Excellent';
    if (score >= 4) return 'Good';
    return 'Needs Improvement';
  }

  private calculatePriorityBonus(foundKeywords: string[], missingKeywords: MissingKeyword[]): number {
    const highPriorityMissing = missingKeywords.filter(k => k.priority === 'High Priority').length;
    const highPriorityTotal = missingKeywords.filter(k => k.priority === 'High Priority').length + 
                             foundKeywords.length; // Approximate high priority found
    
    // Bonus for having high priority keywords
    if (highPriorityTotal > 0) {
      const highPriorityScore = ((highPriorityTotal - highPriorityMissing) / highPriorityTotal) * 20;
      return Math.round(highPriorityScore);
    }
    
    return 0;
  }

  private generateSuggestions(
    score: number, 
    missingKeywords: MissingKeyword[], 
    resumeText: string
  ): string[] {
    const suggestions: string[] = [];

    // High priority keywords suggestion
    const highPriorityMissing = missingKeywords
      .filter(k => k.priority === 'High Priority')
      .slice(0, 3);
    
    if (highPriorityMissing.length > 0) {
      const keywords = highPriorityMissing.map(k => `"${k.keyword}"`).join(' and ');
      suggestions.push(`Add missing high priority keywords: ${keywords} to improve your ATS score by ~${highPriorityMissing.length * 5}%.`);
    }

    // Quantification suggestion
    if (!/\d+%|\d+x|\$\d+/.test(resumeText)) {
      suggestions.push('Quantify your achievements with specific metrics (e.g., "Improved page load time by 40%" instead of "Improved performance").');
    }

    // Industry terms suggestion
    if (score < 70) {
      suggestions.push('Use industry-standard terms and replace generic phrases with specific technologies mentioned in job descriptions.');
    }

    // Experience section suggestion
    if (!resumeText.toLowerCase().includes('experience') && !resumeText.toLowerCase().includes('work history')) {
      suggestions.push('Ensure your resume has a clear "Experience" or "Work History" section with relevant job titles.');
    }

    // Skills section suggestion
    if (!resumeText.toLowerCase().includes('skill')) {
      suggestions.push('Add a dedicated "Skills" or "Technical Skills" section to highlight your expertise.');
    }

    return suggestions;
  }

  getScoreDescription(score: number): string {
    if (score >= 80) return 'Excellent Match';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Fair Match';
    return 'Needs Improvement';
  }

  getScoreColor(score: number): string {
    if (score >= 80) return 'text-success';
    if (score >= 70) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-error';
  }
}
