// Enhanced Dashboard JavaScript - HubSpot Inspired Features
// Global state
let currentUser = null;
let currentSection = 'overview';
let editingContent = null;
let currentTab = 'content';

// Authentication state listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        showDashboard();
        loadDashboardData();
    } else {
        currentUser = null;
        showLogin();
    }
});

// Show/Hide screens
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('dashboardContent').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'flex';
    document.getElementById('userEmail').textContent = currentUser.email;
    document.getElementById('settingsEmail').textContent = currentUser.email;
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');

    try {
        await auth.signInWithEmailAndPassword(email, password);
        errorDiv.style.display = 'none';
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.classList.add('show');
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error('Error signing out:', error);
    }
});

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;
        showSection(section, false);
    });
});

function showSection(section, createNew = false) {
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) {
            item.classList.add('active');
        }
    });

    // Update content
    document.querySelectorAll('.dashboard-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(`${section}Section`).classList.add('active');

    currentSection = section;

    // Load section data
    if (section === 'blog') {
        loadBlogPosts();
        if (createNew) showBlogEditor();
    } else if (section === 'news') {
        loadNewsArticles();
        if (createNew) showNewsEditor();
    } else if (section === 'overview') {
        loadOverviewStats();
    } else if (section === 'calendar') {
        loadCalendar();
    } else if (section === 'analytics') {
        loadAnalytics();
    }
}

// Load dashboard data
async function loadDashboardData() {
    loadOverviewStats();
    loadBlogPosts();
    loadNewsArticles();
}

// Load overview statistics
async function loadOverviewStats() {
    try {
        const blogSnapshot = await db.collection('blogPosts').get();
        const newsSnapshot = await db.collection('newsArticles').get();

        let publishedCount = 0;
        let draftCount = 0;
        let scheduledCount = 0;

        blogSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'published') publishedCount++;
            else if (data.status === 'scheduled') scheduledCount++;
            else draftCount++;
        });

        newsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'published') publishedCount++;
            else if (data.status === 'scheduled') scheduledCount++;
            else draftCount++;
        });

        document.getElementById('totalBlogPosts').textContent = blogSnapshot.size;
        document.getElementById('totalNewsArticles').textContent = newsSnapshot.size;
        document.getElementById('totalPublished').textContent = publishedCount;
        document.getElementById('totalDrafts').textContent = draftCount;
        document.getElementById('totalScheduled').textContent = scheduledCount;
        document.getElementById('totalViews').textContent = '0'; // Placeholder for analytics
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Blog Posts Management
async function loadBlogPosts() {
    const container = document.getElementById('blogList');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading blog posts...</p></div>';

    try {
        const snapshot = await db.collection('blogPosts')
            .orderBy('createdAt', 'desc')
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                    </svg>
                    <h3>No blog posts yet</h3>
                    <p>Create your first blog post to get started</p>
                </div>
            `;
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += createContentItem(doc.id, data, 'blog');
        });
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading blog posts:', error);
        container.innerHTML = '<div class="empty-state"><p>Error loading blog posts</p></div>';
    }
}

// News Articles Management
async function loadNewsArticles() {
    const container = document.getElementById('newsList');
    container.innerHTML = '<div class="loading-state"><div class="spinner"></div><p>Loading news articles...</p></div>';

    try {
        const snapshot = await db.collection('newsArticles')
            .orderBy('createdAt', 'desc')
            .get();

        if (snapshot.empty) {
            container.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                    <h3>No news articles yet</h3>
                    <p>Create your first news article to get started</p>
                </div>
            `;
            return;
        }

        let html = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            html += createContentItem(doc.id, data, 'news');
        });
        container.innerHTML = html;
    } catch (error) {
        console.error('Error loading news articles:', error);
        container.innerHTML = '<div class="empty-state"><p>Error loading news articles</p></div>';
    }
}

// Create content item HTML
function createContentItem(id, data, type) {
    const createdDate = data.createdAt ? new Date(data.createdAt.toDate()).toLocaleDateString() : 'N/A';
    const statusClass = data.status === 'published' ? 'published' : data.status === 'scheduled' ? 'scheduled' : 'draft';
    const scheduledDate = data.publishDate ? ` (${new Date(data.publishDate.toDate()).toLocaleDateString()})` : '';

    return `
        <div class="content-item">
            <div class="content-info">
                <h3 class="content-title">${data.title}</h3>
                <div class="content-meta">
                    <span class="meta-badge ${statusClass}">${data.status || 'draft'}${statusClass === 'scheduled' ? scheduledDate : ''}</span>
                    <span class="meta-badge">${data.category || 'Uncategorized'}</span>
                    ${data.difficulty ? `<span class="meta-badge">${data.difficulty}</span>` : ''}
                    <span class="meta-badge">Created: ${createdDate}</span>
                    ${data.seoScore ? `<span class="meta-badge">SEO: ${data.seoScore}/100</span>` : ''}
                </div>
            </div>
            <div class="content-actions">
                <button class="btn-icon" onclick="editContent('${id}', '${type}')" title="Edit">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <button class="btn-icon" onclick="togglePublish('${id}', '${type}', '${data.status}')" title="${data.status === 'published' ? 'Unpublish' : 'Publish'}">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                </button>
                <button class="btn-icon delete" onclick="deleteContent('${id}', '${type}')" title="Delete">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
            </div>
        </div>
    `;
}

