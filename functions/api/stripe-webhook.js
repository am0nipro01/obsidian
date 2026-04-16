import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

async function sendConfirmationEmail({ toEmail, toName, vehicleName, pickupDate, returnDate, location, total, reservationId, isFr, resendApiKey }) {
  const fmt = (d) => new Date(d).toLocaleDateString(isFr ? 'fr-FR' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  const subject = isFr
    ? `Réservation confirmée — ${vehicleName}`
    : `Booking confirmed — ${vehicleName}`

  const html = `<!DOCTYPE html>
<html lang="${isFr ? 'fr' : 'en'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f5f7;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <tr>
          <td style="background:#0C0C0C;border-radius:16px 16px 0 0;padding:40px 48px 32px;text-align:center;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.18em;color:#C8A96E;">OBSIDIAN</p>
            <h1 style="margin:0;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
              ${isFr ? 'Réservation confirmée.' : 'Booking confirmed.'}
            </h1>
          </td>
        </tr>
        <tr>
          <td style="background:#ffffff;padding:40px 48px;">
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              ${isFr ? `Bonjour ${toName},` : `Hello ${toName},`}
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#374151;line-height:1.6;">
              ${isFr
                ? `Votre réservation pour le <strong>${vehicleName}</strong> a bien été confirmée.`
                : `Your reservation for the <strong>${vehicleName}</strong> has been confirmed.`}
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border-radius:12px;overflow:hidden;margin-bottom:32px;">
              <tr><td style="padding:24px 28px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;"><span style="font-size:12px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;">${isFr ? 'VÉHICULE' : 'VEHICLE'}</span></td>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;"><span style="font-size:14px;font-weight:600;color:#111827;">${vehicleName}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;"><span style="font-size:12px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;">${isFr ? 'PRISE EN CHARGE' : 'PICK-UP'}</span></td>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;"><span style="font-size:14px;color:#374151;">${fmt(pickupDate)}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;"><span style="font-size:12px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;">${isFr ? 'RETOUR' : 'RETURN'}</span></td>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;"><span style="font-size:14px;color:#374151;">${fmt(returnDate)}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;"><span style="font-size:12px;font-weight:600;color:#9ca3af;letter-spacing:0.08em;">${isFr ? 'LIEU' : 'LOCATION'}</span></td>
                    <td style="padding:8px 0;border-bottom:1px solid #e5e7eb;text-align:right;"><span style="font-size:14px;color:#374151;">${location}</span></td>
                  </tr>
                  <tr>
                    <td style="padding:12px 0 0;"><span style="font-size:12px;font-weight:700;color:#111827;letter-spacing:0.08em;">TOTAL</span></td>
                    <td style="padding:12px 0 0;text-align:right;"><span style="font-size:18px;font-weight:700;color:#111827;">${total.toLocaleString()}€</span></td>
                  </tr>
                </table>
              </td></tr>
            </table>
            <p style="margin:0 0 8px;font-size:13px;color:#9ca3af;">
              ${isFr ? `Référence : #${reservationId.slice(0, 8).toUpperCase()}` : `Reference: #${reservationId.slice(0, 8).toUpperCase()}`}
            </p>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">
              ${isFr
                ? 'Notre équipe vous contactera pour confirmer les détails de la livraison.'
                : 'Our team will reach out to confirm delivery details.'}
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#f9fafb;border-radius:0 0 16px 16px;padding:24px 48px;text-align:center;border-top:1px solid #e5e7eb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} OBSIDIAN — ${isFr ? 'Location de véhicules premium' : 'Premium vehicle rental'}
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'OBSIDIAN <noreply@obsidian-rental.com>',
      to: toEmail,
      subject,
      html,
    }),
  })
}

export async function onRequestPost(context) {
  const { request, env } = context

  const stripe = new Stripe(env.STRIPE_SECRET_KEY)
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

  const sig = request.headers.get('stripe-signature')
  const rawBody = await request.text()

  let stripeEvent
  try {
    stripeEvent = await stripe.webhooks.constructEventAsync(
      rawBody,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object
    const { reservationId } = session.metadata

    const { data: reservation } = await supabase
      .from('reservations')
      .update({ status: 'paid', stripe_session_id: session.id })
      .eq('id', reservationId)
      .select('vehicle_id, pickup_date, return_date, location, total_price, user_id')
      .single()

    if (!reservation) return new Response('ok', { status: 200 })

    await supabase
      .from('vehicles')
      .update({ available: false })
      .eq('id', reservation.vehicle_id)

    const [{ data: vehicle }, { data: authUser }, { data: profile }] = await Promise.all([
      supabase.from('vehicles').select('name').eq('id', reservation.vehicle_id).single(),
      supabase.auth.admin.getUserById(reservation.user_id),
      supabase.from('profiles').select('full_name').eq('id', reservation.user_id).single(),
    ])

    const toEmail = authUser?.user?.email
    if (toEmail && env.RESEND_API_KEY) {
      const isFr = (authUser?.user?.user_metadata?.lang || 'fr').startsWith('fr')
      await sendConfirmationEmail({
        toEmail,
        toName: profile?.full_name?.split(' ')[0] || 'Client',
        vehicleName: vehicle?.name || '',
        pickupDate: reservation.pickup_date,
        returnDate: reservation.return_date,
        location: reservation.location,
        total: reservation.total_price,
        reservationId,
        isFr,
        resendApiKey: env.RESEND_API_KEY,
      })
    }
  }

  return new Response('ok', { status: 200 })
}
