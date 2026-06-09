import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock } from 'lucide-react';
import { Button, Input, Checkbox } from '../../../components/ui';
import { useAuth } from '../../../hooks/useAuth';

/**
 * Registration form component.
 */
export default function RegisterForm() {
  const { register: registerUser, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await registerUser(data);
    navigate('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        label="Full Name"
        icon={<User size={16} />}
        placeholder="John Doe"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />

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
            value: 8,
            message: 'Must be at least 8 characters',
          },
        })}
      />

      <Input
        label="Confirm Password"
        type="password"
        icon={<Lock size={16} />}
        placeholder="••••••••"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword', {
          required: 'Please confirm your password',
          validate: (val) =>
            val === watch('password') || 'Passwords do not match',
        })}
      />

      <Checkbox
        label="I agree to the Terms of Service and Privacy Policy"
        {...register('terms', { required: true })}
      />

      <Button
        type="submit"
        variant="accent"
        size="lg"
        fullWidth
        loading={isLoading}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-surface-400">
        Already have an account?{' '}
        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-default">
          Sign In
        </Link>
      </p>
    </form>
  );
}
