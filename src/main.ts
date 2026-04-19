import "./scss/styles.scss";
import {Api} from "./components/base/Api";
import {Catalog} from "./components/Models/Catalog";
import {Cart} from "./components/Models/Cart";
import {Buyer} from "./components/Models/Buyer";
import {Communication} from "./components/Communication";
import {API_URL} from "./utils/constants";
import {EventEmitter} from "./components/base/Events";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {Header} from "./components/View/Header";
import {Gallery} from "./components/View/Gallery";
import {Modal} from "./components/View/Modal";
import {CardGallery} from "./components/View/CardGallery";
import {CardPreview} from "./components/View/CardPreview";
import {CardBasket} from "./components/View/CardBasket";
import {Success} from "./components/View/Success";
import {Basket} from "./components/View/Basket";
import {FormOrder} from "./components/View/FormOrder";
import {FormContacts} from "./components/View/FormContacts";
import {ProductsResponse, OrderData, OrderResponse, IProduct, IBuyer} from "./types";

// Сохраняем все шаблоны и контейреры элементов для передачи в слой отображения
const headerContainer = ensureElement<HTMLElement>(".header");
const modallContainer = ensureElement<HTMLElement>("#modal-container");
const pageWrapper = ensureElement<HTMLElement>(".page__wrapper");
const successContainer = cloneTemplate<HTMLDivElement>("#success");
const cardPreviewContainer = cloneTemplate<HTMLDivElement>("#card-preview");
const basketContainer = cloneTemplate<HTMLDivElement>("#basket");
const formOrderContainer = cloneTemplate<HTMLFormElement>("#order");
const formContactsContainer = cloneTemplate<HTMLFormElement>("#contacts");

// Создаём экземпляр класса брокера событий
const events = new EventEmitter();

// Создаём экземпляры классов слоя отображения
const header = new Header(headerContainer, events);
const gallery = new Gallery(pageWrapper);
const modal = new Modal(modallContainer, events);
const success = new Success(successContainer, events);
const basket = new Basket(basketContainer, events);
const formOrder = new FormOrder(formOrderContainer, events);
const formContacts = new FormContacts(formContactsContainer, events);
const cardModalview = new CardPreview(cardPreviewContainer, events);

// Создаём экземпляры всех классов модели данных
const productList = new Catalog(events);
const cart = new Cart(events);
const buyer = new Buyer(events);

// Создаём экземпляр класса коммуникации
const api = new Api(API_URL);
const productService = new Communication(api);

// Инициализация приложения: загрузка продуктов с сервера
async function telecomm() {
    try {
        // GET‑запрос на эндпоинт /product/
        const response: ProductsResponse = await productService.getProducts();
        productList.products = response.items;
    } catch (error) {
        console.error("Ошибка сервера:", error);
    }
}

telecomm();

//----- Делее через брокер событий подписываемся на события----

// Событие: каталог: изменился (модель данных)
events.on("catalog:changed", () => {
    const products = productList.products;
    const galleryCards = products.map((product) => {
        const cardCatalogContainer = cloneTemplate<HTMLButtonElement>("#card-catalog");
        const card = new CardGallery(cardCatalogContainer, {
            onClick: () => {
                events.emit("galleryCard:selected", product);
            },
        });
        return card.render(product);
    });
    gallery.catalog = galleryCards;
});

// Событие: карточка товара выбрана (отображение - карточка товара галереи)
events.on("galleryCard:selected", (product: IProduct) => {
    productList.setSelectedItem(product);
});

// Событие: открыть карзину (отображение - клик по рисунку карзины в header)
events.on("basket:open", () => {
    modal.content = basket.render();
    modal.show();
});

//Событие: товар выбран для детального отображения (модель данных- выбранный товар изменился)
events.on("catalog:product_selected", () => {
    const selectedProduct = productList.getSelectedItem();
    if (selectedProduct) {
        const isInCart = cart.isItemInCart(selectedProduct.id);
        cardModalview.buttonText = isInCart ? "Удалить из корзины" : "Купить";
        if (selectedProduct.price === null) {
            cardModalview.buttonStatus = true;
            cardModalview.buttonText = "Недоступно";
        } else {
            cardModalview.buttonStatus = false;
        }
        modal.content = cardModalview.render(selectedProduct);
        modal.show();
    }
});

// Событие: товар купить/удалить (отображение - кнопка товара превью купить/удалить)
events.on("product:to_cart", () => {
    const selectedProduct = productList.getSelectedItem();
    if (!selectedProduct) {
        return;
    }
    const isProductInCart = cart.isItemInCart(selectedProduct.id);
    if (isProductInCart) {
        cart.removeItem(selectedProduct);
    } else {
        cart.addItem(selectedProduct);
    }
    modal.hide();
});

