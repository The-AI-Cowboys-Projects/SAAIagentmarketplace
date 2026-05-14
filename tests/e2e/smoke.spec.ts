import { test, expect } from '@playwright/test'

test.describe('Production Smoke Tests', () => {

  test('homepage loads and shows hero', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/SA Agent|San Antonio/)
    await expect(page.locator('h1')).toContainText('AI Agents')
  })

  test('agents page renders agent cards', async ({ page }) => {
    await page.goto('/agents')
    await expect(page.locator('h1')).toContainText('Agent Marketplace')
    // Wait for agents to load (client-side)
    await page.waitForTimeout(1000)
    const cards = page.locator('[aria-label*="agent details"]')
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('pricing page shows all 3 plans', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.locator('h1')).toContainText('pricing')
    await expect(page.locator('text=Starter')).toBeVisible()
    await expect(page.locator('text=Growth')).toBeVisible()
    await expect(page.locator('text=Partner')).toBeVisible()
  })

  test('login page renders auth form', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.locator('text=Continue with Google')).toBeVisible()
    await expect(page.locator('text=Continue with GitHub')).toBeVisible()
    await expect(page.locator('text=Send Magic Link')).toBeVisible()
  })

  test('privacy page loads', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page.locator('h1')).toContainText('Privacy Policy')
  })

  test('terms page loads', async ({ page }) => {
    await page.goto('/terms')
    await expect(page.locator('h1')).toContainText('Terms of Service')
  })

  test('refund policy page loads', async ({ page }) => {
    await page.goto('/refund-policy')
    await expect(page.locator('h1')).toContainText('Refund Policy')
  })

  test('AI disclaimer page loads', async ({ page }) => {
    await page.goto('/ai-disclaimer')
    await expect(page.locator('h1')).toContainText('AI Disclaimer')
  })

  test('contact page loads with form', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('h1')).toContainText('Contact')
    await expect(page.locator('form')).toBeVisible()
  })

  test('status page loads', async ({ page }) => {
    await page.goto('/status')
    await expect(page.locator('h1')).toContainText('System Status')
  })

  test('dashboard redirects to login when unauthenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/auth/login**')
    expect(page.url()).toContain('/auth/login')
  })

  test('health endpoint returns ok', async ({ request }) => {
    const res = await request.get('/api/health')
    expect(res.ok()).toBeTruthy()
    const data = await res.json()
    expect(data.status).toBe('ok')
  })

  test('agent chat API returns error for missing params', async ({ request }) => {
    const res = await request.post('/api/agents/chat', {
      data: {},
    })
    expect(res.status()).toBe(400)
  })

  test('login page links to terms and privacy', async ({ page }) => {
    await page.goto('/auth/login')
    const termsLink = page.locator('a[href="/terms"]')
    const privacyLink = page.locator('a[href="/privacy"]')
    await expect(termsLink).toBeVisible()
    await expect(privacyLink).toBeVisible()
  })

  test('no unsupported claims on homepage', async ({ page }) => {
    await page.goto('/')
    const content = await page.textContent('body')
    expect(content).not.toContain('10K+')
    expect(content).not.toContain('10,000+')
    expect(content).not.toContain('99.9%')
  })
})
