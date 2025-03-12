import { useState, useEffect } from "react";
import api from "../api/api";
import { myGraph, myNode } from "../types/graphTypes";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const useAxios = <T>(
  method: HttpMethod,
  url: string,
  options: object = {},
  immediate: boolean = true
) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(immediate);
  const [error, setError] = useState<unknown>(null);

  const request = async (
    method: HttpMethod,
    url: string,
    data: myGraph | null = null,
    options = {}
  ) => {
    setLoading(true);
    try {
      if (url === "") return;
      if (
        (method === "POST" && data == null) ||
        (method === "PUT" && data == null)
      )
        return;
      const response = await api({ method, url, data, ...options });
      setData(response.data);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (immediate) request(method, url);
  }, [url]);

  return {
    data,
    loading,
    error,
    request: (data: myGraph | null = null) => request(method, url, data),
  };
};

export default useAxios;
