document.addEventListener('DOMContentLoaded', () => {
    // Yeni bildirim ekleyen fonksiyon
    function addNotification(message) {
        var notificationList = document.getElementById("notificationList");
        var listItem = document.createElement("li");
        listItem.classList.add("list-group-item");
        listItem.textContent = message;
        notificationList.appendChild(listItem);
    }

    // Örnek bir bildirim ekleyelim
    addNotification("Yeni bir rapor eklendi - Rapor No: 0004");


    // Burası kayıtların detay bilgilerinin js kodları
    
        document.querySelectorAll('.detail-btn').forEach((button) => {
            button.addEventListener('click', (event) => {
                var rowData = JSON.parse(event.target.getAttribute('name'));
                // Modal içindeki input alanlarına ilgili verileri yaz
                document.getElementById('ad').value = rowData.ad;
                document.getElementById('eposta').value = rowData.mail;
                document.getElementById('tel').value = rowData.tel; 
                document.getElementById('brans-detail').value = rowData.brans;
                document.getElementById('tarih').value = rowData.tarih;
            });
        });
    });
    
    
    
    
    
      

