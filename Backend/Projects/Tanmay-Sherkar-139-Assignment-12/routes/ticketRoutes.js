const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { bookingRateLimiter } = require('../middleware/rateLimiter');

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Atomic ticket booking, user ticket retrieval, and cancellation
 */

/**
 * @swagger
 * /api/tickets/book:
 *   post:
 *     summary: Atomically book event tickets (Attendee only - Rate limited to 10 req/min)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookTicketRequest'
 *     responses:
 *       201:
 *         description: Tickets booked successfully via Firestore transaction
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: 'Tickets booked successfully' }
 *                 data: { $ref: '#/components/schemas/Ticket' }
 *       400:
 *         description: Insufficient tickets or invalid input
 *       403:
 *         description: Forbidden - Requires Attendee role
 *       429:
 *         description: Too Many Requests - Anti-scalper rate limit triggered
 */
router.post('/book', auth, checkRole('Attendee'), bookingRateLimiter, ticketController.bookTicket);

/**
 * @swagger
 * /api/tickets/my-tickets:
 *   get:
 *     summary: View all tickets booked by the authenticated attendee
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 count: { type: integer, example: 2 }
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ticket'
 *       403:
 *         description: Forbidden - Requires Attendee role
 */
router.get('/my-tickets', auth, checkRole('Attendee'), ticketController.getMyTickets);

/**
 * @swagger
 * /api/tickets/{id}/cancel:
 *   post:
 *     summary: Cancel a booked ticket and restore inventory via atomic transaction (Attendee only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Ticket document ID
 *     responses:
 *       200:
 *         description: Ticket cancelled and inventory restored
 *       400:
 *         description: Ticket already cancelled or invalid
 *       403:
 *         description: Forbidden - Not the ticket owner or not an Attendee
 *       404:
 *         description: Ticket not found
 */
router.post('/:id/cancel', auth, checkRole('Attendee'), ticketController.cancelTicket);

module.exports = router;
