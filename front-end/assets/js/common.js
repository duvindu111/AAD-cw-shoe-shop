function displaySelectedFile(element) {
    const selectedFile = element.files[0];
    const selectedFileContainer = $(element).next('input');
    selectedFileContainer.val(selectedFile.name); // Use jQuery's text() method
}