import { useEffect, useState } from "react";
import { Grid } from "react-window";

const GAP = 16;
const CARD_W = 240;
const CARD_H = 280;

function getColumnCount(width) {
  if (width >= 1024) return 4;
  if (width >= 640) return 3;
  return 2;
}

function useWindowSize() {
  const [size, setSize] = useState(() => ({
    w: window.innerWidth,
    h: window.innerHeight,
  }));

  useEffect(() => {
    const onResize = () =>
      setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
}

const Cell = ({
  columnIndex,
  rowIndex,
  style,
  items,
  columnCount,
  renderItem,
}) => {
  const index = rowIndex * columnCount + columnIndex;
  if (index >= items.length) return null;

  return (
    <div style={{ ...style, padding: GAP / 2 }}>{renderItem(items[index])}</div>
  );
};

const ProductGridVirtualized = ({ items, renderItem }) => {
  const { w } = useWindowSize();
  const columnCount = getColumnCount(w);
  const rowCount = Math.ceil(items.length / columnCount);

  const gridWidth = Math.min(1200, w - 32);
  const gridHeight = 700;

  return (
    <Grid
      cellComponent={Cell}
      cellProps={{ items, columnCount, renderItem }}
      columnCount={columnCount}
      columnWidth={CARD_W + GAP}
      rowCount={rowCount}
      rowHeight={CARD_H + GAP}
      overscanCount={3}
      style={{ width: gridWidth, height: gridHeight }}
    />
  );
};

export default ProductGridVirtualized;
