import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Cog6ToothIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface SystemSettings {
  notifications: {
    emailEnabled: boolean;
    emailSender: string;
    emailHost: string;
  };
  security: {
    passwordMinLength: number;
    sessionTimeout: number;
    maxLoginAttempts: number;
  };
  project: {
    defaultDeadlineDays: number;
    autoAssignReviewer: boolean;
    autoAssignApprover: boolean;
  };
  storage: {
    maxFileSize: number;
    allowedFileTypes: string[];
  };
}

const SystemSettingsManagement: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    notifications: {
      emailEnabled: true,
      emailSender: 'noreply@designflow.com',
      emailHost: 'smtp.gmail.com',
    },
    security: {
      passwordMinLength: 8,
      sessionTimeout: 24,
      maxLoginAttempts: 5,
    },
    project: {
      defaultDeadlineDays: 7,
      autoAssignReviewer: false,
      autoAssignApprover: false,
    },
    storage: {
      maxFileSize: 10,
      allowedFileTypes: ['pdf', 'jpg', 'png', 'jpeg'],
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Pengaturan berhasil disimpan');
    setIsSaving(false);
  };

  const handleReset = () => {
    if (!confirm('Yakin ingin mereset semua pengaturan ke default?')) return;
    
    setSettings({
      notifications: {
        emailEnabled: true,
        emailSender: 'noreply@designflow.com',
        emailHost: 'smtp.gmail.com',
      },
      security: {
        passwordMinLength: 8,
        sessionTimeout: 24,
        maxLoginAttempts: 5,
      },
      project: {
        defaultDeadlineDays: 7,
        autoAssignReviewer: false,
        autoAssignApprover: false,
      },
      storage: {
        maxFileSize: 10,
        allowedFileTypes: ['pdf', 'jpg', 'png', 'jpeg'],
      },
    });
    
    toast.success('Pengaturan direset ke default');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
          <p className="text-gray-600 mt-1">
            Konfigurasi pengaturan aplikasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <BellIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <CardTitle>Notifikasi</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Pengaturan email dan notifikasi sistem
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email Notifications
                  </label>
                  <p className="text-xs text-gray-500">
                    Aktifkan notifikasi via email
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.notifications.emailEnabled}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailEnabled: e.target.checked }
                  })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Sender
                </label>
                <Input
                  type="email"
                  value={settings.notifications.emailSender}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailSender: e.target.value }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SMTP Host
                </label>
                <Input
                  type="text"
                  value={settings.notifications.emailHost}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, emailHost: e.target.value }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <ShieldCheckIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <CardTitle>Keamanan</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Pengaturan keamanan dan autentikasi
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Panjang Minimum Password
                </label>
                <Input
                  type="number"
                  min={6}
                  max={20}
                  value={settings.security.passwordMinLength}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, passwordMinLength: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Timeout (jam)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={168}
                  value={settings.security.sessionTimeout}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maksimal Percobaan Login
                </label>
                <Input
                  type="number"
                  min={3}
                  max={10}
                  value={settings.security.maxLoginAttempts}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, maxLoginAttempts: parseInt(e.target.value) }
                  })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <DocumentTextIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <CardTitle>Project</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Pengaturan default untuk project
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Deadline (hari)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={30}
                  value={settings.project.defaultDeadlineDays}
                  onChange={(e) => setSettings({
                    ...settings,
                    project: { ...settings.project, defaultDeadlineDays: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Auto Assign Reviewer
                  </label>
                  <p className="text-xs text-gray-500">
                    Otomatis assign reviewer saat project dibuat
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.project.autoAssignReviewer}
                  onChange={(e) => setSettings({
                    ...settings,
                    project: { ...settings.project, autoAssignReviewer: e.target.checked }
                  })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Auto Assign Approver
                  </label>
                  <p className="text-xs text-gray-500">
                    Otomatis assign approver saat project dibuat
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.project.autoAssignApprover}
                  onChange={(e) => setSettings({
                    ...settings,
                    project: { ...settings.project, autoAssignApprover: e.target.checked }
                  })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Storage Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <CloudIcon className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <CardTitle>Storage</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Pengaturan file dan storage
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maksimal Ukuran File (MB)
                </label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={settings.storage.maxFileSize}
                  onChange={(e) => setSettings({
                    ...settings,
                    storage: { ...settings.storage, maxFileSize: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe File yang Diizinkan
                </label>
                <Input
                  type="text"
                  value={settings.storage.allowedFileTypes.join(', ')}
                  onChange={(e) => setSettings({
                    ...settings,
                    storage: { 
                      ...settings.storage, 
                      allowedFileTypes: e.target.value.split(',').map(t => t.trim()) 
                    }
                  })}
                  placeholder="pdf, jpg, png"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pisahkan dengan koma
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="ghost" onClick={handleReset}>
          Reset ke Default
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Menyimpan...' : 'Simpan Semua Perubahan'}
        </Button>
      </div>
    </div>
  );
};

export default SystemSettingsManagement;
