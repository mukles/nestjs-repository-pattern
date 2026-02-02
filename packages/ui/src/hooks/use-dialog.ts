import { useState } from "react";

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const openChange = (value?: boolean) => {
    setIsOpen(value !== undefined ? value : true);
  };

  return {
    isOpen,
    openChange,
  };
}
