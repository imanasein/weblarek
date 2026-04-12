import {IProduct} from "../../types";
import {ensureElement} from "../../utils/utils";
import {Card, ICard} from "./base/Card";
import {IEvents} from "../base/Events";

export interface ICardBasket extends ICard {
    // дописать интерфейс!!!
    index: number;
}

export class CartBasket extends Card<IProduct> {
    private cardIndex: HTMLElement;
    private deleteButton: HTMLButtonElement;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
        this.cardIndex = ensureElement<HTMLElement>(".basket__item-index", this.container);
        this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", this.container);
        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        this.deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();
            this.events.emit("basket:remove-item", {
                productId: this.product.id,
                type: "basket",
            });
        });
    }

    set index(value: number) {
        this.cardIndex.textContent = value.toString();
    }

    render(data?: IProduct): HTMLElement {
        if (data) {
            this.cardData = data;
        }
        return this.container;
    }
}