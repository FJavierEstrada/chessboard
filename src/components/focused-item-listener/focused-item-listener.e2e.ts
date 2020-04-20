import { newE2EPage } from '@stencil/core/testing';

describe('focused-item-listener', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<focused-item-listener></focused-item-listener>');
    const element = await page.find('focused-item-listener');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
