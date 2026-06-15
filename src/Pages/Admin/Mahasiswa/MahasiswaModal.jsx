import { useEffect, useState } from "react";
import { toastError } from "../../../Utils/Helpers/ToastHelpers";

const MahasiswaModal = ({
  isModalOpen,
  onClose,
  onSubmit,
  selectedMahasiswa,
}) => {
  const [form, setForm] = useState({
    nim: "",
    nama: "",
    status: true,
  });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm({
        id: selectedMahasiswa.id,
        nim: selectedMahasiswa.nim,
        nama: selectedMahasiswa.nama,
        status: selectedMahasiswa.status,
      });
    } else {
      setForm({
        nim: "",
        nama: "",
        status: true,
      });
    }
  }, [selectedMahasiswa, isModalOpen]);

  if (!isModalOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.nim || !form.nama) {
      toastError("NIM dan nama wajib diisi");
      return;
    }

    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          <h2 className="text-lg font-semibold">
            {selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-red-500"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nim" className="mb-1 block text-sm font-medium">
              NIM
            </label>
            <input
              id="nim"
              type="text"
              name="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={!!selectedMahasiswa}
              placeholder="Masukkan NIM"
              className="w-full rounded border px-3 py-2 outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="nama" className="mb-1 block text-sm font-medium">
              Nama
            </label>
            <input
              id="nama"
              type="text"
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan Nama"
              className="w-full rounded border px-3 py-2 outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-1 block text-sm font-medium">
              Status
            </label>
            <label className="mt-2 flex items-center gap-2">
              <input
                id="status"
                type="checkbox"
                name="status"
                checked={form.status}
                onChange={handleChange}
              />
              <span>{form.status ? "Aktif" : "Tidak Aktif"}</span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;