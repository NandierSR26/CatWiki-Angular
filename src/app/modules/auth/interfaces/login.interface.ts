export interface ILoginRequest {
    email: string;
    password: string;
}

export interface ILoginResponse {
    message: string;
    data:    Data;
}

export interface Data {
    token: string;
    user:  User;
}

export interface User {
    id:    string;
    email: string;
    name:  string;
}
