import {IBuyer, TPayment} from "../../../types";

export class Buyer implements IBuyer {
    private buyerPayment: TPayment = "";
    private buyerEmail: string = "";
    private buyerPhone: string = "";
    private buyerAddress: string = "";

    constructor(payment: TPayment, email: string, phone: string, address: string) {
        this.buyerPayment = payment;
        this.buyerEmail = email;
        this.buyerPhone = phone;
        this.buyerAddress = address;
    }

    // Геттеры
    get payment(): TPayment {
        return this.buyerPayment;
    }
    get email(): string {
        return this.buyerEmail;
    }
    get phone(): string {
        return this.buyerPhone;
    }
    get address(): string {
        return this.buyerAddress;
    }

    // Сеттеры
    set payment(value: TPayment) {
        this.buyerPayment = value;
    }
    set email(value: string) {
        this.buyerEmail = value;
    }
    set phone(value: string) {
        this.buyerPhone = value;
    }
    set address(value: string) {
        this.buyerAddress = value;
    }

    updateBuyerData(data: Partial<Buyer>): void {
        // Метод добавления данных покупателя, реализован отдельно по полям
        if (data.payment !== undefined) this.payment = data.payment;
        if (data.email !== undefined) this.email = data.email;
        if (data.phone !== undefined) this.phone = data.phone;
        if (data.address !== undefined) this.address = data.address;
    }

    getBuyer(): IBuyer {
        // Метод получения данных покупателя
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address,
        };
    }

    clearBuyerData(): void {
        // Метод очистки данных покупателя
        this.buyerPayment = "";
        this.buyerEmail = "";
        this.buyerPhone = "";
        this.buyerAddress = "";
    }

    validate(): Record<string, string> {
        // метод проверки заполнения полей покупателя
        const errors: Record<string, string> = {}; // объект с ключ - значение клэяч поле Buyer, значение сообщение об ошибке.

        if (this.payment === "") {
            errors.payment = "Не выбран вид оплаты";
        }

        if (!this.email) {
            errors.email = "Укажите email";
        } else if (!this.isValidEmail(this.email)) {
            errors.email = "Некорректный формат email";
        }

        if (!this.phone) {
            errors.phone = "Укажите телефон";
        } else if (!this.isValidPhone(this.phone)) {
            errors.phone = "Некорректный формат телефона";
        }

        if (!this.address) {
            errors.address = "Укажите адрес";
        }

        return errors;
    }

    private isValidEmail(email: string): boolean {
        // Шаблоны проверки вводимых данных email
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    private isValidPhone(phone: string): boolean {
        // Шаблон проверки вводимых данных телефона
        const regex = /^[\d\s\-\(\)\+]{10,}$/;
        return regex.test(phone.trim());
    }
}
