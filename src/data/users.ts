export interface IUserRespose{
    id:number;
    username:string;
    password:string;
    is_admin?:boolean;
    token:string;
}
export const users:IUserRespose[] = [
    {
        "id": 1,
        "username": "user",
        "password": "user",
        "is_admin": false,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InVzZXIiLCJpc19hZG1pbiI6ZmFsc2UsImV4cCI6MTc0ODM0NTY4MH0.dummy-signature-for-mock-user"
    },
    {
        "id": 2,
        "username": "admin",
        "password": "admin",
        "is_admin": true,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJ1c2VybmFtZSI6ImFkbWluIiwiaXNfYWRtaW4iOnRydWUsImV4cCI6MTc0ODM0NTY4MH0.dummy-signature-for-mock-admin"
    }
]