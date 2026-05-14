/**
 * QuickBooks Online integration for Stripe payment sync.
 * Records Stripe subscription payments as sales receipts in QBO.
 *
 * Required env vars:
 *   QBO_CLIENT_ID, QBO_CLIENT_SECRET, QBO_REFRESH_TOKEN, QBO_REALM_ID
 */

const QBO_BASE = 'https://quickbooks.api.intuit.com'

interface QBOTokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

let cachedToken: { token: string; expiresAt: number } | null = null
// Track rotated refresh tokens within this process lifetime.
// NOTE: For durable persistence, store rotated tokens in Supabase or a secrets manager.
let currentRefreshToken: string | null = null

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  const clientId = process.env.QBO_CLIENT_ID!
  const clientSecret = process.env.QBO_CLIENT_SECRET!
  const refreshToken = currentRefreshToken || process.env.QBO_REFRESH_TOKEN!

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`QBO token refresh failed: ${res.status} ${text}`)
  }

  const data: QBOTokens = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  // Persist rotated refresh token if Intuit returned a new one
  if (data.refresh_token && data.refresh_token !== refreshToken) {
    currentRefreshToken = data.refresh_token
    console.log('[QBO] Refresh token rotated — update QBO_REFRESH_TOKEN in env/secrets store')
  }

  return data.access_token
}

export async function recordStripePayment(params: {
  customerEmail: string
  customerName: string
  amount: number // in cents
  planName: string
  stripeInvoiceId: string
  stripeSubscriptionId: string
}) {
  const realmId = process.env.QBO_REALM_ID
  if (!realmId || !process.env.QBO_CLIENT_ID) {
    console.log('[QBO] QuickBooks not configured, skipping payment sync')
    return
  }

  try {
    const token = await getAccessToken()

    // QBO entity refs — configure via env vars or defaults
    const qboCustomerId = process.env.QBO_CUSTOMER_REF_ID || '58'
    const qboItemId = process.env.QBO_ITEM_REF_ID || '1'
    const qboItemName = process.env.QBO_ITEM_REF_NAME || 'Services'

    const salesReceipt = {
      CustomerRef: { value: qboCustomerId },
      TxnDate: new Date().toISOString().split('T')[0],
      PrivateNote: `Stripe Invoice: ${params.stripeInvoiceId} | Sub: ${params.stripeSubscriptionId}`,
      Line: [
        {
          Amount: params.amount / 100,
          DetailType: 'SalesItemLineDetail',
          Description: `SA AI Agent Marketplace — ${params.planName} (${params.customerEmail})`,
          SalesItemLineDetail: {
            ItemRef: { value: qboItemId, name: qboItemName },
            UnitPrice: params.amount / 100,
            Qty: 1,
          },
        },
      ],
      CustomerMemo: { value: `${params.planName} subscription — ${params.customerName}` },
    }

    const res = await fetch(
      `${QBO_BASE}/v3/company/${realmId}/salesreceipt?minorversion=73`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(salesReceipt),
      }
    )

    if (!res.ok) {
      const text = await res.text()
      console.error(`[QBO] Failed to create sales receipt: ${res.status} ${text}`)
      return
    }

    const result = await res.json()
    console.log(`[QBO] Sales receipt created: ${result.SalesReceipt?.Id} for $${params.amount / 100}`)
  } catch (err) {
    console.error('[QBO] Error syncing payment:', err)
  }
}
