const { db } = require('../config/firebaseConfig');

// Atomic ticket booking using Firestore runTransaction with anti-scalping concurrency control
exports.bookTicket = async (req, res) => {
  const { eventId, quantity, attendeeName, attendeeEmail } = req.body;
  const userId = req.user.id;
  const qty = parseInt(quantity, 10);

  if (!eventId || !qty || qty <= 0 || !attendeeName || !attendeeEmail) {
    return res.status(400).json({
      success: false,
      message: 'Invalid request: eventId, positive quantity, attendeeName, and attendeeEmail are required.'
    });
  }

  const eventRef = db.collection('events').doc(eventId);
  const ticketRef = db.collection('tickets').doc();

  try {
    const result = await db.runTransaction(async (t) => {
      const eventDoc = await t.get(eventRef);
      if (!eventDoc.exists) {
        throw new Error('Event not found');
      }

      const eventData = eventDoc.data();
      if (eventData.availableTickets < qty) {
        throw new Error(`Insufficient tickets available. Requested: ${qty}, Remaining: ${eventData.availableTickets}`);
      }

      // 1. Atomically decrement available tickets in event document
      t.update(eventRef, {
        availableTickets: eventData.availableTickets - qty
      });

      // 2. Create confirmed ticket document
      const bookingRef = `TKT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
      const newTicket = {
        id: ticketRef.id,
        eventId,
        eventTitle: eventData.title,
        userId,
        attendeeName: attendeeName.trim(),
        attendeeEmail: attendeeEmail.trim().toLowerCase(),
        quantity: qty,
        totalPaid: qty * eventData.ticketPrice,
        bookingRef,
        status: 'confirmed',
        bookedAt: new Date().toISOString()
      };

      t.set(ticketRef, newTicket);
      return newTicket;
    });

    res.status(201).json({
      success: true,
      message: 'Tickets booked successfully',
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Retrieve purchased tickets for the logged-in attendee
exports.getMyTickets = async (req, res) => {
  try {
    const userId = req.user.id;
    const ticketsSnapshot = await db
      .collection('tickets')
      .where('userId', '==', userId)
      .get();

    const tickets = [];
    ticketsSnapshot.docs.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() });
    });

    // Sort by bookedAt descending
    tickets.sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tickets: ' + error.message
    });
  }
};

// Cancel ticket and restore inventory via ACID transaction
exports.cancelTicket = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const ticketRef = db.collection('tickets').doc(id);

  try {
    const result = await db.runTransaction(async (t) => {
      const ticketDoc = await t.get(ticketRef);

      if (!ticketDoc.exists) {
        throw new Error('Ticket not found');
      }

      const ticketData = ticketDoc.data();

      if (ticketData.userId !== userId) {
        throw new Error('Forbidden: You can only cancel your own tickets');
      }

      if (ticketData.status === 'cancelled') {
        throw new Error('Ticket is already cancelled');
      }

      const eventRef = db.collection('events').doc(ticketData.eventId);
      const eventDoc = await t.get(eventRef);

      if (eventDoc.exists) {
        const eventData = eventDoc.data();
        // Restore inventory
        t.update(eventRef, {
          availableTickets: (eventData.availableTickets || 0) + ticketData.quantity
        });
      }

      // Update ticket status
      t.update(ticketRef, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      });

      return {
        ticketId: ticketRef.id,
        bookingRef: ticketData.bookingRef,
        restoredQuantity: ticketData.quantity,
        status: 'cancelled'
      };
    });

    res.status(200).json({
      success: true,
      message: 'Ticket cancelled successfully and inventory restored.',
      data: result
    });
  } catch (error) {
    const statusCode = error.message.includes('Forbidden') ? 403 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
};
