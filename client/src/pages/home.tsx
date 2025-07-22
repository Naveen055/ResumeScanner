import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileText, Search, Shield, Laptop, Lock, Sparkles, Zap, Target } from 'lucide-react';
import { FileUpload } from '@/components/file-upload';
import { JobRoleInput } from '@/components/job-role-input';
import { AnalysisResults } from '@/components/analysis-results';
import { KeywordAnalysis } from '@/components/keyword-analysis';
import { ImprovementTips } from '@/components/improvement-tips';
import { ThemeToggle } from '@/components/theme-toggle';
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
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg shadow-primary/25">
                <FileText className="text-primary-foreground" size={20} />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                ATS Resume Checker
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">AI-Powered Analysis</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
              <span>•</span>
              <span>100% Private</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
        <div className="container relative max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} />
              <span>AI-Powered Resume Analysis</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Beat ATS Systems with
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Smart Resume Optimization
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              Upload your resume and get instant, detailed feedback on keyword optimization, 
              ATS compatibility, and actionable improvement suggestions tailored to your target role.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Zap, text: "Instant Analysis" },
                { icon: Shield, text: "100% Private" },
                { icon: Target, text: "Role-Specific" }
              ].map(({ icon: Icon, text }, index) => (
                <div key={index} className="flex items-center space-x-2 bg-card border border-border rounded-full px-4 py-2 shadow-sm">
                  <Icon size={16} className="text-primary" />
                  <span className="text-sm font-medium text-card-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Application Interface */}
      <main className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 xl:gap-12">
          {/* Left Column: Upload and Input */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <FileUpload
                onFileUploaded={handleFileUploaded}
                uploadedFile={state.uploadedFile}
                onFileRemoved={handleFileRemoved}
                disabled={state.isAnalyzing}
              />

              <div className="mt-6">
                <JobRoleInput
                  selectedRole={state.selectedRole}
                  onRoleChange={handleRoleChange}
                  disabled={state.isAnalyzing}
                />
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={!canAnalyze}
                className="w-full mt-6 h-14 text-lg font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
                size="lg"
              >
                {state.isAnalyzing ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-3"></div>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <Search className="mr-3" size={20} />
                    Analyze My Resume
                  </>
                )}
              </Button>
            </div>
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
              <div className="relative">
                <div className="bg-card border border-border rounded-2xl p-8 sm:p-12 text-center card-enhanced">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Search className="text-primary" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    Ready for Analysis
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed max-w-md mx-auto">
                    Upload your resume and select your target job role to get started with our comprehensive ATS analysis.
                  </p>
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <FileText size={16} className="text-success" />
                      </div>
                      <div className="font-medium text-card-foreground">Upload</div>
                      <div className="text-muted-foreground">PDF or DOCX</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Target size={16} className="text-warning" />
                      </div>
                      <div className="font-medium text-card-foreground">Select Role</div>
                      <div className="text-muted-foreground">8+ Options</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap size={16} className="text-primary" />
                      </div>
                      <div className="font-medium text-card-foreground">Analyze</div>
                      <div className="text-muted-foreground">Get Results</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Loading Overlay */}
        {state.isAnalyzing && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full animate-spin border-4 border-transparent border-t-primary"></div>
                <div className="absolute inset-2 bg-card rounded-full flex items-center justify-center">
                  <FileText className="text-primary" size={20} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-2">Analyzing Resume</h3>
              <p className="text-muted-foreground leading-relaxed">
                Processing your document, extracting keywords, and calculating your ATS compatibility score...
              </p>
              <div className="mt-6 bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/80 animate-pulse"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-muted/30">
        <div className="container max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="flex justify-center items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Shield size={16} className="text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Privacy-First Design</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your resume data never leaves your device. All processing happens locally in your browser 
              using advanced client-side algorithms, ensuring complete privacy and security.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
              {[
                { icon: Shield, text: "100% Private Processing" },
                { icon: Laptop, text: "Client-Side Analysis" },
                { icon: Lock, text: "Zero Data Collection" },
                { icon: Zap, text: "Instant Results" }
              ].map(({ icon: Icon, text }, index) => (
                <div key={index} className="flex items-center space-x-2 text-muted-foreground">
                  <Icon size={14} className="text-primary" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
