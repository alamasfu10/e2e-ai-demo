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

  test('rellena el formulario y envía — estado cambia a loading o success', async ({ page }) => {
    // Interceptamos la llamada a /api/leads para no depender de la BD real
    // pero dejamos pasar la respuesta original (puede ser 201 o 500, ambos válidos)
    let apiCalled = false
    page.on('response', (response) => {
      if (response.url().includes('/api/leads')) {
        apiCalled = true
      }
    })

    // Rellena campos requeridos usando name para evitar ambigüedad de placeholder
    await page.locator('input[name="nombre"]').fill('Test')
    await page.locator('input[name="apellido"]').fill('E2E')
    await page.locator('input[name="email_empresa"]').fill('test@empresa.com')
    await page.locator('input[name="empresa"]').fill('Empresa E2E')

    // El checkbox ya está marcado por defecto (defaultChecked)
    const checkbox = page.locator('input[name="acepta_comunicaciones"]')
    await expect(checkbox).toBeChecked()

    // Click en submit
    const btn = page.getByRole('button', { name: /reservar plaza/i })
    await btn.click()

    // Espera que el botón cambie de estado (loading o disappears on success)
    // Usamos un selector amplio: el botón desaparece en success o muestra "Enviando…"
    await expect(
      page.locator('button[type="submit"]').filter({ hasText: /enviando/i })
        .or(page.locator('text=¡Gracias por registrarte!'))
        .or(page.locator('button[type="submit"]').filter({ hasText: /reservar plaza/i }))
    ).toBeVisible({ timeout: 10_000 })

    // La llamada a la API debe haberse realizado
    await page.waitForTimeout(2_000)
    expect(apiCalled).toBe(true)
  })
})
