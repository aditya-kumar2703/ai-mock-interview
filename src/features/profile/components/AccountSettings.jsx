import { Card, Button, Toggle } from '../../../components/ui';

/**
 * Account settings (notifications, danger zone).
 */
export default function AccountSettings({ className }) {
  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-surface-100 mb-6">
        Account Settings
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium text-surface-200 mb-4">
            Email Notifications
          </h4>
          <div className="space-y-4">
            <Toggle label="Weekly progress reports" checked={true} />
            <Toggle label="New feature announcements" checked={false} />
            <Toggle label="Practice reminders" checked={true} />
          </div>
        </div>

        <div className="pt-6 border-t border-surface-800">
          <h4 className="text-sm font-medium text-danger-400 mb-2">
            Danger Zone
          </h4>
          <p className="text-sm text-surface-400 mb-4">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button variant="danger" size="sm">
            Delete Account
          </Button>
        </div>
      </div>
    </Card>
  );
}
