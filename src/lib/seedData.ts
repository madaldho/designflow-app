import { User, Institution, Project } from '@/types';

// Demo institutions
export const DEMO_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    name: 'SMA Negeri 1 Jakarta',
    type: 'sma',
    address: 'Jl. Gatot Subroto, Jakarta',
    phone: '021-1234567',
    email: 'sma1jkt@example.com',
  },
  {
    id: 'inst-2',
    name: 'Yayasan Bina Bangsa',
    type: 'yayasan',
    address: 'Jl. Ahmad Yani, Surabaya',
    phone: '031-7654321',
    email: 'binabangsa@example.com',
  },
  {
    id: 'inst-3',
    name: 'Pondok Pesantren Al-Qolam',
    type: 'pondok',
    address: 'Jl. KH. Ahmad, Bandung',
    phone: '022-9876543',
    email: 'alqolam@example.com',
  },
];

// Demo users with different roles
export const DEMO_USERS: User[] = [
  {
    id: 'user-admin-1',
    name: 'Admin System',
    email: 'admin@designflow.com',
    phone: '085678901234',
    roles: ['admin'],
    status: 'active',
    institutions: DEMO_INSTITUTIONS,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-designer-1',
    name: 'Siti Nurhaliza',
    email: 'designer@designflow.com',
    phone: '081987654321',
    roles: ['designer_internal'],
    status: 'active',
    institutions: [DEMO_INSTITUTIONS[0]],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-reviewer-1',
    name: 'Eka Putra',
    email: 'reviewer@designflow.com',
    phone: '083456789012',
    roles: ['reviewer'],
    status: 'active',
    institutions: [DEMO_INSTITUTIONS[0]],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-requester-1',
    name: 'Budi Santoso',
    email: 'requester@designflow.com',
    phone: '081234567890',
    roles: ['requester'],
    status: 'active',
    institutions: [DEMO_INSTITUTIONS[0]],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-designer-2',
    name: 'Ahmad Hidayat',
    email: 'ahmad@example.com',
    phone: '082123456789',
    roles: ['designer_external'],
    status: 'active',
    institutions: [DEMO_INSTITUTIONS[1]],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'user-approver-1',
    name: 'Dwi Cahyo',
    email: 'approver@example.com',
    phone: '084567890123',
    roles: ['approver'],
    status: 'active',
    institutions: [DEMO_INSTITUTIONS[0]],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
];

// Demo projects at various stages
export const DEMO_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    title: 'Desain Banner Acara Akhir Tahun',
    description: 'Banner untuk acara akhir tahun sekolah',
    type: 'baliho',
    size: '4m x 2m',
    quantity: 1,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'designing',
    version: 1,
    createdBy: DEMO_USERS[0],
    institution: DEMO_INSTITUTIONS[0],
    assignee: DEMO_USERS[1],
    reviewer: DEMO_USERS[3],
    approver: DEMO_USERS[4],
    attachments: [],
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: 'proj-2',
    title: 'Poster Kampanye Sanitasi',
    description: 'Poster untuk kampanye sanitasi lingkungan',
    type: 'poster',
    size: 'A2',
    quantity: 50,
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'ready_for_review',
    version: 2,
    createdBy: DEMO_USERS[2],
    institution: DEMO_INSTITUTIONS[1],
    assignee: DEMO_USERS[1],
    reviewer: DEMO_USERS[3],
    attachments: [],
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-22'),
  },
  {
    id: 'proj-3',
    title: 'Spanduk Undangan Workshop',
    description: 'Spanduk untuk undangan workshop teknologi',
    type: 'spanduk',
    size: '5m x 1m',
    quantity: 1,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    status: 'draft',
    version: 1,
    createdBy: DEMO_USERS[0],
    institution: DEMO_INSTITUTIONS[0],
    attachments: [],
    createdAt: new Date('2024-10-20'),
    updatedAt: new Date('2024-10-20'),
  },
  {
    id: 'proj-4',
    title: 'Brosur Program Beasiswa',
    description: 'Brosur informatif program beasiswa',
    type: 'brosur',
    size: 'A4',
    quantity: 1000,
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'approved_for_print',
    version: 3,
    createdBy: DEMO_USERS[0],
    institution: DEMO_INSTITUTIONS[0],
    assignee: DEMO_USERS[1],
    reviewer: DEMO_USERS[3],
    approver: DEMO_USERS[4],
    attachments: [],
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-19'),
  },
  {
    id: 'proj-5',
    title: 'Kartu Nama Identitas Sekolah',
    description: 'Kartu nama untuk staff sekolah',
    type: 'kartu_nama',
    size: '9cm x 5.5cm',
    quantity: 500,
    deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    status: 'picked_up',
    version: 1,
    createdBy: DEMO_USERS[0],
    institution: DEMO_INSTITUTIONS[0],
    assignee: DEMO_USERS[1],
    reviewer: DEMO_USERS[3],
    approver: DEMO_USERS[4],
    attachments: [],
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-10-15'),
  },
];

/**
 * Initialize localStorage with demo data
 */
export function initializeDemoData() {
  const hasData = localStorage.getItem('designflow_initialized');
  const dataVersion = localStorage.getItem('designflow_data_version');
  const CURRENT_VERSION = '1.1'; // Increment this when demo data changes
  
  if (!hasData || dataVersion !== CURRENT_VERSION) {
    // Always update users to ensure latest demo accounts are available
    localStorage.setItem('designflow_users', JSON.stringify(DEMO_USERS));
    localStorage.setItem('designflow_institutions', JSON.stringify(DEMO_INSTITUTIONS));
    
    // Only initialize projects if not exists
    if (!hasData) {
      localStorage.setItem('designflow_projects', JSON.stringify(DEMO_PROJECTS));
      localStorage.setItem('designflow_activities', JSON.stringify([]));
    }
    
    localStorage.setItem('designflow_initialized', 'true');
    localStorage.setItem('designflow_data_version', CURRENT_VERSION);
    
    console.log('✅ Demo data initialized (version ' + CURRENT_VERSION + ')');
  }
}

/**
 * Clear all demo data
 */
export function clearDemoData() {
  localStorage.removeItem('designflow_users');
  localStorage.removeItem('designflow_institutions');
  localStorage.removeItem('designflow_projects');
  localStorage.removeItem('designflow_activities');
  localStorage.removeItem('designflow_initialized');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  
  console.log('✅ Demo data cleared');
}

/**
 * Reset to fresh demo data
 */
export function resetDemoData() {
  clearDemoData();
  initializeDemoData();
  
  console.log('✅ Demo data reset');
}
