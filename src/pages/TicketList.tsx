import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Ticket, TicketFilters } from '../types';
import { useUserContext } from '../context/AuthContext';
import { fetchTickets } from '../hooks/useTickets';
import TicketTable from '../components/ticketTable/TicketTable';
import TicketFilter from '../components/ticketFilter/TicketFilter';


const TicketList = () => {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TicketFilters>({
    status: '',
    priority: '',
    search: '',
    page: 1,
  });
  const { data: ticketsList = [], isLoading, isFetching } = useQuery<Ticket[]>({
    queryKey: ['tickets', user?.id, user?.is_admin, filters],
    queryFn: () => fetchTickets(user, filters),
    enabled: !!user,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };
  const hasNextPage = ticketsList.length === 9;

  if (!user) {
    return (
      <div className="text-center py-20 text-xl text-gray-600">
        لطفاً ابتدا وارد شوید
        <button onClick={() => navigate('/login')}>صفحه ورود </button>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className="text-center py-20 text-xl text-blue-600 animate-pulse">
        در حال بارگذاری تیکت‌ها...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
          لیست تیکت‌ها {user.is_admin ? '(همه کاربران)' : '(تیکت‌های من)'}
        </h1>
        <div className='flex gap-2'>
          {!user.is_admin && (
            <Link
              to="/tickets/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition-colors font-medium"
            >
              + ایجاد تیکت جدید
            </Link>
          )}
          <button
            className=" text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl transition-colors"
            title="خروج"
            onClick={() => {
              localStorage.removeItem('mockUser');
              document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              window.location.href = '/login';
            }}
          >
            خروج
          </button>
        </div>

      </div>
      {/* filters */}
      <TicketFilter filters={filters} handleFilterChange={handleFilterChange} />
      {/* ticket list */}
      {ticketsList.length === 0 ? (
        <div className="text-center py-16 text-gray-500 text-lg bg-gray-50 rounded-xl border border-gray-200">
          هیچ تیکتی یافت نشد.{' '}
          {filters.search || filters.status || filters.priority ? 'فیلترها را تغییر دهید.' : 'هنوز تیکتی ثبت نشده است.'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200">
          {
            ticketsList && user && (
              <TicketTable list={ticketsList} user={user} />
            )
          }
        </div>
      )}
      {/* pagination */}
      {ticketsList.length > 0 && (
        <div className="mt-10 flex justify-center gap-4 items-center">
          <button
            onClick={() => handlePageChange(Math.max(1, filters.page - 1))}
            disabled={filters.page <= 1}
            className={`${filters.page <= 1 && "cursor-not-allowed"} px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition`}
          >
            قبلی
          </button>

          <span className="px-6 py-2 bg-blue-100 text-blue-800 rounded-lg font-medium">
            صفحه {filters.page}
          </span>

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={!hasNextPage}
            className={`${!hasNextPage && "cursor-not-allowed"} px-6 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition`}
          >
            بعدی
          </button>
        </div>
      )}
    </div>
  );
};

export default TicketList;