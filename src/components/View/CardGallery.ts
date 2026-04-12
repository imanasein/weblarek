import { IProduct } from "../../types";
import { Card, ICard } from "./base/Card"
import {IEvents} from "../base/Events";

export interface ICardGallery extends ICard {}

export class CardGallery extends Card<IProduct> {
  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    this.container.addEventListener('click', () => {
      this.events.emit('gallery:open', {id: this.product.id})
    });
  }

  render(data?: IProduct): HTMLElement {
    if (data) {
      this.cardData = data;  
    }
    return this.container;
  }
}