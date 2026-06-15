const TableRencanaStudi = ({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  selectedMhs,
  setSelectedMhs,
  selectedDsn,
  setSelectedDsn,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleDeleteKelas,
  getTotalSksMahasiswa,
  hasPermission,
}) => {
  return (
    <div className="space-y-6">
      {kelas.length === 0 && (
        <p className="text-center text-gray-500">Belum ada kelas.</p>
      )}

      {kelas.map((kelasItem) => {
        const matkul = mataKuliah.find(
          (mk) => String(mk.id) === String(kelasItem.mata_kuliah_id)
        );

        const dosenPengampu = dosen.find(
          (dsn) => String(dsn.id) === String(kelasItem.dosen_id)
        );

        const mahasiswaIds = kelasItem.mahasiswa_ids ?? [];

        const mahasiswaDalamKelas = mahasiswaIds
          .map((id) =>
            mahasiswa.find((mhs) => String(mhs.id) === String(id))
          )
          .filter(Boolean);

        return (
          <div key={kelasItem.id} className="border rounded shadow bg-white">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 px-4 py-3 border-b bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold">
                  {matkul?.name || matkul?.nama || "-"} ({matkul?.sks || 0} SKS)
                </h3>
                <p className="text-sm text-gray-600">
                  Dosen: <strong>{dosenPengampu?.name || dosenPengampu?.nama || "-"}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {hasPermission("rencana-studi.update") && (
                  <>
                    <select
                      value={selectedDsn[kelasItem.id] || ""}
                      onChange={(e) =>
                        setSelectedDsn({
                          ...selectedDsn,
                          [kelasItem.id]: e.target.value,
                        })
                      }
                      className="border rounded px-3 py-2 text-sm"
                    >
                      <option value="">-- Ganti Dosen --</option>
                      {dosen.map((dsn) => (
                        <option key={dsn.id} value={dsn.id}>
                          {dsn.name || dsn.nama} - Max {dsn.max_sks} SKS
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => handleChangeDosen(kelasItem)}
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Simpan
                    </button>
                  </>
                )}

                {hasPermission("rencana-studi.delete") &&
                  mahasiswaDalamKelas.length === 0 && (
                    <button
                      onClick={() => handleDeleteKelas(kelasItem.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600"
                    >
                      Hapus Kelas
                    </button>
                  )}
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="p-2">No</th>
                  <th className="p-2">Nama</th>
                  <th className="p-2">NIM</th>
                  <th className="p-2">Max SKS</th>
                  <th className="p-2">SKS Diambil</th>
                  <th className="p-2">Aksi</th>
                </tr>
              </thead>

              <tbody>
                {mahasiswaDalamKelas.length > 0 ? (
                  mahasiswaDalamKelas.map((mhs, index) => (
                    <tr key={mhs.id} className="border-b text-center">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{mhs.name || mhs.nama}</td>
                      <td className="p-2">{mhs.nim}</td>
                      <td className="p-2">{mhs.max_sks || "-"}</td>
                      <td className="p-2">{getTotalSksMahasiswa(mhs.id)}</td>
                      <td className="p-2">
                        {hasPermission("rencana-studi.delete") && (
                          <button
                            onClick={() =>
                              handleDeleteMahasiswa(kelasItem, mhs.id)
                            }
                            className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                          >
                            Hapus
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-3 text-center italic text-gray-500"
                    >
                      Belum ada mahasiswa.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {hasPermission("rencana-studi.update") && (
              <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t bg-gray-50">
                <select
                  value={selectedMhs[kelasItem.id] || ""}
                  onChange={(e) =>
                    setSelectedMhs({
                      ...selectedMhs,
                      [kelasItem.id]: e.target.value,
                    })
                  }
                  className="border rounded px-3 py-2 text-sm"
                >
                  <option value="">-- Pilih Mahasiswa --</option>
                  {mahasiswa.map((mhs) => (
                    <option key={mhs.id} value={mhs.id}>
                      {mhs.name || mhs.nama} ({mhs.nim}) - Max {mhs.max_sks || 0} SKS
                    </option>
                  ))}
                </select>

                <button
                  onClick={() =>
                    handleAddMahasiswa(
                      kelasItem,
                      selectedMhs[kelasItem.id]
                    )
                  }
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  Tambah Mahasiswa
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TableRencanaStudi;