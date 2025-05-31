
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should display login form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Mot de passe' })).toBeVisible();
  });

  test('should display register form', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Inscription' })).toBeVisible();
  });

  test('should navigate between login and register', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Créer un compte' }).click();
    await expect(page).toHaveURL('/register');
    
    await page.getByRole('link', { name: 'Se connecter' }).click();
    await expect(page).toHaveURL('/login');
  });
});
