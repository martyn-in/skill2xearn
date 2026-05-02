import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AssistantChat from './AssistantChat';
import ProfileModal from './ProfileModal';
import './Layout.css';

const Layout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
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
