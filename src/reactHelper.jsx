import { useRef, useEffect } from 'react';

export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const useEffectAsync = (effect, deps) => {
  try{
    useEffect(() => {
    effect();
  }, deps);}
  catch(e){
  }
};