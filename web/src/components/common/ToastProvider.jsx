import { useEffect } from "react";
import { useState } from "react";
import { ToastContext } from "../../hooks/useToast";

const Toast = ({ id, message, duration, onHide }) => {
  useEffect(() => {
    const timer = setTimeout(() => onHide(id), duration);
    return () => clearTimeout(timer);
  }, []);
  return <div>{message}</div>;
};

let toastCount = 0;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message = " ", duration = 3000) => {
    const toast = { id: ++toastCount, message, duration };
    setToasts((toasts) => [...toasts, toast]);
  };

  const removeToast = (id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <ul className="fixed top-0 right-0 p-8">
        {toasts.map((toast) => (
          <li
            key={toast.id}
            className="px-8 py-4 mb-4 last:mb-0 rounded-md bg-amber-100 text-amber-600 shadow-sm toast-animation"
          >
            <Toast {...toast} onHide={removeToast} />
          </li>
        ))}
      </ul>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
