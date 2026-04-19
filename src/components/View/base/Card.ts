import {ensureElement} from "../../../utils/utils";
import {Component} from "../../base/Components";

export interface ICard {
    title: string;
    price: number | null;
}

export abstract class Card<T> extends Component<ICard> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container); // конструктор родителя Component
        this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
        this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent = value === null ? "Бесценно" : `${value} синапсов`;
    }
}
