
const bcrypt = require('bcryptjs');

const password = 'yaAliHaq712?@!ImamE!!Zamanaas@';
const currentHash = '$2b$10$mg3IVy./yc0njUlzjDexle76FwJ7.CGdzda6ZT8491P7sCP0hywtC';

console.log('Testing Password:', password);
console.log('Testing Hash:', currentHash);

const isValid = bcrypt.compareSync(password, currentHash);
console.log('Is Valid?', isValid);

if (!isValid) {
    console.log('Generating new hash...');
    const newHash = bcrypt.hashSync(password, 10);
    console.log('New Hash:', newHash);
    console.log('Verify New Hash:', bcrypt.compareSync(password, newHash));
}
