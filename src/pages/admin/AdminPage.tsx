import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { 
  UserGroupIcon,
  BuildingOfficeIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import UserManagement from './UserManagement';
import InstitutionManagement from './InstitutionManagement';
import ApprovalRoutesManagement from './ApprovalRoutesManagement';
import SystemSettingsManagement from './SystemSettingsManagement';

type AdminSection = 'overview' | 'users' | 'institutions' | 'approval_routes' | 'settings';

const AdminPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  const menuItems = [
    { id: 'users' as AdminSection, label: 'Manajemen User', icon: UserGroupIcon, description: 'Kelola users, roles, dan permissions' },
    { id: 'institutions' as AdminSection, label: 'Institusi', icon: BuildingOfficeIcon, description: 'Kelola data lembaga dan organisasi' },
    { id: 'approval_routes' as AdminSection, label: 'Approval Routes', icon: ClipboardDocumentListIcon, description: 'Konfigurasi alur persetujuan' },
    { id: 'settings' as AdminSection, label: 'System Settings', icon: Cog6ToothIcon, description: 'Pengaturan umum aplikasi' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'users':
        return <UserManagement />;
      case 'institutions':
        return <InstitutionManagement />;
      case 'approval_routes':
        return <ApprovalRoutesManagement />;
      case 'settings':
        return <SystemSettingsManagement />;
      default:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-gray-600 mt-1">
                Kelola pengaturan sistem dan konfigurasi aplikasi
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card 
                    key={item.id}
                    className="cursor-pointer hover:shadow-md transition-shadow hover:border-primary-300"
                    onClick={() => setActiveSection(item.id)}
                  >
                    <CardContent className="p-6">
                      <Icon className="w-12 h-12 text-primary-600 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.label}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {activeSection !== 'overview' && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
          <button
            onClick={() => setActiveSection('overview')}
            className="hover:text-primary-600 transition-colors"
          >
            Admin Panel
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">
            {menuItems.find(item => item.id === activeSection)?.label}
          </span>
        </div>
      )}

      {renderContent()}
    </div>
  );
};

export default AdminPage;
