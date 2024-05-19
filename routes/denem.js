const express = require('express');
const router = express.Router();
const session = require('express-session');

// Kullanıcı girişi controller fonksiyonu
function loginUser(req, res) {
    const { username, password } = req.body;
    
    // Burada kullanıcı adı ve şifrenin doğruluğunu kontrol edin
    // Doğruysa, session oluşturun veya güncelleyin
    req.session.user = {
        username: username,
        // Diğer kullanıcı bilgileri...
    };

    res.send('Kullanıcı başarıyla giriş yaptı.');
}

// Kullanıcı girişi route'u
router.post('/login', loginUser);

module.exports = router;
