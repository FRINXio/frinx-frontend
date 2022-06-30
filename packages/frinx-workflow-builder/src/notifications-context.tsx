import React, { createContext, FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ToastNotification from './toast-notification';

const MAX_NOTIFICATION_COUNT = 4;

export type ToastProps = {
  type: 'warning' | 'error' | 'info' | 'success';
  title?: string;
  timeout?: number;
  content: ReactNode;
};
type ToastPropsId = ToastProps & { id: string };
export type ContextProps = {
  addToastNotification: (toastProps: ToastProps) => void;
};

const NotificationContext = createContext<ContextProps | null>(null);

export const CustomToastProvider: FC = ({ children }) => {
  const [toasts, setToasts] = useState<ToastPropsId[]>([]);
  const [visibleToasts, setVisibleToasts] = useState<Set<string>>(new Set());

  const addToastNotification = useCallback((tProps: ToastProps) => {
    const id = uuid();
    setVisibleToasts((v) => {
      const v2 = new Set(v);
      v2.add(id);
      return v2;
    });
    setToasts((t) =>
      [
        {
          ...tProps,
          id,
        },
        ...t,
      ].slice(0, MAX_NOTIFICATION_COUNT),
    );
  }, []);

  const notificationContextValue = useMemo(() => ({ addToastNotification }), [addToastNotification]);

  return (
    <NotificationContext.Provider value={notificationContextValue}>
      {toasts.map((t, index) => (
        <ToastNotification
          index={index}
          key={t.id}
          isVisible={visibleToasts.has(t.id)}
          title={t.title}
          type={t.type}
          onClose={() => {
            setVisibleToasts((v) => {
              const v2 = new Set(v);
              v2.delete(t.id);
              return v2;
            });
          }}
          onAnimationEnd={() => {
            setToasts((ts) => {
              const newToasts = ts.filter((toast) => toast.id !== t.id);
              return newToasts;
            });
          }}
        >
          {t.content}
        </ToastNotification>
      ))}
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
