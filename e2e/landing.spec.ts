import { test, expect } from '@playwright/test'

test.describe('Landing page — carga y formulario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('el título H1 existe y contiene texto no vacío', async ({ page }) => {
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    const text = await h1.innerText()
    expect(text.trim().length).toBeGreaterThan(0)
  })

  test('el formulario está visible en la página', async ({ page }) => {
    const form = page.locator('form').first()
    await expect(form).toBeVisible()
  })

  test('el botón "Reservar plaza" existe', async ({ page }) => {
    const btn = page.getByRole('button', { name: /reservar plaza/i })
    await expect(btn).toBeVisible()
  })

  test('rellena el formulario y envía — estado cambia a success (API mockeada)', async ({ page }) => {
    // Mock de /api/leads para no insertar en la BD real durante E2E
    let apiCalled = false
    await page.route('**/api/leads', async (route) => {
      apiCalled = true
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      })
    })

    await page.locator('input[name="nombre"]').fill('Test')
    await page.locator('input[name="apellido"]').fill('E2E')
    await page.locator('input[name="email_empresa"]').fill('test@empresa.com')
    await page.locator('input[name="empresa"]').fill('Empresa E2E')

    const checkbox = page.locator('input[name="acepta_comunicaciones"]')
    await expect(checkbox).toBeChecked()

    const btn = page.getByRole('button', { name: /reservar plaza/i })
    await btn.click()

    await expect(page.getByText('¡Gracias por registrarte!', { exact: true })).toBeVisible({ timeout: 10_000 })
    expect(apiCalled).toBe(true)
  })
})
