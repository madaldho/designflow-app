import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import { useInstitutions, useCreateInstitution, useUpdateInstitution, useDeleteInstitution } from '@/hooks';
import toast from 'react-hot-toast';

interface InstitutionFormData {
  name: string;
  type: string;
  description?: string;
}

const InstitutionManagement: React.FC = () => {
  const { data: institutions = [], isLoading, refetch } = useInstitutions();
  const createMutation = useCreateInstitution();
  const updateMutation = useUpdateInstitution();
  const deleteMutation = useDeleteInstitution();

  const [showModal, setShowModal] = useState(false);
  const [editingInstitution, setEditingInstitution] = useState<any>(null);

  const [formData, setFormData] = useState<InstitutionFormData>({
    name: '',
    type: 'pondok',
    description: '',
  });

  const institutionTypes = [
    { value: 'pondok', label: 'Pondok Pesantren' },
    { value: 'yayasan', label: 'Yayasan' },
    { value: 'smp', label: 'SMP' },
    { value: 'sma', label: 'SMA' },
    { value: 'smk', label: 'SMK' },
    { value: 'ma', label: 'MA' },
    { value: 'mts', label: 'MTs' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  const handleOpenModal = (institution?: any) => {
    if (institution) {
      setEditingInstitution(institution);
      setFormData({
        name: institution.name,
        type: institution.type || 'pondok',
        description: institution.description || '',
      });
    } else {
      setEditingInstitution(null);
      setFormData({
        name: '',
        type: 'pondok',
        description: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingInstitution(null);
    setFormData({
      name: '',
      type: 'pondok',
      description: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingInstitution) {
        await updateMutation.mutateAsync({
          id: editingInstitution.id,
          data: formData,
        });
        toast.success('Lembaga berhasil diupdate!');
      } else {
        await createMutation.mutateAsync(formData);
        toast.success('Lembaga berhasil ditambahkan!');
      }
      handleCloseModal();
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menyimpan lembaga');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus lembaga ini?')) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Lembaga berhasil dihapus!');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Gagal menghapus lembaga');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Institution Management</h2>
          <p className="text-sm text-gray-600 mt-1">Kelola data lembaga dan organisasi</p>
        </div>
        <Button onClick={() => handleOpenModal()} className="w-full sm:w-auto">
          <PlusIcon className="w-5 h-5 mr-2" />
          Tambah Lembaga
        </Button>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          <div className="col-span-full text-center py-12 text-gray-500">Loading...</div>
        ) : institutions.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">Belum ada lembaga</div>
        ) : (
          institutions.map((institution) => (
            <Card key={institution.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <BuildingOfficeIcon className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{institution.name}</h3>
                      <p className="text-xs text-gray-500">
                        {institutionTypes.find(t => t.value === institution.type)?.label || institution.type}
                      </p>
                    </div>
                  </div>
                </div>

                {institution.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{institution.description}</p>
                )}

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleOpenModal(institution)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <PencilIcon className="w-4 h-4 inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(institution.id)}
                    className="flex-1 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="w-4 h-4 inline mr-1" />
                    Hapus
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={handleCloseModal}></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingInstitution ? 'Edit Lembaga' : 'Tambah Lembaga Baru'}
                    </h3>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <Input
                      label="Nama Lembaga *"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Contoh: Pondok Pesantren Al-Hikmah"
                      required
                    />

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipe Lembaga *
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="input"
                        required
                      >
                        {institutionTypes.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="input min-h-[100px]"
                        placeholder="Deskripsi singkat tentang lembaga..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {editingInstitution ? 'Update' : 'Tambah'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseModal}
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionManagement;
