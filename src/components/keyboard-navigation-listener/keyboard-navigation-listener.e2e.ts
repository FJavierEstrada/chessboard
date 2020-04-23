import { newE2EPage } from '@stencil/core/testing';
import { KeyCodes } from '../../utils/keyboard-utils';

describe('keyboard-navigation-listener', () => {
  it('should render', async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigation-listener></keyboard-navigation-listener>');
    const element = await page.find('keyboard-navigation-listener');
    expect(element).toHaveClass('hydrated');
  });

  it('should ask for the up item', async () => {
    const mockGetUpItem = jest.fn();
    const mockGetDownItem = jest.fn();
    const mockGetLeftItem = jest.fn();
    const mockGetRightItem = jest.fn();
    const page = await newE2EPage();
    await page.setContent('<keyboard-navigation-listener><keyboard-navigable></keyboard-navigable></keyboard-navigation-listener>');
    await page.exposeFunction("getUpItem", mockGetUpItem);
    await page.exposeFunction("getDownItem", mockGetDownItem);
    await page.exposeFunction("getLeftItem", mockGetLeftItem);
    await page.exposeFunction("getRightItem", mockGetRightItem);

    const navigable = await page.find("keyboard-navigable");

    navigable.tabIndex = -1;
    await page.$eval("keyboard-navigation-listener", (element: any) => {
      element.handler = {
        getUpItem: this.getUpItem,
        getDownItem: this.getDownItem,
        getLeftItem: this.getLeftItem,
        getRightItem: this.getRightItem
      };
    });
    await page.waitForChanges();

    await navigable.press(KeyCodes.UP);

    expect(mockGetUpItem).toHaveBeenCalled();
  });

});
