import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/useAuth';
import { Card, Input, Button } from '../../../components/ui';

/**
 * Profile details form.
 */
export default function ProfileForm({ className }) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      jobTitle: '',
      company: '',
    },
  });

  const onSubmit = (data) => {
    console.log('Update profile', data);
    // TODO: API call
  };

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-surface-100 mb-6">
        Personal Information
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            error={errors.name?.message}
            {...register('name', { required: 'Name is required' })}
          />
          <Input
            label="Email"
            type="email"
            disabled
            className="opacity-50 cursor-not-allowed"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input label="Current Job Title" {...register('jobTitle')} />
          <Input label="Company / University" {...register('company')} />
        </div>
        <div className="pt-4 flex justify-end">
          <Button type="submit" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
