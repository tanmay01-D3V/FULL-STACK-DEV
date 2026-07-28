const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { Transform, Readable, Writable, pipeline } = require('stream');

// ─── 1. WHAT ARE STREAMS? ─────────────────────────────────────────────────────
// Streams process data piece by piece (chunks) instead of loading it all
// into memory. Ideal for large files, network data, or real-time data.
//
// 4 Types:
//   Readable  → you read FROM it  (e.g. fs.createReadStream)
//   Writable  → you write TO it   (e.g. fs.createWriteStream)
//   Duplex    → both read & write (e.g. TCP socket)
//   Transform → read, modify, write (e.g. zlib compression)


// ─── 2. READABLE STREAM ──────────────────────────────────────────────────────

const readable = fs.createReadStream(
  path.join(__dirname, 'content', 'first.txt'),
  { encoding: 'utf8', highWaterMark: 16 }
);

readable.on('data', (chunk) => {
  console.log('Chunk received:', chunk);
});

readable.on('end', () => {
  console.log('Finished reading.');
});

readable.on('error', (err) => {
  console.error('Read error:', err.message);
});


// ─── 3. WRITABLE STREAM ──────────────────────────────────────────────────────

const writable = fs.createWriteStream(
  path.join(__dirname, 'content', 'output.txt')
);

writable.write('First chunk\n');
writable.write('Second chunk\n');
writable.end('Final chunk\n');

writable.on('finish', () => {
  console.log('All data written to file.');
});

writable.on('error', (err) => {
  console.error('Write error:', err.message);
});


// ─── 4. PIPE ─────────────────────────────────────────────────────────────────

const readStream  = fs.createReadStream(path.join(__dirname, 'content', 'first.txt'));
const writeStream = fs.createWriteStream(path.join(__dirname, 'content', 'copy.txt'));

readStream.pipe(writeStream);
writeStream.on('finish', () => console.log('File copied via pipe!'));


// ─── 5. TRANSFORM STREAM ─────────────────────────────────────────────────────

const toUpperCase = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  }
});

const src  = fs.createReadStream(path.join(__dirname, 'content', 'first.txt'));
const dest = fs.createWriteStream(path.join(__dirname, 'content', 'upper.txt'));

src.pipe(toUpperCase).pipe(dest);


// ─── 6. CUSTOM READABLE STREAM ───────────────────────────────────────────────

const customReadable = new Readable({
  read() {}
});

customReadable.push('Hello ');
customReadable.push('from ');
customReadable.push('custom stream!');
customReadable.push(null);

customReadable.on('data', chunk => console.log(chunk.toString()));


// ─── 7. CUSTOM WRITABLE STREAM ───────────────────────────────────────────────

const customWritable = new Writable({
  write(chunk, encoding, callback) {
    console.log('Writing chunk:', chunk.toString());
    callback();
  }
});

customWritable.write('chunk one\n');
customWritable.write('chunk two\n');
customWritable.end();


// ─── 8. PIPELINE ─────────────────────────────────────────────────────────────

pipeline(
  fs.createReadStream(path.join(__dirname, 'content', 'first.txt')),
  zlib.createGzip(),
  fs.createWriteStream(path.join(__dirname, 'content', 'first.txt.gz')),
  (err) => {
    if (err) console.error('Pipeline failed:', err.message);
    else console.log('Pipeline succeeded — file compressed!');
  }
);


// ─── 9. STREAM EVENTS SUMMARY ────────────────────────────────────────────────

// Readable events:
//   'data'   → chunk is available to read
//   'end'    → no more data to read
//   'error'  → an error occurred
//   'close'  → stream is closed
//   'pause'  → stream is paused
//   'resume' → stream resumed

// Writable events:
//   'drain'  → safe to write again after buffer was full
//   'finish' → all data has been flushed
//   'error'  → an error occurred
//   'close'  → stream is closed
