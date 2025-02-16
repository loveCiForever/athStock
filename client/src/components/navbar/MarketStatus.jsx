const MarketStatus = ({ currentDateTime }) => {
  const checkMarketStatus = (data) => {
    if (!data || !data.year) {
      return "Market Close";
    }

    const currentDate = new Date(
      Number(data.year),
      Number(data.month) - 1,
      Number(data.dayOfMonth),
      Number(data.hour),
      Number(data.minute),
      Number(data.second)
    );
    const dayOfWeek = data.dayOfWeek;
    if (dayOfWeek === "Sunday" || dayOfWeek === "Saturday") {
      return "Market Close";
    }
    const sessions = [
      { start: "09:00", end: "09:15", label: "Opening Session" },
      { start: "09:15", end: "11:30", label: "Morning Trading Session" },
      { start: "11:30", end: "13:00", label: "Lunch break" },
      { start: "13:00", end: "14:30", label: "Afternoon Trading Session" },
      { start: "14:30", end: "15:00", label: "Post Trading Session" },
    ];
    for (const session of sessions) {
      const start = new Date(currentDate);
      const end = new Date(currentDate);
      const [startHour, startMinute] = session.start.split(":").map(Number);
      const [endHour, endMinute] = session.end.split(":").map(Number);
      start.setHours(startHour, startMinute, 0, 0);
      end.setHours(endHour, endMinute, 0, 0);
      if (currentDate >= start && currentDate < end) {
        return session.label;
      }
    }

    return "Market Close";
  };

  const getColorBaseOnMarketStatus = (currentDateTime) => {
    const marketStatus = checkMarketStatus(currentDateTime);
    if (
      marketStatus === "Opening Session" ||
      marketStatus === "Post Trading Session"
    )
      return "bg-blue-200";
    else if (
      marketStatus === "Morning Trading Session" ||
      marketStatus === "Afternoon Trading Session"
    )
      return "bg-green-200";
    else if (marketStatus === "Lunch break") return "bg-yellow-200";
    else if (marketStatus === "Market Close") return "bg-gray-200";

    return "bg-red-200";
  };

  return (
    <span
      className={`text-sm mr-6 font-normal font-mono text-gray-800 whitespace-pre p-2 rounded-md text-center px-4 py-1 ${getColorBaseOnMarketStatus(
        currentDateTime
      )}`}
    >
      {checkMarketStatus(currentDateTime)}
    </span>
  );
};

export default MarketStatus;
