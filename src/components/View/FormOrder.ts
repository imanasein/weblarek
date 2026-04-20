import {TPayment} from "../../types";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/Events";
import {Form} from "./base/Form";

export interface IFormOrder {
    payment: TPayment;
    address: string;
}

export class FormOrder extends Form<IFormOrder> {
    protected buttonCard: HTMLButtonElement;
    protected buttonCash: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, protected events: IEvents) {
        super(container, events);
        this.buttonCard = ensureElement<HTMLButtonElement>(".button_alt[name=card]", this.container);
        this.buttonCash = ensureElement<HTMLButtonElement>(".button_alt[name=cash]", this.container);
        this.addressInput = ensureElement<HTMLInputElement>(".form__input[name=address]", this.container);

        this.buttonCard.addEventListener("click", () => {
            this.events.emit("payment_card:selected");
        });

        this.buttonCash.addEventListener("click", () => {
            this.events.emit("payment_cash:selected");
        });

        this.addressInput.addEventListener("input", () => {
            this.events.emit("address:changed", {address: this.addressInput.value});
        });
    }

    // Сеттеры для установки состояния кнопки
    set buttonStatus(value: TPayment) {
        this.buttonCard.classList.toggle("button_alt-active", value === "card");
        this.buttonCash.classList.toggle("button_alt-active", value === "cash");
    }

    // Сеттер для установки значения в поле Инпут адреса
    set addressInputValue (value: string) {
        this.addressInput.value = value;
    }
}
