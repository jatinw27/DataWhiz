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
  <div className="mt-4 mb-6 max-w-4xl mx-auto">
    <div className="bg-white dark:bg-[#141414]
      border border-gray-200 dark:border-gray-800
      rounded-2xl p-4 shadow-sm space-y-4">

      {/* ROW 1 */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={selectedSource}
          onChange={e => setSelectedSource(e.target.value)}
          className="px-3 py-2 rounded-lg border
          bg-gray-50 dark:bg-[#1a1a1a]
          border-gray-300 dark:border-gray-700"
        >
          <option value="csv">CSV</option>
          <option value="sqlite">SQLite</option>
          <option value="mongo">MongoDB</option>
        </select>

        {selectedSource === "csv" && (
          <select
            value={selectedDataset}
            onChange={e => setSelectedDataset(e.target.value)}
            className="px-3 py-2 rounded-lg border
            bg-gray-50 dark:bg-[#1a1a1a]
            border-gray-300 dark:border-gray-700"
          >
            {datasets.length === 0 && <option>No datasets</option>}
            {datasets.map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        )}
      </div>

      {/* ROW 2 */}
      {selectedSource === "csv" && (
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept=".csv"
            className="text-sm"
           onChange={async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await uploadCSV(formData);
const data = res.data;

    // dataset name comes from backend (single source of truth)
    addDataset(data.dataset);
    setSelectedDataset(data.dataset);

  } catch (err) {
    console.error("CSV upload failed", err);
  }
}}
          />
        </div>
      )}

      {selectedSource === "sqlite" && (
        <input type="file" accept=".db,.sqlite" />
      )}

      {selectedSource === "mongo" && (
        <input
          placeholder="MongoDB connection URI"
          className="w-full px-3 py-2 rounded-lg border
          bg-gray-50 dark:bg-[#1a1a1a]
          border-gray-300 dark:border-gray-700"
          onChange={e => setMongoUri(e.target.value)}
        />
      )}
    </div>
  </div>
);
}