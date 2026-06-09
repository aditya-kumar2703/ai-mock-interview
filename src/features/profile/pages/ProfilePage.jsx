import PageHeader from '../../../components/shared/PageHeader';
import ProfileHeader from '../components/ProfileHeader';
import ProfileForm from '../components/ProfileForm';
import AccountSettings from '../components/AccountSettings';

/**
 * Profile settings page.
 */
export default function ProfilePage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account preferences and personal information"
      />
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>
        <div>
          <AccountSettings />
        </div>
      </div>
    </div>
  );
}
