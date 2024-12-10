import React, { createContext, useContext, useState, ReactNode } from "react";

interface DevToolsContextType {
  logs: string[];
  addLog: (message: string) => void;
}

const DevToolsContext = createContext<DevToolsContextType | undefined>(
  undefined
);

export const DevToolsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, message]);
  };

  return (
    <DevToolsContext.Provider value={{ logs, addLog }}>
      {children}
    </DevToolsContext.Provider>
  );
};

export const useDevTools = () => {
  const context = useContext(DevToolsContext);
  if (!context) {
    throw new Error("useDevTools must be used within a DevToolsProvider");
  }
  return context;
};