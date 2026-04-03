// models/User.js
export async function createUser(email, password) {
    // Validate email format
    if (!isValidEmail(email)) throw new Error('Invalid email');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert into database
    const [result] = await db.query(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword]
    );
    
    return result.insertId;
  }
  
  export async function getUserById(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }