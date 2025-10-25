import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/globals.css';

// Import error boundary
import ErrorBoundary from './components/ErrorBoundary';

// Import seed data utilities
import { resetDemoData, clearDemoData, initializeDemoData } from './lib/seedData';

// Expose utilities to window for debugging
if (typeof window !== 'undefined') {
  (window as any).DesignFlowDebug = {
    resetDemoData,
    clearDemoData,
    initializeDemoData,
    showUsers: () => {
      const users = JSON.parse(localStorage.getItem('designflow_users') || '[]');
      console.table(users.map((u: any) => ({
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status
      })));
      return users;
    },
    showProjects: () => {
      const projects = JSON.parse(localStorage.getItem('designflow_projects') || '[]');
      console.table(projects.map((p: any) => ({
        title: p.title,
        status: p.status,
        type: p.type,
        createdBy: p.createdBy.name
      })));
      return projects;
    }
  };
  console.log('🔧 DesignFlow Debug utilities available:');
  console.log('  - DesignFlowDebug.resetDemoData() - Reset semua data demo');
  console.log('  - DesignFlowDebug.clearDemoData() - Hapus semua data');
  console.log('  - DesignFlowDebug.showUsers() - Tampilkan daftar user');
  console.log('  - DesignFlowDebug.showProjects() - Tampilkan daftar project');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
