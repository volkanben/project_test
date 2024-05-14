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

 res.render('test_2', { 
    aday : adaylar
 });
})


router.post('/filter', async (req,res)=>{
  try{
const date_filter = req.body.date;
const brans_filter = req.body.brans;
const aday_name = req.body.aday_name;
console.log(req.body);
let query_of_filter = `
  SELECT a.kullanici_id, CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad, a.tel, a.email, a.cinsiyet, a.adres, a.dogum_tarihi, t.tarih, t.test_id, b.brans_txt
  FROM aday a
  JOIN test t ON a.kullanici_id = t.kullanici_id
  JOIN branslar b ON a.brans = b.brans_id
`;
if (typeof aday_name !== 'undefined' && aday_name !== '') {
  query_of_filter += ` WHERE CONCAT_WS(' ', ad, soyad) = '${aday_name}'`;
}

else{
if (date_filter !== '' && brans_filter !== '') {
  query_of_filter += ` WHERE `;
  query_of_filter += `b.brans_id = '${brans_filter}'`;

  if (date_filter === '1') {
    query_of_filter += ` ORDER BY t.tarih DESC`;
  } else if (date_filter === '2') {
    query_of_filter += ` ORDER BY t.tarih ASC`;
  }
} else if (brans_filter === '') {
  if (date_filter === '1') {
    query_of_filter += ` ORDER BY t.tarih DESC`;
  } else if (date_filter === '2') {
    query_of_filter += ` ORDER BY t.tarih ASC`;
  }
} else {
  query_of_filter += ` WHERE b.brans_id = '${brans_filter}'`;
}
}

  

query_of_filter += ` LIMIT 1000;`;

console.log('Oluşturulan sorgu:', query_of_filter);

res.redirect(`/filter?query=${encodeURIComponent(query_of_filter)}`);

  }
  catch (error) {
    console.error('İşlem sırasında bir hata oluştu: ', error);
    res.sendStatus(500); // Sunucu hatası durum kodu gönder
}
});

