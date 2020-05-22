import { ItemPosition } from "./FocusedItemHandler";

export interface ActivatedItemHandler {
    notifyActivation(position: ItemPosition);
}