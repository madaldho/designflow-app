import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { validateEmail, validatePhone, cn } from '@/lib/utils';
import { UserRole } from '@/types';
import { EyeIcon, EyeSlashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    institutionId: '',
    institutionType: '',
    institutionName: '',
    role: 'requester' as UserRole,
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showInstitutionForm, setShowInstitutionForm] = useState(false);

  const institutionTypes = [
    { value: 'pondok', label: 'Pondok Pesantren' },
    { value: 'yayasan', label: 'Yayasan' },
    { value: 'smp', label: 'SMP/MTs' },
    { value: 'sma', label: 'SMA/MA' },
    { value: 'smk', label: 'SMK' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  const roles = [
    { value: 'requester', label: 'Requester / Konten', description: 'Mengajukan permintaan desain' },
    { value: 'designer_internal', label: 'Desainer Internal', description: 'Mengerjakan desain internal' },
    { value: 'designer_external', label: 'Desainer Eksternal (Percetakan)', description: 'Mengerjakan desain dan cetak' },
    { value: 'reviewer', label: 'Reviewer', description: 'Melakukan review dan kritik desain (Perlu persetujuan Admin)' },
  ];

  const institutions = [
    { id: '1', name: 'Yayasan Pendidikan Utama', type: 'yayasan' },
    { id: '2', name: 'Pondok Pesantren Al-Hikmah', type: 'pondok' },
    { id: '3', name: 'SMP Negeri 1 Jakarta', type: 'smp' },
    { id: '4', name: 'Percetakan Maju Jaya', type: 'lainnya' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    
    // Clear auth error when user types
    if (error) {
      clearError();
    }

    // Handle institution selection
    if (name === 'institutionId' && value === 'other') {
      setShowInstitutionForm(true);
      setFormData(prev => ({ ...prev, institutionId: '' }));
    } else if (name === 'institutionId' && value !== 'other') {
      setShowInstitutionForm(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Nama harus diisi';
    } else if (formData.name.length < 3) {
      errors.name = 'Nama minimal 3 karakter';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email harus diisi';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Format email tidak valid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Nomor HP harus diisi';
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Format nomor HP tidak valid (gunakan 08xxx)';
    }
    
    if (!formData.password) {
      errors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }
    
    if (!formData.institutionId && !showInstitutionForm) {
      errors.institutionId = 'Pilih lembaga atau tambahkan lembaga baru';
    }
    
    if (showInstitutionForm) {
      if (!formData.institutionType) {
        errors.institutionType = 'Pilih jenis lembaga';
      }
      if (!formData.institutionName.trim()) {
        errors.institutionName = 'Nama lembaga harus diisi';
      }
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'Anda harus menyetujui syarat dan ketentuan';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        institutionId: showInstitutionForm ? 'new' : formData.institutionId,
        role: formData.role,
        agreeToTerms: formData.agreeToTerms,
      });
      
      toast.success('Registrasi berhasil! Silakan masuk.');
      navigate('/login');
    } catch (error) {
      // Error is already handled in AuthContext
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Buat Akun Baru
          </h2>
          <p className="text-gray-600">
            Bergabunglah dengan DesignFlow untuk mengelola proyek desain dengan lebih efisien
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-danger-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-danger-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearError}
                  className="text-danger-400 hover:text-danger-600"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informasi Pribadi</h3>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(
                    'input',
                    validationErrors.name && 'input-error'
                  )}
                  placeholder="John Doe"
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-danger-600">{validationErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor HP (WA) *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={cn(
                    'input',
                    validationErrors.phone && 'input-error'
                  )}
                  placeholder="081234567890"
                />
                {validationErrors.phone && (
                  <p className="mt-1 text-sm text-danger-600">{validationErrors.phone}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={cn(
                  'input',
                  validationErrors.email && 'input-error'
                )}
                placeholder="nama@email.com"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-danger-600">{validationErrors.email}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={cn(
                      'input pr-10',
                      validationErrors.password && 'input-error'
                    )}
                    placeholder="Minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-danger-600">{validationErrors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={cn(
                      'input pr-10',
                      validationErrors.confirmPassword && 'input-error'
                    )}
                    placeholder="Ulangi password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-danger-600">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>

          {/* Institution Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Informasi Lembaga</h3>
            
            <div>
              <label htmlFor="institutionId" className="block text-sm font-medium text-gray-700 mb-2">
                Lembaga *
              </label>
              <select
                id="institutionId"
                name="institutionId"
                value={formData.institutionId}
                onChange={handleChange}
                className={cn(
                  'input',
                  validationErrors.institutionId && 'input-error'
                )}
              >
                <option value="">Pilih lembaga</option>
                {institutions.map((inst) => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name}
                  </option>
                ))}
                <option value="other">+ Tambah lembaga baru</option>
              </select>
              {validationErrors.institutionId && (
                <p className="mt-1 text-sm text-danger-600">{validationErrors.institutionId}</p>
              )}
            </div>

            {showInstitutionForm && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                <h4 className="font-medium text-gray-900">Tambah Lembaga Baru</h4>
                
                <div>
                  <label htmlFor="institutionType" className="block text-sm font-medium text-gray-700 mb-2">
                    Jenis Lembaga *
                  </label>
                  <select
                    id="institutionType"
                    name="institutionType"
                    value={formData.institutionType}
                    onChange={handleChange}
                    className={cn(
                      'input',
                      validationErrors.institutionType && 'input-error'
                    )}
                  >
                    <option value="">Pilih jenis</option>
                    {institutionTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {validationErrors.institutionType && (
                    <p className="mt-1 text-sm text-danger-600">{validationErrors.institutionType}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="institutionName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lembaga *
                  </label>
                  <input
                    type="text"
                    id="institutionName"
                    name="institutionName"
                    value={formData.institutionName}
                    onChange={handleChange}
                    className={cn(
                      'input',
                      validationErrors.institutionName && 'input-error'
                    )}
                    placeholder="Masukkan nama lembaga"
                  />
                  {validationErrors.institutionName && (
                    <p className="mt-1 text-sm text-danger-600">{validationErrors.institutionName}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Peran Pengguna</h3>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Peran *
              </label>
              <div className="space-y-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className="relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{role.label}</div>
                      <div className="text-sm text-gray-500">{role.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="relative flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <div className="ml-3">
                <span className="text-sm text-gray-700">
                  Saya setuju dengan{' '}
                  <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                    Syarat & Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                    Kebijakan Privasi
                  </Link>
                </span>
              </div>
            </label>
            {validationErrors.agreeToTerms && (
              <p className="mt-1 text-sm text-danger-600">{validationErrors.agreeToTerms}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full py-3 text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="loading-spinner w-5 h-5 mr-3"></div>
                Mendaftar...
              </div>
            ) : (
              'Daftar Sekarang'
            )}
          </button>
        </form>

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
