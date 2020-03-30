export interface DirectionalNavigable {
    getLeftItem(): HTMLElement | undefined;
    getRightItem(): HTMLElement | undefined;
    getUpItem(): HTMLElement | undefined;
    getDownItem(): HTMLElement | undefined;
}