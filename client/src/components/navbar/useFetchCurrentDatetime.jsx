// CurrentDatetime.jsx

import axios from "axios";
import { useState, useEffect } from "react";

const useFetchCurrentDatetime = () => {
  const [currentDatetime, setCurrentDatetime] = useState(null);

  const fetchCurrentDatetime = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/currentdatetime"
      );
      setCurrentDatetime(response.data.data.currentdatetime);
      // console.log(response.data.data.currentdatetime);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentDatetime();
    const interval = setInterval(() => {
      fetchCurrentDatetime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { currentDatetime };
};

export default useFetchCurrentDatetime;
