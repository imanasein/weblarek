import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

export interface ISuccess {
    totalPrice: number;
}

export class Success extends Component<ISuccess> {
    protected orderTotal: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;
        this.orderTotal = ensureElement<HTMLElement>(".order-success__description", this.container);
        this.closeButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
        this.closeButton.addEventListener("click", () => {
            this.events.emit("success:close");
        });
    }

    set totalPrice(value: number) {
        this.orderTotal.textContent = `Списано ${value} синапсов`;
    }
}
