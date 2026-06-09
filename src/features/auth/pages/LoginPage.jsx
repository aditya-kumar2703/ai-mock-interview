import LoginForm from '../components/LoginForm';

/**
 * Login page — rendered inside AuthLayout.
 */
export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-surface-100">Welcome Back</h2>
        <p className="text-sm text-surface-400 mt-1">
          Sign in to continue your interview preparation
        </p>
      </div>
      <LoginForm />
    </div>
  );
}
