import React, { PropsWithChildren } from "react";
import { createPortal } from "react-dom";

const Modal = ({ open, children }: PropsWithChildren<{ open: boolean }>) => {
  if (!open) return null;

  // Render children into the 'modal-root' DOM node
  return createPortal(
    <div className="absolute bg-[rgba(0,0,0,0.5)] flex justify-center w-full h-full">
      <div className="mt-[4rem] bg-[rgb(20,20,20)] w-[60%] h-[60%] max-w-[500px] max-h-[500px] rounded-sm">
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLElement
  );
};

export default Modal;
