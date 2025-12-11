import { Outlet } from "react-router-dom"

export default function MainLayout() {
  return (
    <div className="min-h-screen flex">
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  )
}
