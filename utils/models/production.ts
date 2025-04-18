import type { Material } from "./materials";
import type { Order } from "./order";

export interface WorkInProgressResponse {
    success: boolean;
    message: string;
    response: WorkInProgressData;
}

export interface WorkInProgressData {
    current_page: number;
    data: WorkInProgress[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: null;
    path: string;
    per_page: number;
    prev_page_url: null;
    to: number;
    total: number;
}

export interface WorkInProgress {
    id: number;
    order_id: number;
    start_date: Date;
    approx_end_date: Date;
    status: string;
    client_name: string;
    email: string;
    approx_production_cost: number;
    production_number: string;
    created_at: Date;
    updated_at: Date;
    labour_cost: number;
    material_cost: number;
    order: Order;
}




export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}


export interface WorkIProgressResponse {
    success: boolean;
    message: string;
    response: WorkInProgress;
}

export interface UpdateWorkInProgress {
    start_date: Date;
    approx_end_date: Date;
    status: string;
    approx_production_cost: number;
}


export interface UpdateWorkInProgressResponse {
    success: boolean;
    message: string;
    response: WorkInProgress;
}


export interface WorkInProgressMaterialResponse {
    success: boolean;
    message: string;
    response: WorkInProgressMaterial[];
}

export interface WorkInProgressMaterial {
    id: number;
    material_id: number;
    quantity: number;
    description: string;
    work_in_progress_id: number;
    created_at: Date;
    updated_at: Date;
    material: Material;
}


export interface AddWorkInProgressMaterialRequest {
    material_id: number;
    quantity: number;
    description: string;
    id: number | null
    // work_in_progress_id: number;
}
