import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useChartData } from "@/Utils/Hooks/useChart";
import { useMahasiswa } from "@/Utils/Hooks/useMahasiswa";
import { useDosen } from "@/Utils/Hooks/useDosen";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import { useKelas } from "@/Utils/Hooks/useKelas";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

const Dashboard = () => {
  const { data: chartData = {}, isLoading } = useChartData();

  const { data: mahasiswaResult = { data: [] } } = useMahasiswa();
  const { data: dosen = [] } = useDosen();
  const { data: mataKuliah = [] } = useMataKuliah();
  const { data: kelas = [] } = useKelas();

  const mahasiswa = mahasiswaResult.data ?? mahasiswaResult ?? [];

  const {
    students = [],
    genderRatio = [],
    registrations = [],
  } = chartData;

  if (isLoading) {
    return <p className="text-center">Memuat data dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total Mahasiswa</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {mahasiswa.length}
          </h2>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total Dosen</p>
          <h2 className="text-3xl font-bold text-green-600">
            {dosen.length}
          </h2>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total Mata Kuliah</p>
          <h2 className="text-3xl font-bold text-yellow-600">
            {mataKuliah.length}
          </h2>
        </div>

        <div className="bg-white rounded shadow p-4">
          <p className="text-sm text-gray-500">Total Kelas</p>
          <h2 className="text-3xl font-bold text-red-600">
            {kelas.length}
          </h2>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Jumlah Mahasiswa per Fakultas
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={students}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faculty" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Jumlah" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Rasio Gender Mahasiswa
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderRatio}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {genderRatio.map((entry, index) => (
                  <Cell
                    key={entry.id}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* LINE CHART */}
        <div className="bg-white rounded shadow p-4 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">
            Tren Pendaftaran Mahasiswa
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Pendaftaran"
                stroke="#16a34a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;