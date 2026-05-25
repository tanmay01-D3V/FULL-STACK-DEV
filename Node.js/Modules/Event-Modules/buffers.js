// ─── 1. WHAT IS A BUFFER? ─────────────────────────────────────────────────────
// A Buffer is a fixed-size chunk of memory (outside V8 heap) used to store
// raw binary data — like files, images, network packets, or streams.

// ─── 2. CREATING BUFFERS ─────────────────────────────────────────────────────

// From a string
const buf1 = Buffer.from('Hello Tanmay', 'utf8');
console.log(buf1);              // → <Buffer 48 65 6c 6c 6f ...>
console.log(buf1.toString());   // → Hello Tanmay

// From an array of bytes
const buf2 = Buffer.from([72, 101, 108, 108, 111]);
console.log(buf2.toString());   // → Hello

// Allocate empty buffer of fixed size (filled with zeros)
const buf3 = Buffer.alloc(10);
console.log(buf3);              // → <Buffer 00 00 00 00 00 00 00 00 00 00>

// Allocate uninitialized buffer (faster but contains old memory data)
const buf4 = Buffer.allocUnsafe(10);
console.log(buf4);              // → <Buffer (random bytes)>


// ─── 3. READING & WRITING ─────────────────────────────────────────────────────

const buf = Buffer.alloc(5);
buf.write('Hi!');
console.log(buf.toString());         // → Hi!
console.log(buf.toString('hex'));     // → 4869210000
console.log(buf.toString('base64')); // → SGkh

// Access individual bytes
console.log(buf[0]);                 // → 72 (ASCII for 'H')


// ─── 4. BUFFER PROPERTIES ────────────────────────────────────────────────────

console.log(buf1.length);            // → 12 (byte length)
console.log(Buffer.byteLength('Hello', 'utf8')); // → 5


// ─── 5. COPYING & SLICING ────────────────────────────────────────────────────

const source = Buffer.from('Hello World');
const target = Buffer.alloc(5);

source.copy(target, 0, 0, 5);
console.log(target.toString());      // → Hello

// slice() — returns a reference (same memory!)
const slice = source.slice(0, 5);
console.log(slice.toString());       // → Hello

// subarray() — modern alternative to slice()
const sub = source.subarray(6, 11);
console.log(sub.toString());         // → World


// ─── 6. COMPARING & CONCATENATING ────────────────────────────────────────────

const a = Buffer.from('ABC');
const b = Buffer.from('ABC');
const c = Buffer.from('XYZ');

console.log(a.equals(b));            // → true
console.log(a.equals(c));            // → false
console.log(Buffer.compare(a, c));   // → -1 (a comes before c)

const combined = Buffer.concat([a, c]);
console.log(combined.toString());    // → ABCXYZ


// ─── 7. ENCODING TYPES ────────────────────────────────────────────────────────
// utf8, ascii, base64, hex, latin1, binary, ucs2

const encoded = Buffer.from('Hello').toString('base64');
console.log(encoded);                // → SGVsbG8=

const decoded = Buffer.from(encoded, 'base64').toString('utf8');
console.log(decoded);                // → Hello