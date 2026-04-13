import {Component} from "../base/Components";
import {ensureElement} from "../../utils/utils";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = ensureElement<HTMLElement>(".gallery", this.container);
    }

    set catalog(items: HTMLElement[]) {
        this.catalogElement.replaceChildren(...items);
    }
}
// Уточнить нужен ли метод очистки Галереи ???
