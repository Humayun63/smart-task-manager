import React from 'react';
import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface SummaryCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  suffix?: string;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  suffix,
  loading = false,
  trend,
}) => {
  return (
    <Card loading={loading} className="h-full">
      <Statistic
        title={title}
        value={value}
        prefix={icon}
        suffix={suffix}
        valueStyle={{ color: 'var(--color-text)' }}
      />
      {trend && (
        <div className="mt-2 text-sm">
          <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-text-muted ml-1">vs last month</span>
        </div>
      )}
    </Card>
  );
};
