import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdminControls = () => {
  const { logout, isAdmin, adminEmail } = useAuth();

  if (!isAdmin) return null;

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <span className="font-semibold text-yellow-800">Admin Mode</span>
            <div className="text-sm text-yellow-600">Logged in as: {adminEmail}</div>
          </div>
          <span className="text-sm text-yellow-600">Full CRUD access enabled</span>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
        >
          Logout Admin
        </button>
      </div>
    </div>
  );
};

export default AdminControls;