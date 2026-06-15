import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete, isLoading }) => {
  const { user } = useAuthStateContext();

  const hasPermission = (permission) => {
    return user?.permission?.includes(permission);
  };

  // Show loading state
  if (isLoading) {
    return <p className="text-center py-4">Memuat data...</p>;
  }

  // Show empty state
  if (mahasiswa.length === 0) {
    return <p className="text-center py-4">Data tidak ditemukan.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="p-2">NIM</th>
          <th className="p-2">Nama</th>
          <th className="p-2">Status</th>
          <th className="p-2">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {mahasiswa.map((mhs) => (
          <tr key={mhs.id} className="border-b text-center">
            <td className="p-2">{mhs.nim}</td>
            <td className="p-2">{mhs.nama}</td>
            <td className="p-2">{mhs.status ? "Aktif" : "Nonaktif"}</td>
            <td className="p-2 space-x-2">
              {/* Only show Edit button if user has mahasiswa.update permission */}
              {hasPermission("mahasiswa.update") && (
                <button
                  onClick={() => openEditModal(mhs)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
              )}

              {/* Only show Delete button if user has mahasiswa.delete permission */}
              {hasPermission("mahasiswa.delete") && (
                <button
                  onClick={() => onDelete(mhs.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Hapus
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;