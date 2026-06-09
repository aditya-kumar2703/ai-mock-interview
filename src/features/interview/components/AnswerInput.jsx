import { Textarea, Button } from '../../../components/ui';
import { Send, Mic } from 'lucide-react';

/**
 * Answer input area with submit and voice buttons.
 */
export default function AnswerInput({ 
  value, 
  onChange, 
  onSubmit, 
  isLastQuestion,
  disabled,
  isSubmitting,
  className 
}) {
  return (
    <div className={className}>
      <Textarea
        label="Your Answer"
        placeholder="Type your answer here, or use the microphone..."
        rows={6}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isSubmitting}
      />
      <div className="flex items-center justify-between mt-3">
        <Button variant="ghost" size="sm" icon={<Mic size={16} />} disabled={disabled || isSubmitting}>
          Voice Input
        </Button>
        <Button 
          variant={isLastQuestion ? "success" : "primary"} 
          size="md" 
          icon={<Send size={16} />}
          onClick={onSubmit}
          disabled={disabled || !value.trim() || isSubmitting}
          isLoading={isSubmitting}
        >
          {isLastQuestion ? 'Submit & Finish' : 'Submit Answer'}
        </Button>
      </div>
    </div>
  );
}
