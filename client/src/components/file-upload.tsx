import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, X, CheckCircle } from 'lucide-react';
import { ResumeParser } from '@/lib/resume-parser';
import { FileInfo } from '@/types/resume';

interface FileUploadProps {
  onFileUploaded: (fileInfo: FileInfo) => void;
  uploadedFile: FileInfo | null;
  onFileRemoved: () => void;
  disabled?: boolean;
}

export function FileUpload({ onFileUploaded, uploadedFile, onFileRemoved, disabled }: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const parser = new ResumeParser();

  const handleFile = useCallback(async (file: File) => {
    const validation = parser.validateFile(file);
    
    if (!validation.isValid) {
      toast({
        title: 'Invalid File',
        description: validation.error,
        variant: 'destructive'
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const fileInfo = await parser.parseFile(file);
      onFileUploaded(fileInfo);
      toast({
        title: 'File Uploaded Successfully',
        description: `${file.name} has been processed and is ready for analysis.`,
      });
    } catch (error) {
      toast({
        title: 'File Processing Error',
        description: error instanceof Error ? error.message : 'Failed to process file',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [parser, onFileUploaded, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled || isProcessing) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile, disabled, isProcessing]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
    // Reset input value to allow re-uploading the same file
    e.target.value = '';
  }, [handleFile]);

  const handleClick = useCallback(() => {
    if (disabled || isProcessing) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files.length > 0) {
        handleFile(target.files[0]);
      }
    };
    input.click();
  }, [handleFile, disabled, isProcessing]);

  if (uploadedFile) {
    return (
      <Card className="card-enhanced">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
              <Upload className="text-primary-foreground" size={14} />
            </div>
            Upload Your Resume
          </h3>
          
          <div className="p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-xl border border-success/20 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-success/20 to-success/10 rounded-xl flex items-center justify-center">
                  <File className="text-success" size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center space-x-1">
                    <span>{parser.formatFileSize(uploadedFile.size)}</span>
                    <span>•</span>
                    <span className="text-success">Ready for analysis</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-success" size={16} />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFileRemoved}
                  className="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                  disabled={disabled}
                >
                  <X size={16} />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-enhanced card-hover">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center mr-3">
            <Upload className="text-primary-foreground" size={14} />
          </div>
          Upload Your Resume
        </h3>
        
        <div
          className={`group border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer relative overflow-hidden ${
            isDragOver 
              ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 scale-[1.02] shadow-lg shadow-primary/25' 
              : 'border-border hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-primary/10 hover:scale-[1.01] hover:shadow-md'
          } ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isProcessing) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={handleClick}
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div className="relative space-y-4">
            <div className={`w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 ${
              isDragOver ? 'scale-110 bg-gradient-to-br from-primary/30 to-primary/15' : 'group-hover:scale-105'
            }`}>
              <Upload className={`text-primary transition-all duration-300 ${
                isProcessing ? 'animate-pulse' : isDragOver ? 'scale-110' : ''
              }`} size={28} />
            </div>
            <div>
              <p className="text-base font-semibold text-foreground mb-2">
                {isProcessing ? (
                  <span className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing file...</span>
                  </span>
                ) : isDragOver ? (
                  'Drop your file here'
                ) : (
                  'Drop your resume here, or click to browse'
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                Supports PDF and DOCX files up to 10MB
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 bg-muted/50 text-xs font-medium text-muted-foreground rounded-full">
                  .PDF
                </span>
                <span className="px-3 py-1 bg-muted/50 text-xs font-medium text-muted-foreground rounded-full">
                  .DOCX
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
