import { useAuth } from '../../../hooks/useAuth';
import { Card, Avatar, Button } from '../../../components/ui';
import { Camera } from 'lucide-react';

/**
 * Profile header with avatar upload.
 */
export default function ProfileHeader({ className }) {
  const { user } = useAuth();

  return (
    <Card className={className}>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group cursor-pointer">
          <Avatar
            src={user?.avatar}
            name={user?.name || 'User'}
            size="xl"
            className="ring-4 ring-surface-800"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-default">
            <Camera size={24} className="text-white" />
          </div>
        </div>
        <div className="text-center sm:text-left flex-1">
          <h2 className="text-2xl font-bold text-surface-100">
            {user?.name || 'User'}
          </h2>
          <p className="text-surface-400">{user?.email}</p>
        </div>
        <Button variant="outline">Change Avatar</Button>
      </div>
    </Card>
  );
}
