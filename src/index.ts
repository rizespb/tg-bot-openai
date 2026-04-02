import { bot } from './bot';
import { globalContext, YCContext } from './config/context';

// Довольно стандартная функция для инициализации бота при деплое
export const handler = async function (event: any, context: YCContext) {
  globalContext.context = context;

  try {
    await bot.init();
    await bot.handleUpdate(JSON.parse(event.body));
  } catch (e) {
    console.error('Failed to handle update:', (e as Error).message);
  }

  return { statusCode: 200, body: '' };
};

console.log('process.env.NODE_ENV', process.env.NODE_ENV);

// Запуск бота для локальной разработки
if (process.env.NODE_ENV === 'development') {
  bot.start({
    onStart: () => {
      console.log('Bot started');
    },
  });
}
