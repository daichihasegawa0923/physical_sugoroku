'use client';

interface Props {
  id: string;
}

export default function Canvas ({ id }: Props) {
  return (
    <canvas
      id={id}
      style={{
        width: '100%',
        minHeight: 'calc(100svh - 54px)',
        touchAction: 'none'
      }}
    />
  );
}
