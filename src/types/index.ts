export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// интерфейс товара
export interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}

// типа оплаты покупателем
export type TPayment = "card" | "cash" | "";

// тип обекта сообщений об ошибках при заполнении данных пользоавтеля 
export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

// интерфейс данных о покупателе
export interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}

// тип ответа от энпоинта /product/ с сервера с массивом товаров
export interface ProductsResponse {
    total: number;
    items: IProduct[];
}

// данные заказа (объединяет IBuyer и список товаров данные для /order/)
export interface OrderData extends IBuyer {
    total: number;
    items: string[]; // массив ID товаров
}

// тип ответа сервера после создания заказа
export interface OrderResponse {
    id: string;
    total: number;
}