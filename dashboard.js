// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVBxgwHvPRUsMiDggziYZnLa5JuYTFI1E",
    authDomain: "lms-bm-reading.firebaseapp.com",
    projectId: "lms-bm-reading",
    storageBucket: "lms-bm-reading.appspot.com",
    messagingSenderId: "388779759262",
    appId: "1:388779759262:web:955d777ed608a2c1118d8f",
    measurementId: "G-44730J0JV0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Teacher Dashboard template
const teacherDashboardTemplate = `
    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <div class="w-64 bg-blue-600 text-white p-6">
            <h2 class="text-2xl font-bold mb-6">Teacher Dashboard</h2>
            <nav>
                <ul class="space-y-2">
                    <li><a href="#" class="block py-2 px-4 hover:bg-blue-700 rounded" id="nav-overview">Overview</a></li>
                    <li><a href="#" class="block py-2 px-4 hover:bg-blue-700 rounded" id="nav-lessons">Manage Lessons</a></li>
                    <li><a href="#" class="block py-2 px-4 hover:bg-blue-700 rounded" id="nav-students">Manage Students</a></li>
                    <li><a href="#" class="block py-2 px-4 hover:bg-blue-700 rounded" id="nav-classrooms">Classrooms</a></li>
                </ul>
            </nav>
            <button id="logoutButton" class="mt-8 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Logout</button>
        </div>

        <!-- Main Content Area -->
        <div class="flex-1 p-10 overflow-y-auto">
            <div id="content-area">
                <!-- Dynamic content will be loaded here -->
            </div>
        </div>
    </div>
`;

// Overview Section Template
const overviewTemplate = `
    <h2 class="text-2xl font-bold mb-6">Overview</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-2">Total Students</h3>
            <p class="text-3xl font-bold" id="total-students">Loading...</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-2">Active Lessons</h3>
            <p class="text-3xl font-bold" id="active-lessons">Loading...</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow">
            <h3 class="text-xl font-semibold mb-2">Average Progress</h3>
            <p class="text-3xl font-bold" id="avg-progress">Loading...</p>
        </div>
    </div>
    <div class="mt-8 bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4">Recent Activity</h3>
        <ul id="recent-activity" class="space-y-2">
            <li>Loading recent activities...</li>
        </ul>
    </div>
`;

// Manage Lessons Template
const manageLessonsTemplate = `
    <h2 class="text-2xl font-bold mb-6">Manage Lessons</h2>
    <div class="bg-white p-6 rounded-lg shadow mb-6">
        <h3 class="text-xl font-semibold mb-4">Add New Lesson</h3>
        <form id="add-lesson-form">
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="lesson-title">
                    Lesson Title
                </label>
                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lesson-title" type="text" placeholder="Enter lesson title">
            </div>
            <div class="mb-4">
                <label class="block text-gray-700 text-sm font-bold mb-2" for="lesson-content">
                    Lesson Content
                </label>
                <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="lesson-content" placeholder="Enter lesson content" rows="4"></textarea>
            </div>
            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Add Lesson
            </button>
        </form>
    </div>
    <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-xl font-semibold mb-4">Existing Lessons</h3>
        <ul id="lesson-list" class="space-y-2">
            <li>Loading lessons...</li>
        </ul>
    </div>
`;

// Function to load teacher dashboard
function loadTeacherDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = teacherDashboardTemplate;
    setupDashboardHandlers();
    loadOverview(); // Load overview by default
}

// Setup dashboard event handlers
function setupDashboardHandlers() {
    document.getElementById('nav-overview').addEventListener('click', loadOverview);
    document.getElementById('nav-lessons').addEventListener('click', loadManageLessons);
    document.getElementById('nav-students').addEventListener('click', loadManageStudents);
    document.getElementById('nav-classrooms').addEventListener('click', loadClassrooms);
    document.getElementById('logoutButton').addEventListener('click', logout);
}

// Load overview section
function loadOverview() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = overviewTemplate;
    fetchOverviewData();
}

// Load manage lessons section
function loadManageLessons() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = manageLessonsTemplate;
    setupLessonHandlers();
    fetchLessons();
}

// Fetch overview data
function fetchOverviewData() {
    // Placeholder: Replace with actual data fetching from Firebase
    document.getElementById('total-students').textContent = '120';
    document.getElementById('active-lessons').textContent = '15';
    document.getElementById('avg-progress').textContent = '68%';

    const recentActivity = document.getElementById('recent-activity');
    recentActivity.innerHTML = `
        <li>New lesson added: "Introduction to Algebra"</li>
        <li>Student progress update: John Doe (75% complete)</li>
        <li>New student joined: Jane Smith</li>
    `;
}

// Setup lesson handlers
function setupLessonHandlers() {
    document.getElementById('add-lesson-form').addEventListener('submit', addLesson);
}

// Add new lesson
function addLesson(e) {
    e.preventDefault();
    const title = document.getElementById('lesson-title').value;
    const content = document.getElementById('lesson-content').value;
    db.collection("lessons").add({
        title: title,
        content: content,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then((docRef) => {
        console.log("Lesson added with ID: ", docRef.id);
        alert("Lesson added successfully!");
        document.getElementById('add-lesson-form').reset();
        fetchLessons(); // Refresh the lesson list
    })
    .catch((error) => {
        console.error("Error adding lesson: ", error);
        alert("Error adding lesson: " + error.message);
    });
}

// Fetch lessons
function fetchLessons() {
    const lessonList = document.getElementById('lesson-list');
    lessonList.innerHTML = 'Loading lessons...';
    db.collection("lessons").get().then((querySnapshot) => {
        lessonList.innerHTML = '';
        querySnapshot.forEach((doc) => {
            const lesson = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="flex justify-between items-center">
                    <span>${lesson.title}</span>
                    <button class="text-red-500 hover:text-red-700" onclick="deleteLesson('${doc.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            lessonList.appendChild(li);
        });
    }).catch((error) => {
        console.error("Error fetching lessons: ", error);
        lessonList.innerHTML = 'Error fetching lessons. Please try again.';
    });
}

// Delete lesson
window.deleteLesson = function(lessonId) {
    if (confirm("Are you sure you want to delete this lesson?")) {
        db.collection("lessons").doc(lessonId).delete().then(() => {
            console.log("Lesson successfully deleted!");
            fetchLessons(); // Refresh the lesson list
        }).catch((error) => {
            console.error("Error removing lesson: ", error);
            alert("Error deleting lesson: " + error.message);
        });
    }
}

// Load manage students section (placeholder)
function loadManageStudents() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<h2 class="text-2xl font-bold mb-6">Manage Students</h2><p>Student management functionality coming soon.</p>';
}

// Load classrooms section (placeholder)
function loadClassrooms() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<h2 class="text-2xl font-bold mb-6">Classrooms</h2><p>Classroom management functionality coming soon.</p>';
}

// Logout function
function logout() {
    auth.signOut().then(() => {
        console.log("User signed out");
        window.location.href = 'index.html'; // Redirect to login page
    }).catch((error) => {
        console.error("Logout error:", error.message);
        alert("Logout failed: " + error.message);
    });
}

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in, load the dashboard
        loadTeacherDashboard();
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'index.html';
    }
});

// Initial call to load the dashboard
loadTeacherDashboard();
