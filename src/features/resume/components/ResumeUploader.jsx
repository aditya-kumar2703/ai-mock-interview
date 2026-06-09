import { useState, useRef } from 'react';
import { Card, ProgressBar } from '../../../components/ui';
import { cn } from '../../../lib/utils';
import { Upload, FileText, CheckCircle } from 'lucide-react';

/**
 * Resume file uploader with drag & drop zone.
 */
export default function ResumeUploader({ 
  className, 
  isUploading = false, 
  isAnalyzed = false,
  onUpload 
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload?.(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload?.(e.target.files[0]);
    }
  };

  if (isAnalyzed) {
    return (
      <Card className={cn('bg-success-500/5 border-success-500/20', className)}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full bg-success-500/10">
            <CheckCircle size={24} className="text-success-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-surface-100">Analysis Complete</h3>
            <p className="text-sm text-surface-400">Your resume has been successfully processed.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn('', className)}>
      <input 
        type="file" 
        className="hidden" 
        ref={inputRef}
        onChange={handleChange}
        accept=".pdf"
      />
      
      <div 
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-default",
          isDragging ? "border-primary-500 bg-primary-500/5" : "border-surface-700 hover:border-primary-500/50",
          isUploading ? "pointer-events-none opacity-80" : "cursor-pointer group"
        )}
        onClick={() => !isUploading && inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isUploading ? (
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-surface-300">Uploading and Analyzing...</span>
              <span className="text-sm text-primary-400 font-medium animate-pulse">Processing</span>
            </div>
            <ProgressBar value={100} max={100} color="primary" className="h-1.5 [&>div]:animate-pulse" showLabel={false} />
          </div>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-primary-500/10 w-fit mx-auto mb-4 group-hover:bg-primary-500/15 transition-default group-hover:-translate-y-1">
              <Upload size={28} className="text-primary-400" />
            </div>
            <h3 className="text-base font-semibold text-surface-200 mb-1">
              Upload Your Resume
            </h3>
            <p className="text-sm text-surface-400 mb-4">
              Drag & drop your file here, or click to browse
            </p>
            <p className="text-xs text-surface-500">
              Supported format: PDF only (Max 5MB)
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
