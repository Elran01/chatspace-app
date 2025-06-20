import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUp, AlertTriangle, DollarSign, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AIModel = 'gpt4' | 'claude' | 'gemini' | 'deepseek';

interface ModelUsage {
  model: AIModel;
  tokens: number;
  cost: number;
  requests: number;
}

interface UsageData {
  daily: ModelUsage[];
  monthly: ModelUsage[];
  limits: {
    dailyTokens: number;
    dailyCost: number;
    monthlyTokens: number;
    monthlyCost: number;
  };
  period: 'today' | 'this-month';
}

const modelConfig = {
  gpt4: {
    name: 'GPT-4',
    color: 'var(--ai-gpt4)',
    avatar: 'G4',
    bgClass: 'bg-[var(--ai-gpt4)]',
    pricing: 0.03,
  },
  claude: {
    name: 'Claude',
    color: 'var(--ai-claude)',
    avatar: 'CL',
    bgClass: 'bg-[var(--ai-claude)]',
    pricing: 0.025,
  },
  gemini: {
    name: 'Gemini',
    color: 'var(--ai-gemini)',
    avatar: 'GM',
    bgClass: 'bg-[var(--ai-gemini)]',
    pricing: 0.02,
  },
  deepseek: {
    name: 'DeepSeek',
    color: 'var(--ai-deepseek)',
    avatar: 'DS',
    bgClass: 'bg-[var(--ai-deepseek)]',
    pricing: 0.01,
  },
} as const;

interface UsageTrackerProps {
  data: UsageData;
  compact?: boolean;
  className?: string;
}

export function UsageTracker({
  data,
  compact = false,
  className,
}: UsageTrackerProps) {
  const currentUsage = data.period === 'today' ? data.daily : data.monthly;
  const limits = data.limits;

  const totalTokens = currentUsage.reduce(
    (sum, usage) => sum + usage.tokens,
    0
  );
  const totalCost = currentUsage.reduce((sum, usage) => sum + usage.cost, 0);
  const totalRequests = currentUsage.reduce(
    (sum, usage) => sum + usage.requests,
    0
  );

  const tokenLimit =
    data.period === 'today' ? limits.dailyTokens : limits.monthlyTokens;
  const costLimit =
    data.period === 'today' ? limits.dailyCost : limits.monthlyCost;

  const tokenPercentage = (totalTokens / tokenLimit) * 100;
  const costPercentage = (totalCost / costLimit) * 100;

  const isNearTokenLimit = tokenPercentage > 80;
  const isNearCostLimit = costPercentage > 80;
  const isOverLimit = tokenPercentage > 100 || costPercentage > 100;

  const formatCost = (cost: number) => {
    return cost < 0.01 ? '<$0.01' : `$${cost.toFixed(3)}`;
  };

  const formatTokens = (tokens: number) => {
    if (tokens < 1000) return tokens.toString();
    if (tokens < 1000000) return `${(tokens / 1000).toFixed(1)}K`;
    return `${(tokens / 1000000).toFixed(1)}M`;
  };

  if (compact) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Zap
                  className={cn(
                    'h-4 w-4',
                    isNearTokenLimit ? 'text-warning' : 'text-muted-foreground'
                  )}
                />
                <span className="text-sm font-mono">
                  {formatTokens(totalTokens)} / {formatTokens(tokenLimit)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Token usage {data.period === 'today' ? 'today' : 'this month'}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <DollarSign
                  className={cn(
                    'h-4 w-4',
                    isNearCostLimit ? 'text-warning' : 'text-muted-foreground'
                  )}
                />
                <span className="text-sm font-mono">
                  {formatCost(totalCost)} / {formatCost(costLimit)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cost {data.period === 'today' ? 'today' : 'this month'}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {(isNearTokenLimit || isNearCostLimit || isOverLimit) && (
        <Alert variant={isOverLimit ? 'destructive' : 'default'}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {isOverLimit
              ? 'Usage limits exceeded. Consider upgrading your plan.'
              : 'Approaching usage limits. Monitor your consumption.'}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              Usage {data.period === 'today' ? 'Today' : 'This Month'}
            </CardTitle>
            <Badge variant="outline" className="font-mono">
              {totalRequests} requests
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Overall Usage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Tokens</span>
                <span className="font-mono">
                  {formatTokens(totalTokens)} / {formatTokens(tokenLimit)}
                </span>
              </div>
              <Progress
                value={Math.min(tokenPercentage, 100)}
                className={cn(
                  'h-2',
                  isNearTokenLimit && 'bg-warning/20',
                  isOverLimit && 'bg-error/20'
                )}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Cost</span>
                <span className="font-mono">
                  {formatCost(totalCost)} / {formatCost(costLimit)}
                </span>
              </div>
              <Progress
                value={Math.min(costPercentage, 100)}
                className={cn(
                  'h-2',
                  isNearCostLimit && 'bg-warning/20',
                  isOverLimit && 'bg-error/20'
                )}
              />
            </div>
          </div>

          {/* Per Model Breakdown */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Model Breakdown</h4>
            <div className="space-y-3">
              {currentUsage.map(usage => {
                const config = modelConfig[usage.model];
                const modelPercentage =
                  totalTokens > 0 ? (usage.tokens / totalTokens) * 100 : 0;

                return (
                  <div key={usage.model} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback
                            className={cn(
                              config.bgClass,
                              'text-white text-xs font-medium'
                            )}
                          >
                            {config.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {config.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-mono">
                        <span>{formatTokens(usage.tokens)}</span>
                        <span>{formatCost(usage.cost)}</span>
                        <Badge variant="outline" className="text-xs">
                          {usage.requests}
                        </Badge>
                      </div>
                    </div>
                    <Progress
                      value={modelPercentage}
                      className="h-1"
                      style={
                        {
                          '--progress-color': config.color,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-between pt-3 border-t text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>
                Avg: {formatCost(totalCost / Math.max(totalRequests, 1))} per
                request
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>
                Most used:{' '}
                {currentUsage.reduce(
                  (a, b) => (a.tokens > b.tokens ? a : b),
                  currentUsage[0] || { model: 'gpt4' }
                )
                  ? modelConfig[
                      currentUsage.reduce((a, b) =>
                        a.tokens > b.tokens ? a : b
                      ).model
                    ].name
                  : 'None'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function QuickUsageIndicator({
  tokens,
  cost,
  limit,
  costLimit,
  className,
}: {
  tokens: number;
  cost: number;
  limit: number;
  costLimit: number;
  className?: string;
}) {
  const tokenPercentage = (tokens / limit) * 100;
  const costPercentage = (cost / costLimit) * 100;
  const isWarning = tokenPercentage > 80 || costPercentage > 80;
  const isDanger = tokenPercentage > 100 || costPercentage > 100;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'h-2 w-2 rounded-full',
          isDanger
            ? 'bg-error animate-pulse'
            : isWarning
              ? 'bg-warning'
              : 'bg-success'
        )}
      />
      <span className="text-xs text-muted-foreground">
        {Math.round(Math.max(tokenPercentage, costPercentage))}% used
      </span>
    </div>
  );
}
