import { Component, h, Host, Event, EventEmitter, Listen } from '@stencil/core';
import { KeyCodes } from '../../utils/keyboard-utils';


@Component({
    tag: 'keyboard-navigable',
    styleUrl: 'keyboard-navigable.css',
    shadow: true
})
export class KeyboardNavigable {

    @Event() upArrow: EventEmitter<any>;
    @Event() downArrow: EventEmitter<any>;
    @Event() leftArrow: EventEmitter<any>;
    @Event() rightArrow: EventEmitter<any>;

    @Listen('keyup')
    protected keyupHandler(event: KeyboardEvent) {
        switch (event.key) {
            case KeyCodes.UP:
                event.stopPropagation();
                this.upArrow.emit();
                break;
            case KeyCodes.DOWN:
                event.stopPropagation();
                this.downArrow.emit();
                break;
            case KeyCodes.LEFT:
                event.stopPropagation();
                this.leftArrow.emit();
                break;
            case KeyCodes.RIGHT:
                event.stopPropagation();
                this.rightArrow.emit();
        }
    }

    render() {
        return (
            <Host role="none">
                <slot />
            </Host>
        );
    }
}
