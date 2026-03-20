import {IProduct} from "../../types";

export class Catalog {
    private productCatalog: IProduct[] = [];

    private selectedProduct: IProduct | null = null;

    constructor(initialProducts: IProduct[] = []) {
        this.productCatalog = initialProducts;
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
    }

    getSelectedItem(): IProduct | null {
        // Возвращает товар, выбранный для подробного отображения
        return this.selectedProduct;
    }
}