import { useState } from "react";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import MahasiswaModal from "./MahasiswaModal";
import MahasiswaTable from "./MahasiswaTable";

import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";

import { confirmUpdate, confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const Mahasiswa = () => {
  const { user } = useAuthStateContext();

  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: mahasiswa = [], isLoading } = useMahasiswa();
  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const hasPermission = (permission) => {
    return user?.permission?.includes(permission);
  };

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMahasiswa(null);
  };

  const handleSubmit = (form) => {
    if (selectedMahasiswa) {
      confirmUpdate(() => {
        update(
          { id: selectedMahasiswa.id, data: form },
          {
            onSuccess: () => {
              closeModal();
            },
          }
        );
      });
    } else {
      const exists = mahasiswa.find((mhs) => mhs.nim === form.nim);

      if (exists) {
        toastError("NIM sudah terdaftar!");
        return;
      }

      store(form, {
        onSuccess: () => {
          closeModal();
        },
      });
    }
  };

  const handleDelete = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  if (isLoading) {
    return <p className="text-center">Memuat data mahasiswa...</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold">Data Mahasiswa</h2>

        {hasPermission("mahasiswa.create") && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tambah
          </button>
        )}
      </div>

      {hasPermission("mahasiswa.read") ? (
        <MahasiswaTable
          mahasiswa={mahasiswa}
          openEditModal={openEditModal}
          onDelete={handleDelete}
        />
      ) : (
        <p className="text-red-500">
          Anda tidak memiliki akses membaca data mahasiswa.
        </p>
      )}

      <MahasiswaModal
        isModalOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
      />
    </div>
  );
};

export default Mahasiswa;