import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock } from 'lucide-react';
import { Button, Input, Checkbox } from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Login form component.
 */
export default function LoginForm() {
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await login(data);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Email"
        type="email"
        icon={<Mail size={16} />}
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email address',
          },
        })}
      />

      <Input
        label="Password"
        type="password"
        icon={<Lock size={16} />}
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password', {
          required: 'Password is required',
          minLength: {
            value: 6,
            message: 'Must be at least 6 characters',
          },
        })}
      />

      <div className="flex items-center justify-between">
        <Checkbox label="Remember me" {...register('remember')} />
        <a href="#" className="text-xs text-primary-400 hover:text-primary-300 transition-default">
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        variant="accent"
        size="lg"
        fullWidth
        loading={isLoading}
      >
        Sign In
      </Button>

      <p className="text-center text-sm text-surface-400">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-default">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
