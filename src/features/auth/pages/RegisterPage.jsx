import RegisterForm from '../components/RegisterForm';

/**
 * Register page — rendered inside AuthLayout.
 */
export default function RegisterPage() {
  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-surface-100">Create Account</h2>
        <p className="text-sm text-surface-400 mt-1">
          Start your AI-powered interview preparation journey
        </p>
      </div>
      <RegisterForm />
    </div>
  );
}
