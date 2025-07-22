import { FileInfo } from '../types/resume';

export class ResumeParser {
  async parseFile(file: File): Promise<FileInfo> {
    const fileInfo: FileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      content: ''
    };

    try {
      if (file.type === 'application/pdf') {
        fileInfo.content = await this.parsePDF(file);
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        fileInfo.content = await this.parseDOCX(file);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
      }
    } catch (error) {
      throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return fileInfo;
  }

  private async parsePDF(file: File): Promise<string> {
    try {
      // Dynamic import to avoid bundling issues
      const pdfjsLib = await import('pdfjs-dist');
      
      // Set worker source - use jsdelivr CDN for better compatibility
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@5.3.93/build/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document with proper configuration
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        verbosity: 0,
        disableAutoFetch: true,
        disableStream: true,
      });
      
      const pdf = await loadingTask.promise;
      let fullText = '';
      
      // Extract text from all pages
      for (let i = 1; i <= pdf.numPages; i++) {
        try {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          
          // Extract text items and join them properly
          const pageText = textContent.items
            .filter((item: any) => item.str && item.str.trim())
            .map((item: any) => {
              // Handle text positioning for better formatting
              let text = item.str.trim();
              if (item.hasEOL) {
                text += '\n';
              }
              return text;
            })
            .join(' ');
          
          if (pageText.trim()) {
            fullText += pageText + '\n';
          }
        } catch (pageError) {
          console.warn(`Error processing page ${i}:`, pageError);
          // Continue with other pages even if one fails
        }
      }
      
      // Clean up the extracted text
      return fullText
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s+/g, '\n') // Clean up line breaks
        .trim();
        
    } catch (error) {
      console.error('PDF parsing error:', error);
      throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async parseDOCX(file: File): Promise<string> {
    // Dynamic import to avoid bundling issues
    const mammoth = await import('mammoth');
    
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    if (result.messages.length > 0) {
      console.warn('DOCX parsing warnings:', result.messages);
    }
    
    return result.value.trim();
  }

  validateFile(file: File): { isValid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size exceeds 10MB limit. Please choose a smaller file.'
      };
    }

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a PDF or DOCX file.'
      };
    }

    return { isValid: true };
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
