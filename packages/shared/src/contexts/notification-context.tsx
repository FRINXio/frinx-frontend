import React, { createContext, FC, ReactNode, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import ToastNotification from '../components/toast-notification/toast-notification';

const MAX_NOTIFICATION_COUNT = 4;

export type ToastProps = {
  type: 'warning' | 'error' | 'info' | 'success';
  title?: string;
  timeout?: number;
  content: ReactNode;
};
type ToastPropsWithId = ToastProps & { id: string };
export type ContextProps = {
  addToastNotification: (toastProps: ToastProps) => void;
};

const NotificationContext = createContext<ContextProps | null>(null);

export const CustomToastProvider: FC = ({ children }) => {
  const [toasts, setToasts] = useState<ToastPropsWithId[]>([]);
  const [visibleToasts, setVisibleToasts] = useState<Set<string>>(new Set());

  const handlers = useMemo(
    () => ({
      addToastNotification: (toastProps: ToastProps) => {
        const id = uuid();
        setVisibleToasts((prevSet) => {
          const nextSet = new Set(prevSet);
          nextSet.add(id);
          return nextSet;
        });
        setToasts((prevToasts) =>
          [
            {
              ...toastProps,
              id,
            },
            ...prevToasts,
          ].slice(0, MAX_NOTIFICATION_COUNT),
        );
      },
    }),
    [],
  );

  return (
    <NotificationContext.Provider value={handlers}>
      {toasts.map((t, index) => (
        <ToastNotification
          index={index}
          key={t.id}
          isVisible={visibleToasts.has(t.id)}
          title={t.title}
          type={t.type}
          timeout={t.timeout}
          onClose={() => {
            setVisibleToasts((prevSet) => {
              const nextSet = new Set(prevSet);
              nextSet.delete(t.id);
              return nextSet;
            });
          }}
          onAnimationEnd={() => {
            setToasts((prevToasts) => {
              const nextToasts = prevToasts.filter((toast) => toast.id !== t.id);
              return nextToasts;
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
