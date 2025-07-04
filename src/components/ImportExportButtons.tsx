import React, { useRef } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { OptionEntry } from "./OptionEntryTable";

interface ImportExportButtonsProps {
  options: OptionEntry[];
  onOptionsChange: (options: OptionEntry[]) => void;
}

const ImportExportButtons = ({ options, onOptionsChange }: ImportExportButtonsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target?.result;
      if (!data) return;
      const workbook = XLSX.read(data, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json: any[] = XLSX.utils.sheet_to_json(sheet);
      // Map to OptionEntry
      const importedOptions: OptionEntry[] = json.map((row, idx) => ({
        id: row.id || Date.now().toString() + idx,
        priority: Number(row.priority) || idx + 1,
        collegeCode: row.collegeCode || "",
        collegeName: row.collegeName || "",
        branchCode: row.branchCode || "",
        branchName: row.branchName || "",
        location: row.location || "",
        collegeCourse: row.collegeCourse || "",
        notes: row.notes || ""
      }));
      onOptionsChange(importedOptions);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(options);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Options");
    XLSX.writeFile(wb, "KCET_Option_Entry_List.xlsx");
  };

  return (
    <div className="flex gap-2 import-export-btns">
      <input
        type="file"
        accept=".xlsx,.csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleImport}
      />
      <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
        Import Excel/CSV
      </Button>
      <Button variant="outline" onClick={handleExport}>
        Export Excel/CSV
      </Button>
    </div>
  );
};

export default ImportExportButtons;