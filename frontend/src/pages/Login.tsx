import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types';

const { Title, Text } = Typography;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (values: LoginCredentials) => {
    setLoading(true);
    setError('');
    
    try {
      await login(values);
      
      // Get redirect URL or default to dashboard
      const redirect = searchParams.get('redirect') || '/dashboard';
      navigate(redirect);
    } catch (err: any) {
      // Display error below form
      const errorMsg = err.response?.data?.message || err.message || 'Login failed. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-bg">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2 !text-primary">
            Welcome Back
          </Title>
          <Text className="text-text-muted">Sign in to your account to continue</Text>
        </div>

        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError('')}
            className="mb-4"
          />
        )}

        <Form
          name="login"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-text-muted" />}
              placeholder="Email"
              className="rounded-lg"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-text-muted" />}
              placeholder="Password"
              className="rounded-lg"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              className="rounded-lg font-semibold"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text className="text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-semibold hover:underline">
                Sign up
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};
