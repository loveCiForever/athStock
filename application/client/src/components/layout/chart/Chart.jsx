import { useMemo } from "react";

export const lineChartOptions = useMemo(
  () => ({
    chart: {
      type: "area",
      stacked: false,
      height: 350,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: "zoom",
      },
    },
    stroke: {
      width: 2,
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 0,
    },
    title: {
      text: "Stock Price Change Movement",
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: undefined,
        color: "#b6b7b8",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0,
        opacityTo: 0,
        stops: [0, 50, 100],
      },
    },
    yaxis: {
      labels: {
        formatter: function (val) {
          return val.toFixed(2);
        },
        style: {
          colors: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
        },
      },

      title: {
        text: "Ratio Change (%)",
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#ffffff",
        },
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: "#ffffff",
          fontSize: "12px",
          fontWeight: "bold",
        },
      },
    },
    tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      shared: true,
      followCursor: false,
      intersect: false,
      inverseOrder: false,
      hideEmptySeries: true,
      fillSeriesColor: false,
      onDatasetHover: {
        highlightDataSeries: false,
      },
      cssClass: "my-custom-tooltip",
      x: {
        show: true,
        format: "dd MMM",
        formatter: undefined,
      },
      marker: {
        show: true,
      },
      fixed: {
        enabled: false,
        position: "topRight",
        offsetX: 0,
        offsetY: 0,
      },
    },
    legend: {
      show: false,
    },
  }),
  []
);
