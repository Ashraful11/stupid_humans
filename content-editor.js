// Content Editor JavaScript
let quill;
let autoSaveTimeout;
let currentUser = null;
let editingId = null;
let contentType = 'blog';
let uploadedImageUrl = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    auth.onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            initializeEditor();
            loadContentIfEditing();
        } else {
            // Redirect to dashboard login
            window.location.href = 'admin-dashboard-enhanced.html';
        }
    });
});

// Initialize Quill Editor
function initializeEditor() {
    quill = new Quill('#editor', {
        theme: 'snow',
        placeholder: 'Start writing your content here...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'indent': '-1'}, { 'indent': '+1' }],
                ['link', 'image', 'video'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                ['clean']
            ]
        }
    });

    // Listen for text changes
    quill.on('text-change', function() {
        updateWordCount();
        updatePreview();
        autoSave();
        calculateSEO();
    });

    // Setup character counters
    setupCharCounters();

    // Get content type and ID from URL
    const params = new URLSearchParams(window.location.search);
    contentType = params.get('type') || 'blog';
    editingId = params.get('id') || null;

    document.getElementById('contentType').value = contentType;
    if (editingId) {
        document.getElementById('editId').value = editingId;
    }

    // Update category options based on content type
    updateCategoryOptions();
}

// Setup character counters
function setupCharCounters() {
    const titleInput = document.getElementById('postTitle');
    const excerptInput = document.getElementById('postExcerpt');

    titleInput.addEventListener('input', () => {
        const count = titleInput.value.length;
        document.getElementById('titleCharCount').textContent = `${count}/60 characters`;

        // SEO indicator
        const indicator = document.getElementById('titleSEO');
        if (count >= 50 && count <= 60) {
            indicator.textContent = '✅ Perfect!';
            indicator.className = 'seo-indicator good';
        } else if (count > 30) {
            indicator.textContent = '⚠️ Could be better';
            indicator.className = 'seo-indicator warning';
        } else {
            indicator.textContent = '❌ Too short';
            indicator.className = 'seo-indicator';
        }

        calculateSEO();
    });

    excerptInput.addEventListener('input', () => {
        const count = excerptInput.value.length;
        document.getElementById('excerptCharCount').textContent = `${count}/160 characters`;

        // SEO indicator
        const indicator = document.getElementById('excerptSEO');
        if (count >= 140 && count <= 160) {
            indicator.textContent = '✅ Perfect!';
            indicator.className = 'seo-indicator good';
        } else if (count > 100) {
            indicator.textContent = '⚠️ Could be better';
            indicator.className = 'seo-indicator warning';
        } else {
            indicator.textContent = '❌ Too short';
            indicator.className = 'seo-indicator';
        }

        calculateSEO();
    });
}

// Update word count and read time
function updateWordCount() {
    const text = quill.getText();
    const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;

    document.getElementById('wordCount').textContent = `${words} words`;

    // Calculate read time (average 200 words per minute)
    const readTime = Math.max(1, Math.ceil(words / 200));
    document.getElementById('readTime').textContent = `${readTime} min read`;

    // Auto-fill read time if not manually set
    if (!document.getElementById('postReadTime').value) {
        document.getElementById('postReadTime').value = readTime;
    }
}

// Update category options based on content type
function updateCategoryOptions() {
    const categorySelect = document.getElementById('postCategory');

    if (contentType === 'blog') {
        categorySelect.innerHTML = `
            <option value="">Select category</option>
            <option value="tutorials">Tutorials</option>
            <option value="case-studies">Case Studies</option>
            <option value="tools">Tool Reviews</option>
            <option value="analytics">Analytics</option>
            <option value="social">Social Media</option>
            <option value="email">Email</option>
            <option value="seo">SEO</option>
            <option value="leads">Leads</option>
        `;
    } else {
        categorySelect.innerHTML = `
            <option value="">Select category</option>
            <option value="ai-tools">AI Tools</option>
            <option value="marketing-tech">Marketing Tech</option>
            <option value="platform-updates">Platform Updates</option>
            <option value="industry">Industry Trends</option>
            <option value="research">Research</option>
            <option value="automation">Automation</option>
        `;
    }
}

// Load content if editing
async function loadContentIfEditing() {
    if (!editingId) return;

    try {
        const collection = contentType === 'blog' ? 'blogPosts' : 'newsArticles';
        const doc = await db.collection(collection).doc(editingId).get();

        if (doc.exists) {
            const data = doc.data();

            // Populate form
            document.getElementById('postTitle').value = data.title || '';
            document.getElementById('postCategory').value = data.category || '';
            document.getElementById('postDifficulty').value = data.difficulty || '';
            document.getElementById('postAuthor').value = data.author || '';
            document.getElementById('postReadTime').value = data.readTime || '';
            document.getElementById('postExcerpt').value = data.excerpt || '';
            document.getElementById('postTags').value = data.tags ? data.tags.join(', ') : '';
            document.getElementById('metaTitle').value = data.metaTitle || '';
            document.getElementById('urlSlug').value = data.slug || '';

            // Set content in Quill
            if (data.content) {
                quill.root.innerHTML = data.content;
            }

            // Set image
            if (data.image) {
                uploadedImageUrl = data.image;
                showImagePreview(data.image);
                document.getElementById('imageAlt').value = data.imageAlt || '';
            }

            // Trigger updates
            updateWordCount();
            updatePreview();
            calculateSEO();
        }
    } catch (error) {
        console.error('Error loading content:', error);
        showNotification('Error loading content', 'error');
    }
}

