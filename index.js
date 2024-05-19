const express = require('express');
const app = express();
const port = 1000;


app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.static('node_modules'));


const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");

const mysql = require('mysql2/promise');

// MySQL bağlantısını oluşturma
let connection;

async function initializeConnection() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',    // MySQL sunucusunun adresi
            user: 'root',         // MySQL kullanıcı adı
            password: 'Volkinger0660.', // MySQL kullanıcı şifresi
            database: 'deneme'      // Bağlanmak istediğiniz veritabanı
        });
    } catch (error) {
        console.error('MySQL bağlantısı oluşturulamadı:', error);
    }
}

async function executeQuery(query, params) {
    if (!connection || connection.connection._closing) {
        // Bağlantı kapalıysa yeniden oluşturun
        await initializeConnection();
    }

    try {
        const [results, fields] = await connection.execute(query, params);
        return results;
    } catch (error) {
        console.error('Sorgu çalıştırılırken hata oluştu:', error);
        throw error;
    }
}

// Uygulama başlangıcında bağlantıyı oluşturun
initializeConnection();
app.use(userRoutes); 
app.use(adminRoutes); 


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
