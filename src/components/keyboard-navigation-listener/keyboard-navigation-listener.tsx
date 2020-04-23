import { Component, h, Prop, Host, Listen } from '@stencil/core';
import { KeyboardNavigationHandler } from '../../abstraction/KeyboardNavigationHandler';


@Component({
    tag: 'keyboard-navigation-listener',
    styleUrl: 'keyboard-navigation-listener.css',
    shadow: false
})
export class KeyboardNavigationListener {

    @Prop() handler: KeyboardNavigationHandler;

    @Listen('upArrow')
    protected upArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getUpItem();
        this.focusItem(itemToFocus);
    }

    @Listen('downArrow')
    protected downArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getDownItem();
        this.focusItem(itemToFocus);
    }

    @Listen('leftArrow')
    protected leftArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getLeftItem();
        this.focusItem(itemToFocus);
    }

    @Listen('rightArrow')
    protected rightArrowHandler(event: CustomEvent<any>) {
        event?.stopPropagation();
        const itemToFocus = this.handler.getRightItem();
        this.focusItem(itemToFocus);
    }

    focusItem(item: HTMLElement | undefined) {
        if (item instanceof HTMLElement) item.focus();
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
