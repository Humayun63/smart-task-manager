import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import type { RegisterData } from '../types';

const { Title, Text } = Typography;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (values: RegisterData & { confirmPassword: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const { confirmPassword, ...registerData } = values;
      await register(registerData);
      navigate('/dashboard');
    } catch (err: any) {
      // Display error below form
      const errorMsg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
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
            Create Account
          </Title>
          <Text className="text-text-muted">Sign up to get started</Text>
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
          name="register"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Please enter your name' },
              { min: 2, message: 'Name must be at least 2 characters' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-text-muted" />}
              placeholder="Full Name"
              className="rounded-lg"
              disabled={loading}
            />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Please enter your password' },
              { min: 6, message: 'Password must be at least 6 characters' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-text-muted" />}
              placeholder="Password"
              className="rounded-lg"
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-text-muted" />}
              placeholder="Confirm Password"
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
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </Form.Item>

          <div className="text-center">
            <Text className="text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};
