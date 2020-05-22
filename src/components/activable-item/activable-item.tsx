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

    @Event() activated: EventEmitter<ItemPosition>;

    @Listen('click')
    protected clickHandler() {
        this.activated.emit(this.position);
    }

    @Listen('keyup')
    protected keyupHandler(event: KeyboardEvent) {
        function activate(event: KeyboardEvent, emitter: EventEmitter<ItemPosition>) {
            event.preventDefault();
            event.stopPropagation();
            emitter.emit(this.position);
        }

        if (this.space && event.key === KeyCodes.SPACE) activate(event, this.activated);
        else if (this.enter && event.key === KeyCodes.RETURN) activate(event, this.activated);
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
