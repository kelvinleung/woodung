import { useEffect } from "react";
import { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { ToastContext } from "../../hooks/useToast";

const TOAST_STYLE = {
  info: {
    bgColor: "bg-amber-100",
    textColor: "text-amber-600",
  },
  error: {
    bgColor: "bg-red-100",
    textColor: "text-red-600",
  },
  success: {
    bgColor: "bg-green-100",
    textColor: "text-green-600",
  },
};

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

  const toast = (message, config = {}, type = "info") => {
    if (!message) return;
    const duration = config.duration || 3000;
    const toast = { id: ++toastCount, message, duration, type };
    setToasts((toasts) => [...toasts, toast]);
  };

  // toast.info 调用
  ["info", "error", "success"].forEach((type) => {
    toast[type] = (message, config) => {
      toast(message, config, type);
    };
  });
  const removeToast = (id) => {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <TransitionGroup
        component="ul"
        className="fixed top-0 right-0 p-8 flex flex-col items-end"
      >
        {toasts.map((toast) => (
          <CSSTransition key={toast.id} timeout={300} classNames="toast">
            <li
              className={`px-8 py-4 mb-4 last:mb-0 rounded-md shadow-sm ${
                TOAST_STYLE[toast.type].bgColor
              } ${TOAST_STYLE[toast.type].textColor}`}
            >
              <Toast {...toast} onHide={removeToast} />
            </li>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
