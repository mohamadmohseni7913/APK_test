import { useNavigate, useParams } from 'react-router-dom';
import {  useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { useFetchTicketDetail } from '../hooks/useTickets';
interface ResponseFormData {
    message: string;
}
const TicketDetails = () => {
    const { id } = useParams();
    const { user } = useUserContext();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ResponseFormData>();

  
    const { data: ticket, isLoading: ticketLoading} = useFetchTicketDetail(id)

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

    if (ticketLoading ) {
        return <div className="text-center w-10 h-10 border-2 border-blue-700 border-l-0 animate-spin rounded-full"></div>;
    }

    if (!ticket) {
        return <div className="text-center py-20 text-red-600">تیکت یافت نشد</div>;
    }
    return (
        <div className="container mx-auto max-w-3xl px-4 py-8 bg-white rounded-xl">
            <div className='flex justify-between bg-blue-500 p-4 rounded-xl text-white gap-2 items-center text-3xl font-bold mb-6'>
                <div className='flex items-center gap-2'>
                    <span>موضوع: </span>
                    <h2 className="">{ticket.title}</h2>
                </div>
                <button title='back' onClick={() => navigate('/tickets')}><BsArrowLeftCircle /></button>
            </div>
            <div className='flex flex-col items-start gap-2 border border-gray-500 rounded-xl p-4'>
                <span className='font-bold'>جزئیات تیکت </span>
                <p className="text-gray-600 w-full flex justify-between"><span>توضیحات :</span> {ticket.description}</p>

                <p className="text-sm w-full flex justify-between">
                    اولویت:
                    <span className={` 
              rounded font-medium text-white text-xs px-4 py-1 w-16
            ${ticket.priority === 'high' ? 'bg-red-600' :
                            ticket.priority === 'medium' ? 'bg-orange-500' :
                                ticket.priority === 'low' ? 'bg-green-600' : 'bg-gray-500'}
        `}>
                        {ticket.priority === 'high' ? 'بالا' :
                            ticket.priority === 'medium' ? 'متوسط' :
                                ticket.priority === 'low' ? 'پایین' : ticket.priority}
                    </span>
                </p>

                <p className="text-sm w-full flex justify-between gap-2">
                    وضعیت:
                    <span className={` 
            w-16 py-1 rounded text-center font-medium text-white text-sm
            ${ticket.status === 'open' ? 'bg-green-600' :
                            ticket.status === 'in_progress' ? 'bg-yellow-500' :
                                ticket.status === 'closed' ? 'bg-red-600' : 'bg-gray-500'}
        `}>
                        {ticket.status === 'open' ? 'باز' :
                            ticket.status === 'in_progress' ? 'در حال بررسی' :
                                ticket.status === 'closed' ? 'بسته شده' : ticket.status}
                    </span>
                </p>

                <p className="text-sm text-gray-500 w-full flex justify-between">
                    <span>تاریخ ایجاد:</span> {new Date(ticket.created_at).toLocaleString('fa-IR')}
                </p>
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
            {/* {responses.length === 0 ? (
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
            )} */}

            <h4 className="text-xl font-bold mt-6 mb-2">اضافه پاسخ</h4>
            <form onSubmit={handleSubmit(onAddResponse)}>
                <textarea
                    {...register('message', { required: 'پیام الزامی است' })}
                    placeholder="پیام شما..."
                    className="w-full p-2 bg-gray-200 rounded resize-none focus:outline-0 h-32"
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