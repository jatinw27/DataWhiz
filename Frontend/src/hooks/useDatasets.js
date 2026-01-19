import { useEffect, useState } from "react";
import { fetchDatasets, uploadCSV } from "../services/api.js";

export function useDatasets() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState("users");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDatasets()
      .then(res => {
        setDatasets(res.data.datasets || []);
        if (res.data.datasets?.length) {
          setSelectedDataset(res.data.datasets[0]);
        }
      })
      .catch(console.error);
  }, []);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await uploadCSV(formData);
      const res = await fetchDatasets();
      setDatasets(res.data.datasets || []);
      setSelectedDataset(res.data.datasets[0]);
    } finally {
      setUploading(false);
    }
  };

  return {
    datasets,
    selectedDataset,
    setSelectedDataset,
    uploading,
    uploadFile,
  };
}
