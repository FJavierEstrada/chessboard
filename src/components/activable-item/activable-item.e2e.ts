import { newE2EPage } from '@stencil/core/testing';

describe('activable-item', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<activable-item></activable-item>');
    const element = await page.find('activable-item');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
