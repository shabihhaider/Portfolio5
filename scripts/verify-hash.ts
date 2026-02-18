import bcrypt from 'bcryptjs';

const password = 'yaAliHaq712?@!ImamE!!Zamanaas@';
const hash = '$2b$10$mg3IVy./yc0njUlzjDexle76FwJ7.CGdzda6ZT8491P7sCP0hywtC'; // Cleaned hash

bcrypt.compare(password, hash).then(isValid => {
    console.log(`Password matches hash: ${isValid}`);
});
