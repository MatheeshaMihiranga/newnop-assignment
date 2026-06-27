import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar  from './Navbar';

interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function AppLayout({ title, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-dark-900 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Navbar title={title} onMenuToggle={() => setSidebarOpen((p) => !p)} />
        <main className="flex-1 overflow-y-auto p-5 md:p-7 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
