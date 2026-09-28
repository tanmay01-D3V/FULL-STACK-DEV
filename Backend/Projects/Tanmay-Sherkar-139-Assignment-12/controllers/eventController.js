const { db } = require('../config/firebaseConfig');

// Browse all upcoming events with optional category & city/venue filtering
exports.getAllEvents = async (req, res) => {
  try {
    const { category, city, venue } = req.query;
    const eventsRef = db.collection('events');

    const snapshot = await eventsRef.get();
    let events = [];

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      events.push({ id: doc.id, ...data });
    });

    // Filter by upcoming date (eventDate >= current date)
    const nowIso = new Date().toISOString();
    events = events.filter((e) => e.eventDate >= nowIso);

    // Apply category filter if provided
    if (category) {
      events = events.filter(
        (e) => e.category && e.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply city / venue search if provided
    const locationQuery = city || venue;
    if (locationQuery) {
      events = events.filter(
        (e) => e.venue && e.venue.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    // Sort by eventDate ascending
    events.sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events: ' + error.message
    });
  }
};

// View single event details and live ticket count
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventDoc = await db.collection('events').doc(id).get();

    if (!eventDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    res.status(200).json({
      success: true,
      data: { id: eventDoc.id, ...eventDoc.data() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event details: ' + error.message
    });
  }
};

// Create new event listing (Organizer only)
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      eventDate,
      venue,
      ticketPrice,
      totalCapacity
    } = req.body;

    if (!title || !description || !category || !eventDate || !venue || ticketPrice === undefined || totalCapacity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: title, description, category, eventDate, venue, ticketPrice, totalCapacity.'
      });
    }

    const price = Number(ticketPrice);
    const capacity = parseInt(totalCapacity, 10);

    if (isNaN(price) || price < 0 || isNaN(capacity) || capacity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'ticketPrice must be a positive number and totalCapacity must be a positive integer.'
      });
    }

    const eventRef = db.collection('events').doc();
    const newEvent = {
      id: eventRef.id,
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      eventDate: new Date(eventDate).toISOString(),
      venue: venue.trim(),
      organizerId: req.user.id,
      ticketPrice: price,
      totalCapacity: capacity,
      availableTickets: capacity,
      createdAt: new Date().toISOString()
    };

    await eventRef.set(newEvent);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create event: ' + error.message
    });
  }
};

// Update event details (Organizer must own event)
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventRef = db.collection('events').doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    const eventData = doc.data();

    if (eventData.organizerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only edit events created by you.'
      });
    }

    const updates = {};
    const allowedFields = ['title', 'description', 'category', 'eventDate', 'venue', 'ticketPrice'];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'eventDate') {
          updates[field] = new Date(req.body[field]).toISOString();
        } else if (field === 'ticketPrice') {
          updates[field] = Number(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    });

    updates.updatedAt = new Date().toISOString();

    await eventRef.update(updates);
    const updatedDoc = await eventRef.get();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: { id: updatedDoc.id, ...updatedDoc.data() }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event: ' + error.message
    });
  }
};

// Cancel & Delete event (Organizer must own event)
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const eventRef = db.collection('events').doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    const eventData = doc.data();

    if (eventData.organizerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You can only delete events created by you.'
      });
    }

    await eventRef.delete();

    res.status(200).json({
      success: true,
      message: 'Event cancelled and deleted successfully.'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event: ' + error.message
    });
  }
};

// List all registered attendees for an event (Organizer only)
exports.getEventAttendees = async (req, res) => {
  try {
    const { id } = req.params;
    const eventDoc = await db.collection('events').doc(id).get();

    if (!eventDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Event not found.'
      });
    }

    const eventData = eventDoc.data();

    if (eventData.organizerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: Only the event organizer can view the attendee roster.'
      });
    }

    const ticketsSnapshot = await db
      .collection('tickets')
      .where('eventId', '==', id)
      .where('status', '==', 'confirmed')
      .get();

    const attendees = [];
    ticketsSnapshot.docs.forEach((doc) => {
      const ticket = doc.data();
      attendees.push({
        ticketId: doc.id,
        bookingRef: ticket.bookingRef,
        attendeeName: ticket.attendeeName,
        attendeeEmail: ticket.attendeeEmail,
        userId: ticket.userId,
        quantity: ticket.quantity,
        totalPaid: ticket.totalPaid,
        bookedAt: ticket.bookedAt
      });
    });

    res.status(200).json({
      success: true,
      eventId: id,
      eventTitle: eventData.title,
      totalAttendees: attendees.length,
      totalTicketsSold: attendees.reduce((acc, a) => acc + a.quantity, 0),
      data: attendees
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve attendees: ' + error.message
    });
  }
};
