import { useState } from "react";

import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

import { useDosen } from "@/Utils/Hooks/useDosen";
import { useKelas, useStoreKelas, useUpdateKelas, useDeleteKelas } from "@/Utils/Hooks/useKelas";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import { useMahasiswa } from "@/Utils/Hooks/useMahasiswa";

import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

const RencanaStudi = () => {
  const { user } = useAuthStateContext();

  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form, setForm] = useState({
    mata_kuliah_id: "",
    dosen_id: "",
  });

  const { data: kelas = [], isLoading: loadingKelas } = useKelas();
  const { data: dosen = [] } = useDosen();
  const { data: mataKuliah = [] } = useMataKuliah();

  const { data: mahasiswaResult = { data: [] } } = useMahasiswa({
    _page: 1,
    _limit: 1000,
  });

  const mahasiswa = mahasiswaResult.data ?? [];

  const { mutate: storeKelas } = useStoreKelas();
  const { mutate: updateKelas } = useUpdateKelas();
  const { mutate: deleteKelas } = useDeleteKelas();

  const hasPermission = (permission) => {
    return user?.permission?.includes(permission);
  };

  const getMataKuliahSks = (mataKuliahId) => {
    return mataKuliah.find((mk) => String(mk.id) === String(mataKuliahId))?.sks || 0;
  };

  const getMahasiswaMaxSks = (mahasiswaId) => {
    return mahasiswa.find((mhs) => String(mhs.id) === String(mahasiswaId))?.max_sks || 0;
  };

  const getDosenMaxSks = (dosenId) => {
    return dosen.find((dsn) => String(dsn.id) === String(dosenId))?.max_sks || 0;
  };

  const getTotalSksMahasiswa = (mahasiswaId) => {
    return kelas
      .filter((kls) => kls.mahasiswa_ids?.map(String).includes(String(mahasiswaId)))
      .map((kls) => getMataKuliahSks(kls.mata_kuliah_id))
      .reduce((total, sks) => total + sks, 0);
  };

  const getTotalSksDosen = (dosenId, exceptKelasId = null) => {
    return kelas
      .filter((kls) => String(kls.dosen_id) === String(dosenId))
      .filter((kls) => String(kls.id) !== String(exceptKelasId))
      .map((kls) => getMataKuliahSks(kls.mata_kuliah_id))
      .reduce((total, sks) => total + sks, 0);
  };

  const mataKuliahSudahDipakai = kelas.map((kls) => String(kls.mata_kuliah_id));
  const mataKuliahBelumAdaKelas = mataKuliah.filter(
    (mk) => !mataKuliahSudahDipakai.includes(String(mk.id))
  );

  const openAddModal = () => {
    setForm({
      mata_kuliah_id: "",
      dosen_id: "",
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.mata_kuliah_id || !form.dosen_id) {
      toastError("Mata kuliah dan dosen wajib dipilih");
      return;
    }

    const sksMatkul = getMataKuliahSks(form.mata_kuliah_id);
    const totalSksDosen = getTotalSksDosen(form.dosen_id);
    const maxSksDosen = getDosenMaxSks(form.dosen_id);

    if (totalSksDosen + sksMatkul > maxSksDosen) {
      toastError(`Dosen melebihi batas maksimal SKS (${maxSksDosen})`);
      return;
    }

    storeKelas(
      {
        mata_kuliah_id: form.mata_kuliah_id,
        dosen_id: form.dosen_id,
        mahasiswa_ids: [],
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setForm({ mata_kuliah_id: "", dosen_id: "" });
        },
      }
    );
  };

  const handleAddMahasiswa = (kelasItem, mahasiswaId) => {
    if (!mahasiswaId) {
      toastError("Pilih mahasiswa terlebih dahulu");
      return;
    }

    const mahasiswaIds = kelasItem.mahasiswa_ids ?? [];

    if (mahasiswaIds.map(String).includes(String(mahasiswaId))) {
      toastError("Mahasiswa sudah terdaftar di kelas ini");
      return;
    }

    const sksMatkul = getMataKuliahSks(kelasItem.mata_kuliah_id);
    const totalSksMahasiswa = getTotalSksMahasiswa(mahasiswaId);
    const maxSksMahasiswa = getMahasiswaMaxSks(mahasiswaId);

    if (totalSksMahasiswa + sksMatkul > maxSksMahasiswa) {
      toastError(`SKS mahasiswa melebihi batas maksimal (${maxSksMahasiswa})`);
      return;
    }

    updateKelas(
      {
        id: kelasItem.id,
        data: {
          ...kelasItem,
          mahasiswa_ids: [...mahasiswaIds, mahasiswaId],
        },
      },
      {
        onSuccess: () => {
          setSelectedMhs((prev) => ({
            ...prev,
            [kelasItem.id]: "",
          }));
        },
      }
    );
  };

  const handleDeleteMahasiswa = (kelasItem, mahasiswaId) => {
    const mahasiswaIds = kelasItem.mahasiswa_ids ?? [];

    updateKelas({
      id: kelasItem.id,
      data: {
        ...kelasItem,
        mahasiswa_ids: mahasiswaIds.filter(
          (id) => String(id) !== String(mahasiswaId)
        ),
      },
    });
  };

  const handleChangeDosen = (kelasItem) => {
    const dosenId = selectedDsn[kelasItem.id];

    if (!dosenId) {
      toastError("Pilih dosen terlebih dahulu");
      return;
    }

    const sksMatkul = getMataKuliahSks(kelasItem.mata_kuliah_id);
    const totalSksDosen = getTotalSksDosen(dosenId, kelasItem.id);
    const maxSksDosen = getDosenMaxSks(dosenId);

    if (totalSksDosen + sksMatkul > maxSksDosen) {
      toastError(`Dosen melebihi batas maksimal SKS (${maxSksDosen})`);
      return;
    }

    updateKelas(
      {
        id: kelasItem.id,
        data: {
          ...kelasItem,
          dosen_id: dosenId,
        },
      },
      {
        onSuccess: () => {
          setSelectedDsn((prev) => ({
            ...prev,
            [kelasItem.id]: "",
          }));
        },
      }
    );
  };

  const handleDeleteKelas = (kelasId) => {
    confirmDelete(() => {
      deleteKelas(kelasId);
    });
  };

  if (loadingKelas) {
    return <p className="text-center">Memuat data rencana studi...</p>;
  }

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Rencana Studi</h2>

        {hasPermission("rencana-studi.create") && (
          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Tambah Kelas
          </button>
        )}
      </div>

      {hasPermission("rencana-studi.read") ? (
        <TableRencanaStudi
          kelas={kelas}
          mahasiswa={mahasiswa}
          dosen={dosen}
          mataKuliah={mataKuliah}
          selectedMhs={selectedMhs}
          setSelectedMhs={setSelectedMhs}
          selectedDsn={selectedDsn}
          setSelectedDsn={setSelectedDsn}
          handleAddMahasiswa={handleAddMahasiswa}
          handleDeleteMahasiswa={handleDeleteMahasiswa}
          handleChangeDosen={handleChangeDosen}
          handleDeleteKelas={handleDeleteKelas}
          getTotalSksMahasiswa={getTotalSksMahasiswa}
          hasPermission={hasPermission}
        />
      ) : (
        <p className="text-red-500">
          Anda tidak memiliki akses membaca rencana studi.
        </p>
      )}

      <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onChange={handleChange}
        form={form}
        dosen={dosen}
        mataKuliah={mataKuliahBelumAdaKelas}
      />
    </div>
  );
};

export default RencanaStudi;