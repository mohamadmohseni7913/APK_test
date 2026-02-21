import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import type { Ticket } from '../types';

interface TicketResponse {
    id: number;
    ticketId: number;
    userId: number;
    message: string;
    created_at: string;
}

interface ResponseFormData {
    message: string;
}
const fetchTicketDetails = async (id: string): Promise<Ticket> => {
    const res = await fetch(`http://localhost:3001/tickets/${id}`);
    if (!res.ok) throw new Error('تیکت یافت نشد');
    return res.json();
};

const fetchResponses = async (id: string): Promise<TicketResponse[]> => {
    const res = await fetch(`http://localhost:3001/ticketResponses?ticketId=${id}`);
    if (!res.ok) throw new Error('خطا در دریافت پاسخ‌ها');
    return res.json();
};
const TicketDetails = () => {
    const { id } = useParams();
    const { user } = useUserContext();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ResponseFormData>();

    const { data: ticket, isLoading: ticketLoading } = useQuery<Ticket>({
        queryKey: ['ticket', id],
        queryFn: () => fetchTicketDetails(id || ''),
        enabled: !!id,
    });

    const { data: responses = [], isLoading: responsesLoading } = useQuery<TicketResponse[]>({
        queryKey: ['ticketResponses', id],
        queryFn: () => fetchResponses(id || ''),
        enabled: !!id,
    });

    const addResponseMutation = useMutation({
        mutationFn: async (message: string) => {
            if (!user) throw new Error('لاگین نیست');
            const newResponse = {
                ticketId: Number(id),
                userId: user.id,
                message,
                created_at: new Date().toISOString(),
            };
            const res = await fetch('http://localhost:3001/ticketResponses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newResponse),
            });
            if (!res.ok) throw new Error('خطا در اضافه پاسخ');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticketResponses', id] });
            reset();
            toast.success('پاسخ اضافه شد');
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: async (newStatus: string) => {
            const res = await fetch(`http://localhost:3001/tickets/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, updated_at: new Date().toISOString() }),
            });
            if (!res.ok) throw new Error('خطا در تغییر وضعیت');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket', id] });
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            toast.success('وضعیت تغییر یافت');
        },
    });

    const onAddResponse = (data: ResponseFormData) => {
        addResponseMutation.mutate(data.message);
    };

    if (ticketLoading || responsesLoading) {
        return <div className="text-center w-10 h-10 border-2 border-blue-700 border-l-0 animate-spin rounded-full"></div>;
    }

    if (!ticket) {
        return <div className="text-center py-20 text-red-600">تیکت یافت نشد</div>;
    }
    return (
        <div className="container mx-auto px-4 py-8">
            <div className='flex gap-2 items-center text-3xl font-bold mb-6'>
                <span>موضوع: </span>
                <h2 className="">{ticket.title}</h2>

            </div>
            <div className='flex flex-col items-start gap-2'>
                <p className="text-gray-600 "><span>توضیحات :</span> {ticket.description}</p>
                <p className="text-sm text-gray-500">اولویت: {ticket.priority}</p>
                <p className="text-sm text-gray-500">وضعیت: {ticket.status}</p>
                <p className="text-sm text-gray-500">تاریخ ایجاد: {new Date(ticket.created_at).toLocaleString()}</p>
            </div>


            {user?.is_admin && (
                <div className="mt-4">
                    <label>تغییر وضعیت:</label>
                    <select title='status' value={ticket.status} onChange={(e) => updateStatusMutation.mutate(e.target.value)}>
                        <option value="open">باز</option>
                        <option value="in_progress">در حال بررسی</option>
                        <option value="closed">بسته شده</option>
                    </select>
                </div>
            )}

            <h3 className="text-2xl font-bold mt-8 mb-4">پاسخ‌ها</h3>
            {responses.length === 0 ? (
                <p>هیچ پاسخی وجود ندارد</p>
            ) : (
                <ul>
                    {responses.map((response) => (
                        <li key={response.id} className="mb-4">
                            <p className="text-gray-600">{response.message}</p>
                            <p className="text-sm text-gray-500">کاربر: {response.userId}</p>
                            <p className="text-sm text-gray-500">تاریخ: {new Date(response.created_at).toLocaleString()}</p>
                        </li>
                    ))}
                </ul>
            )}

            <h4 className="text-xl font-bold mt-6 mb-2">اضافه پاسخ</h4>
            <form onSubmit={handleSubmit(onAddResponse)}>
                <textarea
                    {...register('message', { required: 'پیام الزامی است' })}
                    placeholder="پیام شما..."
                    className="w-full p-2 border rounded"
                />
                {errors.message && <p className="text-red-600">{errors.message.message}</p>}
                <button type="submit" disabled={addResponseMutation.isPending} className="mt-2 bg-blue-500 text-white p-2 rounded">
                    {addResponseMutation.isPending ? 'در حال ارسال...' : 'ارسال پاسخ'}
                </button>
            </form>
        </div>
    );
};

export default TicketDetails;