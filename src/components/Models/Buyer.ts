import {IBuyer, TPayment, TBuyerErrors} from "../../types";
import {IEvents} from "../base/Events";

export class Buyer {
    private buyerPayment: TPayment = "";
    private buyerEmail: string = "";
    private buyerPhone: string = "";
    private buyerAddress: string = "";

    constructor(protected events: IEvents) {}

    updateBuyerData(data: Partial<IBuyer>): void {
        // Метод добавления данных покупателя, реализован отдельно по полям
        if (data.payment !== undefined) this.buyerPayment = data.payment;
        if (data.email !== undefined) this.buyerEmail = data.email;
        if (data.phone !== undefined) this.buyerPhone = data.phone;
        if (data.address !== undefined) this.buyerAddress = data.address;
        this.events.emit("buyer:chenged"); // Уточнить нужен ли контекст или данные ???
    }

    getBuyer(): IBuyer {
        // Метод получения данных покупателя
        return {
            payment: this.buyerPayment,
            email: this.buyerEmail,
            phone: this.buyerPhone,
            address: this.buyerAddress,
        };
    }

    clearBuyerData(): void {
        // Метод очистки данных покупателя
        this.buyerPayment = "";
        this.buyerEmail = "";
        this.buyerPhone = "";
        this.buyerAddress = "";
        this.events.emit("buyer:cleared");
    }

    validate(): TBuyerErrors {
        // метод проверки заполнения полей покупателя
        const errors: TBuyerErrors = {}; // получает объединение всех ключей интерфейса, создаёт объектный тип, где каждый из этих ключей имеет тип string;

        if (this.buyerPayment === "") {
            errors.payment = "Не выбран вид оплаты";
        }

        if (this.buyerEmail === "") {
            errors.email = "Укажите email";
        }

        if (this.buyerPhone === "") {
            errors.phone = "Укажите телефон";
        }
        if (this.buyerAddress === "") {
            errors.address = "Не указан адрес";
        }

        return errors;
    }
}
