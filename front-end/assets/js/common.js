function displaySelectedFile(element) {
    const selectedFile = element.files[0];
    const selectedFileContainer = $(element).next('input');
    selectedFileContainer.val(selectedFile.name);
}

// Function to convert File to Base64 string
function fileToBase64(file, callback) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        let base64ProfilePic = reader.result.split(',')[1];
        callback(base64ProfilePic);
    };
    reader.onerror = function (error) {
        console.error('Error occurred while reading the file:', error);
    };
}