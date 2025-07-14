document.addEventListener('DOMContentLoaded', () => {
    const uploadButton = document.getElementById('upload-button');
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const uploadForm = document.getElementById('upload-form');

    uploadButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (event) => {
        handleFiles(event.target.files);
    });

    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        dropZone.classList.remove('dragover');
        handleFiles(event.dataTransfer.files);
    });

    uploadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const files = fileInput.files;
        if (!files.length) {
            alert("Please select a file to upload.");
            return;
        }
        handleFiles(files);
    });

    const handleFiles = (files) => {
        const fabric = document.getElementById('fabric').value.trim();
        const cost = document.getElementById('cost').value.trim();
        const availability = document.getElementById('availability').value;

        if (!fabric || !cost || !availability) {
            alert("Please fill in all the details.");
            return;
        }

        const validFiles = Array.from(files).filter(file => {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) && !file.name.toLowerCase().endsWith('.dxf')) {
                console.warn(`Unsupported file type skipped: ${file.name}`);
                return false;
            }
            return true;
        });

        if (!validFiles.length) return;

        let filesProcessed = 0;
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const design = {
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    dataUrl: e.target.result,
                    uploadDate: new Date().toLocaleDateString(),
                    rating: 0,
                    fabric: fabric,
                    cost: cost,
                    availability: availability
                };

                let designs = getDesigns();
                designs.push(design);
                saveDesigns(designs);

                filesProcessed++;
                if (filesProcessed === validFiles.length) {
                    alert(`${filesProcessed} design(s) uploaded successfully!`);
                    uploadForm.reset();
                }
            };
            reader.readAsDataURL(file);
        });

        fileInput.value = '';
    };
});
