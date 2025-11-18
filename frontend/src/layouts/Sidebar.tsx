import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  CheckSquareOutlined,
  HistoryOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: '/teams',
      icon: <TeamOutlined />,
      label: <Link to="/teams">Teams</Link>,
    },
    {
      key: '/projects',
      icon: <ProjectOutlined />,
      label: <Link to="/projects">Projects</Link>,
    },
    {
      key: '/tasks',
      icon: <CheckSquareOutlined />,
      label: <Link to="/tasks">Tasks</Link>,
    },
    {
      key: '/activity-log',
      icon: <HistoryOutlined />,
      label: <Link to="/activity-log">Activity Log</Link>,
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      className="!bg-surface border-r border-divider"
      width={240}
    >
      <div className="h-16 flex items-center justify-center border-b border-divider">
        {!collapsed ? (
          <h2 className="text-xl font-bold text-primary m-0">TaskManager</h2>
        ) : (
          <h2 className="text-xl font-bold text-primary m-0">TM</h2>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="!bg-transparent !border-0"
      />
    </Sider>
  );
};
