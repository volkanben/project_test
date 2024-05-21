

document.getElementById('insert_btn').addEventListener('click', function() {
    var gonderButonu = document.getElementById("insert_btn");
    if (gonderButonu) {
          
        
    } else {
        console.error("insert_btn id'sine sahip bir düğme bulunamadı.");
    }

    var formDataArray = []; 

    
    var forms = document.querySelectorAll('.form');

   
    forms.forEach(function(form) {
        var formData = {}; 

      
        var inputs = form.querySelectorAll('input');
       
      
        inputs.forEach(function(input) {
          
            if (input.type === 'radio' && input.checked) {
              
                formData[input.name] = input.value;
            }
        });

        formDataArray.push(formData);
    });

  
    var form_eh = document.querySelectorAll('.form2');

    form_eh.forEach(function(form) {
        var formData_eh = {};
    
        var inputs_eh = form.querySelectorAll('input');
    
        inputs_eh.forEach(function(input) {
            if (input.type === 'radio' && input.checked) {
                formData_eh[input.name] = input.value;
            }
        });
    
        formDataArray.push(formData_eh);
    });
    
    var hiddenInput = document.querySelector('input[name="kullanici_id"]');
    var kullanici_id_info = {};
     kullanici_id_info[hiddenInput.name]=hiddenInput.value;

     formDataArray.push(kullanici_id_info);
     console.log(formDataArray); 
     
  
var emptyQuestion = 0;

function isFormDataArray(formDataArray) {
    for (var i = 0; i < formDataArray.length; i++) {
        var obj = formDataArray[i];
        var keys = Object.keys(obj);
        if (keys.length === 0) {
            emptyQuestion += 1;
        }
    }
}

isFormDataArray(formDataArray);

if (emptyQuestion === 0) {
    document.getElementById('id01').style.display = "block";
   
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/deneme', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            console.log('Form verileri sunucuya başarıyla gönderildi:');
            console.log(formDataArray); 

        } else {
            console.error('Form verileri sunucuya gönderilirken bir hata oluştu.');
        }
    };
    xhr.send(JSON.stringify(formDataArray));

} else {
    document.getElementById('id02').style.display = "block";
}


  

    
});
