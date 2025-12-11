import React from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Sidebar() {
  const { pathname } = useLocation()

  const menus = [
    { name: 'Dashboard', path: '/' },
    // tambahkan menu lain di sini saat page sudah dibuat
  ]

  return (
    <aside className="w-64 bg-gray-50 dark:bg-gray-800 min-h-screen p-4 border-r">
      <div className="mb-6 px-2">
        <div className="text-xl font-bold">Project</div>
        <div className="text-sm text-gray-500">Management</div>
      </div>

      <nav className="space-y-1">
        {menus.map((m) => {
          const active = pathname === m.path
          return (
            <Link
              key={m.path}
              to={m.path}
              className={`block px-4 py-2 rounded-md font-medium ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {m.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
