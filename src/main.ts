import "./scss/styles.scss";
import { IBuyer, TPayment, IProduct, IApi, ProductsResponse, OrderData, OrderResponse } from "./types";
import { Api } from "./components/base/Api";

export class Catalog {
    private productCatalog: IProduct[] = [];

    private selectedProduct: IProduct | null = null;

    constructor(initialProducts: IProduct[] = []) {
        // Валидируем входные параметры
        if (!Array.isArray(initialProducts)) {
            throw new Error("Параметр initialProducts должен быть массивом IProduct[]");
        }
        for (const product of initialProducts) {
            if (product === null || typeof product !== "object") {
                throw new Error("Каждый элемент массива initialProducts должен быть объектом");
            }
        }

        this.productCatalog = initialProducts;
    }

    getItems(): IProduct[] {
        // Возвращает массив всех товаров
        return this.productCatalog;
    }

    setItems(products: IProduct[]): void {
        // Сохраняет массив товаров, полученный в параметрах метода
        if (!Array.isArray(products)) {
            throw new Error("Параметр должен быть массивом IProduct[]");
        }
        this.productCatalog = products;
    }

    getItem(id: string): IProduct | null {
        // Ищем товар с указанным id
        const product = this.productCatalog.find((item) => item.id === id);
        // Возвращаем найденный товар или null, если не найден
        return product || null;
    }

    setSelectedItem(product: IProduct): void {
        // Сохраняет товар для подробного отображения
        if (product === null || typeof product !== "object" || !product.id) {
            throw new Error("Параметр должен быть объектом IProduct");
        }
        this.selectedProduct = product;
    }

    getSelectedItem(): IProduct | null {
        // Возвращает товар, выбранный для подробного отображения
        return this.selectedProduct;
    }
}

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
        const existingItem = this.cartList.find((item) => item.id === product.id);
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
            if (typeof item.price !== "number") {
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

export class Buyer implements IBuyer {
    private buyerPayment: TPayment = "";
    private buyerEmail: string = "";
    private buyerPhone: string = "";
    private buyerAddress: string = "";

    constructor(payment: TPayment, email: string, phone: string, address: string) {
        this.buyerPayment = payment;
        this.buyerEmail = email;
        this.buyerPhone = phone;
        this.buyerAddress = address;
    }

    // Геттеры
    get payment(): TPayment {
        return this.buyerPayment;
    }
    get email(): string {
        return this.buyerEmail;
    }
    get phone(): string {
        return this.buyerPhone;
    }
    get address(): string {
        return this.buyerAddress;
    }

    // Сеттеры
    set payment(value: TPayment) {
        this.buyerPayment = value;
    }
    set email(value: string) {
        this.buyerEmail = value;
    }
    set phone(value: string) {
        this.buyerPhone = value;
    }
    set address(value: string) {
        this.buyerAddress = value;
    }

    updateBuyerData(data: Partial<Buyer>): void {
        // Метод добавления данных покупателя, реализован отдельно по полям
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    getBuyer(): IBuyer {
        // Метод получения данных покупателя
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clearBuyerData(): void {
        // Метод очистки данных покупателя
        this.buyerPayment = "";
        this.buyerEmail = "";
        this.buyerPhone = "";
        this.buyerAddress = "";
    }

    validate(): Record<string, string> {
        // метод проверки заполнения полей покупателя
        const errors: Record<string, string> = {}; // объект с ключ - значение клэяч поле Buyer, значение сообщение об ошибке.

        if (this.payment === "") {
            errors.payment = "Не выбран вид оплаты";
        }

        if (!this.email) {
            errors.email = "Укажите email";
        } else if (!this.isValidEmail(this.email)) {
            errors.email = "Некорректный формат email";
        }

        if (!this.phone) {
            errors.phone = "Укажите телефон";
        } else if (!this.isValidPhone(this.phone)) {
            errors.phone = "Некорректный формат телефона";
        }

        if (!this.address) {
            errors.address = "Укажите адрес";
        }

        return errors;
    }

    private isValidEmail(email: string): boolean {
        // Шаблоны проверки вводимых данных email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        // Шаблон проверки вводимых данных телефона
        const regex = /^[\d\s\-\(\)\+]{10,}$/;
        return regex.test(phone.trim());
    }
}

export class ProductService {
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

const baseUrl = "https://larek-api.nomoreparties.co/api/weblarek";
const api = new Api(baseUrl);

// Создание сервиса для работы с товарами
const productService = new ProductService(api);

const catalog = new Catalog();

// Основной код: получаем товары и сохраняем в модель
async function initApp() {
    try {
        // GET‑запрос на /product/
        const response: ProductsResponse = await productService.getProducts();

        // Сохраняем массив товаров в модель каталога
        catalog.setItems(response.items);

        // Выводим каталог в консоль
        console.log("Каталог товаров:", catalog.getItems());
    } catch (error) {
        console.error("Ошибка при загрузке товаров:", error);
    }
}

// Запуск приложения
initApp();