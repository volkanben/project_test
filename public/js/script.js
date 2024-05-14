

var iller = [
    "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
    "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır",
    "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay",
    "Isparta", "Mersin", "İstanbul", "İzmir", "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir", "Kocaeli",
    "Konya", "Kütahya", "Malatya", "Manisa", "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu",
    "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Şanlıurfa",
    "Uşak", "Van", "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman", "Kırıkkale", "Batman", "Şırnak", "Bartın",
    "Ardahan", "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye", "Düzce"
  ];

  var select = document.getElementById("sehirler");
  for (var i = 0; i < iller.length; i++) {
    var option = document.createElement("option");
    option.text = iller[i];
    option.value = i + 1;
    select.appendChild(option);
  }






var modal = document.getElementById('id01');


window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

  var modal2 = document.getElementById('id02');


  window.onclick = function(event) {
      if (event.target == modal2) {
          modal2.style.display = "none";
      }
  }

    // id03 butonunu tıkladığında id01 modalını aç
document.getElementById('id03').onclick = function() {
  document.getElementById('id01').style.display = "block";
}

// id04 butonunu tıkladığında id02 modalını aç
document.getElementById('id04').onclick = function() {
  document.getElementById('id02').style.display = "block";
}
  

