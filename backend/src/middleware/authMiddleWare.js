const jwt = require('jsonwebtoken');`
require('dotenv').config();`
const requireAuth = (req, res, next)=>{
    const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized access' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    if (!decoded) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    req.user = decoded; // Attach the decoded user information to the request object
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid auth token' });
  }
}
module.exports = { requireAuth };