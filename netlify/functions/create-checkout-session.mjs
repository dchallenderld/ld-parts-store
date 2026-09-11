// LD Parts Store — basket checkout function
// Creates a single Stripe Checkout Session covering every item in the customer's basket.
//
// SECURITY NOTE: prices are looked up here, server-side, from PRICE_MAP — never trusted
// from the browser. The client only ever sends a part number and a quantity.
//
// This is SANDBOX/TEST mode only (test-mode Stripe secret key + test price IDs below).
// When the live site is ready to get its own basket, this map needs regenerating with
// live-mode price IDs and a live-mode secret key (set via a separate Netlify env var/site).

const PRICE_MAP = {
  "TW/027": { price: "price_1TyBrhFzGx70qTXs17inTxQC", tier: "DX" },
  "LDS/1566": { price: "price_1TyBrfFzGx70qTXsUjJeWKFP", tier: "DX" },
  "VB/022": { price: "price_1TyBrdFzGx70qTXskohwq9sK", tier: "POA" },
  "CS/055": { price: "price_1TyBrbFzGx70qTXspRftOiKn", tier: "DX" },
  "TW/159": { price: "price_1TyBrYFzGx70qTXsIXpoUMYQ", tier: "DX" },
  "AR/009": { price: "price_1TyBrWFzGx70qTXsak29szlE", tier: "POA" },
  "LDS/1343": { price: "price_1TyBrKFzGx70qTXsF8Rk4xhY", tier: "DX" },
  "CS/065": { price: "price_1TyBrIFzGx70qTXsI5o9tVUJ", tier: "DX" },
  "TRT/126": { price: "price_1TyBrGFzGx70qTXsWrfBFfqU", tier: "DX" },
  "TW/035": { price: "price_1TyBrEFzGx70qTXsLOr0aYfG", tier: "POA" },
  "TW/158": { price: "price_1TyBrCFzGx70qTXsFoNOROnF", tier: "DX" },
  "VB/171-13291": { price: "price_1TyBrAFzGx70qTXsn5PjGwcR", tier: "POA" },
  "TN/007A": { price: "price_1TyBr7FzGx70qTXsAA661VbF", tier: "POA" },
  "VB/172-3600": { price: "price_1TyBr5FzGx70qTXsXWLgNmZM", tier: "POA" },
  "TW/026": { price: "price_1TyBr3FzGx70qTXseB5LGH0L", tier: "DX" },
  "CS/096": { price: "price_1TyBr1FzGx70qTXsoWmjjNtD", tier: "DX" },
  "TN/286A": { price: "price_1TyBqsFzGx70qTXslqB3cEiO", tier: "POA" },
  "TW/098": { price: "price_1TyBqqFzGx70qTXs5uglEugc", tier: "POA" },
  "TNX/009": { price: "price_1TyBqoFzGx70qTXssdrJYtpw", tier: "POA" },
  "TW/167B": { price: "price_1TyBqmFzGx70qTXsN0kKoWTP", tier: "POA" },
  "TW/083": { price: "price_1TyBqkFzGx70qTXsnPKnsuA8", tier: "POA" },
  "TW/033": { price: "price_1TyBqiFzGx70qTXseNFvP49z", tier: "DX" },
  "CS/722A": { price: "price_1TyBqgFzGx70qTXspsBtYDWW", tier: "POA" },
  "VB/170-2250": { price: "price_1TyBqdFzGx70qTXseQ6Ipzzl", tier: "POA" },
  "TW/034": { price: "price_1TyBqbFzGx70qTXsp9POckfE", tier: "DX" },
  "VB/013": { price: "price_1TyBqZFzGx70qTXsTfAkNifI", tier: "DX" },
  "TW/105A": { price: "price_1TyBqRFzGx70qTXsDhU5OHp6", tier: "DX" },
  "LDS/1516": { price: "price_1TyBqPFzGx70qTXsuJG2dJFv", tier: "POA" },
  "LDS/1126": { price: "price_1TyBqNFzGx70qTXsFRgrETmA", tier: "DX" },
  "VB/170-13436": { price: "price_1TyBqLFzGx70qTXsTt7XAoAv", tier: "POA" },
  "LDS/1230": { price: "price_1TyBqHFzGx70qTXskL1NsJKI", tier: "POA" },
  "CS/053": { price: "price_1TyBqFFzGx70qTXs3kkM7R5d", tier: "DX" },
  "TW/025": { price: "price_1TyBqCFzGx70qTXseR90KF1e", tier: "POA" },
  "TW/044B": { price: "price_1TyBqBFzGx70qTXsZCGczDfR", tier: "POA" },
  "LDS/1179": { price: "price_1TyBq9FzGx70qTXsDQhjvFMO", tier: "DX" },
  "LDS/1226": { price: "price_1TyBq7FzGx70qTXs8UBi0Rka", tier: "POA" },
  "VB/021": { price: "price_1TyBpyFzGx70qTXsXuJlvCb8", tier: "POA" },
  "TW/228": { price: "price_1TyBpwFzGx70qTXsn4vGyhIL", tier: "POA" },
  "LDS/1404": { price: "price_1TyBpuFzGx70qTXs52kk5kSW", tier: "DX" },
  "TW/038": { price: "price_1TyBpsFzGx70qTXs8gD5V3sL", tier: "POA" },
  "LDS/1209": { price: "price_1TyBpqFzGx70qTXsFvETKUGe", tier: "POA" },
  "LDS/1856": { price: "price_1TyBpoFzGx70qTXsgKPF55rV", tier: "POA" },
  "AS/045": { price: "price_1TyBpmFzGx70qTXshSyr9CIA", tier: "POA" },
  "TRT/127": { price: "price_1TyBplFzGx70qTXsTnqX4tEo", tier: "DX" },
  "LDS/1612": { price: "price_1TyBpiFzGx70qTXs1g3jCo4j", tier: "DX" },
  "CS/655": { price: "price_1TyBpgFzGx70qTXsAxF3Sz9i", tier: "DX" },
  "TW/168B": { price: "price_1TyBjdFzGx70qTXs6upZCqt6", tier: "POA" },
};

