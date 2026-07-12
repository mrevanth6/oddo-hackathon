const login=async(req,res)=>{
    const { email, password } = req.body;
  const db = loadDB();
  const user = db.users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  const token = Buffer.from(`${user.id}:${user.role}`).toString('base64');
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, contactNumber: user.contactNumber } });
}
module.exports={login}