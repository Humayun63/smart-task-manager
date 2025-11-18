import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Result } from 'antd';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Button type="primary" size="large" onClick={() => navigate('/dashboard')}>
            Back to Dashboard
          </Button>
        }
      />
    </div>
  );
};
