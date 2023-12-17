import { PropsWithChildren, createContext, useContext, useMemo, useState } from 'react';

type LayoutContextType = {
  title: string | undefined;
  setTitle: (title: string | undefined) => void;
  renderActions: JSX.Element | undefined;
  setRenderActions: (actions: JSX.Element | undefined) => void;
};
const LayoutContext = createContext({} as LayoutContextType);

export const LayoutContextProvider = (props: PropsWithChildren) => {
  const [title, setTitle] = useState<LayoutContextType['title']>(undefined);
  const [renderActions, setRenderActions] = useState<LayoutContextType['renderActions']>(undefined);

  const context = useMemo(
    () => ({
      title,
      setTitle,
      renderActions,
      setRenderActions,
    }),
    [title, setTitle, renderActions, setRenderActions]
  );

  return <LayoutContext.Provider value={context}>{props.children}</LayoutContext.Provider>;
};

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('Context not found');
  }
  return context;
};
