import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api.service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';

const DebugPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [checks, setChecks] = useState({
    auth: { status: 'pending', message: '' },
    backend: { status: 'pending', message: '' },
    database: { status: 'pending', message: '' },
    projects: { status: 'pending', message: '', count: 0 },
    institutions: { status: 'pending', message: '', count: 0 },
    users: { status: 'pending', message: '', count: 0 },
  });
  const [loading, setLoading] = useState(false);

  const runChecks = async () => {
    setLoading(true);
    const newChecks = { ...checks };

    // Check 1: Authentication
    try {
      if (isAuthenticated && user) {
        newChecks.auth = {
          status: 'success',
          message: `Logged in as ${user.name} (${user.role})`,
        };
      } else {
        newChecks.auth = {
          status: 'error',
          message: 'Not authenticated',
        };
      }
    } catch (error: any) {
      newChecks.auth = {
        status: 'error',
        message: error.message,
      };
    }

    // Check 2: Backend Health
    try {
      const response = await fetch('http://localhost:5175/health');
      if (response.ok) {
        const data = await response.json();
        newChecks.backend = {
          status: 'success',
          message: `Backend running - ${data.status}`,
        };
      } else {
        throw new Error('Backend responded with error');
      }
    } catch (error: any) {
      newChecks.backend = {
        status: 'error',
        message: 'Cannot connect to backend server',
      };
    }

    // If backend is up and user is authenticated, check data
    if (newChecks.backend.status === 'success' && isAuthenticated) {
      // Check 3: Database connection (via projects endpoint)
      try {
        const response = await apiService.getProjects();
        newChecks.database = {
          status: 'success',
          message: 'Database connected',
        };
        newChecks.projects = {
          status: 'success',
          message: `${response.projects.length} projects found`,
          count: response.projects.length,
        };
      } catch (error: any) {
        newChecks.database = {
          status: 'error',
          message: error.message || 'Database connection failed',
        };
        newChecks.projects = {
          status: 'error',
          message: 'Could not fetch projects',
          count: 0,
        };
      }

      // Check 4: Institutions
      try {
        const response = await apiService.getInstitutions();
        newChecks.institutions = {
          status: 'success',
          message: `${response.institutions.length} institutions found`,
          count: response.institutions.length,
        };
      } catch (error: any) {
        newChecks.institutions = {
          status: 'error',
          message: error.message || 'Could not fetch institutions',
          count: 0,
        };
      }

      // Check 5: Users (if admin)
      if (user?.role === 'admin') {
        try {
          const response = await apiService.getUsers();
          newChecks.users = {
            status: 'success',
            message: `${response.users.length} users found`,
            count: response.users.length,
          };
        } catch (error: any) {
          newChecks.users = {
            status: 'error',
            message: error.message || 'Could not fetch users',
            count: 0,
          };
        }
      }
    }

    setChecks(newChecks);
    setLoading(false);
  };

  useEffect(() => {
    runChecks();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-6 h-6 text-red-500" />;
      default:
        return <ClockIcon className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">OK</Badge>;
      case 'error':
        return <Badge variant="danger">ERROR</Badge>;
      default:
        return <Badge variant="secondary">Checking...</Badge>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">System Debug</h1>
        <p className="text-gray-600">
          This page helps diagnose issues with your DesignFlow application
        </p>
      </div>

      <div className="mb-6 flex gap-4">
        <Button
          onClick={runChecks}
          disabled={loading}
          leftIcon={<ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />}
        >
          {loading ? 'Checking...' : 'Run Checks Again'}
        </Button>
      </div>

      <div className="space-y-4">
        {/* Authentication Check */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.auth.status)}
                <CardTitle>Authentication</CardTitle>
              </div>
              {getStatusBadge(checks.auth.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{checks.auth.message}</p>
            {user && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(user, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Backend Check */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.backend.status)}
                <CardTitle>Backend Server</CardTitle>
              </div>
              {getStatusBadge(checks.backend.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{checks.backend.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Expected: http://localhost:5175
            </p>
            {checks.backend.status === 'error' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠ Backend Not Running
                </p>
                <p className="text-sm text-red-700">
                  Open a terminal and run: <code className="bg-red-100 px-2 py-1 rounded">npm run server</code>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Check */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.database.status)}
                <CardTitle>Database Connection</CardTitle>
              </div>
              {getStatusBadge(checks.database.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{checks.database.message}</p>
            {checks.database.status === 'error' && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠ Database Issue
                </p>
                <p className="text-sm text-red-700">
                  Check if database migrations are applied and database is seeded.
                </p>
                <pre className="text-xs bg-red-100 p-2 rounded mt-2">
                  npx prisma migrate deploy{'\n'}
                  npm run server:seed
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Projects Check */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.projects.status)}
                <CardTitle>Projects Data</CardTitle>
              </div>
              {getStatusBadge(checks.projects.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{checks.projects.message}</p>
            {checks.projects.status === 'success' && checks.projects.count === 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 font-medium mb-2">
                  ⚠ No Projects Found
                </p>
                <p className="text-sm text-yellow-700">
                  Database is connected but empty. Run seed to add demo data:
                </p>
                <pre className="text-xs bg-yellow-100 p-2 rounded mt-2">
                  npm run server:seed
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Institutions Check */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(checks.institutions.status)}
                <CardTitle>Institutions Data</CardTitle>
              </div>
              {getStatusBadge(checks.institutions.status)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{checks.institutions.message}</p>
          </CardContent>
        </Card>

        {/* Users Check (Admin only) */}
        {user?.role === 'admin' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(checks.users.status)}
                  <CardTitle>Users Data</CardTitle>
                </div>
                {getStatusBadge(checks.users.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{checks.users.message}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Fix Guide */}
      <Card className="mt-8 border-2 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">Quick Fix Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              1. Backend not running:
            </h3>
            <pre className="text-sm bg-blue-100 p-3 rounded">npm run server</pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              2. Database empty or not migrated:
            </h3>
            <pre className="text-sm bg-blue-100 p-3 rounded">
              npx prisma migrate deploy{'\n'}
              npm run server:seed
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              3. Frontend not loading:
            </h3>
            <pre className="text-sm bg-blue-100 p-3 rounded">npm run dev</pre>
          </div>
          
          <div>
            <h3 className="font-semibold text-blue-900 mb-2">
              4. Quick start everything:
            </h3>
            <pre className="text-sm bg-blue-100 p-3 rounded">quick-start.bat</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPage;
