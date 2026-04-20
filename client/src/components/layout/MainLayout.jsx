import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  LayoutDashboard, Search, FileText, User, LogOut,
  Briefcase, PlusCircle, Users, Settings
} from 'lucide-react'

const studentNav = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/internships', label: 'Offres de stage', icon: Search },
  { to: '/student/applications', label: 'Mes candidatures', icon: FileText },
  { to: '/student/profile', label: 'Mon profil', icon: User },
]

const companyNav = [
  { to: '/company', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/company/post', label: 'Publier une offre', icon: PlusCircle },
  { to: '/company/applications', label: 'Candidatures', icon: Users },
  { to: '/company/profile', label: 'Profil entreprise', icon: Briefcase },
]

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
  { to: '/admin/settings', label: 'Paramètres', icon: Settings },
]

export default function MainLayout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const navItems =
    user?.role === 'STUDENT' ? studentNav :
    user?.role === 'COMPANY' ? companyNav : adminNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-primary-600">InternLab</h1>
          <p className="text-xs text-gray-500 mt-1">
            {user?.role === 'STUDENT' ? '🎓 Étudiant' :
             user?.role === 'COMPANY' ? '🏢 Entreprise' : '⚙️ Admin'}
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3 px-3">
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-sm font-bold">
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}