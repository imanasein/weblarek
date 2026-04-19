import {IProduct} from "../../types";
import {IEvents} from "../base/Events";

export class Catalog {
    private productCatalog: IProduct[] = [];
    private selectedProduct: IProduct | null = null;

    constructor(protected events: IEvents) {
        this.events = events;
    }

    // сеттер
    set products(productsList: IProduct[]) {
        this.productCatalog = productsList;
        this.events.emit("catalog:changed");
    }

    // геттер
    get products(): IProduct[] {
        // Возвращает массив всех товаров
        return this.productCatalog;
    }

    getItem(id: string): IProduct | null {
        // Ищем товар с указанным id
        const product = this.productCatalog.find((item) => item.id === id);
        // Возвращаем найденный товар или null, если не найден
        return product || null;
    }

    setSelectedItem(product: IProduct): void {
        // Сохраняет товар для подробного отображения
        this.selectedProduct = product;
        this.events.emit("catalog:product_selected");
    }

    getSelectedItem(): IProduct | null {
        // Возвращает товар, выбранный для подробного отображения
        return this.selectedProduct;
    }
}
