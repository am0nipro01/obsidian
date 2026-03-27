const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { reservationId, vehicleName, totalPrice, lang } = JSON.parse(event.body)
    const origin = event.headers.origin || event.headers.referer?.replace(/\/$/, '')

    const isFr = lang && lang.startsWith('fr')
    const successPath = isFr ? 'reservation-confirmee' : 'booking-confirmed'
    const cancelPath = isFr ? 'paiement-annule' : 'payment-cancelled'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: isFr ? 'eur' : 'usd',
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
      cancel_url: `${origin}/${cancelPath}`,
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
