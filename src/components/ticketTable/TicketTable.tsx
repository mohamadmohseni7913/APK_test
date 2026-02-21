import type { FC } from "react";
import type { Ticket, User } from "../../types";
import { handleStatusChange } from "../../hooks/useTickets";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const headingList = [
    'عنوان',
    'توضیحات',
    'اولویت',
    'وضعیت',
    'جزئیات',
    'تاریخ ایجاد',
    'کابر',
    'عملیات'

]
const Badge: FC<{ children: string; variant: 'status' | 'priority'; }> = ({ children, variant }) => {
    const base = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";

    const variants = {
        status: {
            open: 'bg-blue-100 text-blue-800',
            in_progress: 'bg-purple-100 text-purple-800',
            closed: 'bg-gray-100 text-gray-800',
        },
        priority: {
            low: 'bg-green-100 text-green-800',
            medium: 'bg-yellow-100 text-yellow-800',
            high: 'bg-red-100 text-red-800',
        },
    };

    const variantClass = variants[variant][children as keyof typeof variants[typeof variant]] || 'bg-gray-100 text-gray-800';

    return <span className={`${base} ${variantClass}`}>{children}</span>;
};

const getStatusText = (status: string) => {
    const map: Record<string, string> = {
        open: 'باز',
        in_progress: 'در حال بررسی',
        closed: 'بسته شده',
    };
    return map[status] || status;
};

const getPriorityText = (priority: string) => {
    const map: Record<string, string> = {
        low: 'کم',
        medium: 'متوسط',
        high: 'بالا',
    };
    return map[priority] || priority;
};

interface TicketTableProps {
    list: Ticket[];
    user: User;
}

const TicketTable: FC<TicketTableProps> = ({ list, user }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return (
        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                    <tr>
                        {
                            user.is_admin ? headingList.map((item) => <HeadingCmp title={item} />) :
                                headingList.slice(0, 6).map((item) => <HeadingCmp title={item} />)
                        }

                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {list.map((ticket) => (
                        <tr key={ticket.id} className={`${ticket.status == "closed" ? "cursor-not-allowed" : "cursor-pointer"} hover:bg-gray-100  transition-colors duration-150`}>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">
                                {ticket.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate hidden md:table-cell">
                                {ticket.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Badge variant="priority">{getPriorityText(ticket.priority)}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <Badge variant="status">{getStatusText(ticket.status)}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button className="bg-blue-500 rounded-xl p-2 text-white"
                                    onClick={(e) => {
                                        if (ticket.status == "closed") {
                                            return;
                                        }
                                        navigate(`/tickets/${ticket.id}`); e.stopPropagation()
                                    }}
                                >مشاهده</button>
                            </td>
                            {user.is_admin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {ticket.userId}
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                                {new Date(ticket.created_at).toLocaleDateString('fa-IR', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </td>
                            {user.is_admin && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <select
                                        title="تغییر وضعیت"
                                        value={ticket.status}
                                        onChange={(e) => { handleStatusChange(ticket.id, e.target.value, queryClient); e.stopPropagation() }}
                                        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition"
                                    >
                                        <option value="open">باز</option>
                                        <option value="in_progress">در حال بررسی</option>
                                        <option value="closed">بسته شده</option>
                                    </select>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TicketTable;
interface HeadingProps {
    title: string;
}
const HeadingCmp: FC<HeadingProps> = ({ title }) => {
    return (
        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
            {title}
        </th>
    )
}