import { Component, h, Prop, Event, EventEmitter, Host, Listen } from '@stencil/core';
import { ItemPosition } from '../../abstraction/FocusedItemHandler';


@Component({
    tag: 'focusable-item',
    styleUrl: 'focusable-item.css',
    shadow: false
})
export class FocusableItem {

    @Prop() isInTabSequence: boolean = false;
    @Prop() position!: ItemPosition;
    @Event() focusedItem: EventEmitter<ItemPosition>;

    @Listen('focus')
    protected focusHandler() {
        this.focusedItem.emit(this.position);
    }

    render() {
        return (
            <Host
                tabindex={this.isInTabSequence ? 0 : -1}
            >
                <slot />
            </Host>
        );
    }
}
