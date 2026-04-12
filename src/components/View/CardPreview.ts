import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./base/Card"
import { IEvents } from "../base/Events";

export interface ICardPreview extends ICard { // Дописать интерфейс !!!
  isInBasket: boolean;
}

export class CardPreview extends Card<IProduct> {
  private isInBasket: boolean;   // Значение по умолчанию false - в корзине нет товаров
  private buyButton: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents, isInBasket: boolean = false) {
    super(container, events);
    this.isInBasket = isInBasket;
    this.buyButton = ensureElement<HTMLButtonElement>('.card__button', this.container);
    this.setupEventListeners();
    this.toggleBuyButton();
  }

  private setupEventListeners(): void {
    this.buyButton.addEventListener('click', () => {
      if (this.isInBasket) {
        this.events.emit('card:remove-from-basket', {
          productId: this.product.id,
          type: 'preview'
        });
      } else {
        this.events.emit('card:add-to-basket', {
          product: this.product,
          type: 'preview'
        });
      }
    });
  }

  setIsInBasket(value: boolean): void {
    this.isInBasket = value;
    this.toggleBuyButton();
  }

  private toggleBuyButton(): void {
    if (!this.product.price) {
      this.buyButton.disabled = true;
      this.buyButton.textContent = 'Недоступно';
    } else {
      this.buyButton.disabled = false;
      this.buyButton.textContent = this.isInBasket ? 'Удалить из корзины' : 'Купить';
    }
  }

  render(data?: IProduct): HTMLElement {
    if (data) {
      this.cardData = data;
      this.toggleBuyButton();
    } else {
      this.toggleBuyButton(); // Обновляем состояние кнопки
    }
    return this.container;
  }
}