import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "@/Utils/Apis/DosenApi";
import {
  toastSuccess,
  toastError,
} from "@/Utils/Helpers/ToastHelpers";

export const useDosen = () =>
  useQuery({
    queryKey: ["dosen"],
    queryFn: getAllDosen,
    select: (res) => res?.data ?? [],
  });

export const useStoreDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil ditambahkan!");
    },
    onError: () => toastError("Gagal menambahkan dosen."),
  });
};

export const useUpdateDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateDosen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil diperbarui!");
    },
    onError: () => toastError("Gagal memperbarui dosen."),
  });
};

export const useDeleteDosen = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDosen,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dosen"] });
      toastSuccess("Dosen berhasil dihapus!");
    },
    onError: () => toastError("Gagal menghapus dosen."),
  });
};