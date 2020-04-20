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
    protected upArrowHandler() {
        const itemToFocus = this.handler.getUpItem();
        this.focus(itemToFocus);
    }

    @Listen('downArrow')
    protected downArrowHandler() {
        const itemToFocus = this.handler.getDownItem();
        this.focus(itemToFocus);
    }

    @Listen('leftArrow')
    protected leftArrowHandler() {
        const itemToFocus = this.handler.getLeftItem();
        this.focus(itemToFocus);
    }

    @Listen('rightArrow')
    protected rightArrowHandler() {
        const itemToFocus = this.handler.getRightItem();
        this.focus(itemToFocus);
    }

    focus(item: HTMLElement | undefined) {
        if (item !== undefined) item.focus();
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
