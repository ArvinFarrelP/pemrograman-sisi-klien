import { useEffect, useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext"; // Add this import

import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";

import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "../../../Utils/Apis/MahasiswaApi";

import { confirmUpdate, confirmDelete } from "../../../Utils/Helpers/SwalHelpers";

import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";

const Mahasiswa = () => {
  const { user } = useAuthStateContext(); // Add this to get user from context
  const [mahasiswa, setMahasiswa] = useState([]);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  // Add permission checker function
  const hasPermission = (permission) => {
    return user?.permission?.includes(permission);
  };

  const fetchMahasiswa = async () => {
    try {
      const res = await getAllMahasiswa();
      setMahasiswa(res.data);
    } catch {
      toastError("Gagal mengambil data mahasiswa");
    }
  };

  useEffect(() => {
    fetchMahasiswa();
  }, []);

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const handleSubmit = async (form) => {
    try {
      if (selectedMahasiswa) {
        confirmUpdate(async () => {
          await updateMahasiswa(selectedMahasiswa.id, form);
          toastSuccess("Data mahasiswa berhasil diupdate");
          await fetchMahasiswa();
          setModalOpen(false);
          setSelectedMahasiswa(null);
        });
      } else {
        await storeMahasiswa(form);
        toastSuccess("Data mahasiswa berhasil ditambahkan");
        await fetchMahasiswa();
        setModalOpen(false);
      }
    } catch {
      toastError("Gagal menyimpan data mahasiswa");
    }
  };

  const handleDelete = async (id) => {
    confirmDelete(async () => {
      try {
        await deleteMahasiswa(id);
        toastSuccess("Data mahasiswa berhasil dihapus");
        await fetchMahasiswa();
      } catch {
        toastError("Gagal menghapus data mahasiswa");
      }
    });
  };

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Data Mahasiswa</h2>

        {/* Only show Add button if user has mahasiswa.create permission */}
        {hasPermission("mahasiswa.create") && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tambah
          </button>
        )}
      </div>

      {/* Only show table if user has mahasiswa.read permission */}
      {hasPermission("mahasiswa.read") ? (
        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      ) : (
        <p className="text-red-500">Anda tidak memiliki akses membaca data mahasiswa.</p>
      )}

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedMahasiswa(null);
        }}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </div>
  );
};

export default Mahasiswa;