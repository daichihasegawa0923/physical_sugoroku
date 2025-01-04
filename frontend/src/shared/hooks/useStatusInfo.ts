'use client';

import { WebsocketResolver } from '@/shared/function/websocket.resolver';
import useLocalRoomInfo from '@/shared/hooks/useLocalRoomInfo';
import { type ResultFromName } from 'physical-sugoroku-common/src/event';
import { useEffect, useState } from 'react';

export function useStatusInfo (roomId: string) {
  const [status, setStatus] = useState<
  ResultFromName<'status'>['value'] | null
  >(null);
  const { getByRoomId } = useLocalRoomInfo();

  const fetch = async () => {
    WebsocketResolver.sendSync('status', { roomId }, (data) => {
      setStatus(() => {
        return data;
      });
    });
  };

  useEffect(() => {
    WebsocketResolver.add('updateGameObject', {
      id: 'sequenceComponent',
      func: (data) => {
        setStatus((prev) => {
          if (prev == null) return prev;
          return { ...prev, sequence: data.sequence };
        });
      }
    });
    WebsocketResolver.add('fetchGameObjects', {
      id: 'sequenceComponent',
      func: (data) => {
        setStatus((prev) => {
          if (prev == null) return prev;
          return { ...prev, sequence: data.sequence };
        });
      }
    });
  }, []);

  return {
    fetch,
    status,
    isHost:
      status && getByRoomId(roomId)?.myMemberId === status?.hostRoomMemberId
  };
}
