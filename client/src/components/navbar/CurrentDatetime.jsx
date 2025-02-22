const CurrentDatetime = ({ data }) => {
  const displayCurrentDaytime = (data) => {
    if (data === null) {
      return "Error: Data null";
    }
    // console.log(currentDatetime);

    const dayOfWeek = String(data.dayOfWeek);
    const dayOfMonth = String(data.dayOfMonth).padStart(2, "0");
    const month = String(data.month).padStart(2, "0");
    const year = data.year;
    const hour = String(data.hour).padStart(2, "0");
    const minute = String(data.minute).padStart(2, "0");
    const second = String(data.second).padStart(2, "0");

    return `${dayOfWeek} ${dayOfMonth}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  return (
    <div className="flex items-center justify-center font-mono text-[15px] font-normal tracking-wider">
      {displayCurrentDaytime(data)}
    </div>
  );
};

export default CurrentDatetime;