// Editor Tab Switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        switchTab(tab);
    });
});

function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tab) {
            btn.classList.add('active');
        }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`${tab}Tab`).classList.add('active');

    currentTab = tab;

    // Update preview if on preview tab
    if (tab === 'preview') {
        updatePreview();
    }

    // Calculate SEO score if on SEO tab
    if (tab === 'seo') {
        calculateSEOScore();
    }
}

// Show editor for new blog post
function showBlogEditor() {
    // Redirect to full-page editor
    window.location.href = 'content-editor.html?type=blog';
}

// Show editor for new news article
function showNewsEditor() {
    // Redirect to full-page editor
    window.location.href = 'content-editor.html?type=news';
}

// Setup character counters
function setupCharCounters() {
    const titleInput = document.getElementById('postTitle');
    const excerptInput = document.getElementById('postExcerpt');

    titleInput.addEventListener('input', () => {
        const count = titleInput.value.length;
        document.getElementById('titleCharCount').textContent = `${count}/60 characters`;
    });

    excerptInput.addEventListener('input', () => {
        const count = excerptInput.value.length;
        document.getElementById('excerptCharCount').textContent = `${count}/160 characters`;
        calculateSEOScore();
    });
}

// Calculate SEO Score
function calculateSEOScore() {
    let score = 0;
    let checks = 0;

    // Title length check
    const titleLength = document.getElementById('postTitle').value.length;
    if (titleLength >= 50 && titleLength <= 60) {
        score += 25;
        updateChecklistItem('check-title', 'success');
    } else {
        updateChecklistItem('check-title', titleLength > 0 ? 'warning' : 'pending');
    }
    checks++;

    // Meta description check
    const excerptLength = document.getElementById('postExcerpt').value.length;
    if (excerptLength >= 140 && excerptLength <= 160) {
        score += 25;
        updateChecklistItem('check-meta', 'success');
    } else {
        updateChecklistItem('check-meta', excerptLength > 0 ? 'warning' : 'pending');
    }
    checks++;

    // Image check
    const hasImage = document.getElementById('postImage').value.length > 0;
    const hasAlt = document.getElementById('postImageAlt').value.length > 0;
    if (hasImage && hasAlt) {
        score += 25;
        updateChecklistItem('check-image', 'success');
    } else {
        updateChecklistItem('check-image', hasImage ? 'warning' : 'pending');
    }
    checks++;

    // Content length check
    const contentLength = document.getElementById('postContent').value.split(/\s+/).length;
    if (contentLength >= 300) {
        score += 25;
        updateChecklistItem('check-content', 'success');
    } else {
        updateChecklistItem('check-content', contentLength > 0 ? 'warning' : 'pending');
    }
    checks++;

    document.getElementById('seoScore').textContent = Math.round(score);
}

function updateChecklistItem(id, status) {
    const item = document.getElementById(id);
    if (!item) return;

    const icon = item.querySelector('svg');
    icon.classList.remove('icon-pending', 'icon-success', 'icon-warning');
    icon.classList.add(`icon-${status}`);
}

// Edit existing content
async function editContent(id, type) {
    // Redirect to full-page editor with edit mode
    window.location.href = `content-editor.html?type=${type}&id=${id}`;
}

// Close editor
function closeEditor() {
    document.getElementById('editorModal').classList.remove('show');
    resetForm();
    editingContent = null;
}

// Reset form
function resetForm() {
    document.getElementById('contentForm').reset();
    document.getElementById('editId').value = '';
    document.getElementById('metaTitle').value = '';
    document.getElementById('metaDescription').value = '';
    document.getElementById('slug').value = '';
    document.getElementById('focusKeyword').value = '';
}

// Publish content
async function publishContent() {
    const publishOption = document.querySelector('input[name="publishOption"]:checked').value;

    if (publishOption === 'scheduled') {
        const publishDate = document.getElementById('publishDate').value;
        const publishTime = document.getElementById('publishTime').value;

        if (!publishDate || !publishTime) {
            showToast('Please select both date and time for scheduling', 'warning');
            switchTab('schedule');
            return;
        }

        await saveContent('scheduled');
    } else {
        await saveContent('published');
    }
}

// Save draft
async function saveDraft() {
    await saveContent('draft');
}

