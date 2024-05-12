function openModal(title) {
  document.getElementById('modalContent').innerHTML = '<p>Modal içeriği: ' + title + '</p>';
  document.getElementById('myModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('myModal').style.display = 'none';
}

var checkbox = document.getElementById('filterCheckbox');
var date = document.getElementById('date');
var brans = document.getElementById('brans');

checkbox.addEventListener('click', function() {

      date.value="";
      brans.value="";
  
});