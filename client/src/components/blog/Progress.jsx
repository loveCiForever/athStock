const Progress = ({ progress = 0, text = "Uploading...", className }) => {
  return (
    <div className={className}>
      <div className="w-full">
        <div className="mb-2 flex justify-between items-center">
          <h3 className="text-xs">{text}</h3>
          <span className="text-sm">{progress}%</span>
        </div>
        <div
          className="flex w-full h-2 bg-dark-grey/30 rounded-full overflow-hidden dark:bg-neutral-700"
          role="progressbar"
        >
          <div
            className="flex flex-col justify-center rounded-full overflow-hidden bg-black text-xs text-white text-center whitespace-nowrap transition duration-500 dark:bg-blue-500"
            style={{ width: progress + "%" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
