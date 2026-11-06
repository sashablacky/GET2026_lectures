import { memo } from 'react';

type Props = {
  onProp: () => void;
};

export const Reset = memo(({ onProp }: Props) => {
  console.log('child component invoked');
  return <button>Reset</button>;
});

Reset.displayName = 'Reset in profiler';
