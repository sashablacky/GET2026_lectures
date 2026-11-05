import { useState } from 'react';

export function Alert({ type = 'warning', heading, Children, closable, onClose }) {
  const [visible, setVisible] = useState(true);

  /*   if (!visible) {
    return null;
  } */

  /* onClose = function () {
    console.log('ocClose invoked fromm the child');
  }; */

  function callBack1() {
    console.log('call back function invoked');
    setVisible(false);
    onClose('some datat from child component');
  }
  return (
    <>
      <div>{type === 'warning' ? 'Warn' : 'Info'}</div>
      <div>{heading}</div>
      <div>{Children}</div>
      <div>{closable && <button onClick={callBack1}>sometext</button>}</div>
    </>
  );
}
