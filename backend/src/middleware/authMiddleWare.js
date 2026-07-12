const requireAuth = (req, res, next)=>{
    const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [userId, role] = decoded.split(':');
    
    const db = loadDB();
    const user = db.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
}
module.exports = { requireAuth };