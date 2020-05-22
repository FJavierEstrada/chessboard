import { newE2EPage } from '@stencil/core/testing';

describe('activated-item-listener', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<activated-item-listener></activated-item-listener>');
    const element = await page.find('activated-item-listener');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
