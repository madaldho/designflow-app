import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateUser } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  UserCircleIcon,
  BuildingOfficeIcon,
  BellIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const updateUserMutation = useUpdateUser();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: formData,
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'approver':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'reviewer':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'designer_internal':
      case 'designer_external':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'requester':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'approver':
        return 'Approver';
      case 'reviewer':
        return 'Reviewer';
      case 'designer_internal':
        return 'Designer Internal';
      case 'designer_external':
        return 'Designer Eksternal';
      case 'requester':
        return 'Requester';
      default:
        return role;
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Kelola informasi akun dan preferensi Anda
          </p>
        </div>
        
        {/* User Avatar - Desktop */}
        <div className="hidden sm:flex items-center gap-3 bg-gradient-to-br from-primary-50 to-primary-100 px-6 py-4 rounded-xl border border-primary-200">
          <div className="w-16 h-16 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0">
            <UserCircleIcon className="w-10 h-10 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <Badge
              size="sm"
              className={`${getRoleBadgeColor(user.role)} mt-1`}
            >
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <UserCircleIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl">Informasi Pribadi</CardTitle>
                  <CardDescription className="text-sm">
                    Data pribadi Anda yang terdaftar di sistem
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nama Lengkap
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    leftIcon={<UserCircleIcon className="w-5 h-5" />}
                    placeholder="Masukkan nama lengkap"
                    className={cn(
                      !isEditing && "bg-gray-50 cursor-not-allowed"
                    )}
                  />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={user.email}
                    disabled
                    leftIcon={<EnvelopeIcon className="w-5 h-5" />}
                    className="bg-gray-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Email tidak dapat diubah untuk keamanan akun
                  </p>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Nomor HP / WhatsApp
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    leftIcon={<PhoneIcon className="w-5 h-5" />}
                    placeholder="Contoh: 081234567890"
                    className={cn(
                      !isEditing && "bg-gray-50 cursor-not-allowed"
                    )}
                  />
                  <p className="text-xs text-gray-500">
                    Format: 08xxxxxxxxxx (tanpa +62 atau spasi)
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-gray-100">
                  {!isEditing ? (
                    <Button 
                      type="button" 
                      onClick={() => setIsEditing(true)}
                      className="w-full sm:w-auto"
                      leftIcon={
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      }
                    >
                      Edit Profil
                    </Button>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        loading={updateUserMutation.isPending}
                        loadingText="Menyimpan..."
                        className="w-full sm:w-auto"
                        leftIcon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        }
                      >
                        Simpan Perubahan
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            name: user.name,
                            phone: user.phone || '',
                          });
                        }}
                        className="w-full sm:w-auto"
                        leftIcon={
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        }
                      >
                        Batal
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Card */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success-100 flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-success-600" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl">Keamanan Akun</CardTitle>
                  <CardDescription className="text-sm">
                    Informasi keamanan dan status akun
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Status Akun</p>
                      <p className="text-xs text-gray-500">Akun Anda dalam keadaan baik</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    Aktif
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Password</p>
                      <p className="text-xs text-gray-500">Terakhir diubah 30 hari lalu</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" disabled>
                    Ubah Password
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Role Card */}
          <Card className="shadow-sm bg-gradient-to-br from-white to-primary-50/30">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
                  <ShieldCheckIcon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">Peran & Akses</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                  <ShieldCheckIcon className="w-10 h-10 text-white" />
                </div>
                <div>
                  <Badge
                    size="lg"
                    className={`${getRoleBadgeColor(user.role)} px-4 py-2 font-semibold text-base shadow-sm`}
                  >
                    {getRoleLabel(user.role)}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-3">
                    Peran Anda di sistem DesignFlow
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Institution Card */}
          {user.institutions && user.institutions.length > 0 && (
            <Card className="shadow-sm">
              <CardHeader className="border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Institusi</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {user.institutions.map((institution, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <BuildingOfficeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {institution.name}
                        </p>
                        <p className="text-xs text-gray-600 capitalize mt-0.5">
                          {institution.type}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications Preference */}
          <Card className="shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <BellIcon className="w-6 h-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg">Notifikasi</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
                  <BellIcon className="w-8 h-8 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Pengaturan notifikasi via email dan WhatsApp akan segera tersedia.
                  </p>
                  <Badge variant="warning" size="sm" className="mt-3">
                    Segera Hadir
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