// Save content (publish, draft, or scheduled)
async function saveContent(status) {
    const type = document.getElementById('contentType').value;
    const id = document.getElementById('editId').value;

    // Generate slug from title if not provided
    let slug = document.getElementById('slug').value;
    if (!slug) {
        slug = document.getElementById('postTitle').value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    const contentData = {
        title: document.getElementById('postTitle').value,
        category: document.getElementById('postCategory').value,
        difficulty: document.getElementById('postDifficulty').value,
        author: document.getElementById('postAuthor').value,
        readTime: parseInt(document.getElementById('postReadTime').value) || null,
        excerpt: document.getElementById('postExcerpt').value,
        content: document.getElementById('postContent').value,
        image: document.getElementById('postImage').value,
        imageAlt: document.getElementById('postImageAlt').value,
        tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: status,
        slug: slug,
        metaTitle: document.getElementById('metaTitle').value,
        metaDescription: document.getElementById('metaDescription').value,
        focusKeyword: document.getElementById('focusKeyword').value,
        seoScore: parseInt(document.getElementById('seoScore').textContent) || 0,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    // Add publish date if scheduled
    if (status === 'scheduled') {
        const publishDate = document.getElementById('publishDate').value;
        const publishTime = document.getElementById('publishTime').value;
        contentData.publishDate = firebase.firestore.Timestamp.fromDate(new Date(`${publishDate}T${publishTime}`));
    }

    const collection = type === 'blog' ? 'blogPosts' : 'newsArticles';

    try {
        if (id) {
            // Update existing
            await db.collection(collection).doc(id).update(contentData);
        } else {
            // Create new
            contentData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection(collection).add(contentData);
        }

        closeEditor();

        // Reload appropriate list
        if (type === 'blog') {
            await loadBlogPosts();
        } else {
            await loadNewsArticles();
        }

        await loadOverviewStats();

        showToast(`Content ${id ? 'updated' : 'created'} successfully!`, 'success');
    } catch (error) {
        console.error('Error saving content:', error);
        showToast('Error saving content: ' + error.message, 'error');
    }
}

// Toggle publish status
async function togglePublish(id, type, currentStatus) {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    const collection = type === 'blog' ? 'blogPosts' : 'newsArticles';

    try {
        await db.collection(collection).doc(id).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });

        if (type === 'blog') {
            await loadBlogPosts();
        } else {
            await loadNewsArticles();
        }

        await loadOverviewStats();
        showToast(`Content ${newStatus === 'published' ? 'published' : 'unpublished'}`, 'success');
    } catch (error) {
        console.error('Error toggling publish status:', error);
        showToast('Error updating status', 'error');
    }
}

// Delete content
async function deleteContent(id, type) {
    if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
        return;
    }

    const collection = type === 'blog' ? 'blogPosts' : 'newsArticles';

    try {
        await db.collection(collection).doc(id).delete();

        if (type === 'blog') {
            await loadBlogPosts();
        } else {
            await loadNewsArticles();
        }

        await loadOverviewStats();
        showToast('Content deleted successfully', 'success');
    } catch (error) {
        console.error('Error deleting content:', error);
        showToast('Error deleting content', 'error');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor" style="width:24px;height:24px;">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
        <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Calendar functions
function loadCalendar() {
    // Placeholder for calendar implementation
    console.log('Loading calendar...');
}

function previousMonth() {
    console.log('Previous month');
}

function nextMonth() {
    console.log('Next month');
}

// Analytics functions
function loadAnalytics() {
    console.log('Loading analytics...');
}

// Bulk actions
function bulkActions() {
    showToast('Bulk actions coming soon!', 'info');
}

// Image upload
function uploadImage() {
    showToast('Image upload coming soon! For now, use an image URL.', 'info');
}

// Preview update
function updatePreview() {
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;

    document.getElementById('previewContent').innerHTML = `
        <h1>${title || 'Untitled'}</h1>
        <div>${content || 'No content yet...'}</div>
    `;
}

// Schedule fields toggle
document.querySelectorAll('input[name="publishOption"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        const scheduleFields = document.getElementById('scheduleFields');
        if (e.target.value === 'scheduled') {
            scheduleFields.style.display = 'block';
        } else {
            scheduleFields.style.display = 'none';
        }
    });
});

// Close modal when clicking outside
document.getElementById('editorModal').addEventListener('click', (e) => {
    if (e.target.id === 'editorModal') {
        closeEditor();
    }
});

// Preview mode toggle
document.querySelectorAll('.preview-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.preview-mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const mode = btn.dataset.mode;
        const previewContent = document.getElementById('previewContent');

        if (mode === 'mobile') {
            previewContent.classList.add('mobile-mode');
        } else {
            previewContent.classList.remove('mobile-mode');
        }
    });
});
