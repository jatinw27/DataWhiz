import { useEffect } from "react";
import { uploadCSV } from "../../services/api.js";

export default function DatasetSelector({
  selectedSource,
  setSelectedSource,
  selectedDataset,
  setSelectedDataset,
  datasets,
  addDataset,
  setMongoUri,
  setSqliteFile,
}) {
  useEffect(() => {
    setSelectedDataset("");
    setMongoUri?.("");
    setSqliteFile?.(null);
  }, [selectedSource]);

 return (
  <div className="flex items-center gap-2">

    {/* SOURCE */}
    <select
      value={selectedSource}
      onChange={e => setSelectedSource(e.target.value)}
      className="px-2 py-1 text-sm rounded-md bg-[#1a1a1a] border border-gray-700"
    >
      <option value="csv">CSV</option>
      <option value="sqlite">SQLite</option>
      <option value="mongo">MongoDB</option>
    </select>

    {/* DATASET */}
    {selectedSource === "csv" && (
      <select
        value={selectedDataset}
        onChange={e => setSelectedDataset(e.target.value)}
        className="px-2 py-1 text-sm rounded-md bg-[#1a1a1a] border border-gray-700"
      >
        {datasets.length === 0 && <option>No datasets</option>}
        {datasets.map(d => (
          <option key={d}>{d}</option>
        ))}
      </select>
    )}

    {/* FILE UPLOAD */}
    {selectedSource === "csv" && (
      <input
        type="file"
        accept=".csv"
        className="text-xs text-gray-400"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (!file) return;

          const formData = new FormData();
          formData.append("file", file);

          try {
            const res = await uploadCSV(formData);
            const data = res.data;

            addDataset(data.dataset);
            setSelectedDataset(data.dataset);

          } catch (err) {
            console.error("CSV upload failed", err);
          }
        }}
      />
    )}

    {/* MONGO */}
    {selectedSource === "mongo" && (
      <input
        placeholder="Mongo URI"
        className="px-2 py-1 text-sm rounded-md bg-[#1a1a1a] border border-gray-700"
        onChange={e => setMongoUri(e.target.value)}
      />
    )}

  </div>
);
}