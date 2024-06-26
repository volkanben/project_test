const express = require("express");
const router = express.Router();
const db = require("../data/get_question");

const bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));  

router.post('/filter/:id', async (req, res) => {
  const id = req.params.id;

  const delete_aday = "DELETE FROM aday WHERE kullanici_id=?";
  const delete_test = "DELETE FROM test WHERE kullanici_id=?";
  const delete_cevap = "DELETE FROM cevap WHERE kullanici_id=?";

  try {
    const [rows1, fields1] = await db.execute(delete_aday, [id]);
    const [rows2, fields2] = await db.execute(delete_test, [id]);
    const [rows3, fields3] = await db.execute(delete_cevap, [id]);

    res.redirect('/test2');
  } catch (error) {
    console.error("Silme işlemi sırasında bir hata oluştu:", error);
    res.status(500).json({ success: false, message: "Kullanıcı silinirken bir hata oluştu." });
  }
});

router.get('/filter',async (req,res)=>{
  const query = req.query.query;
  const [rows, fields] = await db.execute(query);
  const adaylar = rows.map(row => {
  const formattedDate = new Date(row.tarih).toLocaleDateString('tr-TR');
    
    return {
        id: row.kullanici_id,
        ad: row.Ad_Soyad,
        brans: row.brans_txt,
        tel: row.tel,
        mail: row.email,
        cinsiyet: row.cinsiyet,
        adres: row.adres,
        dogum: row.dogum_tarihi,
        tarih: formattedDate,
        test_id: row.test_id
    };
  
});

const query_notification = `SELECT a.kullanici_id, CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad, t.tarih 
FROM aday a
JOIN test t ON a.kullanici_id = t.kullanici_id
WHERE okundu='0'
ORDER BY t.tarih DESC`;

const [not, field] = await db.execute(query_notification);

const unread = not.map(notification => {
const { Ad_Soyad, tarih } = notification;
const formattedDate = new Date(tarih).toLocaleDateString('tr-TR');
const formattedTime = new Date(tarih).toLocaleTimeString('tr-TR');
return {
id:notification.kullanici_id,
not_ad: Ad_Soyad,
date: formattedDate,
time: formattedTime
};
});

res.render('test_2',  { 
aday: adaylar,
unread: unread
});
});

router.post('/filter', async (req,res)=>{
  try{
    const dateFilter = req.body.date;
    const bransFilter = req.body.brans;
    const cinsiyetFilter = req.body.cinsiyet;
    const deneyimFilter = req.body.deneyim;
    const adayName = req.body.aday_name;

    console.log(req.body);

    let query_of_filter = `
    SELECT a.kullanici_id, CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad, a.tel, a.email, a.cinsiyet, a.adres, a.dogum_tarihi, t.tarih, t.test_id, b.brans_txt
    FROM aday a
    JOIN test t ON a.kullanici_id = t.kullanici_id
    JOIN branslar b ON a.brans = b.brans_id
    `;

    let whereClause = [];

    if (adayName && adayName !== '') {
        whereClause.push(`CONCAT_WS(' ', a.ad, a.soyad) LIKE '%${adayName}%'`);
    } else {
        if (bransFilter && bransFilter !== '') {
            whereClause.push(`b.brans_id = '${bransFilter}'`);
        }

        if (cinsiyetFilter && cinsiyetFilter !== '') {
            if (cinsiyetFilter === '1') {
                whereClause.push(`a.cinsiyet = 'kadın'`);
            } else if (cinsiyetFilter === '2') {
                whereClause.push(`a.cinsiyet = 'erkek'`);
            }
        }

        if (deneyimFilter && deneyimFilter !== '') {
            whereClause.push(`a.experiences = '${deneyimFilter}'`);
        }
    }

    if (whereClause.length > 0) {
        query_of_filter += ` WHERE ${whereClause.join(' AND ')}`;
    }

    if (dateFilter && dateFilter !== '') {
        if (dateFilter === '1') {
            query_of_filter += ` ORDER BY t.tarih DESC`;
        } else if (dateFilter === '2') {
            query_of_filter += ` ORDER BY t.tarih ASC`;
        }
    }

    query_of_filter += ` LIMIT 1000;`;

    console.log('Oluşturulan sorgu:', query_of_filter);

    res.redirect(`/filter?query=${encodeURIComponent(query_of_filter)}`);
  }
  catch (error) {
    console.error('İşlem sırasında bir hata oluştu: ', error);
    res.sendStatus(500); 
}
});

