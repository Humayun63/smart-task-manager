import React from 'react';
import type { ReactNode } from 'react';
import { Card as AntCard } from 'antd';
import type { CardProps as AntCardProps } from 'antd';

interface CardProps extends AntCardProps {
  children: ReactNode;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  hoverable = false,
  className = '',
  ...props 
}) => {
  return (
    <AntCard
      hoverable={hoverable}
      className={`
        bg-surface 
        border 
        rounded-lg 
        shadow-sm
        ${hoverable ? 'hover:shadow-md transition-shadow duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="text-text">
        {children}
      </div>
    </AntCard>
  );
};
