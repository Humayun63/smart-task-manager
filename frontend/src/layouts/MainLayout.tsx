import React from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Switch } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { useTheme } from '../context/ThemeContext';

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { currentTheme, toggleTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Navigation Bar */}
      <nav className="bg-surface border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">
                TM
              </h1>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <SunOutlined className="text-text-muted" />
                <Switch
                  checked={isDark}
                  onChange={toggleTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                  className="bg-primary"
                />
                <MoonOutlined className="text-text-muted" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-text-muted text-sm">
            © 2025 Task Manager. Built with React, TypeScript, and Ant Design.
          </p>
        </div>
      </footer>
    </div>
  );
};
