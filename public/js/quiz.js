document.addEventListener("DOMContentLoaded", function() {
    // Tüm board div'lerini seçin
    var boards = document.querySelectorAll('.board');

    boards.forEach(function(board) {
        var ans1 = board.querySelector(".ans-1");
        var gizliDiv1 = board.querySelector(".answer-radio-1");
        var hideDiv = board.querySelector(".answer-radio-2");

        ans1.addEventListener("click", function() {
            gizliDiv1.style.visibility = "visible";
            hideDiv.style.visibility = "hidden";
           
        });

        var ans2 = board.querySelector(".ans-2");
        ans2.addEventListener("click", function() {
            hideDiv.style.visibility = "visible"; 
            gizliDiv1.style.visibility = "hidden";
           
        });

             // Tüm radio butonlarını seç
             const radioButonlar = board.querySelectorAll('input[type="radio"]');
             // Her radio butonuna tıklandığında
             radioButonlar.forEach(function(radio) {
                 radio.addEventListener('change', function() {
                     // İlgili radio butonunun index değerini al
                     var index = radio.getAttribute('name').split('-').pop(); // "a-1-<%= index %>" -> index
             
                     // Diğer formun id'sini al
                     var otherFormId = '#board-' + (parseInt(index));
             
                     // Diğer formu seç
                     var otherform = document.querySelector(otherFormId);
             
                     // Diğer formu görüntüle
                     if (otherform) {
                         otherform.scrollIntoView({ behavior: 'smooth', block: 'start' });
                     }
                 });
             });
             

        


    });

    const progress_bar = document.querySelector(".bar");
    const time = document.querySelector(".time");
    window.addEventListener("scroll",function(){
        if(window.scrollY>400){
            progress_bar.style.display="block";
            time.style.display="block";
            
        }
        else{
            progress_bar.style.display="none";
            time.style.display="none";
        }
    });
// Tüm radio butonlarını seçin

// Progress bar öğesini seçin
const progressBar = document.querySelector('.bar');

sorularCevaplar.forEach((soru, index) => {
    // Her form içindeki radio butonlarını seçin
    const radioButonlar = document.querySelectorAll(`#first-form${index} input[type="radio"], #second-form${index} input[type="radio"]`);

    // Progress barın artması için olay dinleyicisi ekle
    let progressIncreased = false;

    // Her form içindeki radio butonları için olay dinleyicisi ekle
    radioButonlar.forEach(function(radio) {
        radio.addEventListener('change', function() {
            // Progress bar henüz artırılmadıysa
            if (!progressIncreased) {
                // Progress barı artır
                const progressValue = ((index + 1) * 100) / sorularCevaplar.length;
                progressBar.style.width = progressValue + '%';
                progressIncreased = true;
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



