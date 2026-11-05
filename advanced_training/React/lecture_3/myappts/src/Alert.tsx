import React, { useState } from "react";

type myType = {
  type?: string;
  heading: string;
  children: React.ReactNode;
  closable: boolean;
  onClose: () => void;
};

export function Alert({ type, heading, children, closable, onClose }: myType) {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return null;
  }

  /* onClose = function () {
    console.log('ocClose invoked fromm the child');
  }; */

  function callBack1() {
    console.log("call back function invoked");
    setVisible(false);
    onClose();
  }
  return (
    <>
      <div>{type === "warning" ? "Warn" : "Info"}</div>
      <div>{heading}</div>
      <div>{children}</div>
      <div>{closable && <button onClick={callBack1}>sometext</button>}</div>
    </>
  );
}
