'use client';

import React, { useState } from 'react';
import { AIMessage, type AIModel } from '@/components/ui/ai-message';
import { ModelSelector, ModelBadge } from '@/components/ui/model-selector';
import {
  UsageTracker,
  QuickUsageIndicator,
} from '@/components/ui/usage-tracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ComponentsDemo() {
  const [selectedModel, setSelectedModel] = useState<AIModel>('gpt4');

  // Sample data for demonstrations
  const sampleUsageData = {
    daily: [
      { model: 'gpt4' as AIModel, tokens: 15000, cost: 0.45, requests: 25 },
      { model: 'claude' as AIModel, tokens: 8000, cost: 0.2, requests: 12 },
      { model: 'gemini' as AIModel, tokens: 12000, cost: 0.24, requests: 18 },
      { model: 'deepseek' as AIModel, tokens: 5000, cost: 0.05, requests: 8 },
    ],
    monthly: [
      { model: 'gpt4' as AIModel, tokens: 450000, cost: 13.5, requests: 750 },
      { model: 'claude' as AIModel, tokens: 240000, cost: 6.0, requests: 360 },
      { model: 'gemini' as AIModel, tokens: 360000, cost: 7.2, requests: 540 },
      {
        model: 'deepseek' as AIModel,
        tokens: 150000,
        cost: 1.5,
        requests: 240,
      },
    ],
    limits: {
      dailyTokens: 50000,
      dailyCost: 2.0,
      monthlyTokens: 1500000,
      monthlyCost: 50.0,
    },
    period: 'today' as const,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('Sample AI response copied!');
  };

  const handleRegenerate = () => {
    console.log('Regenerating response...');
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    console.log(`Feedback: ${type}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">ChatSpace Components Demo</h1>
        <p className="text-muted-foreground">
          Showcasing our custom shadcn/ui components with ChatSpace design
          system integration
        </p>
      </div>

      {/* Model Selector Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Model Selector Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Interactive Model Selector</h4>
            <ModelSelector
              value={selectedModel}
              onValueChange={setSelectedModel}
              showTooltip={true}
            />
            <p className="text-xs text-muted-foreground">
              Selected: {selectedModel} - Try switching between models and hover
              the info icon
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Model Badges</h4>
            <div className="flex flex-wrap gap-2">
              <ModelBadge model="gpt4" showProvider />
              <ModelBadge model="claude" showProvider />
              <ModelBadge model="gemini" showProvider />
              <ModelBadge model="deepseek" showProvider />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Message Demo */}
      <Card>
        <CardHeader>
          <CardTitle>AI Message Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AIMessage
            content="Here's a comprehensive example of how to implement a React component with TypeScript. This response demonstrates the AI message component with proper styling, token tracking, and interactive features.

Key features include:
- Model-specific color coding
- Token usage display
- Action buttons for copy, regenerate, and feedback
- Responsive design that works on all devices
- Integration with our ChatSpace design system"
            model={selectedModel}
            timestamp={new Date()}
            tokens={342}
            cost={0.0103}
            onCopy={handleCopy}
            onRegenerate={handleRegenerate}
            onFeedback={handleFeedback}
          />

          <AIMessage
            content="Loading response..."
            model="claude"
            timestamp={new Date()}
            isLoading={true}
          />
        </CardContent>
      </Card>

      {/* Usage Tracker Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Tracker Component</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Compact Usage Display</h4>
            <UsageTracker data={sampleUsageData} compact={true} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Full Usage Dashboard</h4>
            <UsageTracker data={sampleUsageData} />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Quick Usage Indicators</h4>
            <div className="flex gap-4">
              <QuickUsageIndicator
                tokens={25000}
                cost={0.75}
                limit={50000}
                costLimit={2.0}
              />
              <QuickUsageIndicator
                tokens={45000}
                cost={1.8}
                limit={50000}
                costLimit={2.0}
              />
              <QuickUsageIndicator
                tokens={55000}
                cost={2.2}
                limit={50000}
                costLimit={2.0}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Standard shadcn/ui Components */}
      <Card>
        <CardHeader>
          <CardTitle>Standard shadcn/ui Components</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Badges with ChatSpace Theme</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Theme Integration</h4>
            <p className="text-sm text-muted-foreground">
              All components automatically adapt to our ChatSpace design system
              with:
            </p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• CSS custom properties for consistent theming</li>
              <li>• AI model-specific color coding</li>
              <li>• Typography using Inter and JetBrains Mono fonts</li>
              <li>• Automatic light/dark mode switching</li>
              <li>• Tailwind CSS v4 integration</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          🎉 shadcn/ui components successfully integrated with ChatSpace design
          system!
        </p>
      </div>
    </div>
  );
}
