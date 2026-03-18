import "./scss/styles.scss";
import {IBuyer, TPayment, IProduct, IApi, ProductsResponse, OrderData, OrderResponse} from "./types";
import {Api} from "./components/base/Api";

// Класс каталог товаров
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

// Класс корзина покупателя
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

// Класс Покупатель
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

// Класс коммуникации с сервером
export class Communication {
    private api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    async getProducts(): Promise<ProductsResponse> {
        return this.api.get<ProductsResponse>("/product/");
    }

    async createOrder(orderData: OrderData): Promise<OrderResponse> {
        return this.api.post<OrderResponse>("/order/", orderData);
    }
}

// Проверка работы классов и методов
const baseUrl = "https://larek-api.nomoreparties.co/api/weblarek";
const api = new Api(baseUrl);

// Создание сервиса для работы с товарами
const productService = new Communication(api);

const catalog = new Catalog();

// Тестирование работы классов и методов
async function initApp() {
    try {
        // 1. GET‑запрос на эндпоинт /product/
        const response: ProductsResponse = await productService.getProducts();

        // 2. Тестирование класса Catalog
        console.log("*Тестирование класса Catalog*");

        // Сохраняем массив товаров в модель каталога
        catalog.setItems(response.items);
        console.log("2.1. Каталог товаров (после setItems):", catalog.getItems());

        // Получаем товар по ID
        const prodButton = catalog.getItem("1c521d84-c48d-48fa-8cfb-9d911fa515fd");
        console.log("2.2. Получили товар по ID:", prodButton);

        // Устанавливаем выбранный товар
        catalog.setSelectedItem(prodButton!);
        console.log("2.3. Выбранный товар (после setSelectedItem):", catalog.getSelectedItem());

        // Очищаем выбранный товар
        catalog.setSelectedItem({
            id: "id-25",
            title: "Забор",
            price: 500,
            category: "Стройка",
            description: "Отличная вещь от надоедливых и любопытных соседей",
            image: "ШШШ",
        });
        console.log("2.4. Выбранный товар после очистки:", catalog.getSelectedItem());

        // 3. Тестирование класса Cart
        console.log("*Тестирование класса Cart*");
        const cart = new Cart();

        // Добавляем товары в корзину
        cart.addItem(response.items[0]);
        cart.addItem(response.items[1]);
        console.log("3.1. Корзина после добавления 2 товаров:", cart.getCartList());

        // Проверяем наличие товара в корзине
        console.log("3.2. Товар с ID 854cef69-976d-4c2a-a18c-2aa45046c390 в корзине:",cart.isItemInCart("854cef69-976d-4c2a-a18c-2aa45046c390"));

        // Получаем общую стоимость
        console.log("3.3. Общая стоимость товаров в корзине:", cart.getTotalPrice());

        // Получаем количество товаров
        console.log("3.4. Количество товаров в корзине:", cart.getItemsQuantity());

        // Удаляем товар из корзины
        cart.removeItem(response.items[0]);
        console.log("3.5. Корзина после удаления 1 товара:", cart.getCartList());

        // Очищаем корзину
        cart.deleteAll();
        console.log("3.6. Корзина после очистки:", cart.getCartList());

        // 4. Тестирование класса Buyer
        console.log("*Тестирование класса Buyer*");
        const buyer = new Buyer("card", "rom@cocacola.com", "+79991234567", "ул. Набережная, д. 1, кв 9");

        // Выводим данные покупателя
        console.log("4.1. Данные покупателя (после создания):", buyer.getBuyer());

        // Обновляем данные покупателя
        buyer.updateBuyerData({email: "new@example.com", phone: "+79182233221"});
        console.log("4.2. Данные покупателя после обновления:", buyer.getBuyer());

        // Проверяем валидацию
        console.log("4.3. Проверка валидации (корректные данные):", buyer.validate());

        // Очищаем данные покупателя
        buyer.clearBuyerData();
        console.log("4.4. Данные покупателя после очистки:", buyer.getBuyer());

        // Проверяем валидацию после очистки
        console.log("4.5. Проверка валидации (пустые данные):", buyer.validate());

        // 5. Тестирование класса Communication (дополнительные вызовы)
        console.log("*Тестирование класса Communication*");

        // Создаем заказ
        const selectedItems = response.items.slice(0, 2); // берём 2 товара
        const totalPrice = selectedItems.reduce((sum, item) => sum + (item.price ?? 0), 0); // у некоторых товаров цены нет!

        const orderData: OrderData = {
            payment: "card",
            email: "test@example.com",
            phone: "+79991234567",
            address: "ул. Примерная, д. 1",
            items: selectedItems.map((item) => item.id), // ID товаров
            total: totalPrice, // добавляем общую сумму
        };

        const orderResponse: OrderResponse = await productService.createOrder(orderData);
        console.log("5.1. Ответ сервера после создания заказа:", orderResponse);
    } catch (error) {
        console.error("Ошибка при выполнении тестов:", error);
    }
}

initApp();