import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected buttonBasket: HTMLButtonElement;
    protected counterElement!: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLElement, events: IEvents) {
        super(container);

        this.buttonBasket = ensureElement<HTMLButtonElement>(".header__basket", this.container);
        this.counterElement = ensureElement<HTMLElement>(".header__basket-counter", this.container);
        this.events = events;
        // Устанавливаем значение счётчика по умолчанию при инициализации
        this.counter = 0;
        this.buttonBasket.addEventListener("click", () => {
            this.events.emit("basket:open");
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = value.toString();
    }
}
