import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export type AIModel = 'gpt4' | 'claude' | 'gemini' | 'deepseek';

interface ModelInfo {
  id: AIModel;
  name: string;
  provider: string;
  color: string;
  avatar: string;
  bgClass: string;
  description: string;
  strengths: string[];
  pricing: string;
  contextWindow: string;
}

const modelInfo: Record<AIModel, ModelInfo> = {
  gpt4: {
    id: 'gpt4',
    name: 'GPT-4',
    provider: 'OpenAI',
    color: 'var(--ai-gpt4)',
    avatar: 'G4',
    bgClass: 'bg-[var(--ai-gpt4)]',
    description: 'Advanced reasoning and general intelligence',
    strengths: ['Code generation', 'Complex reasoning', 'Creative writing'],
    pricing: '$0.03/1K tokens',
    contextWindow: '128K tokens',
  },
  claude: {
    id: 'claude',
    name: 'Claude',
    provider: 'Anthropic',
    color: 'var(--ai-claude)',
    avatar: 'CL',
    bgClass: 'bg-[var(--ai-claude)]',
    description: 'Constitutional AI with strong safety focus',
    strengths: ['Analysis', 'Writing', 'Helpful responses'],
    pricing: '$0.025/1K tokens',
    contextWindow: '200K tokens',
  },
  gemini: {
    id: 'gemini',
    name: 'Gemini',
    provider: 'Google',
    color: 'var(--ai-gemini)',
    avatar: 'GM',
    bgClass: 'bg-[var(--ai-gemini)]',
    description: 'Multimodal AI with strong performance',
    strengths: ['Multimodal', 'Fast responses', 'Math & science'],
    pricing: '$0.02/1K tokens',
    contextWindow: '128K tokens',
  },
  deepseek: {
    id: 'deepseek',
    name: 'DeepSeek',
    provider: 'DeepSeek',
    color: 'var(--ai-deepseek)',
    avatar: 'DS',
    bgClass: 'bg-[var(--ai-deepseek)]',
    description: 'Cost-effective with strong capabilities',
    strengths: ['Code tasks', 'Cost-effective', 'Fast inference'],
    pricing: '$0.01/1K tokens',
    contextWindow: '64K tokens',
  },
};

interface ModelSelectorProps {
  value: AIModel;
  onValueChange: (model: AIModel) => void;
  disabled?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function ModelSelector({
  value,
  onValueChange,
  disabled = false,
  showTooltip = true,
  className,
}: ModelSelectorProps) {
  const selectedModel = modelInfo[value];

  const ModelOption = ({ model }: { model: ModelInfo }) => (
    <div className="flex items-center gap-3 p-2">
      <Avatar className="h-8 w-8">
        <AvatarFallback
          className={cn(model.bgClass, 'text-white text-xs font-medium')}
        >
          {model.avatar}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{model.name}</span>
          <Badge variant="outline" className="text-xs">
            {model.provider}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {model.description}
        </p>
      </div>
    </div>
  );

  const ModelTooltip = ({ model }: { model: ModelInfo }) => (
    <div className="space-y-3 p-2">
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarFallback
            className={cn(model.bgClass, 'text-white text-xs font-medium')}
          >
            {model.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{model.name}</div>
          <div className="text-xs text-muted-foreground">{model.provider}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-xs font-medium mb-1">Strengths</div>
          <div className="flex flex-wrap gap-1">
            {model.strengths.map(strength => (
              <Badge key={strength} variant="secondary" className="text-xs">
                {strength}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="font-medium">Pricing</div>
            <div className="text-muted-foreground">{model.pricing}</div>
          </div>
          <div>
            <div className="font-medium">Context</div>
            <div className="text-muted-foreground">{model.contextWindow}</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-[200px]">
          <SelectValue>
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback
                  className={cn(
                    selectedModel.bgClass,
                    'text-white text-xs font-medium'
                  )}
                >
                  {selectedModel.avatar}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{selectedModel.name}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {Object.values(modelInfo).map(model => (
            <SelectItem key={model.id} value={model.id} className="p-0">
              <ModelOption model={model} />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {showTooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
                <Info className="h-3 w-3 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <ModelTooltip model={selectedModel} />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
}

export function ModelBadge({
  model,
  showProvider = false,
  className,
}: {
  model: AIModel;
  showProvider?: boolean;
  className?: string;
}) {
  const info = modelInfo[model];

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Avatar className="h-5 w-5">
        <AvatarFallback
          className={cn(info.bgClass, 'text-white text-xs font-medium')}
        >
          {info.avatar}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{info.name}</span>
      {showProvider && (
        <Badge variant="outline" className="text-xs">
          {info.provider}
        </Badge>
      )}
    </div>
  );
}
