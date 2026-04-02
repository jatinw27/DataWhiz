import { useEffect, useState } from "react";

export function useDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("");
  const [mongoUri, setMongoUri] = useState("");
const [sqliteFile, setSqliteFile] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("datasets") || "[]");
    setDatasets(saved);
    setSelectedDataset(saved[0] || "");
  }, []);

  const addDataset = (name) => {
    setDatasets(prev => {
      const updated = [...new Set([name, ...prev])];
      localStorage.setItem("datasets", JSON.stringify(updated));
      return updated;
    });
    setSelectedDataset(name);
  };

  return {
    datasets,
    selectedDataset,
    setSelectedDataset,
    addDataset,
    mongoUri,
  setMongoUri,
  sqliteFile,
  setSqliteFile,
  };
}
