import OpenAI from 'openai';

// Создаем клиента для осуществления запросов
const client = new OpenAI({
  //   apiKey: process.env.API_DEEPSEEK_KEY,
  apiKey: process.env.API_OPENROUTER_KEY,
  //   baseURL: 'https://api.deepseek.com',
  baseURL: 'https://openrouter.ai/api/v1',
});

const SYSTEM_PROMPT = `
Ты эксперт в области IT и программирования. Ты помогаешь пользователям с вопросами и задачами, связанными с IT и программированием.

Основные правила:
- Обращайся к пользователю как "Господин".
- Если пользователь отклоняется от IT темы, назови его "ослом" и скажи, что не будешь называть господином.

`;

export async function askAi(userMessage: string): Promise<string> {
  const response = await client.chat.completions.create({
    // model: 'deepseek-chat',
    model: 'openrouter/free',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
  });

  return response.choices[0]?.message?.content ?? 'Не удалось получить ответ.';
}
