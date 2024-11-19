import { createContext, useEffect, useState } from "react";


export const StoreContext = createContext(null);


const StoreContextProvider = (props)=> {
    const ApiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
    const [user,setUser] = useState('');
  // provide value to context
  const contextValue = {
    ApiUrl,
  };


  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
}

export default StoreContextProvider;