import {ensureElement} from "../../../utils/utils";
import {IProduct} from "../../../types";
import {Component} from "../../base/Components";
import {IEvents} from "../../base/Events";
import {CDN_URL} from "../../../utils/constants";
import {categoryMap} from "../../../utils/constants";

export interface ICard extends IProduct {
    cardData:IProduct;
}

type CategoryKey = keyof typeof categoryMap;

export abstract class Card<T extends IProduct> extends Component<T> {
    protected product: T; // Инициализируем с пустыми значениями, а не null
    protected events: IEvents;

    // Общие элементы для всех карточек товара
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected categoryElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);
        this.events = events;

        // Инициализируем product с пустыми значениями на случей, если с ервера ничего не придёт
        this.product = {
            id: "",
            title: "",
            description: "",
            image: "",
            category: "",
            price: null,
        } as T;

        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
    }

    set cardData(data: T) {
        const {image, title, category, price} = data;
        // Обновляем внутренние данные
        this.product = data;

        // Заполняем элементы
        this.titleElement.textContent = title;
        // Проверка наличия цены
        this.priceElement.textContent = price !== null ? `${price} синапсов` : "Бесценно";
        this.setImage(this.imageElement, `${CDN_URL}/${image}`, title);
        this.categoryElement.textContent = category;

        // Очищаем все классы категорий перед установкой новых
        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });

        // Безопасная индексация с проверкой
        if (category in categoryMap) {
            const categoryKey = category as CategoryKey;
            const className = categoryMap[categoryKey];
            this.categoryElement.classList.add(className);
        }
    }

    abstract render(data?: T): HTMLElement;
}