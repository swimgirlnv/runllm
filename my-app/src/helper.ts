// export const unlockNode = (
//     nodeId: number,
//     nodes: Node[],
//     setNodes: React.Dispatch<React.SetStateAction<Node[]>>,
//     advanceGameState: () => void
//   ) => {
//     setNodes((prev) =>
//       prev.map((node) =>
//         node.id === nodeId ? { ...node, unlocked: true } : node
//       )
//     );
  
//     const allUnlocked = nodes.every((node) => node.unlocked);
//     if (allUnlocked) advanceGameState();
//   };
  
//   export const addDynamicNote = async (
//     assistant: "alice" | "bob",
//     context: string,
//     threadId: string,
//     sendMessageToAssistant: (
//       assistant: string,
//       message: string,
//       threadId: string
//     ) => Promise<string>,
//     setNotes: React.Dispatch<React.SetStateAction<string[]>>
//   ) => {
//     const generatedNote = await sendMessageToAssistant(
//       assistant,
//       `Reflect on the following event involving Charlie: ${context}`,
//       threadId
//     );
//     setNotes((prev) => [
//       ...prev,
//       `${assistant === "alice" ? "Alice" : "Bob"}: ${generatedNote}`,
//     ]);
//   };