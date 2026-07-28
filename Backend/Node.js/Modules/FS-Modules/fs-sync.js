const { readFileSync, writeFileSync } = require('fs')
const path = require('path')

console.log('start')

// Go up two levels from FS-Modules → Modules → Node.js, then into content
const contentDir = path.join(__dirname, '..', '..', 'content')

const first  = readFileSync(path.join(contentDir, 'first.txt'), 'utf8')
const second = readFileSync(path.join(contentDir, 'second.txt'), 'utf8')

writeFileSync(
  path.join(contentDir, 'result-sync.txt'),
  `Here is the result : ${first}, ${second}`,
  { flag: 'a' }
)

console.log('done with this task')
console.log('starting the next one')