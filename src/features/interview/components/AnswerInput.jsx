import { useState } from 'react';
import { Textarea, Button } from '../../../components/ui';
import { Send, Mic, Type } from 'lucide-react';
import VoiceRecorder from './VoiceRecorder';

/**
 * Answer input area with submit and voice buttons.
 */
export default function AnswerInput({ 
  value, 
  onChange, 
  onSubmit, 
  onVoiceSubmit,
  isLastQuestion,
  disabled,
  isSubmitting,
  shouldAutoRecord,
  onLiveTranscriptChange,
  className 
}) {
  const [inputMode, setInputMode] = useState('voice'); // 'text' | 'voice'

  return (
    <div className={`bg-surface-900 border-t border-surface-800 p-4 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {inputMode === 'text' ? (
          <div className="flex flex-col sm:flex-row items-end gap-3">
            <div className="flex-1 w-full">
              <Textarea
                placeholder="Type your answer here..."
                rows={3}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled || isSubmitting}
                className="resize-none"
              />
            </div>
            <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
              <Button 
                variant="ghost" 
                size="md" 
                icon={<Mic size={18} />} 
                disabled={disabled || isSubmitting}
                onClick={() => setInputMode('voice')}
                className="flex-1 sm:flex-none justify-center"
              >
                Voice
              </Button>
              <Button 
                variant={isLastQuestion ? "success" : "primary"} 
                size="md" 
                icon={<Send size={18} />}
                onClick={onSubmit}
                disabled={disabled || !value.trim() || isSubmitting}
                isLoading={isSubmitting}
                className="flex-1 sm:flex-none justify-center"
              >
                {isLastQuestion ? 'Finish' : 'Send'}
              </Button>
            </div>
          </div>
        ) : (
          <VoiceRecorder 
            onRecordingComplete={onVoiceSubmit}
            onCancel={() => setInputMode('text')}
            disabled={disabled || isSubmitting}
            autoStart={shouldAutoRecord}
            onLiveTranscriptChange={onLiveTranscriptChange}
          />
        )}
      </div>
    </div>
  );
}
