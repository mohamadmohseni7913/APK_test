import type { FC } from "react";
import type { TicketFilters } from "../../types";

interface props {
  filters: TicketFilters;
  handleFilterChange: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
}
const TicketFilter: FC<props> = ({ filters, handleFilterChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <select title='status'
        name="status"
        value={filters.status}
        onChange={handleFilterChange}
        className="border border-gray-300 bg-white rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="">همه وضعیت‌ها</option>
        <option value="open">باز</option>
        <option value="in_progress">در حال بررسی</option>
        <option value="closed">بسته شده</option>
      </select>

      <select title='priority'
        name="priority"
        value={filters.priority}
        onChange={handleFilterChange}
        className="border border-gray-300 rounded-lg bg-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      >
        <option value="">همه اولویت‌ها</option>
        <option value="low">کم</option>
        <option value="medium">متوسط</option>
        <option value="high">بالا</option>
      </select>

      <input
        name="search"
        value={filters.search}
        onChange={handleFilterChange}
        placeholder="جستجو در عنوان یا توضیح..."
        className="border border-gray-300 rounded-lg bg-white p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  );
};

export default TicketFilter;