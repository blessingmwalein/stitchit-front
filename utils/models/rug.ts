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

// Types for Rug Cost Calculation API
export interface RugCostCalculationRequest {
    width_cm: number;
    height_cm: number;
}

export interface RugCostMaterial {
    material_id: number;
    material_name: string;
    material_type: string;
    unit: string;
    price_per_unit: number;
    used: number;
    cost: number;
}

export interface RugCostDimensions {
    width: number;
    height: number;
}

export interface RugCostCalculationResponseData {
    dimensions_cm: RugCostDimensions;
    area_sq_cm: number;
    total_price: number;
    materials: RugCostMaterial[];
}

export interface RugCostCalculationResponse {
    success: boolean;
    message: string;
    response: RugCostCalculationResponseData;
}

