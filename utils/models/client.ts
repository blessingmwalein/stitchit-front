export interface CreateClientRequest {
    name: string;
    email: string;
    gender: string;
    phone_number: string;
    address: string;
    city: string;
    role: string;
}
export interface SearchClientRequest {
    name: string;
    email: string;
    gender: string;
    phone_number: string;
    address: string;
}






export interface CreateClientResponse {
    success: boolean;
    message: string;
    response: UserClient;
}

export interface ClientsResponse {
    success: boolean;
    message: string;
    response: ClientData;
}

export interface ClientData {
    data: UserClient[];
    meta: Meta;
    links: Link[];
}

export interface UserClient {
    id: number;
    name: string;
    email: string;
    gender: string;
    phone_number: string;
    address: string;
    city: string;
    created_at: Date;
    updated_at: Date;
    role: string;
}

export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}

export interface Meta {
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: null;
    path: string;
    per_page: number;
    prev_page_url: null;
    to: number;
    total: number;
}
