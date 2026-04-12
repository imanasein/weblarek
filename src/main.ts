import "./scss/styles.scss";
import {ProductsResponse, OrderData, OrderResponse} from "./types";
import {Api} from "./components/base/Api";
import {Catalog} from "./components/Models/Catalog";
import {Cart} from "./components/Models/Cart";
import {Buyer} from "./components/Models/Buyer";
import {Communication} from "./components/Communication";
import {API_URL} from "./utils/constants";
import {apiProducts} from "./utils/data";
import {Header} from "./components/View/Header";
import {Gallery} from "./components/View/Gallery";
import {Modal} from "./components/View/Modal";
import {CardGallery} from "./components/View/CardGallery";
import {CardPreview} from "./components/View/CardPreview";
import {cloneTemplate, ensureElement} from "./utils/utils";
import {IProduct} from "./types";
import {ICardActions} from "./components/View/base/Card";
import {EventEmitter} from "./components/base/Events";

// Создаём экземпляры всех классов, которые не зависят от DOM
const productList = new Catalog();
const cart = new Cart();
const buyer = new Buyer();
const api = new Api(API_URL);
const productService = new Communication(api);
const events = new EventEmitter();

// // 1. Тестирование класса Catalog
// console.log("*Тестирование класса Catalog*");

// // Сохраняем массив товаров в модель каталога
// productList.products = apiProducts.items;
// console.log("1.1. Каталог товаров (Сохранение в конструкторе):", productList.products);

// // Получаем товар по ID
// const candy = productList.getItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
// console.log("1.2. Получили товар по ID:", candy);

// // Устанавливаем выбранный товар
// productList.setSelectedItem(candy!);
// console.log("1.3. Выбранный товар (после setSelectedItem):", productList.getSelectedItem());

// // 3. Тестирование класса Cart
// console.log("*Тестирование класса Cart*");

// const prodCat = productList.products;
// // Добавляем товары в корзину
// cart.addItem(prodCat[0]);
// cart.addItem(prodCat[1]);
// console.log("2.1. Корзина после добавления 2 товаров:", cart.getCartList());

// // Проверяем наличие товара в корзине  ??? Уточнить ID товара (2)
// console.log(
//     "2.2. Товар с ID 854cef69-976d-4c2a-a18c-2aa45046c390 в корзине:",
//     cart.isItemInCart("854cef69-976d-4c2a-a18c-2aa45046c390")
// );
// console.log("2.3. Товар с ID 2515ААА в корзине:", cart.isItemInCart("2515ААА"));

// // Получаем общую стоимость
// console.log("2.4. Общая стоимость товаров в корзине:", cart.getTotalPrice());

// // Получаем количество товаров
// console.log("2.5. Количество товаров в корзине:", cart.getItemsQuantity());

// // Удаляем товар из корзины
// cart.removeItem(prodCat[0]); // для проверки добавления 2-х товаров нужно закоментировать удаление из корзины
// console.log("2.6. Корзина после удаления 1 товара:", cart.getCartList());

// // Очищаем корзину
// cart.deleteAll(); // для проверки добавления 2-х товаров нужно закоментировать удаление из корзины
// console.log("2.7. Корзина после очистки:", cart.getCartList());

// // 3. Тестирование класса Buyer
// console.log("*Тестирование класса Buyer*");

// // Обновляем данные покупателя
// buyer.updateBuyerData({email: "new@example.com", phone: "+79182233221"});
// console.log("3.1. Данные покупателя после обновления:", buyer.getBuyer());

// // Проверяем валидацию неполные данные покупателя
// console.log("3.2. Проверка валидации (неполные данные):", buyer.validate());

// buyer.updateBuyerData({
//     payment: "card",
//     address: "350000, Краснодарский край, Сочи, Адлер, ул. Олимпийский проспект, д.7",
// });
// console.log("3.3. Данные покупателя после обновления:", buyer.getBuyer());

// // Проверяем валидацию
// console.log("3.4. Проверка валидации (корректные полные данные):", buyer.validate());

// // Удаляем данные покупателя
// buyer.clearBuyerData();
// console.log("3.5. Данные покупателя после удаления:", buyer.getBuyer());

// // Проверяем валидацию после удаления данных покупателя
// console.log("3.6. Проверка валидации (все поля покупателя пусты):", buyer.validate());

// //Тестирование класса Communication методов POST и GET
// console.log("*Тестирование класса Communication*");

// async function telecomm() {
//     try {
//         // GET‑запрос на эндпоинт /product/
//         const response: ProductsResponse = await productService.getProducts();
//         console.log("4.1. Выполнен GET запрос на эндпоинт /product/, ответ сервера: ", response);

//         productList.products = response.items;
//         console.log("4.2 Проверка каталога товаров, полученных с сервера: ", productList.products);

//         // === ТЕСТИРОВАНИЕ ВИЗУАЛЬНОГО СЛОЯ (Gallery + CardCatalog) ===
//         console.log("=== ТЕСТИРОВАНИЕ ВИЗУАЛЬНОГО СЛОЯ (Gallery + CardCatalog) ===");

//         // Находим элемент class="gallery"> в разметке
//         const gallery = ensureElement<HTMLElement>(".gallery");

//         // Получаем шаблон карточки из DOM
//         const cardTemplate = cloneTemplate<HTMLTemplateElement>("#card-catalog");

//         // Создаёт карточку товара на основе шаблона и данных продукта
//         // Создаём массив карточек для первых 10 товаров

//         const testProducts = productList.products
//         const cardElements: HTMLElement[] = [];

//         testProducts.forEach((product, index) => {
//             console.log(`  - Создаём карточку ${index + 1}: ${product.title}`);

//             // Создаём экземпляр CardCatalog напрямую
//             const cardElement = cardTemplate.cloneNode(true) as HTMLElement;
//             const card = new CardCatalog(cardElement, {
//                 onClick: (event: MouseEvent) => {
//                 // Эмиттим событие при клике на карточку
//                     events.emit("card:open", {
//                         productId: product.id,
//                         productTitle: product.title
//                     });
//                 }
//             });

//             // Используем метод render для заполнения данными и получения элемента
//             const renderedCard = card.render(product);
//             cardElements.push(renderedCard);
//         });

//         // Отображаем ВСЕ карточки разом через replaceChildren()
//         console.log("Передаём все карточки в галерею для отображения...");
//         gallery.replaceChildren(...cardElements);

//         // ... остальной код (создание заказа и т. д.)
//     } catch (error) {
//         console.error("Ошибка сервера:", error);
//     }
// }

// // Запускаем тестирование после загрузки DOM
// document.addEventListener("DOMContentLoaded", async () => {
//     await telecomm();