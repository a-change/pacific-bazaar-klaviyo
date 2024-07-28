import React, {createContext, useState} from 'react';

type VisualSearchContextType = {
  visualSearchParams: any;
  setVisualSearchParams: (params: any) => void;
};

const initialState = {};

const VisualSearchContext = createContext<VisualSearchContextType | undefined>(undefined);

const VisualSearchProvider = (props: any) => {
  const [visualSearchParams, setVisualSearchParams] = useState(initialState);

  return (
    <VisualSearchContext.Provider value={{visualSearchParams, setVisualSearchParams}}>
      {props.children}
    </VisualSearchContext.Provider>
  );
};

export {VisualSearchContext, VisualSearchProvider};
