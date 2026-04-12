import {Component} from "../base/Components";
import {createElement, ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

export interface IBasket {
    orderPrice: number;
    isEmpty: boolean;
    toggleOrderButton: void;
}

export class Basket extends Component<IBasket> {

    private isBasketEmpty: boolean;
    protected basketList: HTMLElement;
    protected orderButton: HTMLButtonElement;
    protected totalPrice: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {

        super(container);
        this.isBasketEmpty = true;  // Значение по умолчанию "true" - корзина пуста!
        this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
        this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
        this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
        this.events = events;
        this.orderButton.addEventListener("click", () => {
            this.events.emit("busket:order");
        });
        this.toggleOrderButton();
    }

    set orderPrice(value: number) {
        this.totalPrice.textContent = `${value} синапсов`;
    }

    set isEmpty(value: boolean) {
        this.isBasketEmpty = value;
    }

    private toggleOrderButton(): void {
        if(this.isBasketEmpty) {
            this.orderButton.disabled = true;
            this.orderPrice = 0;
            const noItems: HTMLElement = createElement<HTMLElement>('span');
            noItems.textContent = "Корзина пуста"; // проверить нужны ли стили(какой нибудь класс)
            this.basketList.appendChild(noItems);
        }
    }
}