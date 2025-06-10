// src\components\admin\transaksi\TransaksiEdit.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { fetchWithToken } from "@/services/auth";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { Select } from "@/components/FormElements/select";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Wallet, CreditCard, AlertTriangle } from "lucide-react";

type Summary = {
  pemasukan: number;
  pengeluaran: number;
  draft: number;
  saldo_tunai: number;
  saldo_rekening: number;
  total_saldo: number;
};

type JenisTransaksi = {
  jenis_transaksi_id: number;
  jenis_name: string;
  sumber_dana: "tunai" | "rekening";
};

export default function TransaksiEditPage() {
  const router = useRouter();
  const params = useParams();

  const [form, setForm] = useState({
    kategori: "",
    jenis_transaksi_id: "",
    nominal: "",
    sumber: "",
    status: "",
    keterangan: "",
  });

  const [jenisTransaksiOptions, setJenisTransaksiOptions] = useState<
    { value: string; label: string; sumber_dana: "tunai" | "rekening" }[]
  >([]);

  const [summary, setSummary] = useState<Summary>({
    pemasukan: 0,
    pengeluaran: 0,
    draft: 0,
    saldo_tunai: 0,
    saldo_rekening: 0,
    total_saldo: 0
  });

  const [originalTransaksi, setOriginalTransaksi] = useState<{
    kategori: string;
    nominal: number;
    jenis_transaksi_id: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saldoWarning, setSaldoWarning] = useState("");
  const [selectedJenis, setSelectedJenis] = useState<JenisTransaksi | null>(null);

  // Ambil data summary saldo
  const fetchSummary = async () => {
    try {
      const data = await fetchWithToken("/api/transaksi/summary");
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  // Ambil data dropdown jenis transaksi
  useEffect(() => {
    const fetchJenisTransaksi = async () => {
      try {
        const data = await fetchWithToken(`/api/jenis_transaksi`);
        if (Array.isArray(data)) {
          const options = data.map((item: JenisTransaksi) => ({
            value: item.jenis_transaksi_id.toString(),
            label: item.jenis_name,
            sumber_dana: item.sumber_dana,
          }));
          setJenisTransaksiOptions(options);
        } else {
          console.warn("Data bukan array:", data);
        }
      } catch (err) {
        console.error("Gagal mengambil data jenis transaksi:", err);
      }
    };

    fetchJenisTransaksi();
    fetchSummary();
  }, []);

  // Ambil data transaksi berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchWithToken(`/api/transaksi/${params.id}`);
        setForm({
          kategori: data.kategori || "",
          jenis_transaksi_id: data.jenis_transaksi_id?.toString() || "",
          nominal: data.nominal?.toString() || "",
          sumber: data.sumber || "",
          status: data.status || "draft",
          keterangan: data.keterangan || "",
        });

        // Simpan data original untuk perhitungan saldo
        setOriginalTransaksi({
          kategori: data.kategori || "",
          nominal: data.nominal || 0,
          jenis_transaksi_id: data.jenis_transaksi_id || 0,
        });
      } catch (err) {
        console.error("Gagal ambil data transaksi:", err);
      }
    };

    if (params.id) fetchData();
  }, [params.id]);

  // Update selectedJenis ketika jenis_transaksi_id berubah
  useEffect(() => {
    if (form.jenis_transaksi_id && jenisTransaksiOptions.length > 0) {
      const jenisTransaksi = jenisTransaksiOptions.find(
        (item) => item.value === form.jenis_transaksi_id
      );
      
      if (jenisTransaksi) {
        let sumberDana = jenisTransaksi.sumber_dana;
        
        if (!sumberDana) {
          const namaJenis = jenisTransaksi.label.toLowerCase();
          if (namaJenis.includes('tunai') || namaJenis.includes('cash')) {
            sumberDana = 'tunai';
          } else if (namaJenis.includes('rekening') || namaJenis.includes('bank')) {
            sumberDana = 'rekening';
          } else {
            sumberDana = 'tunai';
          }
        }
        
        setSelectedJenis({
          jenis_transaksi_id: parseInt(form.jenis_transaksi_id),
          jenis_name: jenisTransaksi.label,
          sumber_dana: sumberDana
        });
      }
    }
  }, [form.jenis_transaksi_id, jenisTransaksiOptions]);

  // Validasi saldo real-time ketika nominal atau jenis transaksi berubah
  useEffect(() => {
    if (form.nominal && form.jenis_transaksi_id && form.kategori === "pengeluaran") {
      validateSaldo();
    } else {
      setSaldoWarning("");
    }
  }, [form.nominal, form.jenis_transaksi_id, form.kategori, summary, jenisTransaksiOptions, originalTransaksi]);

  const validateSaldo = () => {
    const nominal = parseFloat(form.nominal);
    if (!nominal || nominal <= 0) {
      setSaldoWarning("");
      return true;
    }

    // Cari jenis transaksi yang dipilih
    const jenisTransaksi = jenisTransaksiOptions.find(
      (item) => item.value === form.jenis_transaksi_id
    );

    if (!jenisTransaksi || !originalTransaksi) {
      setSaldoWarning("");
      return true;
    }

    // Hitung saldo yang akan tersedia setelah mengembalikan transaksi original
    let saldoTunaiAdjusted = summary.saldo_tunai;
    let saldoRekeningAdjusted = summary.saldo_rekening;

    // Kembalikan efek transaksi original jika ada perubahan
    if (originalTransaksi.kategori && originalTransaksi.nominal > 0) {
      // Cari jenis transaksi original
      const originalJenis = jenisTransaksiOptions.find(
        (item) => item.value === originalTransaksi.jenis_transaksi_id.toString()
      );

      if (originalJenis) {
        let originalSumberDana = originalJenis.sumber_dana;
        
        if (!originalSumberDana) {
          const namaJenis = originalJenis.label.toLowerCase();
          if (namaJenis.includes('tunai') || namaJenis.includes('cash')) {
            originalSumberDana = 'tunai';
          } else if (namaJenis.includes('rekening') || namaJenis.includes('bank')) {
            originalSumberDana = 'rekening';
          } else {
            originalSumberDana = 'tunai';
          }
        }

        // Kembalikan efek transaksi original
        if (originalTransaksi.kategori === "pemasukan") {
          if (originalSumberDana === "tunai") {
            saldoTunaiAdjusted -= originalTransaksi.nominal;
          } else {
            saldoRekeningAdjusted -= originalTransaksi.nominal;
          }
        } else if (originalTransaksi.kategori === "pengeluaran") {
          if (originalSumberDana === "tunai") {
            saldoTunaiAdjusted += originalTransaksi.nominal;
          } else {
            saldoRekeningAdjusted += originalTransaksi.nominal;
          }
        }
      }
    }

    // Tentukan sumber dana untuk transaksi baru
    let sumberDana = jenisTransaksi.sumber_dana;
    
    if (!sumberDana) {
      const namaJenis = jenisTransaksi.label.toLowerCase();
      if (namaJenis.includes('tunai') || namaJenis.includes('cash')) {
        sumberDana = 'tunai';
      } else if (namaJenis.includes('rekening') || namaJenis.includes('bank')) {
        sumberDana = 'rekening';
      } else {
        sumberDana = 'tunai';
      }
    }

    let saldoTersedia = 0;
    let namaAkun = "";

    if (sumberDana === "tunai") {
      saldoTersedia = saldoTunaiAdjusted;
      namaAkun = "Tunai";
    } else if (sumberDana === "rekening") {
      saldoTersedia = saldoRekeningAdjusted;
      namaAkun = "Rekening";
    }

    console.log("Validasi saldo edit:", {
      sumberDana,
      saldoTersedia,
      nominal,
      namaAkun,
      originalTransaksi,
      saldoTunaiAdjusted,
      saldoRekeningAdjusted
    });

    // Validasi apakah saldo mencukupi
    if (saldoTersedia < nominal) {
      setSaldoWarning(
        `Saldo ${namaAkun} tidak mencukupi! Saldo tersedia: Rp ${saldoTersedia.toLocaleString("id-ID")}, dibutuhkan: Rp ${nominal.toLocaleString("id-ID")}`
      );
      return false;
    }

    setSaldoWarning("");
    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleJenisTransaksiChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jenisId = e.target.value;
    setForm({ ...form, jenis_transaksi_id: jenisId });
    
    // Update selected jenis untuk menampilkan info sumber dana
    const jenisTransaksi = jenisTransaksiOptions.find(
      (item) => item.value === jenisId
    );
    
    if (jenisTransaksi) {
      let sumberDana = jenisTransaksi.sumber_dana;
      
      if (!sumberDana) {
        const namaJenis = jenisTransaksi.label.toLowerCase();
        if (namaJenis.includes('tunai') || namaJenis.includes('cash')) {
          sumberDana = 'tunai';
        } else if (namaJenis.includes('rekening') || namaJenis.includes('bank')) {
          sumberDana = 'rekening';
        } else {
          sumberDana = 'tunai';
        }
      }
      
      setSelectedJenis({
        jenis_transaksi_id: parseInt(jenisId),
        jenis_name: jenisTransaksi.label,
        sumber_dana: sumberDana
      });
    } else {
      setSelectedJenis(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.kategori || !form.jenis_transaksi_id || !form.nominal || !form.status) {
      setError("Semua field bertanda * wajib diisi.");
      setLoading(false);
      return;
    }

    // Validasi saldo untuk pengeluaran
    if (form.kategori === "pengeluaran") {
      const isValid = validateSaldo();
      if (!isValid) {
        setError("Saldo tidak mencukupi untuk melakukan transaksi ini.");
        setLoading(false);
        return;
      }
    }

    try {
      await fetchWithToken(`/api/transaksi/${params.id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...form,
          nominal: parseFloat(form.nominal),
        }),
      });

      router.push("/admin/transaksi");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan perubahan");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk format saldo
  const formatSaldo = (saldo: number) => {
    const isNegative = saldo < 0;
    const formattedAmount = Math.abs(saldo).toLocaleString("id-ID");
    
    if (isNegative) {
      return `- Rp ${formattedAmount}`;
    }
    
    return `Rp ${formattedAmount}`;
  };

  return (
    <>
      <Breadcrumb pageName="Transaksi" mapName="Edit Transaksi" />
      
      {/* Card Info Saldo */}
      <div className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Saldo Tunai */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Tunai</h3>
                <p className={`text-lg font-bold ${summary.saldo_tunai < 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                  {formatSaldo(summary.saldo_tunai)}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${summary.saldo_tunai < 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-blue-100 dark:bg-blue-900/20'}`}>
                <Wallet className={`h-5 w-5 ${summary.saldo_tunai < 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
              </div>
            </div>
          </div>

          {/* Saldo Rekening */}
          <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Saldo Rekening</h3>
                <p className={`text-lg font-bold ${summary.saldo_rekening < 0 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`}>
                  {formatSaldo(summary.saldo_rekening)}
                </p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${summary.saldo_rekening < 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-purple-100 dark:bg-purple-900/20'}`}>
                <CreditCard className={`h-5 w-5 ${summary.saldo_rekening < 0 ? 'text-red-600 dark:text-red-400' : 'text-purple-600 dark:text-purple-400'}`} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-9">
        <div className="flex flex-col gap-9">
          <ShowcaseSection title="Edit Transaksi" className="!p-6.5 space-y-5.5">
            {/* Kategori, Jenis Transaksi & Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Select
                label="Kategori"
                placeholder="Pilih Kategori"
                value={form.kategori}
                onChange={(e) => setForm({ ...form, kategori: e.target.value })}
                items={[
                  { value: "pemasukan", label: "Pemasukan" },
                  { value: "pengeluaran", label: "Pengeluaran" },
                ]}
              />
              <div>
                <Select
                  label="Jenis Transaksi"
                  placeholder="Pilih Jenis"
                  value={form.jenis_transaksi_id}
                  onChange={handleJenisTransaksiChange}
                  items={jenisTransaksiOptions}
                />
                {/* Info sumber dana */}
                {selectedJenis && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {selectedJenis.sumber_dana === "tunai" ? (
                      <Wallet className="h-4 w-4" />
                    ) : (
                      <CreditCard className="h-4 w-4" />
                    )}
                    <span>Sumber dana: {selectedJenis.sumber_dana === "tunai" ? "Tunai" : "Rekening"}</span>
                  </div>
                )}
              </div>
              <Select
                label="Status"
                placeholder="Pilih Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                items={[
                  { value: "draft", label: "Draft" },
                  { value: "valid", label: "Valid" },
                ]}
              />
            </div>

            {/* Nominal & Sumber */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <InputGroup
                  label="Nominal"
                  name="nominal"
                  type="number"
                  placeholder="Masukkan nominal"
                  value={form.nominal}
                  onChange={handleChange}
                  required
                />
                {/* Warning saldo tidak mencukupi */}
                {saldoWarning && (
                  <div className="mt-2 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                    <span className="text-sm text-red-600 dark:text-red-400">{saldoWarning}</span>
                  </div>
                )}
              </div>
              <InputGroup
                label="Sumber"
                name="sumber"
                type="text"
                placeholder="Contoh: Infaq, kotak amal, dll"
                value={form.sumber}
                onChange={handleChange}
              />
            </div>

            {/* Keterangan */}
            <div>
              <TextAreaGroup
                label="Keterangan"
                name="keterangan"
                placeholder="Keterangan tambahan"
                value={form.keterangan}
                onChange={handleChange}
              />
            </div>
          </ShowcaseSection>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-red-600 dark:text-red-400">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (form.kategori === "pengeluaran" && saldoWarning !== "")}
          className={`rounded px-6 py-3 text-white transition ${
            loading || (form.kategori === "pengeluaran" && saldoWarning !== "")
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-opacity-90"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </>
  );
}