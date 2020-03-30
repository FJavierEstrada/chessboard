import { Component, h, Prop, Host, Listen } from '@stencil/core';
import { DirectionalNavigable } from '../../abstraction/DirectionalNavigable';


@Component({
    tag: 'keyboard-navigation-listener',
    styleUrl: 'keyboard-navigation-listener.css',
    shadow: false
})
export class KeyboardNavigationListener {

    @Prop() navigable!: DirectionalNavigable;

    @Listen('upArrow')
    protected upArrowHandler() {
        const itemToFocus = this.navigable.getUpItem();
        this.focus(itemToFocus);
    }

    @Listen('downArrow')
    protected downArrowHandler() {
        const itemToFocus = this.navigable.getDownItem();
        this.focus(itemToFocus);
    }

    @Listen('leftArrow')
    protected leftArrowHandler() {
        const itemToFocus = this.navigable.getLeftItem();
        this.focus(itemToFocus);
    }

    @Listen('rightArrow')
    protected rightArrowHandler() {
        const itemToFocus = this.navigable.getRightItem();
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
