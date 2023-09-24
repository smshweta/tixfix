// Schema for ticket model
export interface Ticket {
    id?: number;
    name: string;
    description: string;
    created?: Date;
    modified?: Date;
    status: string;
    customer_id: number;
    assigned_id?: number;
}

export enum Status {
    OPEN = 'open',
    IN_PROGRESS = 'in_progress',
    CLOSED = 'closed',
}