// Handle image upload
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageUrl = e.target.result;
        showImagePreview(e.target.result);
        updatePreview();
        calculateSEO();
    };
    reader.readAsDataURL(file);

    // TODO: Upload to Firebase Storage for production
    // For now, using data URL
}

// Show image preview
function showImagePreview(url) {
    document.getElementById('imageUploadArea').style.display = 'none';
    document.getElementById('imagePreviewContainer').style.display = 'block';
    document.getElementById('imagePreview').src = url;
}

// Remove image
function removeImage() {
    uploadedImageUrl = '';
    document.getElementById('imageUploadArea').style.display = 'block';
    document.getElementById('imagePreviewContainer').style.display = 'none';
    document.getElementById('imagePreview').src = '';
    document.getElementById('imageAlt').value = '';
    document.getElementById('imageInput').value = '';
    updatePreview();
    calculateSEO();
}

// Auto save
function autoSave() {
    clearTimeout(autoSaveTimeout);

    document.getElementById('saveStatus').textContent = 'Saving...';
    document.getElementById('saveStatus').className = 'editor-status saving';

    autoSaveTimeout = setTimeout(() => {
        // Save to localStorage as draft
        const draftData = collectFormData('draft');
        localStorage.setItem('contentDraft', JSON.stringify(draftData));

        document.getElementById('saveStatus').textContent = 'All changes saved';
        document.getElementById('saveStatus').className = 'editor-status saved';
    }, 1000);
}

