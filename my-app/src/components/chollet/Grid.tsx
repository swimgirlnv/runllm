import React from "react";

interface GridProps {
  grid: string[][];
  editable?: boolean;
  onCellClick?: (row: number, col: number) => void;
}

const Grid: React.FC<GridProps> = ({ grid, editable, onCellClick }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${grid[0].length}, 30px)`,
        gap: "2px",
      }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            onClick={() => editable && onCellClick?.(rowIndex, colIndex)}
            style={{
              width: "30px",
              height: "30px",
              backgroundColor: cell,
              border: "1px solid gray",
              cursor: editable ? "pointer" : "default",
            }}
          />
        ))
      )}
    </div>
  );
};

export default Grid;