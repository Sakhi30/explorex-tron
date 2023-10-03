import React, { createContext, useContext, useState, ReactNode } from "react";

interface WidgetContextProps {
  showWidget: boolean;
  openWidget: () => void;
  closeWidget: () => void;
}

export const WidgetContext = createContext<WidgetContextProps | undefined>(
  undefined
);

interface WidgetProviderProps {
  children: ReactNode;
}

export const WidgetProvider: React.FC<WidgetProviderProps> = ({ children }) => {
  const [showWidget, setShowWidget] = useState(false);

  const openWidget = () => {
    // window.location.reload();
    setShowWidget(true);
  };

  const closeWidget = () => {
    setShowWidget(false);
  };

  return (
    <WidgetContext.Provider value={{ showWidget, openWidget, closeWidget }}>
      {children}
    </WidgetContext.Provider>
  );
};

export const useWidget = () => {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error("useWidget must be used within a WidgetProvider");
  }
  return context;
};
