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
    input.onchange = handleFileSelect;
    input.click();
  }, [handleFileSelect, disabled, isProcessing]);

  if (uploadedFile) {
    return (
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
            <Upload className="text-primary mr-2" size={20} />
            Upload Your Resume
          </h3>
          
          <div className="p-4 bg-success-muted rounded-lg border border-success">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-success/20 rounded flex items-center justify-center">
                  <File className="text-success" size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{parser.formatFileSize(uploadedFile.size)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="text-success" size={16} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onFileRemoved}
                  className="text-muted-foreground hover:text-foreground"
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
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
          <Upload className="text-primary mr-2" size={20} />
          Upload Your Resume
        </h3>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            isDragOver 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50 hover:bg-primary/5'
          } ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isProcessing) setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onClick={handleClick}
        >
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Upload className="text-primary" size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isProcessing ? 'Processing file...' : 'Drop your resume here, or click to browse'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports PDF and DOCX files up to 10MB
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
