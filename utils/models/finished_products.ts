import type { Order } from "./order";
import type { Rug } from "./rug";

export interface FinishedProductsResponse {
    success: boolean;
    message: string;
    response: FinishedProductsResponseData;
}
export interface FinishedProductResponse {
    success: boolean;
    message: string;
    response: FinishedProduct;
}

export interface FinishedProductsResponseData {
    data: FinishedProduct[];
    meta: Meta;
    links: Link[];
}

export interface FinishedProduct {
    id: number;
    order_id: number;
    order: Order;
    available_quantity: number;
    name: string;
    description: string;
    default_image: string;
    work_in_progress_id: number;
    actual_production_cost: number;
    rug_id: null;
    total_price: number;
    unit: string;
    shape: string;
    length: number;
    width: number;
    materials_cost: number;
    labour_cost: number;
    rug: Rug;
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


export interface CreateFinishedProductRequest {
    id: string;
    name: string;
    order_id: string;
    work_in_progress_id: string;
    rug_id: string;
    description: string;
    available_quantity: string;
    default_image: File | null;
    total_price: number;
    unit: 'cm' | string;
    shape: 'rectangle' | string;
    length: number;
    width: number;
}

export interface CreateFinishedProductResponse {
    success: boolean;
    message: string;
    response: FinishedProduct;
}
