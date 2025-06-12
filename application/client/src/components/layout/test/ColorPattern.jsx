// ./application/client/src/components/layout/test/ColorPattern.jsx

import { getTextStockColor } from "../../../utils/getColor";

const ColorCard = ({ title, type, theme }) => {
  return (
    <div className={`p-4 border rounded ${getTextStockColor(type, theme)}`}>
      {title}
    </div>
  );
};

export const ColorPattern = ({ theme }) => {
  return (
    <div className="color-showcase flex flex-col text-center">
      <h1 className={`text-3xl font-semibold mb-5`}>Stock Color Pattern</h1>
      <div className="grid grid-cols-5 gap-8">
        <ColorCard title="Up (Green)" type="up" theme={theme} />
        <ColorCard title="Down (Red)" type="down" theme={theme} />
        <ColorCard title="No Change" type="nochange" theme={theme} />
        <ColorCard title="Ceiling" type="ceiling" theme={theme} />
        <ColorCard title="Floor" type="floor" theme={theme} />
      </div>
    </div>
  );
};
