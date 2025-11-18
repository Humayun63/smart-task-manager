import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const { Content } = Layout;

interface AppLayoutProps {
  children?: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="min-h-screen">
      <Sidebar collapsed={collapsed} />
      <Layout>
        <Topbar collapsed={collapsed} onToggle={toggleSidebar} />
        <Content className="bg-bg p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children || <Outlet />}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
