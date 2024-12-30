import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderOpen, Users, ArrowLeftRight, DollarSign, FileText, Building2 } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: FolderOpen },
  { name: 'Entities', href: '/entities', icon: Users },
  { name: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { name: 'Fees', href: '/fees', icon: DollarSign },
  { name: 'Documents', href: '/documents', icon: FileText },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 bg-black/20 backdrop-blur-xl border-r border-white/10">
          <div className="flex h-16 items-center gap-3 px-6 border-b border-white/10">
            <Building2 className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                EquiTie Portal
              </h1>
              <p className="text-xs text-blue-300/80">Investment Administration</p>
            </div>
          </div>
          <nav className="space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-100 shadow-lg shadow-blue-900/20'
                      : 'text-blue-100/70 hover:bg-blue-500/10 hover:text-blue-100'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-colors ${
                    isActive ? 'text-blue-400' : 'text-blue-500/50'
                  }`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}