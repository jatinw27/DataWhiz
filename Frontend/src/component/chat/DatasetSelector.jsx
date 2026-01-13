export default function DatasetSelector({
  datasets,
  selectedDataset,
  setSelectedDataset,
  selectedSource,
  setSelectedSource,
  uploadFile,
  uploading,
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 mb-4 mt-24">
      <div className="flex gap-3 items-center">
        <select
          value={selectedSource}
          onChange={e => setSelectedSource(e.target.value)}
          className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
        >
          <option value="sqlite">SQLite</option>
          <option value="csv">CSV</option>
          <option value="mongo">MongoDB</option>
        </select>

        {selectedSource === "csv" && (
          <select
            value={selectedDataset}
            onChange={e => setSelectedDataset(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          >
            {datasets.map(ds => (
              <option key={ds} value={ds}>{ds}</option>
            ))}
          </select>
        )}
      </div>

      {selectedSource === "csv" && (
        <div className="mt-3 flex gap-2">
          <input
            type="file"
            accept=".csv"
            onChange={e => uploadFile(e.target.files[0])}
          />
          {uploading && <span className="text-gray-400">Uploading...</span>}
        </div>
      )}
    </div>
  );
}
