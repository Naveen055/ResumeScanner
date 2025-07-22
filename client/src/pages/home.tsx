import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, Shield, Laptop, Lock } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { JobRoleInput } from '@/components/job-role-input';
import { AnalysisResults } from '@/components/analysis-results';
import { KeywordAnalysis } from '@/components/keyword-analysis';
import { ImprovementTips } from '@/components/improvement-tips';
import { AnalysisState, FileInfo } from '@/types/resume';
import { KeywordMatcher } from '@/lib/keyword-matcher';
import { ATSScorer } from '@/lib/ats-scorer';

export default function Home() {
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    error: null,
    results: null,
    uploadedFile: null,
    selectedRole: ''
  });

  const { toast } = useToast();
  const keywordMatcher = new KeywordMatcher();
  const atsScorer = new ATSScorer();

  const handleFileUploaded = (fileInfo: FileInfo) => {
    setState(prev => ({
      ...prev,
      uploadedFile: fileInfo,
      results: null,
      error: null
    }));
  };

  const handleFileRemoved = () => {
    setState(prev => ({
      ...prev,
      uploadedFile: null,
      results: null,
      error: null
    }));
  };

  const handleRoleChange = (role: string) => {
    setState(prev => ({
      ...prev,
      selectedRole: role,
      results: null,
      error: null
    }));
  };

  const handleAnalyze = async () => {
    if (!state.uploadedFile) {
      toast({
        title: 'No File Uploaded',
        description: 'Please upload a resume file before analyzing.',
        variant: 'destructive'
      });
      return;
    }

    if (!state.selectedRole) {
      toast({
        title: 'No Job Role Selected',
        description: 'Please select a target job role for analysis.',
        variant: 'destructive'
      });
      return;
    }

    setState(prev => ({ ...prev, isAnalyzing: true, error: null }));

    try {
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));

      const { found, missing } = keywordMatcher.matchKeywords(
        state.uploadedFile.content,
        state.selectedRole
      );

      const role = keywordMatcher.getJobRole(state.selectedRole);
      const totalKeywords = role?.keywords.length || 0;

      const analysis = atsScorer.calculateScore(
        found,
        missing,
        totalKeywords,
        state.uploadedFile.content
      );

      setState(prev => ({
        ...prev,
        results: analysis,
        isAnalyzing: false
      }));

      toast({
        title: 'Analysis Complete',
        description: `Your resume scored ${analysis.score}% for the ${role?.name} role.`,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Analysis failed';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isAnalyzing: false
      }));
      
      toast({
        title: 'Analysis Failed',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  };

  const canAnalyze = state.uploadedFile && state.selectedRole && !state.isAnalyzing;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="text-primary-foreground" size={16} />
              </div>
              <h1 className="text-xl font-semibold text-foreground">ATS Resume Checker</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Free • Secure • Private</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Optimize Your Resume for ATS Systems
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload your resume and get instant feedback on how well it matches job requirements. 
            Improve your chances of getting past Applicant Tracking Systems.
          </p>
        </div>

        {/* Main Application Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Upload and Input */}
          <div className="space-y-6">
            <FileUpload
              onFileUploaded={handleFileUploaded}
              uploadedFile={state.uploadedFile}
              onFileRemoved={handleFileRemoved}
              disabled={state.isAnalyzing}
            />

            <JobRoleInput
              selectedRole={state.selectedRole}
              onRoleChange={handleRoleChange}
              disabled={state.isAnalyzing}
            />

            <Button
              onClick={handleAnalyze}
              disabled={!canAnalyze}
              className="w-full py-4 h-auto"
              size="lg"
            >
              <Search className="mr-2" size={20} />
              {state.isAnalyzing ? 'Analyzing Resume...' : 'Analyze Resume'}
            </Button>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6">
            {state.results ? (
              <>
                <AnalysisResults analysis={state.results} />
                <KeywordAnalysis analysis={state.results} />
                <ImprovementTips analysis={state.results} />
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-border p-8 text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-muted-foreground" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-muted-foreground">
                  Upload your resume and select a job role to get started with the ATS analysis.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {state.isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-sm mx-4 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Analyzing Resume</h3>
              <p className="text-sm text-muted-foreground">
                Processing your document and extracting keywords...
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Your resume is processed locally in your browser - no data is sent to our servers.
            </p>
            <div className="flex justify-center items-center space-x-6 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1">
                <Shield size={14} />
                <span>100% Private</span>
              </span>
              <span className="flex items-center space-x-1">
                <Laptop size={14} />
                <span>Client-Side Processing</span>
              </span>
              <span className="flex items-center space-x-1">
                <Lock size={14} />
                <span>Secure</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
