import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

export interface IBasket {
    orderPrice: number;
    basketList: HTMLElement[];
    buttonText: string;
    buttonStatus: boolean;
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
            this.events.emit("basket:order");
        });
    }

    set orderPrice(value: number) {
        this.totalPrice.textContent = `${value} синапсов`;
    }

    set basketList(items: HTMLElement[]) {
        this.basketListElement.replaceChildren(...items);
    }
    
    set buttonStatus(value: boolean) {
        this.orderButton.disabled = value;
    }
}
