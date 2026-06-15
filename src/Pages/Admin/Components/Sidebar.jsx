import { NavLink } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; // Add this import

const Sidebar = () => {
  const { user } = useAuthStateContext(); // Get user from context

  const hasPermission = (permission) => {
    return user?.permission?.includes(permission); // Check if user has specific permission
  };

  return (
    <aside className="bg-blue-800 text-white min-h-screen transition-all duration-300 w-20 lg:w-64">
      <div className="p-4 border-b border-blue-700">
        <span className="text-2xl font-bold hidden lg:block">Admin</span>
      </div>
      <nav className="p-4 space-y-2">
        {/* Only show Dashboard if user has dashboard.page permission */}
        {hasPermission("dashboard.page") && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🏠</span>
            <span className="menu-text hidden lg:inline">Dashboard</span>
          </NavLink>
        )}

        {/* Only show Mahasiswa if user has mahasiswa.page permission */}
        {hasPermission("mahasiswa.page") && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded ${
                isActive ? "bg-blue-700" : "hover:bg-blue-700"
              }`
            }
          >
            <span>🎓</span>
            <span className="menu-text hidden lg:inline">Mahasiswa</span>
          </NavLink>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;