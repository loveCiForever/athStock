import ReactApexChart from "react-apexcharts";

const debugData = (data) => {
  console.log("Raw data:", data);
  console.log("First item:", data[0]);
};

const ChartModal = ({ isOpen, onClose, data = [], symbol }) => {
  if (!isOpen) return null;

  debugData(data);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[90vw] max-w-[1200px]">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {symbol} Price Chart
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-center h-[500px]">
            <p className="text-gray-500">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  const options = {
    chart: {
      type: "line",
      height: 500,
      animations: {
        enabled: true,
      },
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
      colors: ["#00B746"],
    },
    grid: {
      borderColor: "#e0e0e0",
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.5,
      },
    },
    markers: {
      size: 0,
      colors: ["#00B746"],
      strokeWidth: 0,
      hover: {
        size: 6,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeFormatter: {
          year: "yyyy",
          month: "MMM 'yy",
          day: "dd MMM",
          hour: "HH:mm",
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => value.toFixed(0),
      },
      title: {
        text: "Price",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "#333",
        },
      },
    },
    title: {
      text: `${symbol} Price Movement`,
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    tooltip: {
      x: {
        format: "HH:mm",
      },
      y: {
        formatter: (value) => `${value.toFixed(0)} VND`,
      },
    },
    theme: {
      mode: "light",
    },
  };

  const seriesData = data
    .filter((item) => {
      // Add debug logging for filter
      const isValid =
        item &&
        typeof item.TradingDate === "string" &&
        typeof item.Time === "string" &&
        item.Value;
      if (!isValid) {
        console.log("Filtered out item:", item);
      }
      return isValid;
    })
    .map((item) => {
      try {
        // Properly format the date string
        const [day, month, year] = item.TradingDate.split("/");
        const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
          2,
          "0"
        )}`;
        const timeStr = item.Time.padStart(8, "0"); // Ensure proper time format HH:mm:ss

        const timestamp = new Date(`${dateStr}T${timeStr}`).getTime();
        const value = parseFloat(item.Value);

        // Debug each transformation
        console.log("Processing item:", {
          original: item,
          dateStr,
          timeStr,
          timestamp,
          value,
        });

        return {
          x: timestamp,
          y: value,
        };
      } catch (error) {
        console.error("Error processing item:", item, error);
        return null;
      }
    })
    .filter((item) => {
      const isValid = item && !isNaN(item.x) && !isNaN(item.y);
      if (!isValid) {
        console.log("Invalid processed item:", item);
      }
      return isValid;
    })
    .sort((a, b) => a.x - b.x);

  console.log("Final seriesData:", seriesData);

  if (seriesData.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-[90vw] max-w-[1200px]">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {symbol} Price Chart
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="flex items-center justify-center h-[500px]">
            <p className="text-gray-500">Invalid data format</p>
          </div>
        </div>
      </div>
    );
  }

  const series = [
    {
      name: symbol,
      data: seriesData,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[90vw] max-w-[1200px]">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {symbol} Price Chart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={500}
        />
      </div>
    </div>
  );
};

export default ChartModal;
