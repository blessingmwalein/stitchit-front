export interface CreateOrderRequest {
    rug_id: string;
    client_id: string;
    total_price: number;
    color_palet: string[];
    image: any;
    delivery_date: Date;
    description: string;
    unit: string;
    length: number;
    width: number;
    shape: string;
}


export interface CreateOrderResponse {
    success: boolean;
    message: string;
    response: Order;
}

export interface OrdersResponse {
    success: boolean;
    message: string;
    response: OrderData;
}

export interface OrderData {
    data: Order[];
    meta: Meta;
    links: Link[];
}

export interface Order {
    id: number;
    rug_id: number;
    order_number: string;
    size_id: null;
    rug: Rug;
    client_id: number;
    client_name: string;
    unit: string;
    email: string;
    length: number;
    width: number;
    shape: string;
    phone_number: string;
    address: string;
    city: string;
    gender: string;
    total_price: number;
    color_palet: string[];
    image_url: string;
    status: string;
    file_url: null;
    delivery_date: null;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export interface Rug {
    id: number;
    name: string;
    type: string;
    approx_production_cost: number;
    approx_cost: number;
    materials: string;
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


export interface StartProductionRequest {
    order_id:               number;
    start_date:             Date;
    approx_end_date:        Date;
    // status:                 string;
    approx_production_cost: number;
}
