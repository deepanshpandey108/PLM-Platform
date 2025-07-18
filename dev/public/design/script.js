// script.js
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadButton = document.getElementById('upload-button');
    const fileInput = document.getElementById('file-input');
    const designGallery = document.getElementById('design-gallery');
    const placeholder = document.getElementById('placeholder');
    const searchInput = document.getElementById('search-input');
    const themeToggle = document.getElementById('theme-toggle');

    // --- LocalStorage Functions ---
    const getDesigns = () => JSON.parse(localStorage.getItem('designs')) || [];
    const saveDesigns = (designs) => localStorage.setItem('designs', JSON.stringify(designs));

    // --- Core Functions ---
    const updatePlaceholderVisibility = () => {
        const designs = getDesigns();
        if (placeholder) {
            placeholder.style.display = designs.length === 0 ? 'flex' : 'none';
        }
    };

    const deleteDesign = (id) => {
        let designs = getDesigns();
        designs = designs.filter(design => design.id !== id);
        saveDesigns(designs);

        const cardToRemove = designGallery.querySelector(`[data-id='${id}']`);
        if (cardToRemove) {
            cardToRemove.remove();
        }
        updatePlaceholderVisibility();
    };

    const addDesignCard = (design) => {
        const card = document.createElement('div');
        card.className = 'design-card bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition hover:scale-105 hover:shadow-xl flex flex-col';
        card.setAttribute('data-filename', design.name.toLowerCase());
        card.setAttribute('data-id', design.id);

        const fileInfoContainer = document.createElement('div');
        fileInfoContainer.className = 'p-4 border-t border-gray-200 dark:border-gray-700 flex-grow flex flex-col justify-between';

        const fileName = document.createElement('h4');
        fileName.className = 'text-sm font-semibold truncate';
        fileName.textContent = design.name;

        const fileMeta = document.createElement('p');
        fileMeta.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1';
        const fileType = design.name.split('.').pop().toUpperCase();
        const fileSize = (design.size / 1024).toFixed(1) + ' KB';
        fileMeta.textContent = `${fileType} • ${fileSize}`;

        const uploadDate = document.createElement('p');
        uploadDate.className = 'text-xs text-gray-400 dark:text-gray-500 mt-2';
        uploadDate.textContent = `Uploaded: ${design.uploadDate}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'mt-4 text-xs text-red-600 hover:underline self-end';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteDesign(design.id);

        fileInfoContainer.append(fileName, fileMeta, uploadDate, deleteBtn);

        // Previewer
        if (design.type.startsWith('image/')) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'aspect-w-1 aspect-h-1 w-full bg-gray-200 dark:bg-gray-700';
            const img = document.createElement('img');
            img.src = design.dataUrl;
            img.alt = design.name;
            img.className = 'w-full h-full object-cover';
            imageContainer.appendChild(img);
            card.appendChild(imageContainer);
        } else { // DXF or other files
            const dxfPlaceholder = document.createElement('div');
            dxfPlaceholder.className = 'aspect-w-1 aspect-h-1 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center';
            dxfPlaceholder.innerHTML = `<svg class="w-16 h-16 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`;
            card.appendChild(dxfPlaceholder);
        }
        
        card.appendChild(fileInfoContainer);
        designGallery.appendChild(card);
    };

    const handleFiles = (files) => {
        Array.from(files).forEach(file => {
            if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type) && !file.name.toLowerCase().endsWith('.dxf')) {
                console.warn(`Unsupported file type: ${file.name}`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const design = {
                    id: Date.now() + Math.random(), // Unique ID
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    dataUrl: e.target.result,
                    uploadDate: new Date().toLocaleDateString()
                };
                
                let designs = getDesigns();
                designs.push(design);
                saveDesigns(designs);
                addDesignCard(design);
                updatePlaceholderVisibility();
            };
            reader.readAsDataURL(file);
        });
        fileInput.value = ''; // Reset input
    };

    // --- Initial Load ---
    const loadInitialDesigns = () => {
        const designs = getDesigns();
        designs.forEach(addDesignCard);
        updatePlaceholderVisibility();
    };
    
    // --- Event Listeners ---
    uploadButton.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (event) => handleFiles(event.target.files));

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.design-card').forEach(card => {
            const fileName = card.getAttribute('data-filename');
            card.style.display = fileName.includes(query) ? '' : 'none';
        });
    });

    themeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });

    // --- Drag and Drop Event Listeners ---
    const dropZone = document.body; // Allow dropping anywhere on the page
    
    dropZone.addEventListener('dragover', (event) => {
        event.preventDefault();
        placeholder.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', (event) => {
        // Check if the leave event is not going to a child element
        if (!dropZone.contains(event.relatedTarget)) {
            placeholder.classList.remove('dragover');
        }
    });

    dropZone.addEventListener('drop', (event) => {
        event.preventDefault();
        placeholder.classList.remove('dragover');
        handleFiles(event.dataTransfer.files);
    });

    // --- Theme and Initial Setup ---
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.classList.remove('dark');
    }
    
    loadInitialDesigns();
});