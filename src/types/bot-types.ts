import type { Context, SessionFlavor } from 'grammy';

// Это наши данные, которые мы будем хранить в контексте во время сессии
export interface SessionData {
  waitingForAI: boolean;
}

export type BotContext = Context & SessionFlavor<SessionData>;
