import type { Ticket } from '../types';

const STORAGE_KEY = 'mock_tickets';

const initialTickets: Ticket[] = [
  {
    id: 1,
    title: "مشکل در ورود به سیستم",
    description: "نمی‌توانم وارد حساب کاربری‌ام شوم.",
    priority: "high",
    status: "open",
    user: 1,
    created_at: "2026-02-20T10:00:00Z",
    updated_at: "2026-02-20T10:00:00Z",
  },
  {
    id: 2,
    title: "درخواست ویژگی جدید",
    description: "لطفاً گزینه جستجوی پیشرفته اضافه کنید.",
    priority: "medium",
    status: "in_progress",
    user: 1,
    created_at: "2026-02-19T15:30:00Z",
    updated_at: "2026-02-20T09:45:00Z",
  },
  {
    id: 3,
    title: "خطا در صفحه پرداخت",
    description: "هنگام پرداخت خطای 500 رخ می‌دهد.",
    priority: "high",
    status: "closed",
    user: 2,
    created_at: "2026-02-18T14:00:00Z",
    updated_at: "2026-02-19T16:20:00Z",
  },
  {
    id: 4,
    title: "سؤال درباره استفاده از API",
    description: "چگونه از endpoint جدید استفاده کنم؟",
    priority: "low",
    status: "open",
    user: 1,
    created_at: "2026-02-21T08:15:00Z",
    updated_at: "2026-02-21T08:15:00Z",
  },
  {
    id: 5,
    title: "گزارش باگ در موبایل",
    description: "اپلیکیشن در iOS کرش می‌کند.",
    priority: "high",
    status: "in_progress",
    user: 2,
    created_at: "2026-02-20T11:45:00Z",
    updated_at: "2026-02-21T10:30:00Z",
  },
];

export const getMockTickets = (): Ticket[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTickets));
  return initialTickets;
};

export const addMockTicket = (newTicket: Omit<Ticket, 'id' | 'created_at' | 'updated_at'>): Ticket => {
  const allTickets = getMockTickets();
  
  const maxId = allTickets.length > 0 ? Math.max(...allTickets.map(t => t.id || 0)) : 0;
  const ticket: Ticket = {
    ...newTicket,
    id: maxId + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const updated = [...allTickets, ticket];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  
  return ticket;
};

export const resetMockTickets = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialTickets));
};