import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { Avatar, Dropdown, DropdownItem } from '../ui';
import { useAuth } from '../../hooks/useAuth';

/**
 * User menu dropdown in topbar.
 */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const trigger = (
    <div className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-default">
      <Avatar
        src={user?.avatar}
        name={user?.name || 'User'}
        size="sm"
        online
      />
      <span className="text-sm font-medium text-surface-200 hidden lg:block">
        {user?.name || 'User'}
      </span>
    </div>
  );

  return (
    <Dropdown trigger={trigger} align="right">
      <DropdownItem
        icon={<User size={16} />}
        onClick={() => navigate('/profile')}
      >
        Profile
      </DropdownItem>
      <DropdownItem
        icon={<Settings size={16} />}
        onClick={() => navigate('/profile')}
      >
        Settings
      </DropdownItem>
      <div className="border-t border-surface-800 my-1" />
      <DropdownItem
        icon={<LogOut size={16} />}
        danger
        onClick={() => {
          logout();
          navigate('/login');
        }}
      >
        Log Out
      </DropdownItem>
    </Dropdown>
  );
}
