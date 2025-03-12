import { useState, useEffect } from "react";
import api from "../api/api";
import { myGraph, myNode } from "../types/graphTypes";
const useAxios = <T>(
  url: string,
  options: object = {},
  immediate: boolean = true
) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<unknown>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get(url, options);
      console.log(response);
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
