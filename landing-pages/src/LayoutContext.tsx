import { LandingPageSelectorInContextProps } from 'components/LandingPage/LandingPageSelectorInContext';
import { createContext, useState, useContext } from 'react';

interface LayoutContextInterface {
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  path: string;
  setPath: React.Dispatch<React.SetStateAction<string>>;
  backgroundColor: React.CSSProperties['backgroundColor'];
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  selector?: LandingPageSelectorInContextProps;
  setSelector: React.Dispatch<
    React.SetStateAction<LandingPageSelectorInContextProps | undefined>
  >;
}

export const LayoutContext = createContext<LayoutContextInterface | null>(null);

export function LayoutContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [title, setTitle] = useState('');
  const [backgroundColor, setBackgroundColor] = useState('');
  const [path, setPath] = useState('');
  const [selector, setSelector] = useState<
    LandingPageSelectorInContextProps | undefined
  >(undefined);

  return (
    <LayoutContext.Provider
      value={{
        title,
        setTitle,
        path,
        setPath,
        backgroundColor,
        setBackgroundColor,
        selector,
        setSelector,
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
