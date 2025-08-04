import React, { useState } from 'react';
import SubtotalContext from './SubtotalContext';

function SubtotalProvider({ children }) {
  const [subtotal, setSubtotal] = useState(0);
  //Sets scope of subtotal to be basket for ease of use. Passes it down through subtotal and setSubtotal
  return (
    <SubtotalContext.Provider value={{ subtotal, setSubtotal }}>
      {children}
    </SubtotalContext.Provider>
  );
}

export default SubtotalProvider;
