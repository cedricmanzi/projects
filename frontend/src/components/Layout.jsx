import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      {/* Fixed Stable Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content - Positioned on the right side with fixed margin */}
      <main className={`min-h-screen ${showSidebar ? 'ml-64' : ''}`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
