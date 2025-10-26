declare class OrderItemDto {
    productId: string;
    quantity: number;
}
export declare class CreateOrderDto {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    notes?: string;
    paymentMethod: 'COD';
    items: OrderItemDto[];
}
export {};
