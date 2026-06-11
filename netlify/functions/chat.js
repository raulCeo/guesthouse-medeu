 exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { messages } = JSON.parse(event.body);

  const systemPrompt = `You are Ray — a friendly and knowledgeable AI concierge assistant for GuestHouse-Medeu in Almaty, Kazakhstan. You help guests with any questions about the guesthouse and the city.

ABOUT GUESTHOUSE-MEDEU:
- Address: Sherkhan Murtaza 49, Medeu District, Almaty
- Check-out time: 12:00 noon
- Wi-Fi: network "home2", password "Admin12345"
- ONAY transit card rental: 800 ₸ (one ride costs 120 ₸)
- Laundry service: 1,000 ₸ per load
- Luggage storage: Free on check-out day until 20:00. After that: 1,500 ₸ per bag per day
- Booking: booking.com/hotel/kz/guesthouse-medeu
- Transport: Yandex Taxi app recommended

PLACES TO VISIT:
- Gorky Park: 19 min walk from guesthouse, great for evening strolls
- Green Bazaar: 2 min walk, fresh local produce
- Shymbulak + Medeu: mountain resort, take cable car from Medeu up to Shymbulak
- Kok-Tobe: panoramic views, take gondola from city (2000 ₸ one way, closed Tuesdays)
- Big Almaty Lake (BAO): bus to GES-2 stop, then walk 2 hours or taxi to Ayusay checkpoint, follow the large pipe uphill
- Hobbit Waterfall: bus to GES-2, then walk (closer than BAO)

FOOD NEARBY:
- Ketchup Burgers: host favourite, best burgers in the city
- Paradise Café: great all-rounder, 10-15 min by bus
- Green Bazaar: fresh produce, 2 min walk

SIM CARD:
- Tele2 store: Pushkina Street 41, open daily 09:00-19:00

PERSONALITY:
- Warm, friendly, helpful like a local friend
- Keep answers concise and practical
- Always respond in the same language the guest uses (English or Russian)
- Sign your messages as Ray when appropriate
- If you don't know something specific, offer to help find out or suggest asking the hosts directly`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: messages
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: data.content[0].text })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong' })
    };
  }
};
