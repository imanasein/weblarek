import {IProduct} from "../../types";
import { IEvents } from "../base/Events";

export class Cart {
    private cartList: IProduct[] = [];  // Хранит массив товаров 

    constructor(protected events: IEvents) {}
    
    getCartList(): IProduct[] {
        // Получает массив товаров, находящихся в корзине
        return this.cartList;
    }

    addItem(product: IProduct): void {
        // Добавляет товар в массив 
            this.cartList.push(product);
            this.getTotalPrice();
            this.events.emit("basket:changed", this.cartList);
        }

    removeItem(product: IProduct): void {
        // Удаляет товар из корзины
        const index = this.cartList.findIndex((item) => item.id === product.id);
        if (index !== -1) {
            this.cartList.splice(index, 1);
            this.getTotalPrice();
            this.events.emit("basket:changed", this.cartList);
            
        }
    }

    deleteAll(): void {
        // Очищает корзину (удаляет все товары)
        this.cartList = [];
        this.getTotalPrice();
        this.events.emit("basket:changed", this.cartList)
    }

    getTotalPrice(): number {
        // Получает общую стоимость всех товаров в корзине
        return this.cartList.reduce((total, item) => {
            if (typeof item.price !== "number") {
                return total + 0;       // В случае бесценного товара, считаем её равной нулю
            }
            return total + item.price;
        }, 0);
    }

    getItemsQuantity(): number {
        // Получает количество товаров в корзине
        return this.cartList.length;
    }

    isItemInCart(id: string): boolean {
        // Проверяет наличие товара в корзине по его ID
        return this.cartList.some((item) => item.id === id);
    }
}