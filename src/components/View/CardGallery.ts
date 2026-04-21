import {Card} from "./base/Card";
import {ensureElement} from "../../utils/utils";
import {categoryMap} from "../../utils/constants";
import {CDN_URL} from "../../utils/constants";
import {ICardAction} from "../../types";

type CategoryKey = keyof typeof categoryMap;

export interface ICardGallery {
    category: CategoryKey;
    image: string;
}

export class CardGallery extends Card<ICardGallery> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, actions?: ICardAction) {
        // вместо брокера передаём абстракцию
        super(container);
        this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
        this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
        if (actions?.onClick) {
            this.container.addEventListener("click", actions.onClick);
        }
    }

    set category(value: CategoryKey) {
        this.categoryElement.textContent = value;
        // Сразу задаём базовый класс вместо перебора и удаления всех классов
        this.categoryElement.className = 'card__category';
        
        if (value in categoryMap) {
            const className = categoryMap[value];
            this.categoryElement.classList.add(className);
        }
    }

    set image(value: string) {
        this.setImage(this.imageElement, CDN_URL + value, this.title);
    }
}
