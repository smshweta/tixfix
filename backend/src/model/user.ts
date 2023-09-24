// Schema for user model
export interface User {
    id?: number;
    username: string;
    firstname: string;
    lastname: string;
    hashed_password: string;
    email: string;
    role: string;
    created?: Date;
    modified?: Date;
}


export enum Role {
    ADMIN = 'admin',
    CUSTOMER = 'customer',
    EMPLOYEE = 'employee',
}