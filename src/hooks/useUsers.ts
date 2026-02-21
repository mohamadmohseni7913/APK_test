import { useQuery } from "@tanstack/react-query";
import type { ErrorResponseType, User } from "../types";
export const fetchUsers = async () => {
    const url = 'http://localhost:3001/users';
    const res = await fetch(url);
    return res.json();
}
export const useUsers = () => {
    return useQuery<User[], ErrorResponseType>({
        queryKey: ['tickets'],
        queryFn: () => fetchUsers(),

    });
};