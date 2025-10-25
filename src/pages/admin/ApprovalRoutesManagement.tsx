import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { 
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ApprovalRoute {
  id: string;
  name: string;
  description: string;
  projectTypes: string[];
  steps: {
    order: number;
    role: string;
    action: string;
    required: boolean;
  }[];
  active: boolean;
}

const ApprovalRoutesManagement: React.FC = () => {
  const [routes, setRoutes] = useState<ApprovalRoute[]>([
    {
      id: '1',
      name: 'Standard Approval',
      description: 'Alur approval standar untuk semua jenis project',
      projectTypes: ['spanduk', 'baliho', 'poster'],
      steps: [
        { order: 1, role: 'reviewer', action: 'Review Desain', required: true },
        { order: 2, role: 'approver', action: 'Final Approval', required: true },
      ],
      active: true,
    },
    {
      id: '2',
      name: 'Fast Track',
      description: 'Approval cepat untuk project urgent',
      projectTypes: ['kartu_nama', 'id_card'],
      steps: [
        { order: 1, role: 'approver', action: 'Quick Approval', required: true },
      ],
      active: true,
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingRoute, setEditingRoute] = useState<ApprovalRoute | null>(null);

  const handleEdit = (route: ApprovalRoute) => {
    setEditingRoute(route);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Yakin ingin menghapus approval route ini?')) return;
    
    setRoutes(routes.filter(r => r.id !== id));
    toast.success('Approval route berhasil dihapus');
  };

  const handleToggleActive = (id: string) => {
    setRoutes(routes.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
    const route = routes.find(r => r.id === id);
    toast.success(`Approval route ${route?.active ? 'dinonaktifkan' : 'diaktifkan'}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Approval Routes</h2>
          <p className="text-gray-600 mt-1">
            Kelola alur persetujuan untuk berbagai jenis project
          </p>
        </div>
        <Button onClick={() => { setEditingRoute(null); setShowModal(true); }}>
          <PlusIcon className="w-5 h-5 mr-2" />
          Tambah Route
        </Button>
      </div>

      <div className="grid gap-4">
        {routes.map((route) => (
          <Card key={route.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <CardTitle>{route.name}</CardTitle>
                    <Badge variant={route.active ? 'success' : 'default'}>
                      {route.active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{route.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(route)}
                  >
                    <PencilSquareIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(route.id)}
                  >
                    <TrashIcon className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Jenis Project:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {route.projectTypes.map((type) => (
                      <Badge key={type} variant="gray">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Langkah Approval:
                  </p>
                  <div className="space-y-2">
                    {route.steps.map((step) => (
                      <div 
                        key={step.order}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-primary-600">
                            {step.order}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {step.action}
                          </p>
                          <p className="text-xs text-gray-600">
                            Role: {step.role}
                            {step.required && ' • Wajib'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleActive(route.id)}
                  >
                    {route.active ? 'Nonaktifkan' : 'Aktifkan'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {routes.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <ClipboardDocumentListIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Belum Ada Approval Route
            </h3>
            <p className="text-gray-600 mb-4">
              Buat approval route pertama untuk mengatur alur persetujuan
            </p>
            <Button onClick={() => { setEditingRoute(null); setShowModal(true); }}>
              <PlusIcon className="w-5 h-5 mr-2" />
              Tambah Route
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal Add/Edit - Placeholder */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75" 
              onClick={() => setShowModal(false)}
            ></div>
            <div className="relative bg-white rounded-lg p-6 max-w-2xl w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingRoute ? 'Edit Approval Route' : 'Tambah Approval Route'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Form untuk tambah/edit route akan tersedia segera.
                Data saat ini disimpan di state lokal untuk demo.
              </p>
              <Button onClick={() => setShowModal(false)} fullWidth>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalRoutesManagement;
