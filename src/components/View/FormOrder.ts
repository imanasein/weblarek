import {TPayment} from "../../types";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";
import {Form} from "./base/Form";

export interface IFormOrder {
    payment: TPayment;
    adress: string;
}

export class FormOrder extends Form<IFormOrder> {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected adressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this.buttonCard = ensureElement<HTMLButtonElement>('.button_alt[name="card"]', this.formElement);
        this.buttonCash = ensureElement<HTMLButtonElement>('.button_alt[name="cash"]', this.formElement);
        this.adressInput = ensureElement<HTMLInputElement>('.form__input[name="address"]', this.formElement);
        this.buttonCard.addEventListener("click", () => {
            this.payment = "card";
            this.events.emit("payment:card");
        });
        this.buttonCash.addEventListener("click", () => {
            this.payment = "cash";
            this.events.emit("payment:cash");
        });
    }

    set payment(value: TPayment) {
        this.toggleClass(this.buttonCard, "button_alt-active", value === "card");
        this.toggleClass(this.buttonCard, "button_alt-active", value === "cash");
    }

    set address(value: string) {
        this.adressInput.value = value;
    }
}