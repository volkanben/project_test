
const express = require("express");
const router = express.Router();
const db = require("../data/get_question");


const bodyParser = require("body-parser");

// Body-parser middleware'ini kullanarak JSON verilerini ayrıştır
router.use(bodyParser.json());


router.get('/deneme', async (req, res) => {
    try {
   
        const query = `
        SELECT s.soru_ıd,
       s.soruTxt,
       
       MAX(CASE WHEN se.soru_id = s.soru_ıd AND se.secenek_id = 1 THEN se.aSecenekTxt ELSE NULL END) AS secenek_1,
       MAX(CASE WHEN se.soru_id = s.soru_ıd AND se.secenek_id = 2 THEN se.aSecenekTxt ELSE NULL END) AS secenek_2
FROM sorua s
LEFT JOIN seceneka se ON s.soru_ıd = se.soru_id
GROUP BY s.soru_ıd, s.soruTxt
ORDER BY s.soru_ıd;

  
        `;
        const [rows, fields] = await db.execute(query);

       
        const sorularCevaplar = rows.map(row => ({
            soru_id: row.soru_id,
            soru: row.soruTxt,
            secenek1: row.secenek_1,
            secenek2: row.secenek_2
        }));

        const query_yn = `Select * from deneme.sorub`;

        const [yes_no,] = await db.execute(query_yn);

        const evet_hayir = yes_no.map(row => ({
            bsoru:row.bSoruTxt
        }));
        const userID =req.query.param1;
        const name=req.query.param2;
       
        

        res.render('quiz-deneme.ejs', { 
            sorularCevaplar: sorularCevaplar, 
            evet_hayir: evet_hayir,
            name:name,
            kullanici_id:userID

        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
// POST isteği geldiğinde bu endpoint çalışır
router.post('/deneme', async (req, res) => {
    try {
        const formDataArray = req.body;
     
        console.log(formDataArray);
        
        const sql = `INSERT INTO cevap (kullanici_id, aSoru_id, aSecenek_id, secenekDeger, bSoru_id , bSecenek_id) VALUES (?, ?, ?, ?, ?, ?)`;

        for (const formData of formDataArray) {
            // formData içindeki anahtar-değer çiftlerini döngüye al
            for (const [key, value] of Object.entries(formData)) {
                // Anahtarın başlangıcını belirle: 'a' veya 'b'
                const category = key.charAt(0);
                 var sonFormData = formDataArray[formDataArray.length - 1];

                 // Son formData içindeki kullanici_id'yi alma
                 var kullanici_id = sonFormData.kullanici_id;
                 
                if (category === 'a' || category === 'b') {
                    const soru_id = parseInt(key.split('-')[1]);
                    const secenek_id = category === 'a' ? 1 : 2; // 'a-' ise 1, 'b-' ise 2
                    const secenekDeger = value;
            
                    const values = [kullanici_id, soru_id, secenek_id, secenekDeger];
                    const sql = `INSERT INTO cevap (kullanici_id, aSoru_id, aSecenek_id, secenekDeger) VALUES (?, ?, ?, ?)`;
            
                    // INSERT sorgusunu çalıştırın
                    db.query(sql, values, (err, results, fields) => {
                        if (err) {
                            console.error('INSERT işlemi başarısız oldu: ' + err.message);
                            return;
                        }
                        console.log('Veri başarıyla eklendi. Eklenen kayıt ID: ' + results.insertId);
                    });
                } else if (category === 'e') {
                    const bSoru_id = parseInt(key.split('-')[1]);
                    const bSecenek_id = value === 'Evet' ? 1 : 0; // Evet ise 1, Hayır ise 0
                    const values = [kullanici_id, bSoru_id, bSecenek_id];
                    const sql = `INSERT INTO cevap (kullanici_id, bSoru_id, bSecenek_id) VALUES (?, ?, ?)`;

                    // INSERT sorgusunu çalıştırın
                    db.query(sql, values, (err, results, fields) => {
                        if (err) {
                            console.error('INSERT işlemi başarısız oldu: ' + err.message);
                            return;
                        }
                        console.log('Veri başarıyla eklendi. Eklenen kayıt ID: ' + results.insertId);
                    });
                }
            }
        }
        
        

        // Başarılı bir şekilde aldığınızı belirten bir yanıt gönderin
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/', (req, res) => {
    res.render('index');
  });
  

  module.exports = router;