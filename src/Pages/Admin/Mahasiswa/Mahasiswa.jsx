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
  
  // Add pagination, sorting, search states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  // Update hook call with query parameters
  const {
    data: result = { data: [], total: 0 },
    isLoading,
  } = useMahasiswa({
    q: search,
    _sort: sortBy,
    _order: sortOrder,
    _page: page,
    _limit: limit,
  });

  const mahasiswa = result.data;
  const totalCount = result.total;
  const totalPages = Math.ceil(totalCount / limit) || 1;

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

  // Add pagination handlers
  const handlePrev = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages));
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
      // Note: This check now works with paginated data, might need API-side check
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
        <>
          {/* Add filter UI */}
          <div className="flex flex-wrap gap-2 mb-4">
            <input
              type="text"
              placeholder="Cari nama atau NIM..."
              className="border px-3 py-2 rounded flex-grow"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />

            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="nama">Sort by Nama</option>
              <option value="nim">Sort by NIM</option>
              <option value="status">Sort by Status</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value);
                setPage(1);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>

            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="border px-3 py-2 rounded"
            >
              <option value={5}>5 / halaman</option>
              <option value={10}>10 / halaman</option>
              <option value={25}>25 / halaman</option>
            </select>
          </div>

          <MahasiswaTable
            mahasiswa={mahasiswa}
            openEditModal={openEditModal}
            onDelete={handleDelete}
            isLoading={isLoading}
          />

          {/* Add pagination UI */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-600">
              Halaman {page} dari {totalPages} | Total data: {totalCount}
            </p>

            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                onClick={handleNext}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
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