const DX_STANDARD_RATE = "shr_1UETq9FzGx70qTXsd8JHic5e"; // DX Standard, £25.00 (sandbox)
const POA_RATE = "shr_1TyBbCFzGx70qTXsoJ1y60n4"; // POA / quoted, £0 (sandbox)
const COLLECTION_RATE = "shr_1TyBhMFzGx70qTXs3jNrlt6k"; // Free collection (sandbox)

export default async (req, context) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid request body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const requestedItems = Array.isArray(body.items) ? body.items : [];
  const email = typeof body.email === "string" && body.email.trim() ? body.email.trim() : undefined;

  const lineItems = [];
  let anyPOA = false;
  for (const item of requestedItems) {
    const entry = item && typeof item.part === "string" ? PRICE_MAP[item.part] : undefined;
    if (!entry) continue;
    const qty = Math.max(1, Math.min(99, parseInt(item.quantity, 10) || 1));
    lineItems.push({ price: entry.price, quantity: qty });
    if (entry.tier === "POA") anyPOA = true;
  }

  if (lineItems.length === 0) {
    return new Response(JSON.stringify({ error: "No valid items in basket" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response(
      JSON.stringify({ error: "Server is not configured with a Stripe secret key (STRIPE_SECRET_KEY env var missing)" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const siteUrl = process.env.URL || `https://${req.headers.get("host")}`;

  const params = new URLSearchParams();
  params.append("mode", "payment");
  params.append("success_url", `${siteUrl}/?checkout=success`);
  params.append("cancel_url", `${siteUrl}/?checkout=cancelled`);
  if (email) params.append("customer_email", email);
  params.append("billing_address_collection", "auto");
  params.append("shipping_address_collection[allowed_countries][0]", "GB");
  params.append("phone_number_collection[enabled]", "true");
  params.append("invoice_creation[enabled]", "true");

  lineItems.forEach((li, i) => {
    params.append(`line_items[${i}][price]`, li.price);
    params.append(`line_items[${i}][quantity]`, String(li.quantity));
    params.append(`line_items[${i}][adjustable_quantity][enabled]`, "true");
    params.append(`line_items[${i}][adjustable_quantity][maximum]`, "99");
  });

  const shippingRate = anyPOA ? POA_RATE : DX_STANDARD_RATE;
  params.append("shipping_options[0][shipping_rate]", shippingRate);
  params.append("shipping_options[1][shipping_rate]", COLLECTION_RATE);

  let stripeResp;
  try {
    stripeResp = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Could not reach Stripe" }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  const session = await stripeResp.json();

  if (!stripeResp.ok) {
    return new Response(
      JSON.stringify({ error: (session.error && session.error.message) || "Stripe error creating checkout session" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ url: session.url }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  path: "/api/create-checkout-session",
  method: "POST",
};
