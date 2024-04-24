

document.getElementById('gonder-butonu').addEventListener('click', function() {
    var gonderButonu = document.getElementById("gonder-butonu");
    if (gonderButonu) {
        gonderButonu.addEventListener("click", function() {
            // Düğmeye tıklandığında yapılacak işlemler
        });
    } else {
        console.error("gonder-butonu id'sine sahip bir düğme bulunamadı.");
    }

    var formDataArray = []; // Tüm form verilerini saklamak için boş bir dizi oluştur

    // Tüm formları seç
    var forms = document.querySelectorAll('.form');

    // Her bir formu döngüye alarak işlem yap
    forms.forEach(function(form) {
        var formData = {}; // Her form için boş bir form verileri nesnesi oluştur

        // Form içindeki tüm input elemanlarını seç
        var inputs = form.querySelectorAll('input');

        // Her bir input elemanını döngüye alarak işlem yap
        inputs.forEach(function(input) {
            // Eğer input bir radio düğmesi ise ve seçili ise
            if (input.type === 'radio' && input.checked) {
                // Form verilerine input'un adını ve değerini ekle
                formData[input.name] = input.value;
            }
        });

        // Her formun verilerini ana diziye ekle
        formDataArray.push(formData);
    });

    // Diğer formu seç
    var form_eh = document.querySelectorAll('.form2');

    form_eh.forEach(function(form) {
        var formData_eh = {}; // Her form için boş bir form verileri nesnesi oluştur
    
        var inputs_eh = form.querySelectorAll('input');
    
        inputs_eh.forEach(function(input) {
            if (input.type === 'radio' && input.checked) {
                formData_eh[input.name] = input.value;
            }
        });
    
        formDataArray.push(formData_eh);
    });
    
        // Form içindeki tüm input elemanlarını seç
       

        // Her bir input elemanını döngüye alarak işlem yap
       

        // Diğer formun verilerini ana diziye ekle
        
   

    // AJAX ile sunucuya form verilerini gönderme
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/deneme', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Form verileri sunucuya başarıyla gönderildi:');
            console.log(formDataArray); // Tüm form verilerini konsola yazdır
        } else {
            console.error('Form verileri sunucuya gönderilirken bir hata oluştu.');
        }
    };
    xhr.send(JSON.stringify(formDataArray));

    
});
