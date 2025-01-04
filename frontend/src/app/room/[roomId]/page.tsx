import { StatusContextProvider } from '@/shared/components/status.provider';
import Index from '@/app/room/[roomId]/_components';

export default function Page ({ params }: { params: { roomId: string } }) {
  return (
    <StatusContextProvider roomId={params.roomId}>
      <Index roomId={params.roomId} />
    </StatusContextProvider>
  );
}
