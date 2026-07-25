const express = require('express');
const path = require('path');
const app = express();

// Middleware to parse JSON data from the frontend
app.use(express.json());

// Serve the frontend HTML files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ==========================================
// 1. MOCK DATABASE
// ==========================================
// In a real app, this would be your MongoDB or MySQL database.
const usersDatabase = [
    { username: 'lucky@gmail.com', password: 'password123', role: 'customer' },
    { username: 'admin1', password: 'supersecret', role: 'admin' }
];

// ==========================================
// 2. AUTHENTICATION API
// ==========================================
app.post('/api/login', (req, res) => {
    const { username, password, requestedRole } = req.body;
    
    // Search our database for the user
    const user = usersDatabase.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ message: "Invalid username or password!" });
    }
    
    // Security check: Don't let customers log in as admins
    if (requestedRole === 'admin' && user.role !== 'admin') {
        return res.status(403).json({ message: "Access Denied: Admin privileges required." });
    }
    
    res.json({ message: `Welcome back, ${username}!`, role: user.role });
});

// ==========================================
// 3. PAYMENT API (Paytm Checkout)
// ==========================================
app.post('/api/pay', (req, res) => {
    const { amount, items } = req.body;
    
    if (amount <= 0 || items.length === 0) {
        return res.status(400).json({ message: "Cart is empty." });
    }

    console.log(`Processing payment of ₹${amount} for ${items.length} items...`);

    // In a production app, you would contact the Paytm API here using your Merchant Key.
    // For this fully functional demo, we will simulate a successful transaction after a 2-second delay.
    setTimeout(() => {
        const fakeTransactionId = "TXN_" + Math.floor(Math.random() * 100000000);
        
        res.json({ 
            success: true, 
            transactionId: fakeTransactionId,
            message: "Payment verified successfully. Generating download links..." 
        });
    }, 2000);
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 MSTS Store is live! Open your browser and go to http://localhost:${PORT}`);
});

