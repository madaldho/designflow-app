import React, { useState, useEffect } from 'react';

/**
 * DIAGNOSTIC PAGE - Untuk debug blank page / white screen issues
 * Ini halaman KHUSUS yang tidak depend ke AuthContext atau API
 * Jadi bisa detect masalah sebelum app fully load
 */

interface DiagnosticResult {
  test: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  message: string;
  details?: any;
}

const DiagnosticPage: React.FC = () => {
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>({});

  const addResult = (result: DiagnosticResult) => {
    setResults(prev => [...prev, result]);
  };

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);

    // Collect system info
    const info = {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      localStorage: typeof localStorage !== 'undefined',
      sessionStorage: typeof sessionStorage !== 'undefined',
    };
    setSystemInfo(info);

    // Test 1: Check if React loaded
    addResult({
      test: 'React Loaded',
      status: 'pass',
      message: 'React is running and rendering components',
    });

    // Test 2: Check localStorage
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      addResult({
        test: 'LocalStorage',
        status: 'pass',
        message: 'LocalStorage is accessible',
      });
    } catch (error: any) {
      addResult({
        test: 'LocalStorage',
        status: 'fail',
        message: 'LocalStorage is not accessible',
        details: error.message,
      });
    }

    // Test 3: Check environment variables
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5175';
    const hasEnvVars = !!import.meta.env.VITE_API_URL;
    
    addResult({
      test: 'Environment Variables',
      status: hasEnvVars ? 'pass' : 'warning',
      message: hasEnvVars 
        ? `API URL configured: ${apiUrl}`
        : `Using default API URL: ${apiUrl}`,
      details: {
        VITE_API_URL: apiUrl,
        MODE: import.meta.env.MODE,
        DEV: import.meta.env.DEV,
        PROD: import.meta.env.PROD,
      },
    });

    // Test 4: Check backend health
    try {
      const healthUrl = `${apiUrl}/health`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(healthUrl, { 
        signal: controller.signal,
        method: 'GET',
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        addResult({
          test: 'Backend Server',
          status: 'pass',
          message: `Backend is running at ${apiUrl}`,
          details: data,
        });
      } else {
        addResult({
          test: 'Backend Server',
          status: 'fail',
          message: `Backend responded with status ${response.status}`,
          details: { status: response.status, url: healthUrl },
        });
      }
    } catch (error: any) {
      addResult({
        test: 'Backend Server',
        status: 'fail',
        message: error.name === 'AbortError' 
          ? 'Backend server timeout (not responding)'
          : 'Cannot connect to backend server',
        details: {
          error: error.message,
          url: apiUrl,
          suggestion: 'Run: npm run server',
        },
      });
    }

    // Test 5: Check authentication token
    const token = localStorage.getItem('designflow_token');
    const userStr = localStorage.getItem('designflow_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        addResult({
          test: 'Authentication',
          status: 'pass',
          message: `Logged in as ${user.name || user.email}`,
          details: {
            userId: user.id,
            email: user.email,
            role: user.role,
            hasToken: true,
          },
        });
      } catch (error) {
        addResult({
          test: 'Authentication',
          status: 'warning',
          message: 'Invalid user data in localStorage',
          details: { suggestion: 'Try logging in again' },
        });
      }
    } else {
      addResult({
        test: 'Authentication',
        status: 'warning',
        message: 'Not logged in',
        details: { suggestion: 'Go to /login to authenticate' },
      });
    }

    // Test 6: Test API with authentication
    if (token) {
      try {
        const projectsUrl = `${apiUrl}/api/projects`;
        const response = await fetch(projectsUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          addResult({
            test: 'API Data Fetch',
            status: 'pass',
            message: `Successfully fetched projects (${data.projects?.length || 0} found)`,
            details: { count: data.projects?.length || 0 },
          });
        } else if (response.status === 401) {
          addResult({
            test: 'API Data Fetch',
            status: 'warning',
            message: 'Token expired or invalid',
            details: { suggestion: 'Please login again' },
          });
        } else {
          addResult({
            test: 'API Data Fetch',
            status: 'fail',
            message: `API returned status ${response.status}`,
          });
        }
      } catch (error: any) {
        addResult({
          test: 'API Data Fetch',
          status: 'fail',
          message: 'Failed to fetch data from API',
          details: error.message,
        });
      }
    }

    // Test 7: Check for common errors in console
    const consoleErrors: string[] = [];
    const originalError = console.error;
    console.error = (...args: any[]) => {
      consoleErrors.push(args.join(' '));
      originalError.apply(console, args);
    };

    addResult({
      test: 'Console Errors',
      status: consoleErrors.length === 0 ? 'pass' : 'warning',
      message: consoleErrors.length === 0 
        ? 'No console errors detected'
        : `${consoleErrors.length} console errors detected`,
      details: consoleErrors,
    });

    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass':
        return <span className="text-green-500 text-2xl">✓</span>;
      case 'fail':
        return <span className="text-red-500 text-2xl">✗</span>;
      case 'warning':
        return <span className="text-yellow-500 text-2xl">⚠</span>;
      default:
        return <span className="text-gray-400 text-2xl">○</span>;
    }
  };

  const getStatusColor = (status: DiagnosticResult['status']) => {
    switch (status) {
      case 'pass': return 'border-green-500 bg-green-50';
      case 'fail': return 'border-red-500 bg-red-50';
      case 'warning': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const passCount = results.filter(r => r.status === 'pass').length;
  const failCount = results.filter(r => r.status === 'fail').length;
  const warningCount = results.filter(r => r.status === 'warning').length;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔍 System Diagnostics
          </h1>
          <p className="text-gray-600">
            This page helps identify why your app might show a blank page
          </p>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-gray-900">{results.length}</div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-green-600">{passCount}</div>
            <div className="text-sm text-gray-600">Passed</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-yellow-600">{warningCount}</div>
            <div className="text-sm text-gray-600">Warnings</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-3xl font-bold text-red-600">{failCount}</div>
            <div className="text-sm text-gray-600">Failed</div>
          </div>
        </div>

        {/* Run Button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={runDiagnostics}
            disabled={isRunning}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isRunning ? 'Running Diagnostics...' : 'Run Diagnostics Again'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.map((result, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${getStatusColor(result.status)}`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(result.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {result.test}
                  </h3>
                  <p className="text-gray-700 mb-2">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                        Show details
                      </summary>
                      <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Information</h2>
          <pre className="text-xs bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(systemInfo, null, 2)}
          </pre>
        </div>

        {/* Quick Fixes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            🛠️ Quick Fixes for Blank Page
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                1. Backend Not Running:
              </h3>
              <code className="block bg-blue-100 p-2 rounded">npm run server</code>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                2. Database Empty:
              </h3>
              <code className="block bg-blue-100 p-2 rounded">npm run server:seed</code>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                3. Clear Cache & Refresh:
              </h3>
              <code className="block bg-blue-100 p-2 rounded">
                Ctrl + Shift + R (or Cmd + Shift + R on Mac)
              </code>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                4. Clear LocalStorage:
              </h3>
              <code className="block bg-blue-100 p-2 rounded">
                localStorage.clear(); window.location.reload();
              </code>
              <p className="text-xs text-blue-700 mt-1">
                Run this in Browser Console (F12 → Console tab)
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">
                5. Check Browser Console:
              </h3>
              <p className="text-blue-800">
                Press F12 → Console tab to see JavaScript errors
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-6 flex gap-4">
          <a
            href="/"
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-700 text-center"
          >
            ← Back to Home
          </a>
          <a
            href="/login"
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 text-center"
          >
            Go to Login →
          </a>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticPage;
