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

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this.buttonCard = ensureElement<HTMLButtonElement>(".button_alt[name=card]", this.container);
        this.buttonCash = ensureElement<HTMLButtonElement>(".button_alt[name=cash]", this.container);
        this.adressInput = ensureElement<HTMLInputElement>(".form__input[name=address]", this.container);
        this.adressInput.addEventListener("click", () => {
            this.events.emit("input:address", {value: this.adressInput.value});
        });
        this.buttonCard.addEventListener("click", () => {
            this.events.emit("payment:card");
            this.buttonCard.classList.add("button_alt-active");
        });
        this.buttonCash.addEventListener("click", () => {
            this.events.emit("payment:cash");
            this.buttonCash.classList.add("button_alt-active");
        });
    }

    set payment(value: TPayment) {
        this.buttonCard.classList.toggle("button_alt-active", value === "card");
        this.buttonCash.classList.toggle("button_alt-active", value === "cash");
    }

    set address(value: string) {
        this.adressInput.value = value;
    }
}
