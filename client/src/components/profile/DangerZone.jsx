import React, { useState } from 'react';
import { AlertTriangle, LogOut, Trash2, X } from 'lucide-react';

const DangerZone = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null,
    title: '',
    description: '',
    confirmText: '',
  });

  const openModal = (type) => {
    if (type === 'logoutAll') {
      setModalState({
        isOpen: true,
        type: 'logoutAll',
        title: 'Log out of all devices',
        description: 'Are you sure you want to log out of all other devices? You will be signed out everywhere except this current session.',
        confirmText: 'Log Out All Devices'
      });
    } else if (type === 'deleteAccount') {
      setModalState({
        isOpen: true,
        type: 'deleteAccount',
        title: 'Delete Account',
        description: 'Are you sure you want to delete your account? This action is permanent and cannot be undone. All your data, polls, and settings will be permanently removed.',
        confirmText: 'Yes, Delete My Account'
      });
    }
  };

  const closeModal = () => {
    setModalState({ ...modalState, isOpen: false });
  };

  const handleConfirm = () => {
    // Placeholder for actual API call
    console.log(`Action confirmed: ${modalState.type}`);
    closeModal();
  };

  return (
    <div className="space-y-6 mt-10">
      <div>
        <h3 className="text-lg font-medium text-red-600 dark:text-red-500 flex items-center gap-2">
          <AlertTriangle size={20} />
          Danger Zone
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Irreversible and destructive actions for your account.
        </p>
      </div>

      <div className="border border-red-200 dark:border-red-900/50 rounded-2xl overflow-hidden bg-red-50/30 dark:bg-red-950/10">
        
        {/* Logout All Devices */}
        <div className="p-5 sm:p-6 border-b border-red-200/60 dark:border-red-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Log out of all devices
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Sign out from all other active sessions across your devices.
            </p>
          </div>
          <button
            onClick={() => openModal('logoutAll')}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors text-sm shadow-sm cursor-pointer"
          >
            <LogOut size={16} />
            Log Out All
          </button>
        </div>

        {/* Delete Account */}
        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              Delete Account
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Permanently delete your account and all associated data.
            </p>
          </div>
          <button
            onClick={() => openModal('deleteAccount')}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm shadow-sm focus:ring-4 focus:ring-red-500/20 cursor-pointer"
          >
            <Trash2 size={16} />
            Delete Account
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full shrink-0">
                    <AlertTriangle size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {modalState.title}
                  </h3>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="mt-4 sm:ml-14">
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {modalState.description}
                </p>
              </div>

              <div className="mt-8 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:ml-14">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm w-full sm:w-auto cursor-pointer shadow-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm w-full sm:w-auto focus:ring-4 focus:ring-red-500/20 cursor-pointer shadow-sm"
                >
                  {modalState.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerZone;
