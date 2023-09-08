document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('videoElement');
    const startButton = document.getElementById('startButton');
    const takePhotoButton = document.getElementById('takePhotoButton');
    const photoContainer = document.getElementById('photoContainer');
    const fileInput = document.getElementById('fileInput');
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const emailForm = document.getElementById('emailForm');
    const capturedImages = []; // Esta matriz almacenará los imageDataUrls

    function showMessage(message, isSuccess) {
        const messageContainer = document.createElement('div');
        messageContainer.textContent = message;
        messageContainer.classList.add('message');
        if (isSuccess) {
            messageContainer.classList.add('success');
        } else {
            messageContainer.classList.add('error');
        }

        document.body.appendChild(messageContainer);

        setTimeout(() => {
            document.body.removeChild(messageContainer);
        }, 3000);
    }

    fileInput.addEventListener('change', function (event) {
        const selectedFiles = event.target.files;
        if (selectedFiles.length > 0) {
            for (const selectedFile of selectedFiles) {
                const fileReader = new FileReader();
                fileReader.onload = function () {
                    const imageDataUrl = fileReader.result;
                    displayImage(imageDataUrl);
                };
                fileReader.readAsDataURL(selectedFile);
            }
        }
    });

    startButton.addEventListener('click', async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.play();

            const videoSettings = stream.getVideoTracks()[0].getSettings();
            canvas.width = videoSettings.width;
            canvas.height = videoSettings.height;
        } catch (error) {
            console.error('Error al acceder a la camara:', error);
        }
    });

    takePhotoButton.addEventListener('click', function () {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        displayImage(imageDataUrl);
        addImageToEmailForm(imageDataUrl);
    });

    function displayImage(imageDataUrl) {
        const imagePreview = new Image();
        imagePreview.src = imageDataUrl;
        imagePreview.classList.add('photo');

        const deleteButton = createDeleteButton(imagePreview);

        const photoContainerItem = document.createElement('div');
        photoContainerItem.classList.add('photo-item');
        photoContainerItem.appendChild(imagePreview);
        photoContainerItem.appendChild(deleteButton);

        photoContainer.appendChild(photoContainerItem);

        capturedImages.push(imageDataUrl);
    }

    function createDeleteButton(imagePreview) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => {
            const index = capturedImages.indexOf(imagePreview.src);
            if (index !== -1) {
                capturedImages.splice(index, 1);
            }
            photoContainer.removeChild(imagePreview.parentElement);
        });
        return deleteButton;
    }

    function addImageToEmailForm(imageDataUrl) {
        const imageInput = document.createElement('input');
        imageInput.type = 'hidden';
        imageInput.name = 'imageDataUrls[]'; // Use un arreglo para múltiples imágenes
        imageInput.value = imageDataUrl;
        emailForm.appendChild(imageInput);
    }
});
