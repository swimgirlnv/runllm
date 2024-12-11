import React, { useState, useEffect } from "react";

const TILE_SIZE = 100; // Size of each tile (in pixels)

const SlidingTileGame: React.FC<{ imageUrl: string; onStart?: () => void; onComplete: () => void }> = ({
  imageUrl,
  onStart,
  onComplete,
}) => {
  const GRID_SIZE = 3; // 3x3 grid
  const EMPTY_TILE = GRID_SIZE * GRID_SIZE - 1;

  React.useEffect(() => {
    if (onStart) onStart(); // Trigger onStart when the component mounts
  }, [onStart]);

  // Generate initial tiles (in order)
  const generateTiles = () =>
    Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, index) => index);

  const [tiles, setTiles] = useState<number[]>(generateTiles());
  const [emptyTileIndex, setEmptyTileIndex] = useState<number>(EMPTY_TILE);

  // Shuffle tiles, ensuring solvability
  useEffect(() => {
    const shuffledTiles = shuffleTiles(generateTiles());
    setTiles(shuffledTiles);
    setEmptyTileIndex(shuffledTiles.indexOf(EMPTY_TILE));
  }, []);

  const shuffleTiles = (array: number[]): number[] => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    // Ensure the puzzle is solvable by checking inversions
    return isSolvable(shuffled) ? shuffled : shuffleTiles(array);
  };

  const isSolvable = (array: number[]): boolean => {
    const inversions = array.reduce((count, value, index) => {
      for (let j = index + 1; j < array.length; j++) {
        if (array[j] < value && array[j] !== EMPTY_TILE) count++;
      }
      return count;
    }, 0);
    return inversions % 2 === 0;
  };

  const canMoveTile = (index: number): boolean => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const emptyRow = Math.floor(emptyTileIndex / GRID_SIZE);
    const emptyCol = emptyTileIndex % GRID_SIZE;

    // Tile can move if it's adjacent to the empty tile
    return (
      (row === emptyRow && Math.abs(col - emptyCol) === 1) || // Same row, adjacent column
      (col === emptyCol && Math.abs(row - emptyRow) === 1) // Same column, adjacent row
    );
  };

  const handleTileClick = (index: number) => {
    if (canMoveTile(index)) {
      const newTiles = [...tiles];
      newTiles[emptyTileIndex] = newTiles[index];
      newTiles[index] = EMPTY_TILE;
      setTiles(newTiles);
      setEmptyTileIndex(index);

      // Check if the puzzle is solved
      if (newTiles.every((value, idx) => value === idx)) {
        alert("Puzzle Solved!");
        onComplete();
      }
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_SIZE}, ${TILE_SIZE}px)`,
        gap: "2px",
        width: `${GRID_SIZE * TILE_SIZE}px`,
        height: `${GRID_SIZE * TILE_SIZE}px`,
        border: "2px solid black",
        position: "relative",
      }}
    >
      {tiles.map((tile, index) =>
        tile !== EMPTY_TILE ? (
          <div
            key={index}
            onClick={() => handleTileClick(index)}
            style={{
              width: `${TILE_SIZE}px`,
              height: `${TILE_SIZE}px`,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: `${GRID_SIZE * TILE_SIZE}px ${GRID_SIZE * TILE_SIZE}px`,
              backgroundPosition: `${-(tile % GRID_SIZE) * TILE_SIZE}px ${
                -Math.floor(tile / GRID_SIZE) * TILE_SIZE
              }px`,
              border: "1px solid gray",
              cursor: "pointer",
            }}
          />
        ) : (
          <div
            key={index}
            style={{
              width: `${TILE_SIZE}px`,
              height: `${TILE_SIZE}px`,
              backgroundColor: "white",
            }}
          />
        )
      )}
    </div>
  );
};

export default SlidingTileGame;