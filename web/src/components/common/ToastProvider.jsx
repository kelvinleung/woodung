import { useState, useEffect } from "react";
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

const Toast = ({ id, message, duration, type, onHide }) => {
  useEffect(() => {
    const timer = setTimeout(() => onHide(id), duration);
    return () => clearTimeout(timer);
  }, []);
  return (
    <div
      className={`px-8 py-4 rounded-md shadow-sm ${TOAST_STYLE[type].bgColor} ${TOAST_STYLE[type].textColor}`}
    >
      {message}
    </div>
  );
};

const ToastContainer = ({ toasts, onHide }) => {
  return (
    <TransitionGroup
      component="ul"
      className="fixed top-0 right-0 p-8 flex flex-col items-end"
    >
      {toasts.map((toast) => {
        const { id, type, message, duration } = toast;
        return (
          <CSSTransition key={id} timeout={300} classNames="toast">
            <li className="mb-4 last:mb-0">
              <Toast
                id={id}
                message={message}
                duration={duration}
                type={type}
                onHide={onHide}
              />
            </li>
          </CSSTransition>
        );
      })}
    </TransitionGroup>
  );
};

let toastCount = 0;

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, duration, onHideHandler, type) => {
    const toast = {
      id: ++toastCount,
      message,
      duration,
      onHideHandler,
      type,
    };
    setToasts((toasts) => [...toasts, toast]);
  };

  const toast = (message, config = {}, onHideHandler, type = "info") => {
    if (!message) return;
    if (typeof config === "function") {
      onHideHandler = config;
      config = {};
    }
    const duration = config.duration || 3000;
    addToast(message, duration, onHideHandler, type);
  };

  // toast.info 调用
  ["info", "error", "success"].forEach((type) => {
    toast[type] = (message, config, onHideHandler) => {
      toast(message, config, onHideHandler, type);
    };
  });

  const removeToast = (id) => {
    setToasts((toasts) =>
      toasts.filter((toast) => {
        if (toast.id === id) {
          if (typeof toast.onHideHandler === "function") {
            toast.onHideHandler();
          }
          return false;
        }
        return true;
      })
    );
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} onHide={removeToast} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
