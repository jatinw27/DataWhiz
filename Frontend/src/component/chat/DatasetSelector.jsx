export default function DatasetSelector({
  selectedSource,
  setSelectedSource,
  selectedDataset,
  setSelectedDataset,
  datasets,
}) {
  return (
    <div className="px-6 py-4 flex gap-4 items-center">

      {/* SOURCE */}
      <select
        value={selectedSource}
        onChange={e => setSelectedSource(e.target.value)}
        className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
      >
        <option value="csv">CSV</option>
        <option value="sqlite">SQLite</option>
        <option value="mongo">MongoDB</option>
      </select>

      {/* CSV */}
      {selectedSource === "csv" && (
        <>
          <select
            value={selectedDataset}
            onChange={e => setSelectedDataset(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          >
            {datasets.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <input type="file" accept=".csv" />
        </>
      )}

      {/* SQLITE */}
      {selectedSource === "sqlite" && (
        <input type="file" accept=".db,.sqlite" />
      )}

      {/* MONGO */}
      {selectedSource === "mongo" && (
        <input
          placeholder="MongoDB connection URI"
          className="bg-gray-900 border border-gray-700 px-3 py-2 rounded w-96"
        />
      )}
    </div>
  );
}
