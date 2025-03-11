import React, { useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Car, MessageSquare, HelpCircle, LogOut, LayoutDashboard, Newspaper, Inbox } from 'lucide-react';
import { useAuth } from '../../lib/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const location = useLocation();

  // Verify authentication on mount
  useEffect(() => {
    if (!user) {
      console.log('No user found in AdminLayout, redirecting to login');
      navigate('/admin/login', { replace: true });
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === `/admin${path}` ? 'text-red-500 border-red-500' : 'text-gray-500 border-transparent hover:text-gray-700 dark:hover:text-gray-300';
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link to="/admin" className="text-xl font-bold text-gray-900 dark:text-white">
                  SGV Auto Admin
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('')}`}
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Дашборд
                </Link>
                <Link
                  to="/admin/cars"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/cars')}`}
                >
                  <Car className="w-4 h-4 mr-2" />
                  Автомобили
                </Link>
                <Link
                  to="/admin/news"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/news')}`}
                >
                  <Newspaper className="w-4 h-4 mr-2" />
                  Новости
                </Link>
                <Link
                  to="/admin/reviews"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/reviews')}`}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Отзывы
                </Link>
                <Link
                  to="/admin/faq"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/faq')}`}
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  FAQ
                </Link>
                <Link
                  to="/admin/submissions"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive('/submissions')}`}
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  Заявки
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleSignOut}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}