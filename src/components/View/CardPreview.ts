import {ensureElement} from "../../utils/utils";
import {Card} from "./base/Card";
import {IEvents} from "../base/Events";
import {categoryMap} from "../../utils/constants";
import {CDN_URL} from "../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

export interface ICardPreview {
    category: CategoryKey;
    image: string;
    description: string;
}

export class CardPreview extends Card<ICardPreview> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected descriptionElement: HTMLElement;
    private buyButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        this.descriptionElement = ensureElement<HTMLElement>(".card__description", this.container);
        this.buyButton = ensureElement<HTMLButtonElement>(".card__buy-button", this.container);

        this.buyButton.addEventListener("click", () => {
            this.events.emit("product:buy", this.container);
        });
    }

    set category(value: CategoryKey) {
        this.categoryElement.textContent = value;
        // Очищаем все классы категорий перед установкой новых
        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });
        // Безопасная индексация с проверкой
        if (value in categoryMap) {
            const className = categoryMap[value];
            this.categoryElement.classList.add(className);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value);
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }

    set buttonStatus(value: boolean) {
        // кнопка включается/отключается в зависимости от value
        this.buyButton.disabled = !value;
        this.buyButton.textContent = "Недоступно"
    }

    set isInBasket(value: boolean) {
        this.buyButton.textContent = value ? "Удалить из корзины" : "Купить";
    }
}