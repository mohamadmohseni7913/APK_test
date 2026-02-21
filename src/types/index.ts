export interface ResponseType<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}
export interface ErrorResponseType {
  status: boolean;
  message: string;
  errors?: string[];
}


export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'closed';
  user: number;
  created_at: string;
  updated_at: string;
  userId?: number;
}

export interface TicketResponse {
  id?: number;
  ticket: number;
  user: number;
  message: string;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  is_admin: boolean;
  email: string;
  password?: string;
}

export interface TicketFilters {
  status: string;
  priority: string;
  search: string;
  page: number;
}
export interface TicketFormData {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
}