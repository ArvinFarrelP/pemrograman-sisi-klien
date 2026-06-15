const MahasiswaTable = ({ mahasiswa, openEditModal, onDelete }) => {
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
              <button
                onClick={() => openEditModal(mhs)}
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={() => onDelete(mhs.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Hapus
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MahasiswaTable;