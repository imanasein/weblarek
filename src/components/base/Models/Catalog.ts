import {IProduct} from "../../../types";

export class Catalog {
    private productCatalog: IProduct[] = [];

    private selectedProduct: IProduct | null = null;

    constructor(initialProducts: IProduct[] = []) {
        // Валидируем входные параметры 
        if (!Array.isArray(initialProducts)) {
            throw new Error("Параметр initialProducts должен быть массивом IProduct[]");
        }
        for (const product of initialProducts) {
            if (product === null || typeof product !== 'object') {
                throw new Error("Каждый элемент массива initialProducts должен быть объектом");
            }
        }
        
        this.productCatalog = initialProducts;
    }

    // геттер 
    get products(): IProduct[] {
        // Возвращает массив всех товаров
        return this.productCatalog;
    }

    // сеттер
    set products(productsList: IProduct[]) {
        // Сохраняет массив товаров, полученный в параметрах метода
        if (!Array.isArray(productsList)) {
            throw new Error("Параметр должен быть массивом IProduct[]");
        }
        this.productCatalog = productsList;
    }

    getItem(id: string): IProduct | null {
    // Ищем товар с указанным id
        const product = this.productCatalog.find((item) => item.id === id);
        // Возвращаем найденный товар или null, если не найден
        return product || null;
    }

    setSelectedItem(product: IProduct): void {
        // Сохраняет товар для подробного отображения
        if (product === null || typeof product !== 'object' || !product.id) {
            throw new Error("Параметр должен быть объектом IProduct");
        }
        this.selectedProduct = product;
    }

    getSelectedItem(): IProduct | null {
        // Возвращает товар, выбранный для подробного отображения
        return this.selectedProduct;
    }
}