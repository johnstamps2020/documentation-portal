import { HeaderOptions } from 'components/Layout/Header/Header';
import { createContext, useState, useContext } from 'react';

interface LayoutContextInterface {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  headerOptions: HeaderOptions;
  setHeaderOptions: React.Dispatch<React.SetStateAction<HeaderOptions>>;
  path: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor: React.CSSProperties['backgroundColor'];
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
}

export const LayoutContext = createContext<LayoutContextInterface | null>(null);

export function LayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState('');
  const [headerOptions, setHeaderOptions] = useState({});
  const [backgroundColor, setBackgroundColor] = useState('');
  const [path, setPath] = useState('');

  // TODO: please delete this comment, I'm just testing
  
  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        headerOptions,
        setHeaderOptions,
        path,
        setPath,
        backgroundColor,
        setBackgroundColor,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayoutContext() {
  const value = useContext(LayoutContext);

  if (!value) {
    throw new Error(
      'useLayoutContext must be used within LayoutContextProvider'
    );
  }

  return value;
}
