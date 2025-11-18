import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="text-6xl font-bold text-primary">404</div>
          <h1 className="text-3xl font-bold text-text">Page Not Found</h1>
          <p className="text-text-muted">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/">
            <Button variant="primary" size="large">
              Go Back Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
