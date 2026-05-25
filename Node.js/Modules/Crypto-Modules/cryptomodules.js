const crypto = require('crypto');

// ─── 1. HASHING ───────────────────────────────────────────────────────────────
// Creates a one-way fixed-size digest from input data.
const hash = crypto.createHash('sha256')
  .update('hello world')
  .digest('hex');
console.log('SHA-256 Hash:', hash);


// ─── 2. HMAC (Hash-based Message Authentication Code) ─────────────────────────
// Like hashing, but requires a secret key — used to verify data integrity & authenticity.
const hmac = crypto.createHmac('sha256', 'my-secret-key')
  .update('hello world')
  .digest('hex');
console.log('HMAC:', hmac);


// ─── 3. SYMMETRIC ENCRYPTION (AES) ───────────────────────────────────────────
// Same key is used to encrypt and decrypt. AES-256-CBC is a common standard.
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);   // 256-bit key
const iv  = crypto.randomBytes(16);   // Initialization Vector

const cipher = crypto.createCipheriv(algorithm, key, iv);
let encrypted = cipher.update('secret message', 'utf8', 'hex');
encrypted += cipher.final('hex');
console.log('Encrypted:', encrypted);

const decipher = crypto.createDecipheriv(algorithm, key, iv);
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('Decrypted:', decrypted);


// ─── 4. ASYMMETRIC ENCRYPTION (RSA) ──────────────────────────────────────────
// Two keys: public key encrypts, private key decrypts.
// Used for secure key exchange, digital signatures, and TLS.
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const encryptedRSA = crypto.publicEncrypt(publicKey, Buffer.from('hello RSA'));
const decryptedRSA = crypto.privateDecrypt(privateKey, encryptedRSA);
console.log('RSA Decrypted:', decryptedRSA.toString());


// ─── 5. DIGITAL SIGNATURES ───────────────────────────────────────────────────
// Proves authenticity: sign with private key, verify with public key.
const sign = crypto.createSign('SHA256');
sign.update('document content');
const signature = sign.sign(privateKey, 'hex');
console.log('Signature:', signature.slice(0, 40) + '...');

const verify = crypto.createVerify('SHA256');
verify.update('document content');
const isValid = verify.verify(publicKey, signature, 'hex');
console.log('Signature valid:', isValid);


// ─── 6. RANDOM BYTES / TOKENS ────────────────────────────────────────────────
// Cryptographically secure random data — ideal for tokens, salts, IVs.
const token = crypto.randomBytes(32).toString('hex');
console.log('Secure Token:', token);

const uuid = crypto.randomUUID();
console.log('Random UUID:', uuid);


// ─── 7. KEY DERIVATION (PBKDF2) ──────────────────────────────────────────────
// Derives a strong key from a password + salt. Used for password hashing.
crypto.pbkdf2('password', 'salt', 100_000, 64, 'sha512', (err, derivedKey) => {
  if (err) throw err;
  console.log('Derived Key:', derivedKey.toString('hex').slice(0, 40) + '...');
});


// ─── 8. DIFFIE-HELLMAN KEY EXCHANGE ──────────────────────────────────────────
// Two parties compute a shared secret without ever transmitting it.
const alice = crypto.createDiffieHellman(2048);
const aliceKeys = alice.generateKeys();

const bob = crypto.createDiffieHellman(alice.getPrime(), alice.getGenerator());
const bobKeys = bob.generateKeys();

const aliceSecret = alice.computeSecret(bobKeys);
const bobSecret   = bob.computeSecret(aliceKeys);
console.log('Shared secrets match:', aliceSecret.equals(bobSecret));


// ─── 9. CIPHER INFO / AVAILABLE ALGORITHMS ───────────────────────────────────
// Inspect what algorithms are available on the current OpenSSL build.
const ciphers = crypto.getCiphers().slice(0, 5);
const hashes  = crypto.getHashes().slice(0, 5);
console.log('Sample ciphers:', ciphers);
console.log('Sample hashes:', hashes);