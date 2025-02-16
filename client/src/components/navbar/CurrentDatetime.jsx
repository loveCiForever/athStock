const CurrentDatetime = ({ currentDatetime }) => {
  const displayCurrentDaytime = (currentDatetime) => {
    if (currentDatetime === null) {
      return "Error: CurrentDatetime";
    }
    // console.log(currentDatetime);

    const dayOfWeek = String(currentDatetime.dayOfWeek);
    const dayOfMonth = String(currentDatetime.dayOfMonth).padStart(2, "0");
    const month = String(currentDatetime.month).padStart(2, "0");
    const year = currentDatetime.year;
    const hour = String(currentDatetime.hour).padStart(2, "0");
    const minute = String(currentDatetime.minute).padStart(2, "0");
    const second = String(currentDatetime.second).padStart(2, "0");

    return `${dayOfWeek} ${dayOfMonth}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <div className="flex items-center justify-center font-normal font-mono text-gray-800 tracking-wider text-base">
      {displayCurrentDaytime(currentDatetime)}
    </div>
  );
};

export default CurrentDatetime;
