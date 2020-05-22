import { Component, h, Host, Prop, Event, EventEmitter, Listen } from '@stencil/core';
import { ItemPosition } from '../../abstraction/FocusedItemHandler';
import { KeyCodes } from '../../utils/keyboard-utils';


@Component({
    tag: 'activable-item',
    styleUrl: 'activable-item.css',
    shadow: false
})
export class ActivableItem {

    @Prop() position: ItemPosition;
    @Prop() space: boolean = true;
    @Prop() enter: boolean = true;

    @Event() activatedItem: EventEmitter<ItemPosition>;

    @Listen('click')
    protected clickHandler() {
        this.activatedItem.emit(this.position);
    }

    @Listen('keyup')
    protected keyupHandler(event: KeyboardEvent) {
        function activate(event: KeyboardEvent, emitter: EventEmitter<ItemPosition>, position: ItemPosition) {
            event.preventDefault();
            event.stopPropagation();
            emitter.emit(position);
        }

        if (this.space && event.key === KeyCodes.SPACE) activate(event, this.activatedItem, this.position);
        else if (this.enter && event.key === KeyCodes.RETURN) activate(event, this.activatedItem, this.position);
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
