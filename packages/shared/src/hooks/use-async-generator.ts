import { useState, useEffect } from 'react';

export async function* asyncGenerator<T>({
  fn,
  repeatTill,
  timeout = 800,
}: {
  fn: () => Promise<T | null>;
  repeatTill: boolean;
  timeout?: number;
}): AsyncGenerator<T | null, void, unknown> {
  let data = await fn();

  while (repeatTill) {
    await new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
    yield data;
    // eslint-disable-next-line no-await-in-loop
    data = await fn();
  }
  // we need to do an additional yield for the last task status change
  yield data;
}

export default function useAsyncGenerator<T>({
  fn,
  repeatTill,
  timeout = 800,
}: {
  fn: (abortController: AbortController) => () => Promise<T | null>;
  repeatTill: (data?: T | null) => boolean;
  timeout?: number;
}): {
  abort: (reason?: any) => void;
  abortSignal: AbortSignal;
  data: T | null;
} {
  const [item, setItem] = useState<T | null>(null);
  const controller = new AbortController();

  useEffect(() => {
    (async () => {
      const shouldRepeat = repeatTill(item);
      const loadDataFn = await fn(controller);
      // we have to use async iterator here, so we turn off this rule
      // eslint-disable-next-line no-restricted-syntax
      for await (const data of asyncGenerator<T>({
        fn: loadDataFn,
        repeatTill: shouldRepeat,
        timeout,
      })) {
        setItem(data);
      }
    })();

    return () => {
      controller.abort();
    };
  }, []);

  return {
    abort: controller.abort,
    abortSignal: controller.signal,
    data: item,
  };
}
