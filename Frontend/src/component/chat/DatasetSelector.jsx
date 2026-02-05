import { useEffect } from "react";
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
    <div className="px-6 py-4 flex gap-4 items-center flex-wrap">

      {/* SOURCE SELECT */}
      <select
        value={selectedSource}
        onChange={e => setSelectedSource(e.target.value)}
        className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
      >
        <option value="csv">CSV</option>
        <option value="sqlite">SQLite</option>
        <option value="mongo">MongoDB</option>
      </select>

      {/* CSV MODE */}
      {selectedSource === "csv" && (
        <>
          <select
            value={selectedDataset}
            onChange={e => setSelectedDataset(e.target.value)}
            className="bg-gray-900 border border-gray-700 px-3 py-2 rounded"
          >
            {datasets.length === 0 && (
              <option>No datasets</option>
            )}
            {datasets.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <input
            type="file"
            accept=".csv"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) addDataset(file.name);   // ✅ FIX
            }}
          />
        </>
      )}

      {/* SQLITE MODE */}
      {selectedSource === "sqlite" && (
        <input
          type="file"
          accept=".db,.sqlite"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setSqliteFile(file);       // ✅ FIX
          }}
        />
      )}

      {/* MONGO MODE */}
      {selectedSource === "mongo" && (
        <input
          placeholder="MongoDB connection URI"
          className="bg-gray-900 border border-gray-700 px-3 py-2 rounded w-96"
          onChange={(e) => setMongoUri(e.target.value)}  // ✅ FIX
        />
      )}
    </div>
  );
}
