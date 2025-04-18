export interface CreateRugRequest {
    name: string;
    type: string;
    approx_production_cost: number;
    approx_cost: number;
    materials: string;
    // sizes: Size[];
}

export interface Size {
    width: number;
    length: number;
}

export interface CreateResponse {
    success: boolean;
    message: string;
    response: Rug;
}

export interface RugResponse {
    success: boolean;
    message: string;
    response: RugData;
}

export interface RugData {
    data: Rug[];
    meta: Meta;
    links: Link[];
}

export interface Rug {
    id: number;
    name: string;
    type: string;
    approx_production_cost: number;
    approx_cost: number;
    created_at: Date;
    updated_at: Date;
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

