import { newE2EPage } from '@stencil/core/testing';

describe('chess-board', () => {
  it('renders', async () => {
    const page = await newE2EPage();

    await page.setContent('<chess-board></chess-board>');
    const element = await page.find('chess-board');
    expect(element).toHaveClass('hydrated');
  });{cursor}
});
