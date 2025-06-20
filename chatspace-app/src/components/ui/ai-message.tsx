import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Copy, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AIModel = 'gpt4' | 'claude' | 'gemini' | 'deepseek';

interface AIMessageProps {
  content: string;
  model: AIModel;
  timestamp: Date;
  tokens?: number;
  cost?: number;
  isLoading?: boolean;
  onRegenerate?: () => void;
  onCopy?: () => void;
  onFeedback?: (type: 'positive' | 'negative') => void;
  className?: string;
}

const modelConfig = {
  gpt4: {
    name: 'GPT-4',
    color: 'var(--ai-gpt4)',
    avatar: 'G4',
    bgClass: 'bg-[var(--ai-gpt4)]',
  },
  claude: {
    name: 'Claude',
    color: 'var(--ai-claude)',
    avatar: 'CL',
    bgClass: 'bg-[var(--ai-claude)]',
  },
  gemini: {
    name: 'Gemini',
    color: 'var(--ai-gemini)',
    avatar: 'GM',
    bgClass: 'bg-[var(--ai-gemini)]',
  },
  deepseek: {
    name: 'DeepSeek',
    color: 'var(--ai-deepseek)',
    avatar: 'DS',
    bgClass: 'bg-[var(--ai-deepseek)]',
  },
} as const;

export function AIMessage({
  content,
  model,
  timestamp,
  tokens,
  cost,
  isLoading,
  onRegenerate,
  onCopy,
  onFeedback,
  className,
}: AIMessageProps) {
  const config = modelConfig[model];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatCost = (cost: number) => {
    return cost < 0.01 ? '<$0.01' : `$${cost.toFixed(3)}`;
  };

  return (
    <Card
      className={cn(
        'ai-message border-l-4 transition-all duration-200 hover:shadow-md',
        className
      )}
      style={{ borderLeftColor: config.color }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className={cn(config.bgClass, 'text-white text-xs font-medium')}
              >
                {config.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                {config.name}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {formatTime(timestamp)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {tokens && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs">
                      {tokens.toLocaleString()} tokens
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Token usage for this response</p>
                    {cost && <p>Cost: {formatCost(cost)}</p>}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center space-x-2 text-muted-foreground">
              <div className="loading-dots flex space-x-1">
                <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                <span
                  className="w-2 h-2 bg-current rounded-full animate-pulse"
                  style={{ animationDelay: '0.2s' }}
                ></span>
                <span
                  className="w-2 h-2 bg-current rounded-full animate-pulse"
                  style={{ animationDelay: '0.4s' }}
                ></span>
              </div>
              <span className="text-sm">Thinking...</span>
            </div>
          ) : (
            <div className="ai-response prose prose-sm max-w-none dark:prose-invert">
              {content.split('\n').map((line, index) => (
                <p key={index} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
          )}

          {!isLoading && (
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeedback?.('positive')}
                        className="h-8 w-8 p-0 hover:bg-success/10 hover:text-success"
                      >
                        <ThumbsUp className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Good response</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onFeedback?.('negative')}
                        className="h-8 w-8 p-0 hover:bg-error/10 hover:text-error"
                      >
                        <ThumbsDown className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Poor response</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCopy}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy response</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onRegenerate}
                        className="h-8 w-8 p-0"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Regenerate response</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
