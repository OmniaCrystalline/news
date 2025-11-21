import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const BOT_NAME = '@бот';
const BOT_DISPLAY_NAME = 'Бот';

// Ініціалізуємо клієнт OpenRouter
const client = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY || '',
});

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Повідомлення не може бути порожнім' },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OpenRouter API ключ не налаштовано' },
        { status: 500 }
      );
    }

    // Формуємо історію розмови для бота
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: 'Ти корисний асистент-бот у чаті новин України. Відповідай українською мовою, бути дружнім та інформативним. Можеш допомагати з питаннями про новини, поточні події та інші теми.',
      },
    ];

    // Додаємо історію розмови, якщо є
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg: any) => {
        if (msg.user?.name === BOT_DISPLAY_NAME) {
          messages.push({
            role: 'assistant',
            content: msg.content,
          });
        } else {
          messages.push({
            role: 'user',
            content: msg.content,
          });
        }
      });
    }

    // Додаємо поточне повідомлення
    messages.push({
      role: 'user',
      content: message,
    });

    // Викликаємо API OpenRouter
    const response = await client.chat.completions.create({
      model: 'x-ai/grok-4.1-fast:free',
      messages: messages,
      extra_body: {
        reasoning: {
          enabled: true,
        },
      },
    });

    const botResponse = response.choices[0]?.message?.content || 'Вибачте, не вдалося отримати відповідь.';

    return NextResponse.json({
      success: true,
      response: botResponse,
    });
  } catch (error: any) {
    console.error('Помилка при обробці запиту бота:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Помилка при обробці запиту бота',
      },
      { status: 500 }
    );
  }
}

