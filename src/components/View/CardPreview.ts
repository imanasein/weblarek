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
        this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);
        this.buyButton = ensureElement<HTMLButtonElement>(".card__button", this.container);

        this.buyButton.addEventListener("click", () => {
            this.events.emit("product:to_cart");
        });
    }

    set category(value: CategoryKey) {
        this.categoryElement.textContent = value;
        Object.values(categoryMap).forEach((className) => {
            this.categoryElement.classList.remove(className);
        });
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

    set buttonText(value: string) {
        this.buyButton.textContent = value;
    }

    set buttonStatus(value: boolean) {
        this.buyButton.disabled = value;
    }
}
