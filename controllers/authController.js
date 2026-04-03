// controllers/authController.js
export async function handleSignup(req, res) {
    try {
      const { email, password, name } = req.body;
      
      // Validate input
      if (!email || !password) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      
      // Call Model to create user
      const userId = await User.createUser(email, password);
      
      // Send response to View
      res.json({ success: true, userId });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }