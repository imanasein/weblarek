import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

interface IHeader {
    counter: number;
}

export class Header extends Component<IHeader> {
    protected buttonBasket!: HTMLButtonElement;
    protected counterElement!: HTMLElement;

    constructor(protected events: IEvents, container: HTMLElement) {
        
        super(container);
        this.buttonBasket = ensureElement<HTMLButtonElement>(".header__basket", this.container);
        this.counterElement = ensureElement<HTMLElement>(".header__basket-counter", this.container);
        // Устанавливаем значение счётчика по умолчанию при инициализации
        this.counter = 0;
        this.buttonBasket.addEventListener("click", () => {
            // Устанавливаем слушатель события клика в конструкторе
            this.events.emit("basket:open");
        });
    }

    set counter(value: number) {
        this.counterElement.textContent = value.toString(); // из цифры делаем строку и записываем текст в Спан
    }
}