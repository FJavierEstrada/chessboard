import { newE2EPage } from '@stencil/core/testing';

describe('chess-square', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<chess-square></chess-square>');
    const element = await page.find('chess-square');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
