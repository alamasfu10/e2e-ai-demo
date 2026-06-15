import { test, expect } from '@playwright/test'

test.describe('Validación HTML5 del formulario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Esperamos a que el formulario esté visible
    await page.locator('form').first().waitFor({ state: 'visible' })
  })

  test('enviar formulario vacío — el navegador bloquea el submit (HTML5 required)', async ({ page }) => {
    // Intentamos hacer submit sin rellenar nada
    const btn = page.getByRole('button', { name: /reservar plaza/i })

    // Registramos si se hace una llamada a /api/leads
    let apiCalled = false
    page.on('request', (req) => {
      if (req.url().includes('/api/leads')) apiCalled = true
    })

    await btn.click()

    // Damos un momento para que la petición pudiera ocurrir
    await page.waitForTimeout(500)

    // El navegador HTML5 debe haber bloqueado el submit — no se llama a la API
    expect(apiCalled).toBe(false)

    // El primer campo requerido debería tener el estado invalid
    const nombreInput = page.locator('input[name="nombre"]')
    const isValid = await nombreInput.evaluate(
      (el) => (el as HTMLInputElement).validity.valid,
    )
    expect(isValid).toBe(false)
  })

  test('email inválido — el navegador bloquea el submit', async ({ page }) => {
    // Rellenamos todos los campos excepto el email, que ponemos inválido
    // Usamos selectores por name para evitar ambigüedad de placeholder
    await page.locator('input[name="nombre"]').fill('Test')
    await page.locator('input[name="apellido"]').fill('User')
    await page.locator('input[name="email_empresa"]').fill('correo-invalido')
    await page.locator('input[name="empresa"]').fill('Empresa Test')

    let apiCalled = false
    page.on('request', (req) => {
      if (req.url().includes('/api/leads')) apiCalled = true
    })

    const btn = page.getByRole('button', { name: /reservar plaza/i })
    await btn.click()

    await page.waitForTimeout(500)

    // El navegador debe haber bloqueado el submit por email inválido
    expect(apiCalled).toBe(false)

    const emailInput = page.locator('input[name="email_empresa"]')
    const isValid = await emailInput.evaluate(
      (el) => (el as HTMLInputElement).validity.valid,
    )
    expect(isValid).toBe(false)
  })
})
