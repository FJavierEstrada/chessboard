import { newE2EPage } from '@stencil/core/testing';
import { KeyCodes } from '../../utils/keyboard-utils';

describe('keyboard-navigable', () => {
  it('should renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    expect(element).toHaveClass('hydrated');
  });

  it("should notify up arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("upArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.UP);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

  it("should notify down arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("downArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.DOWN);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

  it("should notify left arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("leftArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.LEFT);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

  it("should notify right arrow pressed", async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    const spyEvent = await element.spyOnEvent("rightArrow");
    // The element must be focusable in order to press a key inside.
    element.tabIndex = -1;
    await page.waitForChanges();
    await element.press(KeyCodes.RIGHT);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

});
