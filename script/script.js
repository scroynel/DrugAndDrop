
var dropArea = document.getElementById("drop-area");
var progressBar = document.getElementById('progress-bar');
var uploadProgress = [];

dropArea.addEventListener('drop', handleDrop, false);


['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false); 
  document.body.addEventListener(eventName, preventDefaults, false);
});

//Подсвечиваемая область при перетаскивании
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false);
});


function preventDefaults (e) {
  e.preventDefault();
  e.stopPropagation();
}

function highlight(e) {
  dropArea.classList.add('highlight');
}

function unhighlight(e) {
  dropArea.classList.remove('highlight');
}

function handleDrop(e) {
  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}


function initializeProgress(numFiles) {
  progressBar.value = 0;
  uploadProgress = [];

  for(var i = numFiles; i > 0; i--) {
    uploadProgress.push(0);
  }
};

function updateProgress(fileNumber, percent) {
  uploadProgress[fileNumber] = percent;
  var total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length;
  progressBar.value = total;
};

function handleFiles(files) {
  files = [...files];
  initializeProgress(files.length);
  files.forEach(uploadFile);
  files.forEach(previewFile);;
};

function previewFile(file) {
  var reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function() {
    var img = document.createElement('img');
    img.src = reader.result;
    document.getElementById('gallery').appendChild(img);
  };
};

function uploadFile(file, i) {
  var url = 'Ваш URL для загрузки файлов ';
  var xhr = new XMLHttpRequest();
  var formData = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

  //Обновление прогресса
  xhr.upload.addEventListener("progress", function(e) {
    updateProgress(i, (e.loaded * 100.0 / e.total) || 100);
  });

  xhr.addEventListener('readystatechange', function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      updateProgress(i, 100);
    }else if(xhr.readyState == 4 && xhr.status != 200) {
        //Ошибка. Проинформировать пользователя.
    }
  })

  formData.append('file', file)
  xhr.send(formData)
}