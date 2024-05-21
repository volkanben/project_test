

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




document.getElementById('id03').onclick = function() {
  document.getElementById('id01').style.display = "block";
}

document.getElementById('id04').onclick = function() {
  document.getElementById('id02').style.display = "block";
}
  

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = {};
  formData.forEach((value, key) => data[key] = value);

  try {
      const response = await fetch(this.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
      });

      if (!response.ok) {
          const result = await response.json();
          showError(result.error);
      } else {
          window.location.href = '/test2';
      }
  } catch (error) {
    console.log(error);
      showError('Bir hata oluştu, lütfen tekrar deneyin.');
  }
});

function showError(message) {
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}


function validateYear() {
  var yearInput = document.getElementById("birthday").value;
  var yearlength = yearInput.substring(4,5);
  var year = yearInput.substring(0,4);
  var currentYear = new Date().getFullYear();
  var age = currentYear - year;
  var dateError = document.getElementById("date-error");
  if (age >= 22 && age <= 55 && yearlength=='-') {
      dateError.style.display = "none";
      document.getElementById('btn').disabled = false;
  } else {
      dateError.style.display = "block";
      document.getElementById('btn').disabled = true;
  }
}



function onlyLetters(input) {
  var regex = /[^a-zA-ZğüşöçĞÜŞİÖÇ]/g;
  input.value = input.value.replace(regex, "");
}

var emo_tag = document.querySelector('.emo')
var pass_input = document.querySelector('.psw1')
emo_tag.addEventListener('click',function(){
  if(pass_input.type!='text'){
  pass_input.setAttribute('type','text');
}
else {
  pass_input.setAttribute('type','password');
}
});
