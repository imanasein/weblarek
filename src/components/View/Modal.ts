import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        this.events = events;
        this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
        this.contentElement = ensureElement<HTMLElement>(".modal__content", this.container);
        this.closeButton.addEventListener("click", () => {
            this.events.emit("modal:close");
        });
    }

    set content(item: HTMLElement) {
        // Уточнить нужна ли очистка содержимого перед загрузкой
        this.contentElement.replaceChildren(item);
        this.show(); // при добавлении сразу отрываем модальное окно
    }

    show(): void {
        this.container.classList.add("modal_active");
        this.events.emit("modal:open");
    }

    hide(): void {
        this.container.classList.remove("modal_active");
        this.events.emit("modal:close");
    }
}
