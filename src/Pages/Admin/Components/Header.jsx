import { useNavigate } from "react-router-dom"; // Add this import
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; // Add this import
import Button from "@/Pages/Admin/Components/Button";

import { confirmLogout } from "@/Utils/Helpers/SwalHelpers";
import { toastSuccess } from "@/Utils/Helpers/ToastHelpers";

const Header = () => {
  const navigate = useNavigate(); // Add this for navigation
  const { user, setUser } = useAuthStateContext(); // Add this to get user and setUser from context

  const toggleProfileMenu = () => {
    const menu = document.getElementById("profileMenu");
    if (menu) menu.classList.toggle("hidden");
  };

  const handleLogout = () => {
    confirmLogout(() => {
      setUser(null); // Replace localStorage.removeItem with setUser(null)
      toastSuccess("Logout berhasil!");

      setTimeout(() => {
        navigate("/"); // Replace location.href with navigate
      }, 800);
    });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Mahasiswa
        </h1>

        <div className="flex items-center gap-4">
          {/* Add role display */}
          <span className="text-sm text-gray-600">
            Login sebagai: <strong>{user?.role}</strong>
          </span>

          <div className="relative">
            <Button
              onClick={toggleProfileMenu}
              className="w-8 h-8 rounded-full bg-gray-300 focus:outline-none"
            />

            <div
              id="profileMenu"
              className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-2 hidden"
            >
              <a
                href="#"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </a>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;