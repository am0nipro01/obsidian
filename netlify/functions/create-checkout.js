const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  try {
    const { reservationId, vehicleName, totalPrice } = JSON.parse(event.body)
    const origin = event.headers.origin || event.headers.referer?.replace(/\/$/, '')

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: `OBSIDIAN — ${vehicleName}`,
            description: 'Location de véhicule premium',
          },
          unit_amount: totalPrice * 100,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${origin}/dashboard?payment=success`,
      cancel_url: `${origin}/reservation?payment=cancelled`,
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
