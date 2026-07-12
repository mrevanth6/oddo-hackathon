const connection=require("../database")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")
require('dotenv').config();
const { v4: uuidv4 } = require("uuid");
const login=async(req,res)=>{
    const { email, password ,role} = req.body;
    // MYSQL query to find the user by email and role
    try{
        const [user] = await connection.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
        const userData = user[0]; // Get the first user from the result
        if (!userData) {
            return res.status(401).json({ error: 'Invalid email or role' });
        }
        // Compare the provided password with the stored password hash  
        const isMatch=await bcrypt.compare(password,userData.password_hash);
        if(!isMatch){
            return res.status(401).json({ error: 'Invalid password' });
        }
        const token=jwt.sign({ id: userData.id, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.status(200).json({ token});

    }
    catch(err){
        console.error('Error during login:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
const register=async(req,res)=>{
    const { email, password, name, role, contact_number } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const id=uuidv4(); // Generate a unique ID for the user
        const [existingUser] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const [result] = await connection.query(
            'INSERT INTO users (id, email, password_hash, name, role, contact_number) VALUES (?, ?, ?, ?, ?, ?)',
            [id, email, hashedPassword, name, role, contact_number]
        );
        return res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error during registration:', err);
        return res.status(500).json({ error: 'Internal server error' });
    }

}
module.exports={login, register}