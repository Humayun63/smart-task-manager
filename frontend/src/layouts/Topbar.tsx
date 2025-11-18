import React from 'react';
import { Layout, Button, Dropdown, Avatar, Switch, Space } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { Header } = Layout;

interface TopbarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { currentTheme, toggleTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => {
        // Navigate to profile page (to be implemented)
      },
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header className="!bg-surface !px-6 flex items-center justify-between border-b border-divider !h-16">
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        className="!text-text"
      />

      <Space size="middle">
        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <SunOutlined className="text-text-muted" />
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
          <MoonOutlined className="text-text-muted" />
        </div>

        {/* User Dropdown */}
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar icon={<UserOutlined />} className="!bg-primary" />
            <span className="text-text font-medium">{user?.name}</span>
          </div>
        </Dropdown>
      </Space>
    </Header>
  );
};
