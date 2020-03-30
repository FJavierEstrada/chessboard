import { newE2EPage } from '@stencil/core/testing';

describe('keyboard-navigation-listener', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<keyboard-navigation-listener></keyboard-navigation-listener>');
    const element = await page.find('keyboard-navigation-listener');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
