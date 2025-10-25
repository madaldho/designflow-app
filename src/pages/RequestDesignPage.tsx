import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInstitutions, useCreateProject } from '@/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { 
  ArrowUpTrayIcon,
  XMarkIcon,
  PlusCircleIcon,
  CloudArrowUpIcon,
  DocumentIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { MediaType, Institution } from '@/types';
import { validateEmail, validatePhone, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const RequestDesignPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: institutions = [], isLoading: institutionsLoading } = useInstitutions();
  const createProjectMutation = useCreateProject();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'poster' as MediaType,
    size: '',
    customSize: '',
    quantity: 1,
    deadline: '',
    institutionId: '',
    description: '',
    gdriveLink: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const mediaTypes = [
    { value: 'baliho', label: 'Baliho', sizes: ['3x5m', '4x6m', '5x8m', 'Custom'] },
    { value: 'poster', label: 'Poster', sizes: ['A3', 'A2', 'A1', 'Custom'] },
    { value: 'rundown', label: 'Rundown', sizes: ['A4', 'A5', 'Custom'] },
    { value: 'spanduk', label: 'Spanduk', sizes: ['2x1m', '3x1m', '4x1m', 'Custom'] },
    { value: 'leaflet', label: 'Leaflet', sizes: ['A5', 'A6', 'Custom'] },
    { value: 'brosur', label: 'Brosur', sizes: ['A4', 'A5', 'Custom'] },
    { value: 'kartu_nama', label: 'Kartu Nama', sizes: ['Standard', 'Custom'] },
    { value: 'stiker', label: 'Stiker', sizes: ['A5', 'A4', 'Custom'] },
    { value: 'lainnya', label: 'Lainnya', sizes: ['Custom'] },
  ];

  // Institutions fetched from API via useInstitutions hook

  const selectedMediaType = mediaTypes.find(m => m.value === formData.type);
  const isCustomSize = formData.size === 'Custom' || !selectedMediaType?.sizes.includes(formData.size);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf' || file.type.includes('document');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType) {
        toast.error(`File ${file.name} tidak valid. Hanya gambar, PDF, atau dokumen yang diperbolehkan.`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File ${file.name} terlalu besar. Maksimal 10MB.`);
        return false;
      }
      
      return true;
    });
    
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Judul proyek harus diisi';
    }
    
    if (!formData.size) {
      errors.size = 'Pilih ukuran media';
    }
    
    if (isCustomSize && !formData.customSize.trim()) {
      errors.customSize = 'Ukuran custom harus diisi';
    }
    
    if (formData.quantity < 1) {
      errors.quantity = 'Jumlah cetak minimal 1';
    }
    
    if (!formData.deadline) {
      errors.deadline = 'Deadline harus diisi';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() + 1); // Minimum 1 day from now
      
      if (deadlineDate < minDate) {
        errors.deadline = 'Deadline minimal 1 hari dari sekarang';
      }
    }
    
    if (!formData.institutionId) {
      errors.institutionId = 'Pilih lembaga';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Deskripsi permintaan harus diisi';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedInstitution = institutions.find(i => i.id === formData.institutionId);
      
      const projectData = {
        title: formData.title,
        type: formData.type,
        size: formData.size === 'Custom' ? formData.customSize : formData.size,
        quantity: formData.quantity,
        deadline: new Date(formData.deadline),
        institutionId: formData.institutionId,
        institution: selectedInstitution,
        description: formData.description,
        gdriveLink: formData.gdriveLink || undefined,
        status: 'draft' as const,
      };
      
      await createProjectMutation.mutateAsync(projectData);
      
      toast.success('Request desain berhasil dibuat! Tim desain akan segera memproses.');
      navigate('/projects');
    } catch (error) {
      toast.error('Gagal membuat request desain. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return PhotoIcon;
    if (file.type === 'application/pdf') return DocumentIcon;
    return DocumentIcon;
  };

  const getFileSize = (file: File) => {
    const size = file.size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Request Desain Baru</h1>
        <p className="text-gray-600 mt-1">
          Ajukan permintaan desain dengan detail yang lengkap untuk hasil terbaik
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Dasar</CardTitle>
            <CardDescription>
              Masukkan informasi utama tentang desain yang Anda butuhkan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Judul Proyek *"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Contoh: Baliho HSN 3x5m"
                  error={validationErrors.title}
                />
              </div>
              
              <Select
                label="Jenis Media *"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                error={validationErrors.type}
              >
                {mediaTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              
              <Select
                label="Ukuran *"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                error={validationErrors.size}
              >
                <option value="">Pilih ukuran</option>
                {selectedMediaType?.sizes.map(size => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Select>
              
              {isCustomSize && (
                <Input
                  label="Ukuran Custom *"
                  name="customSize"
                  value={formData.customSize}
                  onChange={handleInputChange}
                  placeholder="Contoh: 2x3 meter"
                  error={validationErrors.customSize}
                />
              )}
              
              <Input
                label="Jumlah Cetak *"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                min="1"
                error={validationErrors.quantity}
              />
              
              <Input
                label="Deadline *"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                error={validationErrors.deadline}
              />
            </div>
          </CardContent>
        </Card>

        {/* Institution and Description */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Request</CardTitle>
            <CardDescription>
              Informasi lengkap tentang konten dan penerima desain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Lembaga *"
              name="institutionId"
              value={formData.institutionId}
              onChange={handleInputChange}
              error={validationErrors.institutionId}
            >
              <option value="">Pilih lembaga</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </Select>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deskripsi Permintaan * 
                <span className="text-gray-500 font-normal">
                  {' '}(jelaskan detail desain, warna, gaya, dll)
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={cn(
                  'input min-h-[120px]',
                  validationErrors.description && 'input-error'
                )}
                placeholder="Contoh: Desain baliho untuk acara HSN dengan tema hijau emas, menggunakan logo... "
              />
              {validationErrors.description && (
                <p className="mt-1 text-sm text-danger-600">{validationErrors.description}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Lampiran</CardTitle>
            <CardDescription>
              Upload referensi, logo, atau file pendukung lainnya
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* File Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label className="cursor-pointer">
                      <span className="btn btn-ghost">
                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                        Upload File
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileChange}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, PDF, DOC, DOCX (max. 10MB per file)
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Files */}
              {attachments.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">File Diunggah:</h4>
                  {attachments.map((file, index) => {
                    const Icon = getFileIcon(file);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{file.name}</p>
                            <p className="text-xs text-gray-500">{getFileSize(file)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Google Drive Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Google Drive (Opsional)
                </label>
                <input
                  type="url"
                  name="gdriveLink"
                  value={formData.gdriveLink}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/projects')}
          >
            Batal
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            loading={isSubmitting}
            loadingText="Membuat Request..."
          >
            Ajukan Request
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RequestDesignPage;