// Collect form data
function collectFormData(status = 'draft') {
    const title = document.getElementById('postTitle').value;
    let slug = document.getElementById('urlSlug').value;

    // Auto-generate slug if empty
    if (!slug && title) {
        slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
        document.getElementById('urlSlug').value = slug;
    }

    return {
        title: title,
        category: document.getElementById('postCategory').value,
        difficulty: document.getElementById('postDifficulty').value,
        author: document.getElementById('postAuthor').value,
        readTime: parseInt(document.getElementById('postReadTime').value) || null,
        excerpt: document.getElementById('postExcerpt').value,
        content: quill.root.innerHTML,
        image: uploadedImageUrl,
        imageAlt: document.getElementById('imageAlt').value,
        tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        slug: slug,
        metaTitle: document.getElementById('metaTitle').value,
        status: status,
        seoScore: parseInt(document.getElementById('seoScore').textContent) || 0,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
}

// Save draft
async function saveDraft() {
    try {
        const data = collectFormData('draft');
        const collection = contentType === 'blog' ? 'blogPosts' : 'newsArticles';

        if (editingId) {
            await db.collection(collection).doc(editingId).update(data);
        } else {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            const docRef = await db.collection(collection).add(data);
            editingId = docRef.id;
            document.getElementById('editId').value = editingId;

            // Update URL without reload
            const newUrl = `${window.location.pathname}?type=${contentType}&id=${editingId}`;
            window.history.replaceState({}, '', newUrl);
        }

        showNotification('Draft saved successfully!', 'success');
    } catch (error) {
        console.error('Error saving draft:', error);
        showNotification('Error saving draft', 'error');
    }
}

// Publish content
async function publishContent() {
    // Validate required fields
    if (!document.getElementById('postTitle').value) {
        showNotification('Please enter a title', 'error');
        return;
    }

    if (!document.getElementById('postExcerpt').value) {
        showNotification('Please enter an excerpt', 'error');
        return;
    }

    if (quill.getText().trim().length < 100) {
        showNotification('Content is too short (minimum 100 characters)', 'error');
        return;
    }

    try {
        const publishOption = document.querySelector('input[name="publishOption"]:checked').value;
        let status = 'published';
        const data = collectFormData(status);

        // Handle scheduling
        if (publishOption === 'scheduled') {
            const publishDate = document.getElementById('publishDate').value;
            if (!publishDate) {
                showNotification('Please select a publish date', 'error');
                return;
            }
            status = 'scheduled';
            data.status = 'scheduled';
            data.publishDate = firebase.firestore.Timestamp.fromDate(new Date(publishDate));
        }

        const collection = contentType === 'blog' ? 'blogPosts' : 'newsArticles';

        if (editingId) {
            await db.collection(collection).doc(editingId).update(data);
        } else {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection(collection).add(data);
        }

        showNotification('Content published successfully!', 'success');

        // Redirect back to dashboard after 1 second
        setTimeout(() => {
            goBack();
        }, 1000);
    } catch (error) {
        console.error('Error publishing content:', error);
        showNotification('Error publishing content', 'error');
    }
}

// Toggle preview
function togglePreview() {
    const previewPanel = document.getElementById('previewPanel');
    const sidebar = document.getElementById('editorSidebar');

    if (previewPanel.style.display === 'none' || previewPanel.style.display === '') {
        previewPanel.style.display = 'block';
        sidebar.style.display = 'none';
        updatePreview();
    } else {
        previewPanel.style.display = 'none';
        sidebar.style.display = 'block';
    }
}

// Update preview
function updatePreview() {
    const title = document.getElementById('postTitle').value || 'Your title will appear here';
    const excerpt = document.getElementById('postExcerpt').value;
    const author = document.getElementById('postAuthor').value || 'Author';
    const readTime = document.getElementById('postReadTime').value || '5';
    const content = quill.root.innerHTML;

    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewAuthor').textContent = author;
    document.getElementById('previewReadTime').textContent = `${readTime} min read`;
    document.getElementById('previewExcerpt').innerHTML = excerpt;
    document.getElementById('previewBody').innerHTML = content;

    // Handle image
    const previewImage = document.getElementById('previewImage');
    if (uploadedImageUrl) {
        previewImage.src = uploadedImageUrl;
        previewImage.style.display = 'block';
        previewImage.alt = document.getElementById('imageAlt').value;
    } else {
        previewImage.style.display = 'none';
    }

    // Update date
    document.getElementById('previewDate').textContent = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Set preview mode
function setPreviewMode(mode) {
    const previewContent = document.getElementById('previewContent');
    const buttons = document.querySelectorAll('.preview-mode-btn');

    buttons.forEach(btn => {
        if (btn.dataset.mode === mode) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    if (mode === 'mobile') {
        previewContent.classList.add('mobile');
    } else {
        previewContent.classList.remove('mobile');
    }
}

// Calculate SEO Score
function calculateSEO() {
    let score = 0;

    // Title check (25 points)
    const titleLength = document.getElementById('postTitle').value.length;
    const titleCheck = document.getElementById('checkTitle');
    if (titleLength >= 50 && titleLength <= 60) {
        score += 25;
        updateCheckItem(titleCheck, true);
    } else {
        updateCheckItem(titleCheck, false);
    }

    // Excerpt check (25 points)
    const excerptLength = document.getElementById('postExcerpt').value.length;
    const excerptCheck = document.getElementById('checkExcerpt');
    if (excerptLength >= 140 && excerptLength <= 160) {
        score += 25;
        updateCheckItem(excerptCheck, true);
    } else {
        updateCheckItem(excerptCheck, false);
    }

    // Image check (25 points)
    const imageCheck = document.getElementById('checkImage');
    const hasImage = uploadedImageUrl.length > 0;
    const hasAlt = document.getElementById('imageAlt').value.length > 0;
    if (hasImage && hasAlt) {
        score += 25;
        updateCheckItem(imageCheck, true);
    } else {
        updateCheckItem(imageCheck, false);
    }

    // Content check (25 points)
    const contentCheck = document.getElementById('checkContent');
    const wordCount = quill.getText().trim().split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount >= 300) {
        score += 25;
        updateCheckItem(contentCheck, true);
    } else {
        updateCheckItem(contentCheck, false);
    }

    // Update score display
    document.getElementById('seoScore').textContent = score;

    // Update circular progress
    const circle = document.getElementById('seoCircle');
    const circumference = 283; // 2 * PI * 45
    const offset = circumference - (score / 100) * circumference;
    circle.style.strokeDashoffset = offset;

    // Change color based on score
    if (score >= 80) {
        circle.style.stroke = '#48bb78';
    } else if (score >= 60) {
        circle.style.stroke = '#ed8936';
    } else {
        circle.style.stroke = '#f56565';
    }
}

// Update check item
function updateCheckItem(element, isPassed) {
    const icon = element.querySelector('.check-icon');
    if (isPassed) {
        icon.textContent = '✅';
    } else {
        icon.textContent = '⚪';
    }
}

// Toggle schedule options
function toggleSchedule() {
    const scheduleOptions = document.getElementById('scheduleOptions');
    const publishOption = document.querySelector('input[name="publishOption"]:checked').value;

    if (publishOption === 'scheduled') {
        scheduleOptions.style.display = 'block';
    } else {
        scheduleOptions.style.display = 'none';
    }
}

// Go back to dashboard
function goBack() {
    window.location.href = 'admin-dashboard-enhanced.html';
}

// Show notification
function showNotification(message, type = 'success') {
    // Create toast notification
    const toast = document.createElement('div');
    toast.className = `notification notification-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#48bb78' : '#f56565'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
