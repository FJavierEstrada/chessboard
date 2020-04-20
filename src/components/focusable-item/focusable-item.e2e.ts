import { newE2EPage } from '@stencil/core/testing';

describe('focusable-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<focusable-item></focusable-item>');
    const element = await page.find('focusable-item');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
