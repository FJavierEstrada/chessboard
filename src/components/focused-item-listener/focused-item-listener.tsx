import { Component, h, Host, Prop, Listen } from '@stencil/core';
import { FocusedItemHandler, ItemPosition } from '../../abstraction/FocusedItemHandler';


@Component({
    tag: 'focused-item-listener',
    styleUrl: 'focused-item-listener.css',
    shadow: false
})
export class FocusedItemListener {

    @Prop() handler!: FocusedItemHandler;

    @Listen('focusedItem')
    protected focusedItemHandler(event: CustomEvent<ItemPosition>) {
        this.handler.notifyFocusedItem(event.detail);
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
