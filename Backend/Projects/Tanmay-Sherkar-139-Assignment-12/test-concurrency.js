const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const reqOptions = {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(url, reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, data: body });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runConcurrencyTest() {
  console.log('🧪 Starting Concurrency & Rate Limiting Verification Test...\n');

  try {
    // 1. Register Organizer
    const orgEmail = `organizer_${Date.now()}@techconf.org`;
    console.log(`1️⃣  Registering Organizer: ${orgEmail}`);
    const orgReg = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Conference Director',
        email: orgEmail,
        password: 'Password123!',
        role: 'Organizer'
      }
    });

    const orgToken = orgReg.data.token;
    console.log(`   Organizer Token obtained. Status: ${orgReg.status}`);

    // 2. Organizer creates event with totalCapacity: 5
    console.log(`2️⃣  Creating Event with totalCapacity = 5 tickets...`);
    const eventRes = await request('/api/events', {
      method: 'POST',
      headers: { Authorization: `Bearer ${orgToken}` },
      body: {
        title: 'Cloud Concurrency Summit 2026',
        description: 'Testing high concurrency ticket booking transactions',
        category: 'Technology',
        eventDate: '2026-10-15T09:00:00Z',
        venue: 'Tech Arena Hall B, Mumbai',
        ticketPrice: 999,
        totalCapacity: 5
      }
    });

    const eventId = eventRes.data.data.id;
    console.log(`   Created Event ID: ${eventId}, Initial Available Tickets: ${eventRes.data.data.availableTickets}\n`);

    // 3. Register Attendee
    const attendeeEmail = `attendee_${Date.now()}@gmail.com`;
    console.log(`3️⃣  Registering Attendee: ${attendeeEmail}`);
    const attendeeReg = await request('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Kunal Sharma',
        email: attendeeEmail,
        password: 'Password123!',
        role: 'Attendee'
      }
    });

    const attendeeToken = attendeeReg.data.token;
    console.log(`   Attendee Token obtained. Status: ${attendeeReg.status}\n`);

    // 4. Simulate 8 concurrent booking calls for 1 ticket each (Capacity is only 5)
    console.log(`4️⃣  Simulating 8 simultaneous booking requests for 1 ticket each (Capacity: 5)...`);
    const bookingPromises = [];

    for (let i = 1; i <= 8; i++) {
      bookingPromises.push(
        request('/api/tickets/book', {
          method: 'POST',
          headers: { Authorization: `Bearer ${attendeeToken}` },
          body: {
            eventId,
            quantity: 1,
            attendeeName: `Attendee #${i}`,
            attendeeEmail: `user${i}@example.com`
          }
        }).then((res) => ({ index: i, ...res }))
      );
    }

    const results = await Promise.all(bookingPromises);

    let successCount = 0;
    let failureCount = 0;

    results.forEach((r) => {
      if (r.status === 201 && r.data.success) {
        successCount++;
        console.log(`   ✅ Request #${r.index}: SUCCESS (BookingRef: ${r.data.data.bookingRef})`);
      } else {
        failureCount++;
        console.log(`   ❌ Request #${r.index}: FAILED (${r.status} - ${r.data.message})`);
      }
    });

    console.log(`\n📊 Concurrency Results:`);
    console.log(`   - Successful Bookings: ${successCount} (Expected: 5)`);
    console.log(`   - Rejected Bookings:   ${failureCount} (Expected: 3)`);

    // 5. Verify final event ticket inventory
    const finalEventRes = await request(`/api/events/${eventId}`);
    const remaining = finalEventRes.data.data.availableTickets;
    console.log(`   - Final Available Tickets in DB: ${remaining}`);

    if (remaining === 0 && successCount === 5) {
      console.log(`\n🎉 TRANSACTION TEST PASSED: Available tickets never dropped below 0, and tickets were never oversold!`);
    } else {
      console.error(`\n⚠️ TRANSACTION TEST FAILED: Over-sold or state mismatch.`);
    }

  } catch (error) {
    console.error('Test execution failed:', error.message);
  }
}

// Run test if server is already running or standalone
if (require.main === module) {
  runConcurrencyTest();
}

module.exports = runConcurrencyTest;