router.get('/test2', async (req, res) => {
 
  try {
                
            
    const get_query = `
    
    SELECT a.kullanici_id,CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad , a.tel, a.email, a.cinsiyet, a.adres, a.dogum_tarihi,t.tarih,t.test_id,b.brans_txt
    FROM aday a
    JOIN test t ON a.kullanici_id = t.kullanici_id
    join branslar b on a.brans = b.brans_id 
    ORDER BY t.tarih ASC
    LIMIT 0, 1000;
    `;
   
const [rows, fields] = await db.execute(get_query);

// rows içindeki verileri kullanarak HTML şablonunu oluşturabilirsiniz
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


    res.render('test_2', { 
       aday : adaylar
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
        SELECT a.kullanici_id, CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad ,b.brans_txt, a.tel, a.email, a.cinsiyet, a.adres, a.dogum_tarihi, t.tarih 
        FROM aday a
        JOIN test t ON a.kullanici_id = t.kullanici_id 
        JOIN branslar b ON a.brans=b.brans_id
        WHERE t.kullanici_id =?`;
    
        
        const [rows,fields] = await db.execute(get_query,[test_id]);
        
        const yas_value = rows[0].dogum_tarihi;


        const current_date = new Date();

        const yas_milisaniye = current_date-yas_value; 
        var yas = Math.floor(yas_milisaniye / (1000 * 60 * 60 * 24 * 365.25));

        rows[0].dogum_tarihi=yas;


        // Öğretmen tipi paun toplamları tanımlama
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
        var yüksek_özsaygili = 0;
        var düsük_özsaygili = 0;
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
            yüksek_özsaygili+=parseInt(inf.secenekDeger)/2
            else
            düsük_özsaygili+=parseInt(inf.secenekDeger)/2
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
                        düsük_özsaygili+=1.5;
                        else
                        yüksek_özsaygili+=1.5
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
              planli: planli,
              spontan: spontan
            },
            CB: {
              bagimsiz: bagimsiz,
              uyumlu: uyumlu
            },
            CC: {
              anlayisli: anlayisli,
              disiplinli: disiplinli
            },
            CD: {
              geleneksel: geleneksel,
              modern: modern
            },
            CE: {
              samimi: samimi,
              mesafeli: mesafeli
            },
            CF: {
              is_öğretmeni: is_öğretmeni,
              sinif_ogretmeni: sinif_ogretmeni
            },
            CG: {
              yüksek_özsaygili: yüksek_özsaygili,
              düsük_özsaygili: düsük_özsaygili
            },
            CH: {
              otokratik_ogretmen: otokratik_ogretmen,
              sosyal_ogretmen: sosyal_ogretmen
            },
            CI: {
              velilerle_isbirligine_acik: velilerle_isbirligine_acik,
              bagimsiz_calisan_ogretmen: bagimsiz_calisan_ogretmen
            },
            CJ: {
              duragan_ogretmen: duragan_ogretmen,
              gelisime_acik_ogretmen: gelisime_acik_ogretmen
            }
          }
          
        
          for (var key in types) {
            if (types.hasOwnProperty(key)) {
              var currentValue = types[key];
              var smallestValue = Infinity;
              var smallestKeys = []; // Eşit olan diğer anahtarları saklamak için bir dizi oluşturuyoruz.
              
              for (var subKey in currentValue) {
                if (currentValue.hasOwnProperty(subKey)) {
                  if (currentValue[subKey] <= smallestValue) { // Küçük veya eşit olanları kontrol ediyoruz.
                    if (currentValue[subKey] < smallestValue) { // Eğer küçükse, en küçük değeri güncelliyoruz.
                      smallestValue = currentValue[subKey];
                      smallestKeys = []; // Eşit olan anahtarları temizliyoruz.
                    }
                    smallestKeys.push(subKey); // Anahtarı eşit olanlar dizisine ekliyoruz.
                  }
                }
              }
          
              // En küçük değere sahip anahtarları silme işlemi
              if (smallestKeys.length === Object.keys(currentValue).length) { // Eğer en küçük anahtar sayısı, tüm anahtar sayısına eşitse, hiçbir anahtar silinmez.
                continue;
              }
          
              smallestKeys.forEach(function(sKey) {
                delete currentValue[sKey];
              });
            }
          }
       
    console.log(types);
        res.render('test-details', {
           aday_info:rows[0],
        types:types
        })
       
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    });
    
    
    router.get('/test',async (req,res)=>{
    
    
        try {
                
            
            const get_query = `
            
            SELECT a.kullanici_id,CONCAT(a.ad, ' ', a.soyad) AS Ad_Soyad , a.tel, a.email, a.cinsiyet, a.adres, a.dogum_tarihi,t.tarih,t.test_id,b.brans_txt
            FROM aday a
            JOIN test t ON a.kullanici_id = t.kullanici_id
            join branslar b on a.brans = b.brans_id 
            ORDER BY t.tarih ASC
            LIMIT 0, 1000;
            `;
           
            const [rows, fields] = await db.execute(get_query);
    
            // rows içindeki verileri kullanarak HTML şablonunu oluşturabilirsiniz
            const adaylar = rows.map(row => ({
               id:row.kullanici_id,
               ad: row.Ad_Soyad,
               brans: row.brans_txt,
               tel: row.tel,
               mail: row.email,
               cinsiyet: row.cinsiyet,
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
 

 
    router.post('/test',async (req,res)=>{
      
      const username = req.body.uname;
      const password = req.body.psw;

      

  
      
  
      const query_aut = `Select * from kurum 
      Where username=? and password=?`;
      
      if(req.body.remember==='on'){
     try {
          const results = await db.execute(query_aut, [username, password]);
          console.log('res',results);
          if (results[0].length > 0) {
              // Doğru kimlik doğrulaması yapıldığında "/test" sayfasına yönlendir
              res.redirect('/test');
          }else{
            res.status(401).send({error:'Kullanıcı adı veya şifre yanlış.'});
            return;

          }
     } catch (err) {
          console.error('MySQL sorgusu sırasında bir hata oluştu:', err);
          res.status(500).send('Bir hata oluştu, lütfen tekrar deneyin.');
     }
    }else{
      try{
        function generateSessionID() {
          const time = new Date();
          const year = time.getFullYear().toString();
          const seconds = time.getSeconds().toString();
          const milliseconds = time.getMilliseconds().toString();
          return year + milliseconds + seconds;

          // altı milyonda bir ihtimalle aynı saniye ve salisede butona tıklanabilir.
      }
      
        kullanici_id = generateSessionID();

      console.log('req',req.body);
      
      const inf_form = req.body;
      const { ad, soyad, brans, phone, email, gender, address, birthday } = inf_form;

    
      

      const info_query = `INSERT INTO aday (kullanici_id, ad, soyad, brans, tel, email, cinsiyet, adres, dogum_tarihi) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
      const values = [kullanici_id, ad, soyad, brans, phone, email, gender, address, birthday];
        
      const test_info_query=`INSERT INTO test (kullanici_id,kurum_id,tarih) VALUES (?,?,?)`;
      const value_test = [kullanici_id,1,new Date()]
      const check = db.execute(info_query,values);

      if(check){
        db.execute(test_info_query,value_test);
        res.redirect(`/deneme?param1=${kullanici_id}&param2=${ad}`);

      }
      else if(err){
        console.log(err);
      }
      

        
      }
  
   catch (error) {
      console.error('İşlem sırasında bir hata oluştu: ', error);
      res.sendStatus(500); // Sunucu hatası durum kodu gönder
  }
    
   }
  });
 
module.exports = router;