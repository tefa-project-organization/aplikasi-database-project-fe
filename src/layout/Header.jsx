import React from 'react'

export default function Header() {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 flex items-center px-6 shadow-sm">
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        Database Project Management
      </div>
      {/* nanti bisa tambahkan search / profile / notif di sini */}
    </header>
  )
}
