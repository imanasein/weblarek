import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";
import {Form} from "./base/Form";

export interface IFormContacts {
    email: string;
    phone: string;
}

export class FormContacts extends Form<IFormContacts> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this.emailInput = ensureElement<HTMLInputElement>(".form__input[name=email]", this.container);
        this.phoneInput = ensureElement<HTMLInputElement>(".form__input[name=phone]", this.container);

        this.emailInput.addEventListener("input", () => {
            this.events.emit("email:changed", {email: this.emailInput.value});
        });

        this.phoneInput.addEventListener("input", () => {
            this.events.emit("phone:changed", {phone: this.phoneInput.value});
        });
    }

    set emailInputValue(value: string) {
        this.emailInput.value = value;
    }

    set phoneInputValue(value: string) {
        this.phoneInput.value = value;
    }
}
