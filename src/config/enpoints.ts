export const endpoints = {
    LOGIN: '/auth/login/',
    REGISTER: '/auth/register/',
    USERS:"users",
    // user endpoints
    USER_TICKET: "/tickets/",
    USER_SINGLE_TICKET: (id:number)=>`/tickets/${id}`,

    // admin endpoints
    ADMIN_UPDATE_TICKET: (user_id: number) => `/admin/update_ticket/${user_id}/`
}