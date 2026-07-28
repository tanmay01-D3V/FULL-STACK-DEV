const EventEmitter = require('events');

// ─── 1. BASIC EVENT EMITTER ───────────────────────────────────────────────────
// EventEmitter is the core class. You create an instance and use it to
// emit named events and register listeners for those events.

const emitter = new EventEmitter();

// Register a listener for 'greet' event
emitter.on('greet', (name) => {
  console.log(`Hello, ${name}!`);
});

// Emit the 'greet' event
emitter.emit('greet', 'Tanmay'); // → Hello, Tanmay!


// ─── 2. MULTIPLE LISTENERS ───────────────────────────────────────────────────
// Multiple listeners can be attached to the same event.
// They fire in the order they were registered.

emitter.on('greet', (name) => {
  console.log(`Welcome aboard, ${name}!`);
});

emitter.emit('greet', 'Tanmay');
// → Hello, Tanmay!
// → Welcome aboard, Tanmay!


// ─── 3. once() — FIRE ONLY ONE TIME ──────────────────────────────────────────
// Listener is automatically removed after it fires once.

emitter.once('connect', () => {
  console.log('Connected to server!');
});

emitter.emit('connect'); // → Connected to server!
emitter.emit('connect'); // → (nothing, listener already removed)


// ─── 4. REMOVING LISTENERS ───────────────────────────────────────────────────
// Use removeListener() or off() to detach a specific listener.

const onData = (data) => console.log('Data received:', data);

emitter.on('data', onData);
emitter.emit('data', '{ id: 1 }');  // → Data received: { id: 1 }

emitter.off('data', onData);        // remove the listener
emitter.emit('data', '{ id: 2 }');  // → (nothing, listener removed)


// ─── 5. removeAllListeners() ─────────────────────────────────────────────────
// Removes all listeners for a specific event, or ALL events if none specified.

emitter.on('log', () => console.log('log 1'));
emitter.on('log', () => console.log('log 2'));

emitter.removeAllListeners('log');
emitter.emit('log'); // → (nothing)


// ─── 6. LISTENER COUNT & LISTING ─────────────────────────────────────────────
// Inspect how many listeners are attached to an event.

emitter.on('request', () => {});
emitter.on('request', () => {});

console.log(emitter.listenerCount('request'));  // → 2
console.log(emitter.eventNames());              // → [ 'greet', 'request' ]
console.log(emitter.listeners('request'));      // → [ [Function], [Function] ]


// ─── 7. ERROR EVENTS ─────────────────────────────────────────────────────────
// 'error' is a special event. If emitted with no listener, Node.js THROWS.
// Always handle 'error' events!

emitter.on('error', (err) => {
  console.error('Caught error:', err.message);
});

emitter.emit('error', new Error('Something went wrong!')); 
// → Caught error: Something went wrong!


// ─── 8. EXTENDING EventEmitter (CUSTOM CLASS) ────────────────────────────────
// Best practice: extend EventEmitter to create your own event-driven classes.

class Logger extends EventEmitter {
  log(message) {
    console.log(`[LOG]: ${message}`);
    this.emit('logged', { message, timestamp: new Date() });
  }
}

const logger = new Logger();

logger.on('logged', (info) => {
  console.log(`Event captured at: ${info.timestamp.toISOString()}`);
});

logger.log('Server started');
// → [LOG]: Server started
// → Event captured at: 2024-01-01T00:00:00.000Z


// ─── 9. prepend LISTENERS ────────────────────────────────────────────────────
// prependListener() adds a listener to the BEGINNING of the listeners array
// instead of the end — so it fires first.

emitter.on('order', () => console.log('Step 2'));
emitter.prependListener('order', () => console.log('Step 1'));

emitter.emit('order');
// → Step 1
// → Step 2


// ─── 10. MAX LISTENERS WARNING ───────────────────────────────────────────────
// Node warns if more than 10 listeners are added to one event (memory leak hint).
// You can increase the limit with setMaxListeners().

emitter.setMaxListeners(20);
console.log('Max listeners:', emitter.getMaxListeners()); // → 20


// ─── 11. ASYNC EVENTS with EventEmitter ──────────────────────────────────────
// EventEmitter is synchronous by default, but listeners can run async logic.

emitter.on('fetchData', async (id) => {
  const data = await Promise.resolve({ id, value: 'some data' }); // simulated async
  console.log('Fetched:', data);
});

emitter.emit('fetchData', 42); // → Fetched: { id: 42, value: 'some data' }
