import {ensureElement} from "../../utils/utils";
import {Card} from "./base/Card";
import {ICardAction} from "../../types";

export interface ICardBasket {
    index: number;
}

export class CardBasket extends Card<ICardBasket> {
    protected cardIndex: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected actions: ICardAction) {
        super(container);
        this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);
        this.deleteButton.addEventListener("click", actions.onClick);
    }

    set index(value: number) {
        this.cardIndex.textContent = value.toString();
    }
}
