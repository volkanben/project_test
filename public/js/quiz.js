document.addEventListener("DOMContentLoaded", function() {
    // Tüm board div'lerini seçin
    var boards = document.querySelectorAll('.board');

    boards.forEach(function(board) {
        

        var ans1 = board.querySelector(".ans-1");
        var ans2 = board.querySelector(".ans-2");

        
        var gizliDiv1 = board.querySelector(".answer-radio-1");
        var hideDiv = board.querySelector(".answer-radio-2");
        

        
          
            ans1.addEventListener("click", function() {
                gizliDiv1.style.visibility = "visible";
                hideDiv.style.visibility = "hidden";
            });
        
            ans2.addEventListener("click", function() {
                hideDiv.style.visibility = "visible"; 
                gizliDiv1.style.visibility = "hidden";
            });
        

        

      
        
        

     
             const radioButonlar = document.querySelectorAll('input[type="radio"]');

             

         
             radioButonlar.forEach(function(radio) {
                 radio.addEventListener('change', function() {
                     // Radyo düğmesinin adından indeks değeri alınır
                     var index = radio.getAttribute('name').split('-').pop();
                     
                     // a ve b radyo düğmelerinin toplamı sekize eşit veya daha azsa
                     var aRadioButtonName = 'a-' + index;
                     var bRadioButtonName = 'b-' + index;
                     var aRadioButton = document.querySelector('input[name="' + aRadioButtonName + '"]:checked');
                     var bRadioButton = document.querySelector('input[name="' + bRadioButtonName + '"]:checked');
               
                    

                     if (aRadioButton && bRadioButton) {
                         var aRadioButtonValue = parseInt(aRadioButton.value);
                         var bRadioButtonValue = parseInt(bRadioButton.value);
                         
                         if (aRadioButtonValue + bRadioButtonValue <= 8) {
                             // Bir sonraki forma kaydır
                             var nextFormIndex = parseInt(index)+1;
                             var nextFormId = '#form' + nextFormIndex;
                             var nextForm = document.querySelector(nextFormId);
                             if (nextForm) {
                                const yOffset = -100; // 100 piksel yukarıda duracak şekilde ayarla
                                const y = nextForm.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                window.scrollTo({ top: y, behavior: 'smooth' });
                            }
                         }
                         else
                        {
                            window.alert("Çift cevaplı soruların değerleri toplamı maximum 8 olmalıdır");
                            bRadioButton.checked=false;
                        }
                         }
                       
                       
                        
                        
                        
                    
                 });
             });
             
             
             const eh_radiobuttonlar = document.querySelectorAll('.form2 input[type="radio"]');
             eh_radiobuttonlar.forEach(function(radio) {
                 radio.addEventListener('change', function() {
                     var index = radio.getAttribute('name').split('-').pop();
                     var e_RadioButtonName = 'e-' + index;
                     var eRadioButton = document.querySelector('.form2 input[name="' + e_RadioButtonName + '"]:checked');
             
                     if (eRadioButton) {
                         var nextFormIndex = parseInt(index) + 1;
                         var nextFormId = '#form2' + nextFormIndex;
                         var nextForm = document.querySelector(nextFormId);
             
                         if (nextForm) {
                             const yOffset = -100; // 50 piksel yukarıda duracak şekilde ayarla
                             const y = nextForm.getBoundingClientRect().top + window.pageYOffset + yOffset;
                             window.scrollTo({ top: y, behavior: 'smooth' });
                         }
                     }
                 });
             });
             


    });


});
function kontrolEt() {
    // Tüm radio düğmelerini seçin
    var radioDugmeleri = document.querySelectorAll('input[type="radio"]');

    // Her radio düğmesini dolaşın
    radioDugmeleri.forEach(function(radioButton) {
        // Eğer bir radio düğmesi seçiliyse
        if (radioButton.checked) {
            // Radio düğmesinin değerini ve adını alın
            var deger = radioButton.value;
            var isim = radioButton.name;

            // Radio düğmesinin formunun kimliğini alın
            var formId = radioButton.closest('form').id;

            // Konsola seçilen radio düğmesinin bilgilerini ve hangi formda olduğunu yazdırın
            console.log("Form ID: " + formId + ", Soru ID: " + isim.split("-")[1] + ", Cevap Değeri: " + deger);
        }
    });
}



