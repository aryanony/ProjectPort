const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testLogin() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });

    const [users] = await pool.query("SELECT * FROM users WHERE email = 'admin@projectport.com'");
    
    if (users.length === 0) {
        console.log('❌ Admin user not found');
        return;
    }

    const user = users[0];
    const isValid = await bcrypt.compare('#admin@ProjectPort', user.password);
    
    console.log('Admin user found:', user.email);
    console.log('Password valid:', isValid ? '✅ YES' : '❌ NO');
    
    if (!isValid) {
        console.log('\n🔧 Fixing password...');
        const newHash = await bcrypt.hash('#admin@ProjectPort', 10);
        await pool.query("UPDATE users SET password = ? WHERE email = 'admin@projectport.com'", [newHash]);
        console.log('✅ Password fixed! Try logging in again.');
    }

    pool.end();
}

testLogin();