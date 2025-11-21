import { NextResponse } from 'next/server';

const BOT_NAME = '@бот';
const BOT_DISPLAY_NAME = 'Бот';

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
      console.error('OPENROUTER_API_KEY не налаштовано');
      return NextResponse.json(
        { 
          success: false,
          error: 'OpenRouter API ключ не налаштовано' 
        },
        { status: 500 }
      );
    }

    // Формуємо історію розмови для бота
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
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
    // Використовуємо fetch напряму, оскільки OpenAI SDK не підтримує extra_body для OpenRouter
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'x-ai/grok-4.1-fast:free',
        messages: messages,
        reasoning: {
          enabled: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();

    const botResponse = data.choices?.[0]?.message?.content || 'Вибачте, не вдалося отримати відповідь.';

    return NextResponse.json({
      success: true,
      response: botResponse,
    });
  } catch (error: any) {
    console.error('Помилка при обробці запиту бота:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      {
        success: false,
        error: process.env.NODE_ENV === 'development' 
          ? error.message || 'Помилка при обробці запиту бота'
          : 'Помилка при обробці запиту бота',
      },
      { status: 500 }
    );
  }
}

