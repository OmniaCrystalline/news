'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Message {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export default function Chat() {
  const { data: session, status } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Прокручуємо тільки контейнер чату, а не всю сторінку
    if (chatContainerRef.current && messagesEndRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Прокручуємо тільки якщо є нові повідомлення
    if (messages.length > 0) {
      // Невелика затримка, щоб DOM встиг оновитися
      setTimeout(scrollToBottom, 100);
    }
  }, [messages.length]);

  useEffect(() => {
    // Завантажуємо повідомлення для всіх
    fetchMessages();
    // Оновлюємо повідомлення кожні 3 секунди
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/chat');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Помилка при завантаженні повідомлень:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    const mentionsBot = messageContent.includes('@бот') || messageContent.includes('@Бот');

    try {
      setSending(true);

      // Спочатку зберігаємо повідомлення користувача
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: messageContent }),
      });

      if (response.ok) {
        setNewMessage('');
        // Прокручуємо до кінця після відправки повідомлення
        setTimeout(() => {
          scrollToBottom();
        }, 200);
        fetchMessages();

        // Якщо згадано бота, отримуємо відповідь
        if (mentionsBot) {
          await getBotResponse(messageContent);
        }
      } else {
        const error = await response.json();
        alert(error.error || 'Помилка при відправці повідомлення');
      }
    } catch (error) {
      console.error('Помилка при відправці повідомлення:', error);
      alert('Помилка при відправці повідомлення');
    } finally {
      setSending(false);
    }
  };

  const getBotResponse = async (userMessage: string) => {
    try {
      // Отримуємо останні повідомлення для контексту
      const recentMessages = messages.slice(-10).map(msg => ({
        content: msg.content,
        user: { name: msg.user.name }
      }));

      const response = await fetch('/api/chat/bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: recentMessages,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.response) {
          // Зберігаємо відповідь бота
          await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: data.response,
              isBot: true,
            }),
          });
          fetchMessages();
          setTimeout(() => {
            scrollToBottom();
          }, 200);
        } else {
          console.error('Помилка від бота:', data.error);
        }
      } else {
        const errorData = await response.json();
        console.error('Помилка при виклику API бота:', errorData);
      }
    } catch (error) {
      console.error('Помилка при отриманні відповіді бота:', error);
    }
  };

  const isAuthenticated = status === 'authenticated';

  return (
    <div className="flex h-[500px] flex-col rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:h-[600px]">
      <div className="border-b border-zinc-200 p-3 dark:border-zinc-800 sm:p-4">
        <h2 className="mb-2 text-base font-semibold text-zinc-900 dark:text-zinc-50 sm:text-lg">
          Чат
        </h2>
        <div className="flex items-start gap-2 rounded-md bg-gradient-to-r from-purple-50 to-blue-50 p-2 dark:from-purple-900/20 dark:to-blue-900/20 sm:gap-2 sm:p-3">
          <span className="text-base sm:text-lg">🤖</span>
          <div className="flex-1">
            <p className="text-xs font-medium text-purple-900 dark:text-purple-300">
              Є питання? Запитайте бота!
            </p>
            <p className="mt-1 hidden text-xs text-purple-700 dark:text-purple-400 sm:block">
              Напишіть <span className="font-mono font-semibold">@бот</span> у повідомленні, і бот відповість на ваше питання про новини, події та інші теми.
            </p>
            <p className="mt-1 text-xs text-purple-700 dark:text-purple-400 sm:hidden">
              Напишіть <span className="font-mono font-semibold">@бот</span> для звернення до бота.
            </p>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-3 chat-scrollbar sm:p-4"
      >
        {loading && messages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-zinc-600 dark:text-zinc-400">Завантаження повідомлень...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-zinc-600 dark:text-zinc-400">
              <p>Повідомлень поки немає</p>
              <p className="mt-2 text-sm">Будьте першим, хто напише!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const userId = session?.user && 'id' in session.user ? (session.user as { id: string }).id : null;
              const isOwnMessage = isAuthenticated && userId === message.user.id;
              const isBotMessage = message.user.name === 'Бот';

              return (
                <div
                  key={message.id}
                  className={`flex gap-2 ${isOwnMessage ? 'flex-row-reverse' : ''} sm:gap-3`}
                >
                  <div className="shrink-0">
                    {message.user.image ? (
                      <Image
                        src={message.user.image}
                        alt={message.user.name || 'Користувач'}
                        width={40}
                        height={40}
                        className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
                      />
                    ) : (
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full sm:h-10 sm:w-10 ${isBotMessage
                        ? 'bg-gradient-to-br from-purple-500 to-blue-500'
                        : 'bg-zinc-200 dark:bg-zinc-800'
                        }`}>
                        <span className={`text-xs font-medium sm:text-sm ${isBotMessage
                          ? 'text-white'
                          : 'text-zinc-600 dark:text-zinc-400'
                          }`}>
                          {isBotMessage ? '🤖' : (message.user.name?.[0]?.toUpperCase() || '?')}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={`flex flex-1 flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    <div className="mb-1 flex items-center gap-1.5 sm:gap-2">
                      <span className={`text-xs font-medium ${isBotMessage
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-zinc-600 dark:text-zinc-400'
                        }`}>
                        <span className="hidden sm:inline">{message.user.name || 'Анонімний користувач'}</span>
                        <span className="sm:hidden">{message.user.name?.[0]?.toUpperCase() || 'А'}</span>
                        {isBotMessage && ' 🤖'}
                      </span>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-500 sm:text-xs">
                        {new Date(message.createdAt).toLocaleTimeString('uk-UA', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div
                      className={`max-w-[85%] min-w-0 rounded-lg px-3 py-1.5 sm:max-w-[75%] sm:px-4 sm:py-2 ${isOwnMessage
                        ? 'bg-blue-600 text-white'
                        : isBotMessage
                          ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-900 dark:from-purple-900 dark:to-blue-900 dark:text-purple-100'
                          : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50'
                        }`}
                    >
                      <p className="break-words text-sm whitespace-pre-wrap sm:text-base">{message.content}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {isAuthenticated ? (
        <form onSubmit={sendMessage} className="border-t border-zinc-200 p-3 dark:border-zinc-800 sm:p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Повідомлення... (@бот)"
              className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 sm:px-4"
              maxLength={1000}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed sm:px-6 sm:text-sm"
            >
              <span className="hidden sm:inline">{sending ? 'Відправка...' : 'Відправити'}</span>
              <span className="sm:hidden">{sending ? '...' : '→'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800 sm:p-4">
          <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-zinc-100 px-3 py-2 dark:bg-zinc-800 sm:flex-row sm:px-4 sm:py-3">
            <p className="text-xs text-zinc-600 dark:text-zinc-400 sm:text-sm">
              Увійдіть, щоб писати
            </p>
            <a
              href="/auth/signin"
              className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 sm:text-sm"
            >
              Увійти
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

