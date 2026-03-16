import {IProduct} from "../../../types";

export class Cart {
    private cartList: IProduct[] = [];

    getCartList(): IProduct[] {
        // Получает массив товаров, находящихся в корзине
        return this.cartList;
    }

    addItem(product: IProduct): void {
        // Проверка на отсутствия ID товара
        if (!product.id) {
            throw new Error("Товар должен иметь id");
        }
        // Проверка на дубликат
        const existingItem = this.cartList.find(item => item.id === product.id);
        if (existingItem) {
            // Если дубликат товара найден
            throw new Error("Товар уже есть в карзине");
        } else {
            this.cartList.push(product);
        }
    }

    removeItem(product: IProduct): void {
        // Удаляет товар из корзины
        const index = this.cartList.findIndex((item) => item.id === product.id);
        if (index !== -1) {
            this.cartList.splice(index, 1);
        }
    }

    deleteAll(): void {
        // Очищает корзину (удаляет все товары)
        this.cartList = [];
    }

    getTotalPrice(): number {
        // Получает общую стоимость всех товаров в корзине
        return this.cartList.reduce((total, item) => {
            if (typeof item.price !== 'number') {
                throw new Error(`Цена товара ${item.id} не является числом`);
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