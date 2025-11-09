import React, { createContext, useContext, useState } from "react";

const ShowcaseContext = createContext();

export const ShowcaseProvider = ({ children }) => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  const triggerRefresh = () => setRefreshFlag((prev) => !prev);

  return (
    <ShowcaseContext.Provider value={{ refreshFlag, triggerRefresh }}>
      {children}
    </ShowcaseContext.Provider>
  );
};

export const useShowcase = () => useContext(ShowcaseContext);
