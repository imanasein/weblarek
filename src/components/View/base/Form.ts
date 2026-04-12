import {ensureElement} from "../../../utils/utils";
import {Component} from "../../base/Components";
import {IEvents} from "../../base/Events";

export abstract class Form<T> extends Component<T> {
    
    protected formElement: HTMLFormElement;
    protected submitButton: HTMLButtonElement;
    protected errorElement: HTMLElement;
    protected events: IEvents;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container);
        this.events = events;
        this.formElement = container;
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);
        this.errorElement = ensureElement<HTMLElement>('form__errors', this.container);
        this.formElement.addEventListener('submit', (event)=> {
            event.preventDefault();
            if (this.validate()) {
                this.onSubmit()// или this.events.emit() ???
            }
        });
        this.formElement.addEventListener('input', () => {
            // логика валидации и обновления состояния кнопки
            this.onInput();
        });
    }
    // переключатель класса: 
    protected toggleClass(element: HTMLElement, className: string, boolenValue?: boolean) {
        return element.classList.toggle(className, boolenValue);
    }

    protected validate(): boolean {
        return true;
    }

    protected onSubmit(): void {
        // логика при нажатии кнопки submit - реазизация предусмотрена в дочерних классах
    }

    protected onInput(): void {
        // логика при заполнении Input - реазизация предусмотрена в дочерних классах
    }
}