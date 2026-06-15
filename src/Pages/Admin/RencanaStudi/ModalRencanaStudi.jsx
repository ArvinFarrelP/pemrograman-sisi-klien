const ModalRencanaStudi = ({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  form,
  dosen,
  mataKuliah,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Tambah Kelas Baru</h2>

          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-4 space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Mata Kuliah
            </label>

            <select
              name="mata_kuliah_id"
              value={form.mata_kuliah_id}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Mata Kuliah --</option>
              {mataKuliah.map((mk) => (
                <option key={mk.id} value={mk.id}>
                  {mk.name || mk.nama} ({mk.sks} SKS)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Dosen Pengampu
            </label>

            <select
              name="dosen_id"
              value={form.dosen_id}
              onChange={onChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">-- Pilih Dosen --</option>
              {dosen.map((dsn) => (
                <option key={dsn.id} value={dsn.id}>
                  {dsn.name || dsn.nama} - Max {dsn.max_sks} SKS
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalRencanaStudi;