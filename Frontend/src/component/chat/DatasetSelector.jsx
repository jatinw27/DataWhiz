export default function DatasetSelector({
  selectedSource,
  setSelectedSource,
  datasets,
  selectedDataset,
  setSelectedDataset,
  uploadFile,
  uploading,
}) {
  return (
    <div className="flex gap-3 px-6 mt-24 items-center">
      {/* Source Selector */}
      <select
        value={selectedSource}
        onChange={(e) => setSelectedSource(e.target.value)}
        className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
      >
        <option value="sqlite">SQLite</option>
        <option value="csv">CSV</option>
        <option value="mongo">MongoDB</option>
      </select>

      {/* Dataset selector only for CSV */}
      {selectedSource === "csv" && (
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2"
        >
          {datasets.map(ds => (
            <option key={ds} value={ds}>
              {ds}
            </option>
          ))}
        </select>
      )}

      {/* Upload */}
      {selectedSource === "csv" && (
        <input
          type="file"
          accept=".csv"
          disabled={uploading}
          onChange={(e) => uploadFile(e.target.files[0])}
        />
      )}
    </div>
  );
}
