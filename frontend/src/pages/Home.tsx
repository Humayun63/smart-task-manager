import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';

export const Home: React.FC = () => {
  const { currentTheme } = useTheme();

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-text mb-4">
          Welcome to Task Manager
        </h1>
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          A modern, feature-rich task management system built with React, TypeScript, and Ant Design.
        </p>
      </div>

      {/* Theme Demo Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Primary Color Demo */}
        <Card hoverable>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text">Primary Colors</h3>
            <div className="space-y-2">
              <div className="h-16 bg-primary rounded flex items-center justify-center text-white font-medium">
                Primary
              </div>
              <div className="h-16 bg-primary-hover rounded flex items-center justify-center text-white font-medium">
                Primary Hover
              </div>
            </div>
          </div>
        </Card>

        {/* Button Variants Demo */}
        <Card hoverable>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text">Button Variants</h3>
            <div className="space-y-3">
              <Button variant="primary" block>Primary Button</Button>
              <Button variant="secondary" block>Secondary Button</Button>
              <Button variant="ghost" block>Ghost Button</Button>
              <Button variant="text" block>Text Button</Button>
            </div>
          </div>
        </Card>

        {/* Theme Info Card */}
        <Card hoverable>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-text">Current Theme</h3>
            <div className="space-y-2">
              <p className="text-text-muted">
                Active Theme: <span className="font-semibold text-primary capitalize">{currentTheme}</span>
              </p>
              <div className="flex items-center gap-2 pt-2">
                <div className="w-8 h-8 rounded bg-background border" title="Background" />
                <div className="w-8 h-8 rounded bg-surface border" title="Surface" />
                <div className="w-8 h-8 rounded bg-primary" title="Primary" />
                <div className="w-8 h-8 rounded bg-text" title="Text" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Feature Overview */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">✨ Features</h2>
          <ul className="space-y-2 text-text-muted">
            <li>✅ React 18+ with TypeScript</li>
            <li>✅ React Router v6 for navigation</li>
            <li>✅ Ant Design v5 component library</li>
            <li>✅ TailwindCSS with custom design tokens</li>
            <li>✅ Context-based theme system (Light + Dark)</li>
            <li>✅ CSS variables for easy branding</li>
            <li>✅ Responsive layout system</li>
            <li>✅ Production-ready architecture</li>
          </ul>
        </div>
      </Card>

      {/* Getting Started */}
      <Card>
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-text">🚀 Getting Started</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-text-muted">
              This is a fully configured frontend setup ready for development. 
              All design tokens are defined in <code className="text-primary">src/theme/tokens.css</code>.
            </p>
            <p className="text-text-muted">
              Toggle between light and dark themes using the switch in the navigation bar. 
              All components automatically adapt to the selected theme.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