// Событие товар: удалить (отображение - карточка в карзине)
events.on("product:delete", (product: IProduct) => {
    if (product) {
        cart.removeItem(product);
    }
});

// Событие карзина: изменилась (слой данных - изменения: добавить,  удалить, удалить всё)
events.on("basket:changed", () => {
    const cartNumber = cart.getItemsQuantity();
    header.counter = cartNumber;
    const cartProducts = cart.getCartList();
    basket.orderPrice = cart.getTotalPrice();
    const basketCards: HTMLElement[] = [];

    if (cartProducts) {
        cartProducts.forEach((product, index) => {
            const cardBasketContainer = cloneTemplate<HTMLLIElement>("#card-basket");
            const cardBasket = new CardBasket(cardBasketContainer, {
                onClick: () => {
                    events.emit("product:delete", product);
                },
            });
            const renderedCard = cardBasket.render(product);
            cardBasket.index = index + 1;
            basketCards.push(renderedCard);
        });
    }
    basket.basketList = basketCards;

    if (basketCards.length === 0) {
        basket.buttonStatus = true;
    } else {
        basket.buttonStatus = false;
    }
    console.log("Отображение - карзина изменилась!");
});
// Событие: модальное окно: закрыть (отображение - клик по кнопке/клик вне окна)
events.on("modal:close", () => {
    modal.hide();
});

// Событие: карзина: заказать (отображение - клик  по кнопке в карзине Заказать)
events.on("basket:order", () => {
    modal.content = formOrder.render();
    modal.show();
});

// Событие: конпка "Оплата онлайн" нажата (отображение - форма Order)
events.on("payment_card:selected", () => {
    formOrder.buttonStatus = "card";
    buyer.updateBuyerData({payment: "card"});
});

// Событие: конпка "Оплата наличными" нажата (отображение - форма Order)
events.on("payment_cash:selected", () => {
    formOrder.buttonStatus = "cash";
    buyer.updateBuyerData({payment: "cash"});
});

// Событие: данные адреса изменены (отображение - поле адреса формы Order)
events.on("address:changed", (data: {address: string}) => {
    buyer.updateBuyerData({address: data.address});
});

// Событие: данные email изменены (отображение - поле адреса формы Contacts)
events.on("email:changed", (data: {email: string}) => {
    buyer.updateBuyerData({email: data.email});
});

// Событие: данные телефона изменены (отображение - поле адреса формы Contacts)
events.on("phone:changed", (data: {phone: string}) => {
    buyer.updateBuyerData({phone: data.phone});
});

// Событие: модель данных Buyer изменилась
events.on("buyer:changed", () => {
    const errors = buyer.validate(); // Вызываем метод валидации модели Buyer
    let orderErrors: string = "";

    if (errors.address && errors.payment) {
        orderErrors = `${errors.address}; ${errors.payment}`;
    } else if (errors.address) {
        orderErrors = `${errors.address}`;
    } else if (errors.payment) {
        orderErrors = `${errors.payment}`;
    }
    formOrder.errors = orderErrors;
    if (!errors.address && !errors.payment) {
        formOrder.valid = true;
    }
    let contactsErrors: string = "";
    if (errors.email && errors.phone) {
        contactsErrors = `${errors.email}; ${errors.phone}`;
    } else if (errors.email) {
        contactsErrors = `${errors.email}`;
    } else if (errors.phone) {
        contactsErrors = `${errors.phone}`;
    }
    formContacts.errors = contactsErrors;
    if (!errors.email && !errors.phone) {
        formContacts.valid = true;
    }
});

// Событие нажатие кнопки Далее (отображение - кнопка submit формы Order)
events.on("order:submit", () => {
    modal.content = formContacts.render();
    modal.show();
});

// Событие нажатие кнопки Оплатить (отображение - кнопка submit формы Contacts)
events.on("contacts:submit", async () => {
    const customer: IBuyer = buyer.getBuyer();
    const orderTotalPrice: number = cart.getTotalPrice();
    const orderingProducts: IProduct[] = cart.getCartList();
    const idProductsList: string[] = orderingProducts.map((item) => item.id);
    const orderRequest: OrderData = {
        payment: customer.payment,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        total: orderTotalPrice,
        items: idProductsList,
    };

    try {
        const response = await productService.createOrder(orderRequest);
        cart.deleteAll();
        buyer.clearBuyerData();
        const serverTotal = response.total;
        success.totalPrice = serverTotal;
        modal.content = success.render();
    } catch (error) {
        console.error(error);
    }
});

// Событие: Успешно: закрыть (отображение - Модальное окно Успешно - кнопка)
events.on("success:close", () => {
    success.totalPrice = 0;
    modal.hide();
});
