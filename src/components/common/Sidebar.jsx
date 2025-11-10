import React from 'react';

const Sidebar = ({ isOpen, onClose, children }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50
        w-80 lg:w-80 xl:w-96 flex-shrink-0 bg-white lg:bg-transparent
        transition-transform duration-300 ease-in-out lg:transition-none
        lg:block
      `}>
        <div className="bg-white rounded-2xl lg:rounded-2xl shadow-sm border border-slate-200 p-4 md:p-6 h-full lg:h-auto lg:max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Authors</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default Sidebar;