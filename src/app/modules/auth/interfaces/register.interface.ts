export interface IRegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface IRegisterResponse {
    message: string;
    user:    User;
}

export interface User {
    id:    string;
    email: string;
    name:  string;
}
