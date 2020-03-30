import { newE2EPage } from '@stencil/core/testing';

describe('keyboard-navigable', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigable></keyboard-navigable>');
    const element = await page.find('keyboard-navigable');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
