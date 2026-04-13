import {ensureElement} from "../../utils/utils";
import {Card} from "./base/Card";
import {IEvents} from "../base/Events";

export interface ICardBasket {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    private cardIndex: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;
        this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);
        this.deleteButton.addEventListener("click", () => {
            this.events.emit("basket:delite_card");
        });
    }

    set index(value: number) {
        this.cardIndex.textContent = value.toString();
    }
}
