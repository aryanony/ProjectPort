const bcrypt = require('bcryptjs');

async function generateHash() {
    const adminHash = await bcrypt.hash('#admin@ProjectPort', 10);
    const clientHash = await bcrypt.hash('client123', 10);
    
    console.log('Admin password hash:', adminHash);
    console.log('Client password hash:', clientHash);
}

generateHash();

