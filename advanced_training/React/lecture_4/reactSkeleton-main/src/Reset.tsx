import { memo } from 'react';

type Props = {
  propMethod: () => void;
};

export const Reset = memo(({ propMethod }: Props) => {
  console.log('reset function invoked');
  return <button onClick={propMethod}> Return</button>;
});

Reset.displayName = 'Reset in profiler';
