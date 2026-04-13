import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

export interface ISuccess {
    orderTotall: number;
}

export class Success extends Component<ISuccess> {
    protected ordertTotal: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;
        this.ordertTotal = ensureElement<HTMLElement>(".order-success__description", this.container);
        this.closeButton = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
        this.closeButton.addEventListener("click", () => {
            this.events.emit("success:close");
        });
    }

    set orderTotall(value: number) {
        this.ordertTotal.textContent = `Списано ${value} синапсов`;
    }
}
