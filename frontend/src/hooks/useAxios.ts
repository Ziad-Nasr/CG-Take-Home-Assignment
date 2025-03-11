import { useState, useEffect } from "react";
import api from "../api/api";

const useAxios = (
  url: string,
  options: object = {},
  immediate: boolean = true
) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<unknown>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(url, options);
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) fetchData();
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

export default useAxios;
