'use client';

interface Props {
  id: string;
}

export default function Canvas({ id }: Props) {
  return (
    <canvas
      id={id}
      style={{ width: '100%', height: '100%', touchAction: 'none' }}
    />
  );
}
