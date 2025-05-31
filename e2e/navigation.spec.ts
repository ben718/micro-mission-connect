
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to main pages', async ({ page }) => {
    await page.goto('/');
    
    // Test header navigation
    await page.getByRole('link', { name: 'Missions' }).click();
    await expect(page).toHaveURL('/missions');
    
    await page.getByRole('link', { name: 'Accueil' }).click();
    await expect(page).toHaveURL('/');
  });

  test('should display hero section on homepage', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Trouvez des missions/ })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Découvrir les missions' })).toBeVisible();
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    // On mobile, should have hamburger menu
    const mobileMenu = page.getByRole('button', { name: 'Menu' });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      await expect(page.getByRole('link', { name: 'Missions' })).toBeVisible();
    }
  });
});
