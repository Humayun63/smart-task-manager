import React from 'react';
import type { ReactNode } from 'react';
import { Button as AntButton } from 'antd';
import type { ButtonProps as AntButtonProps } from 'antd';

interface ButtonProps extends Omit<AntButtonProps, 'variant'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'text';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '',
  ...props 
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-hover text-white';
      case 'secondary':
        return 'bg-surface border-2 border-primary text-primary hover:bg-primary hover:text-white';
      case 'ghost':
        return 'bg-transparent border border-text-muted text-text hover:border-primary hover:text-primary';
      case 'text':
        return 'bg-transparent text-text hover:text-primary';
      default:
        return '';
    }
  };

  // Use Ant Design button for consistency but with custom Tailwind styling
  const antType = variant === 'primary' ? 'primary' : variant === 'text' ? 'text' : 'default';

  return (
    <AntButton
      type={antType}
      className={`transition-all duration-200 ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </AntButton>
  );
};
