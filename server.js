const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// מודל למשתמשים - לדוגמה בתוך קובץ טקסט
let users = [];

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// קובץ CSS סטטי
app.use('/home', express.static(__dirname + '/home'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/home/index.html');
});

app.post('/login', (req, res) => {
    const { username } = req.body;
    if (username.length >= 2) {
        res.redirect('/home/register.html');
    } else {
        res.send('Error: Username must be at least 2 characters long.');
    }
});

// פונקציה להוספת משתמש לקובץ טקסט
function addUserToFile(user) {
    fs.appendFile('users.txt', JSON.stringify(user) + '\n', (err) => {
        if (err) throw err;
        console.log('User added to file');
    });
}

app.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // בדיקת תקינות שם משתמש
    if (username.length < 4 || username.length > 8) {
        return res.send('Error: Username must be between 4-8 characters long.');
    }

    // בדיקת תקינות כתובת דוא"ל
    if (!email.includes('@')) {
        return res.send('Error: Email address must contain @.');
    }

    // בדיקת תקינות סיסמה
    if (password.length < 5 || password.length > 10 || !password.includes('$')) {
        return res.send('Error: Password must be between 5-10 characters long and contain $ sign.');
    }

    // בדיקת תואמות סיסמה ואישור סיסמה
    if (password !== confirmPassword) {
        return res.send('Error: Passwords do not match.');
    }

    // הוספת המשתמש למודל
    const newUser = { username, email, password };
    users.push(newUser);

    // הוספת המשתמש לקובץ טקסט
    addUserToFile(newUser);

    // העברה לדף הבית עם השם המשתמש
    res.redirect(`/home/home.html?username=${username}`);
});

app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/home/home.html');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
