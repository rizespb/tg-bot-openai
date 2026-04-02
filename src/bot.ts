import 'dotenv/config';
import { Bot, session } from 'grammy';
import { BotContext, SessionData } from './types/bot-types';
import { startHandler } from './handlers/start';
import { AiAnswerHandler } from './handlers/ai-answer';
import { Hears } from './consts/hears';
import { HelpHandler } from './handlers/help';

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is not set in .env file');
}

// Создаем бота
export const bot = new Bot<BotContext>(BOT_TOKEN);

// Инициализация текущей сессии
// Для того, чтобы иметь возможность передавать в контекст наши кастомные данные (waitingForAI)
// bot.use регистрирует middleware, который будет выполняться для каждого входящего сообщения/обновления.
bot.use(
  // session плагин управления сессиями. Автоматически создаёт и привязывает объект ctx.session к каждому пользователю/чату.
  session<SessionData, BotContext>({
    // Функция, которая возвращает начальное состояние сессии.
    initial: () => ({
      waitingForAI: false,
    }),
  })
);

bot.command('start', startHandler);

// Хэндлеры для обработки нажатия клавиш на клавиатуре
bot.hears(Hears.AI_HELPER, (ctx, next) => {
  // Если нажали на кнопку AI_HELPER,
  // То проставляем флаг в true
  // Чтобы при вводе следующего сообщения 'message:text'
  // Наш AiAnswerHandler отправил вопрос в LLM
  ctx.session.waitingForAI = true;

  ctx.reply('Задайте ваш вопрос:');
});

bot.hears(Hears.TEST_GENERATOR, AiAnswerHandler);
bot.hears(Hears.HELP, HelpHandler);

// Обработка всех текстовых сообщений
// Можно обрабатывать message:photo, message:document и пр.
bot.on('message:text', AiAnswerHandler);
