'use client';

import { useCommandContext } from '@/shared/components/command.provider';
import { Button, HStack, Input } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

function InviteUrl () {
  const { setCommandText } = useCommandContext();
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, [url]);

  return (
    <HStack>
      <Input
        w="calc(100% - 80px)"
        type="text"
        readOnly
        value={url}
        borderWidth={0}
        borderRadius={0}
        lineHeight={0}
        h="32px"
        borderBottom="1px solid #000"
        _focus={{
          borderWidth: 0,
          borderBottom: '1px solid #000'
        }}
      />
      <Button
        minW="80px"
        onClick={() => {
          global.navigator.clipboard
            .writeText(url)
            .then(() => {
              setCommandText('クリップボードにコピーしました');
            })
            .catch(() => {
              setCommandText('クリップボードへのコピーに失敗しました');
            });
        }}
      >
        コピー
      </Button>
    </HStack>
  );
}

export default React.memo(InviteUrl);
