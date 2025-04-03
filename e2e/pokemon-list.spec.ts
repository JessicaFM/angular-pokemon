import { test, expect } from '@playwright/test';

test.describe('Pokemon List Page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display a list of pokemons', async ({ page }) => {
    const pokemonCards = page.locator('[data-testid="pokemon-card"]');
    await expect(pokemonCards.first()).toBeVisible({ timeout: 5000 });

    const count = await pokemonCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show fallback image on error', async ({ page }) => {
    const image = page.locator('[data-testid="pokemon-image"]').first();

    await image.dispatchEvent('error');

    const fallbackImage = page.locator('[data-testid="image-error"]').first();
    await expect(fallbackImage).toBeVisible();
  });

  test('should paginate to next page and update list', async ({ page }) => {
    const firstBefore = await page.locator('[data-testid="pokemon-name"]').first().textContent();

    const nextBtn = page.getByRole('button', { name: /next/i });
    await nextBtn.click();

    await page.waitForTimeout(300);

    const firstAfter = await page.locator('[data-testid="pokemon-name"]').first().textContent();
    expect(firstAfter).not.toBe(firstBefore);
  });

  test('should disable previous button on first page', async ({ page }) => {
    const prevBtn = page.getByRole('button', { name: /previous/i });
    await expect(prevBtn).toBeDisabled();
  });

  test('should show empty state when list is empty', async ({ page }) => {
    const searchInput = page.locator('input');
    await searchInput.fill('aaaa');
    await searchInput.press('Enter');

    const emptyMsg = page.locator('[data-testid="empty-state"]');
    await expect(emptyMsg).toBeVisible();
  });
});
