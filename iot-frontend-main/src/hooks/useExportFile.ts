import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { WaterChartResponse } from "@/interfaces/water";

const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const pad = (num: number) => num.toString().padStart(2, "0");

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

export const exportToCSV = (chartData: WaterChartResponse, label: string) => {
  if (!chartData || !chartData.series || !chartData.date) {
    console.error("Invalid data format");
    return;
  }

  // Menentukan tipe eksplisit untuk csvData
  const csvData: Record<string, string | number>[] = [];

  // Loop semua desa dalam series
  chartData.series.forEach(seriesItem => {
    seriesItem.data.forEach((value, index) => {
      csvData.push({
        "Nama Desa": seriesItem.name,
        [label]: value.toFixed(2), // Menggunakan label sebagai key
        Tanggal: formatDate(chartData.date[index]) || "", // Pastikan date tersedia
      });
    });
  });

  // Konversi ke CSV
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, "data.csv");
};

export const exportToXLSX = (chartData: WaterChartResponse, label: string) => {
  if (!chartData || !chartData.series || !chartData.date) {
    console.error("Invalid data format");
    return;
  }

  const wb = XLSX.utils.book_new();

  // Fungsi untuk membersihkan nama sheet agar valid
  const sanitizeSheetName = (name: string) => {
    return name.substring(0, 31).replace(/[\\\/\?\*\[\]:]/g, "_"); // Ganti karakter ilegal dengan "_"
  };

  // Loop semua desa dalam series
  chartData.series.forEach(seriesItem => {
    const sheetData: (string | number)[][] = [["Nama Desa", label, "Tanggal"]]; // Header

    seriesItem.data.forEach((value, index) => {
      sheetData.push([
        seriesItem.name,
        value.toFixed(2),
        formatDate(chartData.date[index]) || "", // Pastikan date tersedia
      ]);
    });

    // Buat sheet untuk desa dengan nama yang telah dibersihkan
    const sheetName = sanitizeSheetName(seriesItem.name);
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  // Simpan file
  const xlsxBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const xlsxBlob = new Blob([xlsxBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(xlsxBlob, "data.xlsx");
};
