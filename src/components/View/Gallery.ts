import { Component } from "../base/Components";

interface IGallery {                    
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    protected catalogElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this.catalogElement = container;       // ensureElement<HTMLElement>(".gallery", this.container); ???
    }

    set catalog(items: HTMLElement[]) {
        if (Array.isArray(items)) {
            this.catalogElement.append(...items)
        }
    }

    render(data?: Partial<IGallery>): HTMLElement {
        Object.assign(this as object, data ?? {});
        return this.container;
    }
}

// Уточнить нужен ли метод очистки Галереи.