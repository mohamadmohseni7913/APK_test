import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useUserContext } from '../context/AuthContext';
import type { Ticket } from '../types';
import toast from 'react-hot-toast';
import { api } from '../config/api';

const fetchAllTickets = async () => {
  const res = await api.get('/tickets/'); 
  return res.data.results || res.data;
};

const updateTicketStatus = async ({ id, status }: { id: number; status: string }) => {
  const res = await api.patch(`/tickets/${id}/`, { status });
  return res.data;
};

const addResponse = async ({ ticketId, message }: { ticketId: number; message: string }) => {
  const res = await api.post('/ticket-responses/', { ticket: ticketId, message });
  return res.data;
};

const AdminDashboard = () => {
  const queryClient = useQueryClient();
//   const { user } = useUserContext();
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [responseMsg, setResponseMsg] = useState('');
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['all-tickets'],
    queryFn: fetchAllTickets,
    refetchInterval: 10000, 
  });

  const statusMutation = useMutation({
    mutationFn: updateTicketStatus,
    onSuccess: () => {
      toast.success('وضعیت بروزرسانی شد');
      queryClient.invalidateQueries({ queryKey: ['all-tickets'] });
    },
    onError: () => toast.error('خطا در تغییر وضعیت'),
  });

  const responseMutation = useMutation({
    mutationFn: addResponse,
    onSuccess: () => {
      toast.success('پاسخ ارسال شد');
      setResponseMsg('');
      queryClient.invalidateQueries({ queryKey: ['all-tickets'] }); // یا query جدا برای responses
    },
    onError: () => toast.error('خطا در ارسال پاسخ'),
  });

  if (isLoading) return <div className="text-center py-20 text-xl">بارگذاری داشبورد ادمین...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">داشبورد ادمین - مدیریت تیکت‌ها</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* لیست تیکت‌ها */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4">همه تیکت‌ها</h2>
          <div className="space-y-4">
            {tickets.map((ticket: Ticket) => (
              <div
                key={ticket.id}
                className={`p-6 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer border-l-4 ${
                  ticket.status === 'open' ? 'border-blue-500' :
                  ticket.status === 'in_progress' ? 'border-yellow-500' : 'border-green-500'
                }`}
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{ticket.title}</h3>
                    <p className="text-gray-600 mt-1 line-clamp-2">{ticket.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">کاربر: {ticket.user}</span>
                    <br />
                    <span className="text-xs font-medium mt-1 inline-block px-3 py-1 rounded-full bg-gray-100">
                      {ticket.status === 'open' ? 'باز' : ticket.status === 'in_progress' ? 'در حال بررسی' : 'بسته'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* پنل جزئیات و اقدامات */}
        <div className="lg:col-span-1">
          {selectedTicket ? (
            <div className="bg-white p-6 rounded-xl shadow sticky top-8">
              <h2 className="text-2xl font-bold mb-4">{selectedTicket.title}</h2>
              <p className="text-gray-700 mb-6">{selectedTicket.description}</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">تغییر وضعیت</label>
                <select title='change status'
                  value={selectedTicket.status}
                  onChange={(e) => statusMutation.mutate({ id: selectedTicket.id!, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg p-3"
                >
                  <option value="open">باز</option>
                  <option value="in_progress">در حال بررسی</option>
                  <option value="closed">بسته</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">پاسخ ادمین</label>
                <textarea
                  value={responseMsg}
                  onChange={(e) => setResponseMsg(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500"
                  placeholder="پاسخ خود را اینجا بنویسید..."
                />
                <button
                  onClick={() => {
                    if (responseMsg.trim()) {
                      responseMutation.mutate({ ticketId: selectedTicket.id!, message: responseMsg });
                    }
                  }}
                  disabled={!responseMsg.trim() || responseMutation.isPending}
                  className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {responseMutation.isPending ? 'در حال ارسال...' : 'ارسال پاسخ'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-6 rounded-xl text-center text-gray-500">
              تیکتی انتخاب کنید تا جزئیات و اقدامات نمایش داده شود
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;