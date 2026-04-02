import { markdownToHtml } from '../lib/formatMarkdown';
import { askAi } from '../services/ai';
import { BotContext } from '../types/bot-types';

// Обработка всех текстовых сообщений
export async function AiAnswerHandler(ctx: BotContext, next: () => Promise<void>) {
  const message = ctx.message?.text;

  // Если в данной сессии мы не ожидаем ответ от ИИ,
  // то пропускаем
  if (!ctx.session.waitingForAI) {
    return next();
  }

  if (!message) {
    return next();
  }

  const thinkingMessage = await ctx.reply('Думаю...');

  // Функция удаляет сообщение ДУмаю после получения ответа от AI
  const safeDelete = () => ctx.api.deleteMessage(ctx.chat!.id, thinkingMessage.message_id);

  try {
    const response = await askAi(message);

    // Некоторые модели возвращают markdown (например, deepSeek).
    // Не все теги из этого markdown поддерживаются в ТГ
    // Функция заменяет неподдерживаемые теги на поддерживаемые
    const formattedResponse = markdownToHtml(response);

    // parse_mode: 'HTML' - ответ может содержать HTML
    // Note: ТГ поддерживает ограниченный набор тегов, поэтому предварительно форматируем markdownToHtml
    await ctx.reply(formattedResponse, { parse_mode: 'HTML' });
  } catch (error) {
    console.log(error);

    await ctx.reply('Произошла ошибка при обработке вашего запроса. Попробуйте позже.');
  } finally {
    safeDelete();
  }
}
