
import { test, expect } from '@playwright/test';

test.describe('Missions', () => {
  test('should display missions list', async ({ page }) => {
    await page.goto('/missions');
    await expect(page.getByRole('heading', { name: 'Missions disponibles' })).toBeVisible();
    await expect(page.getByTestId('mission-filters')).toBeVisible();
  });

  test('should filter missions', async ({ page }) => {
    await page.goto('/missions');
    
    // Test search filter
    await page.getByPlaceholder('Rechercher des missions...').fill('test');
    await page.keyboard.press('Enter');
    
    // Test location filter
    await page.getByPlaceholder('Ville ou code postal').fill('Paris');
    await page.keyboard.press('Enter');
  });

  test('should display mission details', async ({ page }) => {
    await page.goto('/missions');
    
    // Wait for missions to load and click on the first one
    await page.waitForSelector('[data-testid="mission-card"]', { timeout: 10000 });
    const firstMission = page.locator('[data-testid="mission-card"]').first();
    await firstMission.getByText('Voir les détails').click();
    
    // Should navigate to mission detail page
    await expect(page.url()).toMatch(/\/missions\/[a-zA-Z0-9-]+/);
  });
});
