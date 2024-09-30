import React, { useState } from 'react';

type GenericSingleImageContextType = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export const GenericSingleImageContext =
  React.createContext<GenericSingleImageContextType | null>(null);

// Fix: Using React.FC or PropsWithChildren to include children automatically
export const GenericSingleImageProvider: React.FC<
  React.PropsWithChildren<{}>
> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <GenericSingleImageContext.Provider value={{ loading, setLoading }}>
      {children}
    </GenericSingleImageContext.Provider>
  );
};
