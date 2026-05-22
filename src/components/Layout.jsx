import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AssistantChat from './AssistantChat';
import ProfileModal from './ProfileModal';
import { useAppContext } from '../context/AppContext';
import './Layout.css';

const Layout = () => {
  const { isSidebarOpen, setIsSidebarOpen } = useAppContext();

  return (
    <div className="app-layout">
      <Sidebar />
      {/* Mobile overlay to close sidebar on tap */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <div className="main-content-wrapper">
        <Topbar />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
      <AssistantChat />
      <ProfileModal />
    </div>
  );
};

export default Layout;
