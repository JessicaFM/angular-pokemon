import { test, expect } from '@playwright/test';

test.describe('Pokemon Details Page', () => {

  test('should load and display pokemon details', async ({ page }) => {
    await page.goto('/details/1');
    await expect(page.getByText(/bulbasaur/i)).toBeVisible({ timeout: 5000 });

    const image = page.locator('img[alt="bulbasaur"]');
    await expect(image).toBeVisible();

    const baseExp = page.getByText(/base exp:/i);
    const attack = page.getByText(/attack:/i);
    const defense = page.getByText(/defense:/i);

    await expect(baseExp).toBeVisible();
    await expect(attack).toBeVisible();
    await expect(defense).toBeVisible();
  });

  test('should toggle extra info when clicking "Show more"', async ({ page }) => {
    await page.goto('/details/1');

    const showMoreButton = page.getByRole('button', { name: /show more/i });
    await expect(showMoreButton).toBeVisible();
    await showMoreButton.click();

    const extraStat = page.getByText(/legendary:/i);
    await expect(extraStat).toBeVisible({ timeout: 3000 });
  });

  test('should show "not found" message for invalid pokemon id', async ({ page }) => {
    await page.goto('/details/1111aaa');

    const notFoundTitle = page.getByRole('heading', { name: /pokémon not found/i });
    const notFoundText = page.getByText(/we couldn't find the pokémon/i);

    await expect(notFoundTitle).toBeVisible({ timeout: 5000 });
    await expect(notFoundText).toBeVisible();
  });

  test('should go back to home when clicking back', async ({ page }) => {
    await page.goto('/details/1');

    const backButton = page.getByRole('button', { name: /back/i });
    await expect(backButton).toBeVisible();

    await backButton.click();
    await expect(page).toHaveURL('/');
  });

});
