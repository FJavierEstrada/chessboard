import { Component, h, Prop, Host, Listen } from '@stencil/core';
import { ActivatedItemHandler } from '../../abstraction/ActivatedItemHandler';
import { ItemPosition } from '../../abstraction/FocusedItemHandler';


@Component({
    tag: 'activated-item-listener',
    styleUrl: 'activated-item-listener.css',
    shadow: false
})
export class ActivatedItemListener {

    @Prop() handler!: ActivatedItemHandler;

    @Listen('activatedItem')
    protected activatedItemHandler(event: CustomEvent<ItemPosition>) {
        event.stopPropagation();
        this.handler.notifyActivation(event.detail);
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
