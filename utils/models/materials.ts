export interface MaterialTypeResponse {
    success: boolean;
    message: string;
    response: MaterialTypeData;
}

export interface MaterialTypeData {
    current_page: number;
    data: MaterialType[];
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

export interface MaterialType {
    id: number;
    name: string;
    description: string;
    created_at: null;
    updated_at: null;
}

export interface Link {
    url: null | string;
    label: string;
    active: boolean;
}


export interface MaterialResponse {
    success: boolean;
    message: string;
    response: MaterialData;
}

export interface MaterialData {
    data: Material[];
    meta: Meta;
    links: Link[];
}

export interface Material {
    id: number;
    name: string;
    material_type_id: number;
    material_type_name: string;
    material_type_description: string;
    price_per_unit: number;
    unit: string;
    brand: string;
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


export interface CreateMaterialRequest {
    name:             string;
    material_type_id: string;
    price_per_unit:   number;
    unit:             string;
    brand:            string;
}

export interface CreateMaterialResponse {
    success: boolean;
    message: string;
    response: Material;
}