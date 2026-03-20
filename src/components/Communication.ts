import { IApi, ProductsResponse, OrderData, OrderResponse } from "../types";

export class Communication {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }
    /**
     * Получает список товаров с сервера
     * @returns Объект с общим количеством товаров и массивом продуктов
     */
    async getProducts(): Promise<ProductsResponse> {
        return this.api.get<ProductsResponse>("/product/");
    }
    /**
     * Отправляет заказ на сервер
     * @param orderData Данные заказа (покупатель IBuyer + список ID товаров + итоговая сумма)
     * @returns Объект с ID заказа и итоговой суммой
     */
    async createOrder(orderData: OrderData): Promise<OrderResponse> {
        return this.api.post<OrderResponse>("/order/", orderData);
    }
}