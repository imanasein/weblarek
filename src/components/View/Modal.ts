import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected events: IEvents;
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, events: IEvents, ) {
        super(container);
        this.events = events;
        this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
        this.contentElement = ensureElement<HTMLElement>(".modal__content", this.container);
        this.closeButton.addEventListener("click", () => {
            this.events.emit("modal:close");
        });
    }

    set content(item: HTMLElement) {
        // Очистка предыдущего содержимого
        this.contentElement.innerHTML = "";

        if (item instanceof HTMLElement) {
            this.contentElement.append(item);
        } else {
            console.warn("Modal: 'элемент переданный в Модальное окно не является HTML элементом!");
        }
        return;
    }

    show(): void {
        this.container.classList.add("modal_active");
    }

    hide(): void {
        this.container.classList.remove("modal_active");
    }

    render(data?: Partial<IModal>): HTMLElement {
        // Переопределяем метод render() так, чтобы при вызове без аргументов он просто возвращал разметку
        if (data) {
            Object.assign(this as object, data);
        }
        return this.container; // В любом случае возвращаем корневой DOM‑элемент
    }
}