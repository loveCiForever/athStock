// ./application/client/src/hooks/useFetch.jsx

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthContext } from "../contexts/AuthContext";

export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessToken } = useAuthContext();

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const headers = {
        ...options.headers,
        ...(getAccessToken() && {
          Authorization: `Bearer ${getAccessToken()}`,
        }),
      };

      const response = await axios({
        ...options,
        url,
        headers,
      });

      setData(response.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  const refetch = () => {
    fetchData();
  };

  return { data, isLoading, error, refetch };
};
