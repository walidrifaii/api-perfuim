export interface OrderItem {
    productId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    name?: string;
    brand?: string;
    size?: string;
}
export declare class Order {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    notes: string;
    paymentMethod: 'COD';
    items: OrderItem[];
    subtotal: number;
    total: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
