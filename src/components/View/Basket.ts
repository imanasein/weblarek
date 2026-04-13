import {Component} from "../base/Components";
import {createElement, ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

export interface IBasket {
    orderPrice: number;
    basketList: HTMLElement[];
}

export class Basket extends Component<IBasket> {
    protected basketListElement: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected totalPrice: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.basketListElement = ensureElement<HTMLElement>(".basket__list", this.container);
        this.totalPrice = ensureElement<HTMLElement>(".basket__price", this.container);
        this.orderButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
        this.orderButton.addEventListener("click", () => {
            this.events.emit("busket:order");
        });
    }

    set orderPrice(value: number) {
        this.totalPrice.textContent = `${value} синапсов`;
    }

    set basketList(items: HTMLElement[]) {
        this.basketListElement.replaceChildren(...items);
        this.isBasketEmpty(); // проверяем сразу пустая ли корзина
        this.events.emit("busket:added");
    }

    protected isBasketEmpty(): boolean {
        const isEmty = this.basketListElement.children.length === 0; // проверяем есть ли товары в корзине
        if (isEmty) {
            this.orderPrice = 0;
            this.orderButton.disabled = true;
            const noItems: HTMLElement = createElement<HTMLElement>("span");
            noItems.textContent = "Корзина пуста"; // проверить нужны ли стили(какой нибудь класс)
            this.basketListElement.replaceChildren(noItems);
        } else {
            this.orderButton.disabled = false;
        }
        return isEmty;
    }
}
