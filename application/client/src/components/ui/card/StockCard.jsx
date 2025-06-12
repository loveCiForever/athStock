import { TruncateString } from "../../../utils/formatString";

const StockCard = ({
  Symbol,
  SymbolName,
  Open,
  High,
  Close,
  Low,
  Volume,
  onClick,
}) => {
  return (
    <button
      className="cursor-pointer grid grid-cols-[0.5fr_2fr_1fr_1fr_1fr_1fr_1fr] p-2 font-medium text-white w-full gap-2 hover:bg-black/10 text-right"
      onClick={() => onClick(Symbol)}
    >
      <span className="text-left">
        {Symbol ? Symbol : "Failed to get symbol"}
      </span>
      <span className="text-left">
        {SymbolName
          ? TruncateString(SymbolName, 40)
          : "Failed to get company name"}
      </span>
      <span className="text-[var(--stock-up)]">{Open ? Open : 0}</span>
      <span className="text-[var(--stock-ceiling)]">{High ? High : 0}</span>
      <span className="text-[var(--stock-down)]">{Close ? Close : 0}</span>
      <span className="text-[var(--stock-floor)]">{Low ? Low : 0}</span>
      <span>{Volume ? Volume : 0}</span>
    </button>
  );
};

export default StockCard;
