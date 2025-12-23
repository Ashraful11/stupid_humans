// Global state
let currentUser = null;
let currentSection = 'overview';
let editingContent = null;

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

        blogSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'published') publishedCount++;
            else draftCount++;
        });

        newsSnapshot.forEach(doc => {
            const data = doc.data();
            if (data.status === 'published') publishedCount++;
            else draftCount++;
        });

        document.getElementById('totalBlogPosts').textContent = blogSnapshot.size;
        document.getElementById('totalNewsArticles').textContent = newsSnapshot.size;
        document.getElementById('totalPublished').textContent = publishedCount;
        document.getElementById('totalDrafts').textContent = draftCount;
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
    const statusClass = data.status === 'published' ? 'published' : 'draft';

    return `
        <div class="content-item">
            <div class="content-info">
                <h3 class="content-title">${data.title}</h3>
                <div class="content-meta">
                    <span class="meta-badge ${statusClass}">${data.status || 'draft'}</span>
                    <span class="meta-badge">${data.category || 'Uncategorized'}</span>
                    ${data.difficulty ? `<span class="meta-badge">${data.difficulty}</span>` : ''}
                    <span class="meta-badge">Created: ${createdDate}</span>
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

// Show editor for new blog post
function showBlogEditor() {
    editingContent = null;
    document.getElementById('editorTitle').textContent = 'Create New Blog Post';
    document.getElementById('contentType').value = 'blog';
    document.getElementById('postCategory').innerHTML = `
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
    resetForm();
    document.getElementById('editorModal').classList.add('show');
}

// Show editor for new news article
function showNewsEditor() {
    editingContent = null;
    document.getElementById('editorTitle').textContent = 'Create New News Article';
    document.getElementById('contentType').value = 'news';
    document.getElementById('postCategory').innerHTML = `
        <option value="">Select category</option>
        <option value="ai-tools">AI Tools</option>
        <option value="marketing-tech">Marketing Tech</option>
        <option value="platform-updates">Platform Updates</option>
        <option value="industry">Industry Trends</option>
        <option value="research">Research</option>
        <option value="automation">Automation</option>
    `;
    resetForm();
    document.getElementById('editorModal').classList.add('show');
}

// Edit existing content
async function editContent(id, type) {
    editingContent = { id, type };
    const collection = type === 'blog' ? 'blogPosts' : 'newsArticles';

    try {
        const doc = await db.collection(collection).doc(id).get();
        if (doc.exists) {
            const data = doc.data();

            document.getElementById('editorTitle').textContent = `Edit ${type === 'blog' ? 'Blog Post' : 'News Article'}`;
            document.getElementById('contentType').value = type;
            document.getElementById('editId').value = id;

            // Populate category options
            if (type === 'blog') {
                document.getElementById('postCategory').innerHTML = `
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
                document.getElementById('postCategory').innerHTML = `
                    <option value="">Select category</option>
                    <option value="ai-tools">AI Tools</option>
                    <option value="marketing-tech">Marketing Tech</option>
                    <option value="platform-updates">Platform Updates</option>
                    <option value="industry">Industry Trends</option>
                    <option value="research">Research</option>
                    <option value="automation">Automation</option>
                `;
            }

            // Populate form
            document.getElementById('postTitle').value = data.title || '';
            document.getElementById('postCategory').value = data.category || '';
            document.getElementById('postDifficulty').value = data.difficulty || '';
            document.getElementById('postAuthor').value = data.author || '';
            document.getElementById('postReadTime').value = data.readTime || '';
            document.getElementById('postExcerpt').value = data.excerpt || '';
            document.getElementById('postContent').value = data.content || '';
            document.getElementById('postImage').value = data.image || '';
            document.getElementById('postTags').value = data.tags ? data.tags.join(', ') : '';

            document.getElementById('editorModal').classList.add('show');
        }
    } catch (error) {
        console.error('Error loading content for edit:', error);
        alert('Error loading content');
    }
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
}

// Save content (publish or draft)
document.getElementById('contentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveContent('published');
});

async function saveDraft() {
    await saveContent('draft');
}

async function saveContent(status) {
    const type = document.getElementById('contentType').value;
    const id = document.getElementById('editId').value;

    const contentData = {
        title: document.getElementById('postTitle').value,
        category: document.getElementById('postCategory').value,
        difficulty: document.getElementById('postDifficulty').value,
        author: document.getElementById('postAuthor').value,
        readTime: parseInt(document.getElementById('postReadTime').value) || null,
        excerpt: document.getElementById('postExcerpt').value,
        content: document.getElementById('postContent').value,
        image: document.getElementById('postImage').value,
        tags: document.getElementById('postTags').value.split(',').map(tag => tag.trim()).filter(tag => tag),
        status: status,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

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

        alert(`Content ${id ? 'updated' : 'created'} successfully!`);
    } catch (error) {
        console.error('Error saving content:', error);
        alert('Error saving content: ' + error.message);
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
    } catch (error) {
        console.error('Error toggling publish status:', error);
        alert('Error updating status');
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
    } catch (error) {
        console.error('Error deleting content:', error);
        alert('Error deleting content');
    }
}

// Close modal when clicking outside
document.getElementById('editorModal').addEventListener('click', (e) => {
    if (e.target.id === 'editorModal') {
        closeEditor();
    }
});
