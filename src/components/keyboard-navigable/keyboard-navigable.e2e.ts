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

    await element.press(KeyCodes.UP);

    expect(spyEvent).toHaveReceivedEventTimes(1);
  });

});
