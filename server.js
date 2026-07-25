const express = require('express');
const path = require('path');
const app = express();

// This allows the server to read data sent from the website
app.use(express.json());

// This tells the server to display your website from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- DATABASE (Mock) ---
const usersDatabase = [
    { username: 'lucky', password: 'password123', role: 'customer' },
    { username: 'admin', password: 'adminpassword', role: 'admin' }
];

// --- LOGIN API ---
app.post('/api/login', (req, res) => {
    const { username, password, requestedRole } = req.body;
    
    const user = usersDatabase.find(u => u.username === username && u.password === password);
    
    if (!user) {
        return res.status(401).json({ success: false, message: "Wrong username or password" });
    }
    
    if (requestedRole === 'admin' && user.role !== 'admin') {
        return res.status(403).json({ success: false, message: "You are not an admin!" });
    }
    
    res.json({ success: true, message: `Welcome back, ${username}!`, role: user.role });
});

// --- PAYMENT API ---
app.post('/api/pay', (req, res) => {
    const { amount, items } = req.body;
    
    if (amount <= 0 || items.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    console.log(`Backend received payment request for ₹${amount}`);

    // Simulate backend talking to Paytm API
    setTimeout(() => {
        const transactionId = "TXN_" + Math.floor(Math.random() * 10000000);
        res.json({ 
            success: true, 
            transactionId: transactionId,
            message: "Payment verified by server!" 
        });
    }, 2000);
});

// Start the Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Backend Server is RUNNING at http://localhost:${PORT}`);
});
