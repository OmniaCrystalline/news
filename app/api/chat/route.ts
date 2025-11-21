import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Повідомлення доступні для всіх, авторизація не потрібна
    const messages = await prisma.message.findMany({
      take: 50,
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ messages });
  } catch (error: any) {
    console.error('Помилка при отриманні повідомлень:', error);
    return NextResponse.json(
      { error: 'Помилка при завантаженні повідомлень' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { content, isBot } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Повідомлення не може бути порожнім' },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'Повідомлення занадто довге (максимум 2000 символів)' },
        { status: 400 }
      );
    }

    let userId: string;

    if (isBot) {
      // Знаходимо або створюємо користувача "Бот"
      let botUser = await prisma.user.findFirst({
        where: { email: 'bot@news.ua' },
      });

      if (!botUser) {
        botUser = await prisma.user.create({
          data: {
            email: 'bot@news.ua',
            name: 'Бот',
          },
        });
      }

      userId = botUser.id;
    } else {
      // Для звичайних користувачів потрібна авторизація
      const session = await getSession();
      
      if (!session?.user) {
        return NextResponse.json(
          { error: 'Необхідна авторизація' },
          { status: 401 }
        );
      }

      const sessionUserId = (session.user as any).id;
      if (!sessionUserId) {
        return NextResponse.json(
          { error: 'Необхідна авторизація' },
          { status: 401 }
        );
      }

      userId = sessionUserId;
    }

    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        userId: userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    console.error('Помилка при створенні повідомлення:', error);
    return NextResponse.json(
      { error: 'Помилка при відправці повідомлення' },
      { status: 500 }
    );
  }
}

