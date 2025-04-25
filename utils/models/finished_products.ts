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
    rug_id: number | null;
    total_price: number;
    unit: string;
    start_date: string;
    end_date: string;
    shape: string;
    length: number;
    width: number;
    materials_cost: number;
    labour_cost: number;
    rug: Rug;
    created_at: string;
    updated_at: string;
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
    id: number | null;
    name: string;
    order_id: number;
    work_in_progress_id: number;
    rug_id: number;
    description: string;
    available_quantity: number;
    default_image: File | null | string;
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


export interface DasbhoardDataResponse {
    success:  boolean;
    message:  string;
    response: DashboardData;
}

export interface DashboardData {
    total_finished_products: number;
    total_sales:             string;
    total_orders:            number;
    total_customers:         number;
}
export interface SalesMonthlyDataResponse {
    success:  boolean;
    message:  string;
    response: SalesData[];
}

export interface SalesData {
    month:       number;
    total_sales: string;
}
