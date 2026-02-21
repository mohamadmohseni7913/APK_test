/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ErrorResponseType, ResponseType, Ticket, TicketFormData, User } from "../types";
import { endpoints } from "../config/enpoints";
import { api } from "../config/api";
import toast from "react-hot-toast";

// fetch ticket list
export const useTickets = () => {
    return useQuery<ResponseType<Ticket[]>, ErrorResponseType>({
        queryKey: ['tickets'],
        queryFn: () => api.get(endpoints.USER_TICKET).then(res => res.data),
        refetchInterval: 5 * 60 * 1000,
        refetchIntervalInBackground: false,
        refetchOnWindowFocus: true,
    });
};
export const useSingleTicket = (TicketId: number) => {
    return useQuery<ResponseType<Ticket>, ErrorResponseType>({
        queryKey: ['tickets'],
        queryFn: () => api.get(endpoints.USER_SINGLE_TICKET(TicketId)).then(res => res.data),
    });
};
// create ticket by user
export const useCreateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation<
        ResponseType<{ message: string }>,
        ErrorResponseType,
        number, Ticket
    >({
        mutationFn: (userId, data) =>
            api.post(endpoints.USER_TICKET, data).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tickets']
            });
        },
    });
};
// update ticket status by admin 
export const useAdminUpdateTicket = () => {
    const queryClient = useQueryClient();
    return useMutation<
        ResponseType<{ message: string }>,
        ErrorResponseType,
        number, boolean
    >({
        mutationFn: (userId, status) =>
            api.patch(endpoints.ADMIN_UPDATE_TICKET(userId), { status }).then(res => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['tickets']
            });
        },
    });
};
// fake request for db.json
export const fetchTickets = async (user: User | null, filters: any): Promise<Ticket[]> => {
    if (!user) return [];

    let url = 'http://localhost:3001/tickets';

    if (!user.is_admin) {
        url += `?userId=${user.id}`;
    }

    const params = new URLSearchParams();

    if (filters.status && filters.status !== '') {
        params.append('status', filters.status);
    }

    if (filters.priority && filters.priority !== '') {
        params.append('priority', filters.priority);
    }

    if (filters.search?.trim()) {
        params.append('q', filters.search.trim());
    }
    const page = Number(filters.page) || 1;
    params.append('_page', page.toString());
    params.append('_limit', '9');
    params.append('_sort', 'created_at');
    params.append('_order', 'desc');

    const queryString = params.toString();
    if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
    }


    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('خطا در دریافت تیکت‌ها');
    }
    return res.json();
};



// update status by admin 
export const handleStatusChange = async (
    ticketId: number,
    newStatus: string,
    queryClient: any
) => {
    try {
        const res = await fetch(`api/tickets/${ticketId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: newStatus,
                updated_at: new Date().toISOString(),
            }),
        });

        if (!res.ok) {
            throw new Error(`خطا ${res.status}: بروزرسانی انجام نشد`);
        }

        queryClient.invalidateQueries({ queryKey: ['tickets'] });
        toast.success('وضعیت تیکت با موفقیت تغییر یافت');
    } catch (err: any) {
        console.error('خطا در تغییر وضعیت:', err);
        toast.error(err.message || 'خطا در بروزرسانی وضعیت');
    }
};

// create fake ticket

export const useCreateFake = () => {
    const queryClient = useQueryClient();
    return useMutation<
        ResponseType<{ message: string }>,
        ErrorResponseType,
        { userId: number; data: TicketFormData }
    >({
        mutationFn: async ({ userId, data }) => {
            const newTicket = {
                ...data,
                userId,
                status: 'open',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const res = await fetch('http://localhost:3001/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTicket)
            });

            if (!res.ok) throw new Error('خطا در ایجاد تیکت');
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
        },
        onError: (err: any) => {
            throw err;
        },
    });
};