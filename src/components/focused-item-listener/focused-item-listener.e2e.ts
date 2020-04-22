import { newE2EPage } from '@stencil/core/testing';
import { ItemPosition, FocusedItemHandler } from '../../abstraction/FocusedItemHandler';

describe('focused-item-listener', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<focused-item-listener></focused-item-listener>');
    const element = await page.find('focused-item-listener');
    expect(element).toHaveClass('hydrated');
  });

  it('should notify to handler when listens a focusedItem event', async () => {
    const page = await newE2EPage();
    const position: ItemPosition = { row: 3, column: 1 };
    const handler: FocusedItemHandler = {
      notifyFocusedItem: jest.fn()
    };
    await page.setContent('<focused-item-listener><focusable-item></focusable-item></focused-item-listener>');
    const listener = await page.find('focused-item-listener');
    const focusable = await page.find("focusable-item");

    focusable.setProperty("position", position);
    listener.setProperty("handler", handler);
    await page.waitForChanges();
    await focusable.focus();

    expect(handler.notifyFocusedItem).toHaveBeenCalledWith(position);
  });
});
