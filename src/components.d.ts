/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { BoardSide, ChessPiece, } from "./utils/chess-utils";
import { FocusedItemHandler, ItemPosition, } from "./abstraction/FocusedItemHandler";
import { KeyboardNavigationHandler, } from "./abstraction/KeyboardNavigationHandler";
export namespace Components {
    interface AppRoot {
    }
    interface ChessBoard {
        "side": BoardSide;
    }
    interface ChessSquare {
        "column": number;
        "piece"?: ChessPiece;
        "row": number;
        "side": BoardSide;
    }
    interface FocusableItem {
        "isInTabSequence": boolean;
        "position": ItemPosition;
    }
    interface FocusedItemListener {
        "handler": FocusedItemHandler;
    }
    interface KeyboardNavigable {
    }
    interface KeyboardNavigationListener {
        "handler": KeyboardNavigationHandler;
    }
}
declare global {
    interface HTMLAppRootElement extends Components.AppRoot, HTMLStencilElement {
    }
    var HTMLAppRootElement: {
        prototype: HTMLAppRootElement;
        new (): HTMLAppRootElement;
    };
    interface HTMLChessBoardElement extends Components.ChessBoard, HTMLStencilElement {
    }
    var HTMLChessBoardElement: {
        prototype: HTMLChessBoardElement;
        new (): HTMLChessBoardElement;
    };
    interface HTMLChessSquareElement extends Components.ChessSquare, HTMLStencilElement {
    }
    var HTMLChessSquareElement: {
        prototype: HTMLChessSquareElement;
        new (): HTMLChessSquareElement;
    };
    interface HTMLFocusableItemElement extends Components.FocusableItem, HTMLStencilElement {
    }
    var HTMLFocusableItemElement: {
        prototype: HTMLFocusableItemElement;
        new (): HTMLFocusableItemElement;
    };
    interface HTMLFocusedItemListenerElement extends Components.FocusedItemListener, HTMLStencilElement {
    }
    var HTMLFocusedItemListenerElement: {
        prototype: HTMLFocusedItemListenerElement;
        new (): HTMLFocusedItemListenerElement;
    };
    interface HTMLKeyboardNavigableElement extends Components.KeyboardNavigable, HTMLStencilElement {
    }
    var HTMLKeyboardNavigableElement: {
        prototype: HTMLKeyboardNavigableElement;
        new (): HTMLKeyboardNavigableElement;
    };
    interface HTMLKeyboardNavigationListenerElement extends Components.KeyboardNavigationListener, HTMLStencilElement {
    }
    var HTMLKeyboardNavigationListenerElement: {
        prototype: HTMLKeyboardNavigationListenerElement;
        new (): HTMLKeyboardNavigationListenerElement;
    };
    interface HTMLElementTagNameMap {
        "app-root": HTMLAppRootElement;
        "chess-board": HTMLChessBoardElement;
        "chess-square": HTMLChessSquareElement;
        "focusable-item": HTMLFocusableItemElement;
        "focused-item-listener": HTMLFocusedItemListenerElement;
        "keyboard-navigable": HTMLKeyboardNavigableElement;
        "keyboard-navigation-listener": HTMLKeyboardNavigationListenerElement;
    }
}
declare namespace LocalJSX {
    interface AppRoot {
    }
    interface ChessBoard {
        "side": BoardSide;
    }
    interface ChessSquare {
        "column": number;
        "piece"?: ChessPiece;
        "row": number;
        "side": BoardSide;
    }
    interface FocusableItem {
        "isInTabSequence"?: boolean;
        "onFocusedItem"?: (event: CustomEvent<ItemPosition>) => void;
        "position": ItemPosition;
    }
    interface FocusedItemListener {
        "handler": FocusedItemHandler;
    }
    interface KeyboardNavigable {
        "onDownArrow"?: (event: CustomEvent<any>) => void;
        "onLeftArrow"?: (event: CustomEvent<any>) => void;
        "onRightArrow"?: (event: CustomEvent<any>) => void;
        "onUpArrow"?: (event: CustomEvent<any>) => void;
    }
    interface KeyboardNavigationListener {
        "handler"?: KeyboardNavigationHandler;
    }
    interface IntrinsicElements {
        "app-root": AppRoot;
        "chess-board": ChessBoard;
        "chess-square": ChessSquare;
        "focusable-item": FocusableItem;
        "focused-item-listener": FocusedItemListener;
        "keyboard-navigable": KeyboardNavigable;
        "keyboard-navigation-listener": KeyboardNavigationListener;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "app-root": LocalJSX.AppRoot & JSXBase.HTMLAttributes<HTMLAppRootElement>;
            "chess-board": LocalJSX.ChessBoard & JSXBase.HTMLAttributes<HTMLChessBoardElement>;
            "chess-square": LocalJSX.ChessSquare & JSXBase.HTMLAttributes<HTMLChessSquareElement>;
            "focusable-item": LocalJSX.FocusableItem & JSXBase.HTMLAttributes<HTMLFocusableItemElement>;
            "focused-item-listener": LocalJSX.FocusedItemListener & JSXBase.HTMLAttributes<HTMLFocusedItemListenerElement>;
            "keyboard-navigable": LocalJSX.KeyboardNavigable & JSXBase.HTMLAttributes<HTMLKeyboardNavigableElement>;
            "keyboard-navigation-listener": LocalJSX.KeyboardNavigationListener & JSXBase.HTMLAttributes<HTMLKeyboardNavigationListenerElement>;
        }
    }
}
