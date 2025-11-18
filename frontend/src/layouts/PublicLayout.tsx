import React from 'react';
import type { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

interface PublicLayoutProps {
  children?: ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background">
      {children || <Outlet />}
    </div>
  );
};
