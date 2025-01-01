'use client';

import Command from '@/shared/components/command';
import CommandAll from '@/shared/components/command.all';
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';

type CommandStatus = 'NONE' | 'DISPLAY' | 'HIDING';
type CommandType = 'DEFAULT' | 'ALL';

interface CommandContextState {
  text: string;
  status: CommandStatus;
  type: CommandType;
  setCommandText: (value: string, type?: CommandType) => void;
}

const DefaultCommandProps: CommandContextState = {
  text: '',
  setCommandText: () => {},
  status: 'NONE',
  type: 'DEFAULT'
} satisfies CommandContextState;

const CommandContext = createContext<CommandContextState>(DefaultCommandProps);

export const useCommandContext = () => useContext(CommandContext);

export function CommandContextProvider ({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<CommandStatus>('NONE');
  const [text, setText] = useState<string>('');
  const [type, setType] = useState<CommandType>('DEFAULT');
  const animationCb = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!text) return;
    if (animationCb.current != null) {
      clearTimeout(animationCb.current);
    }
    setStatus(() => 'DISPLAY');
    const removeCb = setTimeout(() => {
      setStatus(() => 'HIDING');
      setTimeout(() => {
        setText(() => '');
        setStatus(() => 'NONE');
      }, 400);
    }, 3000);
    animationCb.current = removeCb;
    return () => {
      clearTimeout(removeCb);
    };
  }, [text]);

  return (
    <CommandContext.Provider
      value={{
        text,
        setCommandText: (value, type) => {
          setType(() => (type == null ? 'DEFAULT' : type));
          setText(() => value);
        },
        type,
        status
      }}
    >
      {type === 'DEFAULT' && <Command />}
      {type === 'ALL' && <CommandAll />}
      {children}
    </CommandContext.Provider>
  );
}
