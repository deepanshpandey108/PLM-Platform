document.addEventListener('DOMContentLoaded', () => {
    const designGallery = document.getElementById('design-gallery');
    const placeholder = document.getElementById('placeholder');
    const searchInput = document.getElementById('search-input');

    const updateRating = (id, newRating) => {
        let designs = getDesigns();
        const designIndex = designs.findIndex(d => d.id === id);

        if (designIndex > -1) {
            designs[designIndex].rating = newRating;
            saveDesigns(designs);

            const card = designGallery.querySelector(`[data-id='${id}']`);
            if (card) {
                const starContainer = card.querySelector('.star-rating-container');
                const stars = starContainer.querySelectorAll('.star');
                stars.forEach((star, index) => {
                    star.classList.toggle('filled', index < newRating);
                });
            }
        }
    };

    const deleteDesign = (id) => {
        let designs = getDesigns();
        designs = designs.filter(design => design.id !== id);
        saveDesigns(designs);

        const cardToRemove = designGallery.querySelector(`[data-id='${id}']`);
        if (cardToRemove) cardToRemove.remove();

        updatePlaceholderVisibility();
    };

    const addDesignCard = (design) => {
        const card = document.createElement('div');
        card.className = 'design-card';
        card.setAttribute('data-filename', design.name.toLowerCase());
        card.setAttribute('data-id', design.id);

        // Preview section
        if (design.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = design.dataUrl;
            img.alt = design.name;
            img.className = 'w-full h-40 object-cover';
            card.appendChild(img);
        } else {
            const dxfPlaceholder = document.createElement('div');
            dxfPlaceholder.className = 'h-40 w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center';
            dxfPlaceholder.innerHTML = `<svg class="w-16 h-16 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>`;
            card.appendChild(dxfPlaceholder);
        }

        const fileInfoContainer = document.createElement('div');
        fileInfoContainer.className = 'p-4 border-t border-gray-200 dark:border-gray-700 flex-grow flex flex-col justify-between';

        const fileName = document.createElement('h4');
        fileName.className = 'text-sm font-semibold truncate';
        fileName.textContent = design.name;

        const fileMeta = document.createElement('p');
        fileMeta.className = 'text-xs text-gray-500 dark:text-gray-400 mt-1';
        fileMeta.innerHTML = `
            Uploaded: ${design.uploadDate}<br>
            Fabric: ${design.fabric || 'N/A'}<br>
            Cost: ₹${design.cost || 'N/A'}<br>
            Availability: ${design.availability || 'N/A'}
        `;

        // Star Rating
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'star-rating-container mt-3';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            star.setAttribute('class', `star ${i <= design.rating ? 'filled' : ''}`);
            star.setAttribute('viewBox', '0 0 24 24');
            star.innerHTML = `
                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.31h5.418a.562.562 0 01.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.1a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988h5.418a.563.563 0 00.475-.31L11.48 3.5z" />`;
            star.onclick = () => updateRating(design.id, i);
            ratingContainer.appendChild(star);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'mt-3 text-xs text-red-500 hover:underline self-end';
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = () => deleteDesign(design.id);

        fileInfoContainer.append(fileName, fileMeta, ratingContainer, deleteBtn);
        card.appendChild(fileInfoContainer);

        designGallery.insertBefore(card, placeholder);
    };

    const updatePlaceholderVisibility = () => {
        const designsExist = designGallery.querySelector('.design-card');
        if (placeholder) {
            placeholder.style.display = designsExist ? 'none' : 'flex';
        }
    };

    const loadInitialDesigns = () => {
        const designs = getDesigns();
        designGallery.querySelectorAll('.design-card').forEach(card => card.remove());
        designs.forEach(addDesignCard);
        updatePlaceholderVisibility();
    };

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        document.querySelectorAll('.design-card').forEach(card => {
            const fileName = card.getAttribute('data-filename');
            card.style.display = fileName.includes(query) ? 'flex' : 'none';
        });
    });

    loadInitialDesigns();
});
