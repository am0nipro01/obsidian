import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export async function onRequestPost(context) {
  const { request, env } = context

  const stripe = new Stripe(env.STRIPE_SECRET_KEY)
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }

  try {
    const { reservationId, vehicleName, totalPrice, lang } = await request.json()
    const isFr = lang && lang.startsWith('fr')
    const origin = new URL(request.url).origin

    // ── 1. Fetch the reservation ──────────────────────────────────────────────
    const { data: reservation, error: fetchError } = await supabase
      .from('reservations')
      .select('vehicle_id, pickup_date, return_date')
      .eq('id', reservationId)
      .single()

    if (fetchError || !reservation) {
      return new Response(
        JSON.stringify({ error: isFr ? 'Réservation introuvable.' : 'Reservation not found.' }),
        { status: 200, headers: corsHeaders }
      )
    }

    // ── 2. Check for conflicting paid reservations ────────────────────────────
    const { data: conflicts } = await supabase
      .from('reservations')
      .select('id')
      .eq('vehicle_id', reservation.vehicle_id)
      .eq('status', 'paid')
      .neq('id', reservationId)
      .lt('pickup_date', reservation.return_date)
      .gt('return_date', reservation.pickup_date)

    if (conflicts && conflicts.length > 0) {
      await supabase.from('reservations').delete().eq('id', reservationId)
      return new Response(
        JSON.stringify({
          error: isFr
            ? "Ce véhicule n'est plus disponible pour ces dates. Veuillez en choisir un autre."
            : 'This vehicle is no longer available for the selected dates. Please choose another one.',
        }),
        { status: 200, headers: corsHeaders }
      )
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

    return new Response(
      JSON.stringify({ url: session.url }),
      { status: 200, headers: corsHeaders }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
