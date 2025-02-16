// CurrentDatetime.jsx

import axios from "axios";
import { useState, useEffect } from "react";

const useFetchCurrentDatetime = () => {
  const [currentDatetime, setCurrentDatetime] = useState(null);

  const fetchCurrentDateTime = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/currentdatetime"
      );
      setCurrentDatetime(response.data.data.currentdatetime);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrentDateTime();
    const interval = setInterval(() => {
      fetchCurrentDateTime();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return { currentDatetime };
};

export default useFetchCurrentDatetime;
