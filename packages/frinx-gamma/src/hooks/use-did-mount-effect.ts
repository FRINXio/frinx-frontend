import { useEffect, useRef } from 'react';

const useDidMountEffect = (func: () => void, deps?: unknown[]): void => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
};

export default useDidMountEffect;
