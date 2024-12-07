'use client'

import Command from '@/shared/components/command'
import { createContext, type ReactNode, useContext, useState } from 'react'

interface CommandContextState {
  text: string
  setCommandText: (value: string) => void
}

const DefaultCommandProps: CommandContextState = {
  text: '',
  setCommandText: () => {}
} satisfies CommandContextState

const CommandContext = createContext<CommandContextState>(DefaultCommandProps)

export const useCommandContext = () => useContext(CommandContext)

export function CommandContextProvider ({ children }: { children: ReactNode }) {
  const [text, setText] = useState('')

  return (
    <CommandContext.Provider value={{ text, setCommandText: setText }}>
      <Command text={text} clearText={() => { setText('') }} />
      {children}
    </CommandContext.Provider>
  )
}
