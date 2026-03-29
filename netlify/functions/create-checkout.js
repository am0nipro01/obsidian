import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { reservationId, vehicleName, totalPrice, lang } = JSON.parse(event.body)
    const isFr = lang && lang.startsWith('fr')
    const origin = event.headers.origin || event.headers.referer?.replace(/\/$/, '')

    // ── 1. Fetch the reservation to get vehicle + dates ──────────────────────
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('vehicle_id, pickup_date, return_date')
      .eq('id', reservationId)
      .single()

    if (fetchError || !reservation) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          error: isFr ? 'Réservation introuvable.' : 'Reservation not found.',
        }),
      }
    }

    // ── 2. Check for conflicting paid reservations on the same vehicle ────────
    const { data: conflicts } = await supabase
      .from('reservations')
      .select('id')
      .eq('vehicle_id', reservation.vehicle_id)
      .eq('status', 'paid')
      .neq('id', reservationId)
      .lt('pickup_date', reservation.return_date)
      .gt('return_date', reservation.pickup_date)

    if (conflicts && conflicts.length > 0) {
      // Clean up the pending reservation we just created
      await supabase.from('reservations').delete().eq('id', reservationId)

      return {
        statusCode: 200,
        body: JSON.stringify({
          error: isFr
            ? 'Ce véhicule n\'est plus disponible pour ces dates. Veuillez en choisir un autre.'
            : 'This vehicle is no longer available for the selected dates. Please choose another one.',
        }),
      }
    }

    // ── 3. Create Stripe checkout session ─────────────────────────────────────
    const successPath = isFr ? 'reservation-confirmee' : 'booking-confirmed'
    const cancelPath  = isFr ? 'paiement-annule'       : 'payment-cancelled'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `OBSIDIAN — ${vehicleName}`,
            description: isFr ? 'Location de véhicule premium' : 'Premium vehicle rental',
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/${successPath}?id=${reservationId}`,
      cancel_url:  `${origin}/${cancelPath}`,
      metadata: { reservationId },
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    }
  }
}
