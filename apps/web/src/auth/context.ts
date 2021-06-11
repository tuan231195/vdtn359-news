import React, { useContext } from 'react';
export const UserContext = React.createContext(null);
export const useUser = () => useContext(UserContext);
