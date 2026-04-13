import {Card} from "./base/Card";
import {IEvents} from "../base/Events";
import {ensureElement} from "../../utils/utils";
import {categoryMap} from "../../utils/constants";
import {CDN_URL} from "../../utils/constants";

type CategoryKey = keyof typeof categoryMap;

export interface ICardGallery {
    category: CategoryKey;
    image: string;
}

export class CardGallery extends Card<ICardGallery> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        this.container.addEventListener("click", () => {
            this.events.emit("gallery:open");
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
}