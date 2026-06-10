import { cn } from '../../../lib/utils';
import { Bot, User } from 'lucide-react';

export default function ChatBubble({ message }) {
  const isAi = message.role === 'ai';

  return (
    <div className={cn("flex w-full mt-4 space-x-3 max-w-3xl mx-auto", isAi ? "justify-start" : "justify-end")}>
      {isAi && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/30">
            <Bot size={18} className="text-primary-400" />
          </div>
        </div>
      )}
      
      <div className={cn(
        "relative px-5 py-3.5 text-sm md:text-base leading-relaxed rounded-2xl",
        isAi 
          ? "bg-surface-800 text-surface-200 rounded-tl-sm border border-surface-700/50" 
          : "bg-primary-600 text-white rounded-tr-sm shadow-md"
      )}>
        {message.text}
        
        {/* Timestamp or status indicator could go here */}
        <div className={cn(
          "text-[10px] mt-1.5 opacity-60 font-medium",
          isAi ? "text-left" : "text-right text-primary-200"
        )}>
          {isAi ? 'AMIE Coach' : 'You'}
        </div>
      </div>

      {!isAi && (
        <div className="flex-shrink-0 mt-1">
          <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center border border-surface-600">
            <User size={18} className="text-surface-300" />
          </div>
        </div>
      )}
    </div>
  );
}