router.get('/new_user', async (req, res) => {
  try {
    
    res.render('new_user'); 
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

router.post('/new_user', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute(
      'INSERT INTO kurum (kurum_ad,username, password) VALUES (?, ?, ?)',
      [username,username, password]
    );

    res.redirect('/test2');
  } catch (error) {
    console.error('Yeni kullanıcı eklerken hata:', error);
    res.status(500).send('Sunucu Hatası');
  }
});

router.get('/password', async (req,res) =>{
try{
  res.render('pass_change');
}
catch (error) {
  console.error(error);
  res.status(500).send('Bir hata oluştu');
}
});

router.post('/password', async (req, res) => {
  try {
    const { username, old_password, new_password } = req.body;

   
    const query_ques = `SELECT * FROM kurum WHERE username=? AND password=?`;
    const [count_ques] = await db.execute(query_ques, [username, old_password]);

   
    if (count_ques.length > 0) {
      const query_update_password = `UPDATE kurum SET password=? WHERE username=? AND password=?`;
      await db.execute(query_update_password, [new_password, username, old_password]);
    }
    else{
      return res.status(400).send("<b>Kullanıcı adı veya eski şifre yanlış.</b>");
    }

  
    res.redirect('/test2');
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});


router.get('/test2', async (req, res) => {
 
  try {
                
            
    const get_query = `
    
    SELECT a.kullanici_id,CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad , a.tel, a.email, a.cinsiyet, a.adres, a.dogum_tarihi,t.tarih,t.test_id,b.brans_txt
    FROM aday a
    JOIN test t ON a.kullanici_id = t.kullanici_id
    join branslar b on a.brans = b.brans_id 
    ORDER BY t.tarih Desc
    LIMIT 0, 1000;
    `;

    
    
   
const [rows, fields] = await db.execute(get_query);


const adaylar = rows.map(row => {
    const formattedDate = new Date(row.tarih).toLocaleDateString('tr-TR');

    return {
        id: row.kullanici_id,
        ad: row.Ad_Soyad,
        brans: row.brans_txt,
        tel: row.tel,
        mail: row.email,
        cinsiyet: row.cinsiyet,
        adres: row.adres,
        dogum: row.dogum_tarihi,
        tarih: formattedDate,
        test_id: row.test_id
    };
});

const query_notification = `SELECT a.kullanici_id, CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad, t.tarih 
                            FROM aday a
                            JOIN test t ON a.kullanici_id = t.kullanici_id
                            WHERE okundu='0'
                            ORDER BY t.tarih DESC`;

const [not, field] = await db.execute(query_notification);

const unread = not.map(notification => {
  const { Ad_Soyad, tarih } = notification;
  const formattedDate = new Date(tarih).toLocaleDateString('tr-TR');
  const formattedTime = new Date(tarih).toLocaleTimeString('tr-TR');
  return {
    id:notification.kullanici_id,
    not_ad: Ad_Soyad,
    date: formattedDate,
    time: formattedTime
  };
});

res.render('test_2',  { 
  aday: adaylar,
  unread: unread
});




} catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});


router.get('/test/:id', async (req,res)=>{
    try{
        const test_id = req.params.id;
        const get_query=`
        SELECT a.kullanici_id, CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad, b.brans_txt, a.tel, a.email, a.cinsiyet, a.experiences, s.city, a.adres, a.dogum_tarihi, t.tarih
FROM aday a
JOIN test t ON a.kullanici_id = t.kullanici_id
JOIN branslar b ON a.brans = b.brans_id
JOIN sehirler s ON a.city = s.city_id
WHERE t.kullanici_id = ?
`;
      
   
        
        const [rows,fields] = await db.execute(get_query,[test_id]);
        
        const yas_value = rows[0].dogum_tarihi;



        const current_date = new Date();

        const yas_milisaniye = current_date-yas_value; 
        var yas = Math.floor(yas_milisaniye / (1000 * 60 * 60 * 24 * 365.25));

        rows[0].dogum_tarihi=yas;

        // update okunudu bilgisi 

        const query_read = `UPDATE test
        SET okundu = '1'
        WHERE kullanici_id = ?;` ;

        await db.execute(query_read,[test_id]);

      
        var planli = 0;
        var spontan = 0;
        var bagimsiz = 0;
        var uyumlu = 0;
        var anlayisli = 0;
        var disiplinli = 0;
        var geleneksel = 0;
        var modern = 0;
        var samimi = 0;
        var mesafeli = 0;
        var is_öğretmeni = 0;
        var sinif_ogretmeni = 0;
        var yuksek_ozsaygili = 0;
        var dusuk_ozsaygili = 0;
        var otokratik_ogretmen = 0;
        var sosyal_ogretmen = 0;
        var velilerle_isbirligine_acik = 0;
        var bagimsiz_calisan_ogretmen = 0;
        var duragan_ogretmen = 0;
        var gelisime_acik_ogretmen = 0;
    
    
        const query_of_test = `
        SELECT * FROM deneme.cevap 
        where kullanici_id = ?;
        `;
    
        const [info,data]= await db.execute(query_of_test,[test_id]);
        
         info.forEach(inf => {
    
            if(parseInt(inf.aSoru_id)!== null){
                switch(parseInt(inf.aSoru_id)){
            case 0:
            if(inf.aSecenek_id==1)
                planli+=parseInt(inf.secenekDeger)/2;
            else
                spontan+=parseInt(inf.secenekDeger)/2
            break;
          case 1:
            if(inf.aSecenek_id==1)
            bagimsiz+=parseInt(inf.secenekDeger)/2
            else
            uyumlu+=parseInt(inf.secenekDeger)/2
            break;
          case 2:
            if(inf.aSecenek_id==1)
            anlayisli+=parseInt(inf.secenekDeger)/2
            else
            disiplinli+=parseInt(inf.secenekDeger)/2
            break;
          case 3:
            if(inf.aSecenek_id==1)
            geleneksel+=parseInt(inf.secenekDeger)/2
            else
            modern+=parseInt(inf.secenekDeger)/2
            break;
          case 4:
            if(inf.aSecenek_id==1)
            samimi+=parseInt(inf.secenekDeger)/2
            else
            mesafeli+=parseInt(inf.secenekDeger)/2
            break;
          case 5:
            if(inf.aSecenek_id==1)
            is_öğretmeni+=parseInt(inf.secenekDeger)/2
            else
            sinif_ogretmeni+=parseInt(inf.secenekDeger)/2
            break;
          case 6:
            if(inf.aSecenek_id==1)
            yuksek_ozsaygili+=parseInt(inf.secenekDeger)/2
            else
            dusuk_ozsaygili+=parseInt(inf.secenekDeger)/2
            break;
          case 7:
            if(inf.aSecenek_id==1)
            otokratik_ogretmen+=parseInt(inf.secenekDeger)/2
            else
            sosyal_ogretmen+=parseInt(inf.secenekDeger)/2
            break;
          case 8:
            if(inf.aSecenek_id==1)
            velilerle_isbirligine_acik+=parseInt(inf.secenekDeger)/2
            else
            bagimsiz_calisan_ogretmen+=parseInt(inf.secenekDeger)/2
            break;
          case 9:
            if(inf.aSecenek_id==1)
            duragan_ogretmen+=parseInt(inf.secenekDeger)/2
            else
            gelisime_acik_ogretmen+=parseInt(inf.secenekDeger)/2
            break;
                }
            }
            
                if(parseInt(inf.bSoru_id)!==null){
                switch(parseInt(inf.bSoru_id)){
                case 0:
                        if(inf.bSecenek_id==1)
                        anlayisli+=1.5;
                        else
                        disiplinli+=1.5;
                        break;
                case 1:
                        if(inf.bSecenek_id==1)
                        spontan+=1.5;
                        else
                        planli+=1.5;
                        break;
                case 2:
                        if(inf.bSecenek_id==1)
                        geleneksel+=1.5;
                        else
                        modern+=1.5
                        break;
                case 3:
                        if(inf.bSecenek_id==1)
                        uyumlu+=1.5;
                        else
                        bagimsiz+=1.5
                        break;
                case 4:
                        if(inf.bSecenek_id==1)
                        samimi+=1.5;
                        else
                        mesafeli+=1.5
                        break;
                case 5:
                        if(inf.bSecenek_id==1)
                        dusuk_ozsaygili+=1.5;
                        else
                        yuksek_ozsaygili+=1.5
                        break;  
                case 6:
                        if(inf.bSecenek_id==1)
                        sosyal_ogretmen+=1.5;
                        else
                        otokratik_ogretmen+=1.5
                        break;
                case 7:
                        if(inf.bSecenek_id==1)
                        is_öğretmeni+=1.5;
                        else
                        sinif_ogretmeni+=1.5
                        break;
                case 8:
                        if(inf.bSecenek_id==1)
                        velilerle_isbirligine_acik+=1.5;
                        else
                        bagimsiz_calisan_ogretmen+=1.5
                        break; 
                case 9:
                        if(inf.bSecenek_id==1)
                        gelisime_acik_ogretmen+=1.5;
                        else
                        duragan_ogretmen+=1.5
                        break;          
    
                }
            
            
        }
        });
    
       types = {
            CA: {
              'planlı': planli,
              'spontan': spontan
            },
            CB: {
              'bağımsız': bagimsiz,
              'uyumlu': uyumlu
            },
            CC: {
              'anlayışlı': anlayisli,
              'disiplinli': disiplinli
            },
            CD: {
              'geleneksel': geleneksel,
              'modern': modern
            },
            CE: {
              'samimi': samimi,
              'mesafeli': mesafeli
            },
            CF: {
              'iş öğretmeni': is_öğretmeni,
              'sınıf öğretmeni': sinif_ogretmeni
            },
            CG: {
              'yüksek özsaygılı': yuksek_ozsaygili,
              'düşük özsaygılı': dusuk_ozsaygili
            },
            CH: {
              'otokratik': otokratik_ogretmen,
              'sosyal': sosyal_ogretmen
            },
            CI: {
              'işbirliğine açık': velilerle_isbirligine_acik,
              'bağımsız çalışan': bagimsiz_calisan_ogretmen
            },
            CJ: {
              'durağan': duragan_ogretmen,
              'gelişime açık': gelisime_acik_ogretmen
            }
          }
          
        
          for (var key in types) {
            if (types.hasOwnProperty(key)) {
              var currentValue = types[key];
              var smallestValue = Infinity;
              var smallestKeys = [];
              
              for (var subKey in currentValue) {
                if (currentValue.hasOwnProperty(subKey)) {
                  if (currentValue[subKey] <= smallestValue) {
                    if (currentValue[subKey] < smallestValue) {
                      smallestValue = currentValue[subKey];
                      smallestKeys = []; 
                    }
                    smallestKeys.push(subKey); // Anahtarı eşit olanlar dizisine ekliyoruz.
                  }
                }
              }
          
            
              if (smallestKeys.length === Object.keys(currentValue).length) { 
              }
          
              smallestKeys.forEach(function(sKey) {
                delete currentValue[sKey];
              });
            }
          }

          let result = [];
          Object.keys(types).forEach(key => {
            let innerData = types[key];
            Object.keys(innerData).forEach(innerKey => {
              let innerValue = innerData[innerKey];
              result.push({ [innerKey]: innerValue });
            });
          });  

          const mapValues = {
            1: 20,
            1.5: 30,
            2: 40,
            2.5: 50,
            3: 60,
            3.5: 70,
            4: 80,
            4.5: 90,
            5: 100
        };
      
        result.forEach(function(item) {
            Object.keys(item).forEach(function(key) {
                let value = item[key];
                if (value >= 5) {
                    item[key] = 100;
                } else {
                    item[key] = mapValues[value];
                }
            });
        });
        console.log(rows[0]);
    console.log(types);
        res.render('rapor', {
           aday_info:rows[0],
            types: result,
            check:types 
        });



console.log(result); 

       
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
    
router.get('/test',async (req,res)=>{
    
    
        try {
                
            
            const get_query = `
            
            SELECT a.kullanici_id,CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad , a.tel, a.email, a.cinsiyet, a.experiences, a.city, a.adres, a.dogum_tarihi,t.tarih,t.test_id,b.brans_txt
            FROM aday a
            JOIN test t ON a.kullanici_id = t.kullanici_id
            join branslar b on a.brans = b.brans_id 
            ORDER BY t.tarih ASC
            LIMIT 0, 1000;
            `;
           
            const [rows, fields] = await db.execute(get_query);
    
          
            const adaylar = rows.map(row => ({
               id:row.kullanici_id,
               ad: row.Ad_Soyad,
               brans: row.brans_txt,
               tel: row.tel,
               mail: row.email,
               cinsiyet: row.cinsiyet,
               city:row.city,
               deneyim:row.experiences,
               adres: row.adres,
               dogum: row.dogum_tarihi,
               tarih: row.tarih,
               test_id: row.test_id
    
            }));
    
            res.render('test', { 
               aday : adaylar
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        }
});

    router.post('/test', async (req, res) => {
      const username = req.body.uname;
      const password = req.body.psw;
      const query_aut = `SELECT * FROM kurum WHERE username=? AND password=?`;
  
      if (req.body.remember === 'on') {
          try {
              const results = await db.execute(query_aut, [username, password]);
              if (results[0].length > 0) {
                  res.redirect('/test2');
              } else {
                  res.status(401).json({ error: 'Kullanıcı adı veya şifre yanlış.' });
              }
          } catch (err) {
              console.error('MySQL sorgusu sırasında bir hata oluştu:', err);
              res.status(500).json({ error: 'Bir hata oluştu, lütfen tekrar deneyin.' });
          }
      } else {
          try {
              function generateSessionID() {
                  const time = new Date();
                  const year = time.getFullYear().toString();
                  const seconds = time.getSeconds().toString();
                  const milliseconds = time.getMilliseconds().toString();
                  return year + milliseconds + seconds;
              }
  
              const kullanici_id = generateSessionID();
              const inf_form = req.body;
              const { ad, soyad, brans, phone, email, gender,city, experiences, address, birthday } = inf_form;
  
              const info_query = `INSERT INTO aday (kullanici_id, ad, soyad, brans, tel, email, cinsiyet, city , experiences, adres, dogum_tarihi) VALUES (?, ? , ?, ?, ? , ?, ?, ?, ?, ?, ?);`;
              const values = [kullanici_id, ad, soyad, brans, phone, email, gender, city , experiences, address, birthday];
              
              const test_info_query = `INSERT INTO test (kullanici_id, kurum_id, tarih) VALUES (?, ?, ?)`;
              const value_test = [kullanici_id, 1, new Date()];
              
              const check = await db.execute(info_query, values);
              if (check) {
                  await db.execute(test_info_query, value_test);
                  res.redirect(`/deneme?param1=${kullanici_id}&param2=${ad}`);
              } else {
                  res.status(500).json({ error: 'Kayıt işlemi sırasında bir hata oluştu.' });
              }
          } catch (error) {
              console.error('İşlem sırasında bir hata oluştu: ', error);
              res.status(500).json({ error: 'Bir hata oluştu, lütfen tekrar deneyin.' });
          }
      }
});

router.get('/analiz',async (req,res)=>{

  try{
    const mf_percent_query = `SELECT 
    SUM(CASE WHEN cinsiyet = 'kadın' THEN 1 ELSE 0 END) AS kadın_sayısı,
    SUM(CASE WHEN cinsiyet = 'erkek' THEN 1 ELSE 0 END) AS erkek_sayısı,
    COUNT(*) AS toplam,
    (SUM(CASE WHEN cinsiyet = 'kadın' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS kadın_oranı,
    (SUM(CASE WHEN cinsiyet = 'erkek' THEN 1 ELSE 0 END) / COUNT(*)) * 100 AS erkek_oranı
    FROM aday;`

    const [inf, field] = await db.execute(mf_percent_query);

    const brans_percent_query = `
    SELECT 
    b.brans_txt,
    COUNT(*) AS brans_sayisi,
    (COUNT(*) / (SELECT COUNT(*) FROM aday)) * 100 AS brans_orani
    FROM aday a
    JOIN branslar b ON a.brans = b.brans_id
    GROUP BY b.brans_txt;` ; 

    const [bra,field1] = await db.execute(brans_percent_query);

    const deneyim_percent_query = `
    SELECT 
    CASE 
        WHEN a.experiences = '0' THEN '0'
        WHEN a.experiences = '1' THEN '1-3'
        WHEN a.experiences = '2' THEN '4-6'
        WHEN a.experiences = '3' THEN '7-9'
        WHEN a.experiences = '4' THEN '11-13'
        WHEN a.experiences = '5' THEN '14+'
    END AS deneyim_seviyesi,
    COUNT(*) AS deneyim_sayisi,
    (COUNT(*) / (SELECT COUNT(*) FROM aday)) * 100 AS deneyim_orani
FROM aday a
GROUP BY deneyim_seviyesi;
    `;

    const [exp,field2] = await db.execute(deneyim_percent_query);


    res.render('analiz',{
    cinsiyet:inf[0],
    branslar:bra[0],
    deneyim:exp[0]
    }
    );
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
  
 
module.exports = router;