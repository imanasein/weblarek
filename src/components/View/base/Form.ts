import {ensureElement} from "../../../utils/utils";
import {Component} from "../../base/Components";
import {IEvents} from "../../base/Events";

export interface IForm {
    errors: string;
    valid: boolean;
}

export abstract class Form<T> extends Component<IForm> {
    //Уточнить про оператор & нужен ли или оставить IForm

    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container);
        this.events = events;
        this.errorElement = ensureElement<HTMLElement>(".form__errors", this.container);
        this.submitButton = ensureElement<HTMLButtonElement>("button[type=submit]", this.container);
        this.submitButton.addEventListener("click", (event) => {
            event.preventDefault();
            this.events.emit(`${(this.container as HTMLInputElement).name}:submit`);
        });
    }

    set errors(value: string) {
        this.errorElement.textContent = value;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value; // Если valid = false, кнопка блокируется; если valid = true — разблокируется.
    }
}
