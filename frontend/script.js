/* ============================================
   SMART STUDY - Shared JavaScript Utilities
   ============================================ */

// ---- Page Loader ----
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
  initTheme();
  initNavbar();
  initDropdowns();
});

// ---- Theme Toggle ----
function initTheme() {
  const saved = localStorage.getItem('ss_theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light-mode');
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });
}

function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const theme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
  localStorage.setItem('ss_theme', theme);
}

// ---- Toast Notifications ----
function showToast(message, type = 'info', duration = 3000) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<strong>${icons[type] || 'ℹ️'} ${message}</strong>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), duration);
}

// ---- Navbar Scroll + Hamburger ----
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });
  }
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      mobileMenu.classList.contains('open')
        ? (spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)',
           spans[1].style.opacity = '0',
           spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)')
        : (spans[0].style.transform = '', spans[1].style.opacity = '', spans[2].style.transform = '');
    });
  }
  // Set active nav link
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    if (link.href === window.location.href) link.classList.add('active');
  });
}

// ---- Dropdowns ----
function initDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach(trigger => {
    const menuId = trigger.dataset.dropdown;
    const menu = document.getElementById(menuId);
    if (!menu) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.dropdown-menu.open').forEach(m => {
        if (m !== menu) m.classList.remove('open');
      });
      menu.classList.toggle('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-menu.open').forEach(m => m.classList.remove('open'));
  });
}

// ---- Modal ----
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.add('open');
}
function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) overlay.classList.remove('open');
}
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
  if (e.target.classList.contains('modal-close')) {
    e.target.closest('.modal-overlay')?.classList.remove('open');
  }
});

// ---- Form Validation ----
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function validatePassword(password) {
  return password.length >= 6;
}
function setFieldError(inputEl, message) {
  const group = inputEl.closest('.form-group');
  if (!group) return;
  group.classList.add('has-error');
  const errEl = group.querySelector('.form-error');
  if (errEl) errEl.textContent = message;
}
function clearFieldError(inputEl) {
  const group = inputEl.closest('.form-group');
  if (!group) return;
  group.classList.remove('has-error');
}
function clearAllErrors(form) {
  form.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
}

// ---- Local Storage Helpers ----
const SS = {
  get: (key) => { try { return JSON.parse(localStorage.getItem('ss_' + key)); } catch { return null; } },
  set: (key, val) => localStorage.setItem('ss_' + key, JSON.stringify(val)),
  remove: (key) => localStorage.removeItem('ss_' + key),
  // User session
  getUser: () => SS.get('user'),
  setUser: (user) => SS.set('user', user),
  isLoggedIn: () => !!SS.get('user'),
  logout: () => { SS.remove('user'); window.location.href = 'login.html'; }
};

// ---- Tabs ----
function initTabs(containerSelector) {
  document.querySelectorAll(containerSelector || '.tabs').forEach(tabBar => {
    tabBar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(target);
        if (panel) {
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          panel.classList.add('active');
        }
      });
    });
  });
}

// ---- Observe Animations ----
function initAnimations() {
  const els = document.querySelectorAll('.animate-on-scroll');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('animate-fadeUp'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  els.forEach(el => obs.observe(el));
}

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initAnimations();
});

// ---- Password Toggle ----
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('input-toggle') || e.target.closest('.input-toggle')) {
    const btn = e.target.closest('.input-toggle') || e.target;
    const wrapper = btn.closest('.input-wrapper');
    if (!wrapper) return;
    const input = wrapper.querySelector('input');
    if (!input) return;
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.textContent = isText ? '👁️' : '🙈';
  }
});

// ---- Dummy Data ----
const DUMMY = {
  user: {
    name: 'Alex Jordan',
    email: 'alex@smartstudy.io',
    avatar: 'AJ',
    major: 'Computer Science',
    university: 'MIT',
    joined: 'Jan 2025',
    bio: 'Passionate about AI & machine learning. Looking for study partners for advanced algorithms.',
    subjects: ['Mathematics', 'Algorithms', 'Machine Learning', 'Physics'],
    studyHours: 24,
    groupsJoined: 6,
    tasksCompleted: 18,
    streak: 12
  },
  groups: [
    { id: 1, name: 'Advanced Algorithms', subject: 'Computer Science', members: 8, maxMembers: 10, time: 'Mon & Wed 6pm', level: 'Advanced', tags: ['DSA', 'LeetCode', 'Competitive'], avatar: '⚙️', match: 95 },
    { id: 2, name: 'Calculus Masters', subject: 'Mathematics', members: 5, maxMembers: 8, time: 'Tue & Thu 4pm', level: 'Intermediate', tags: ['Calculus', 'Linear Algebra'], avatar: '📐', match: 87 },
    { id: 3, name: 'ML Research Club', subject: 'Machine Learning', members: 12, maxMembers: 15, time: 'Sat 10am', level: 'Advanced', tags: ['Neural Networks', 'Python', 'Research'], avatar: '🤖', match: 92 },
    { id: 4, name: 'Physics Fundamentals', subject: 'Physics', members: 6, maxMembers: 10, time: 'Wed & Fri 5pm', level: 'Beginner', tags: ['Mechanics', 'Thermodynamics'], avatar: '⚛️', match: 78 },
    { id: 5, name: 'Web Dev Squad', subject: 'Web Development', members: 9, maxMembers: 12, time: 'Daily 8pm', level: 'Intermediate', tags: ['React', 'Node.js', 'CSS'], avatar: '🌐', match: 83 },
    { id: 6, name: 'Chemistry Lab', subject: 'Chemistry', members: 4, maxMembers: 8, time: 'Mon 7pm', level: 'Intermediate', tags: ['Organic', 'Lab Reports'], avatar: '🧪', match: 70 }
  ],
  messages: [
    { sender: 'Sarah K.', avatar: 'SK', text: 'Hey everyone! Ready for today\'s session?', time: '5:00 PM', self: false },
    { sender: 'You', avatar: 'AJ', text: 'Absolutely! I\'ve been working on the dynamic programming problems.', time: '5:01 PM', self: true },
    { sender: 'Mike R.', avatar: 'MR', text: 'Same here. The knapsack problem was tricky 😅', time: '5:02 PM', self: false },
    { sender: 'Sarah K.', avatar: 'SK', text: 'Let\'s start with a recap of last session before diving in.', time: '5:03 PM', self: false },
    { sender: 'You', avatar: 'AJ', text: 'Great idea! Should we use the shared whiteboard?', time: '5:04 PM', self: true },
    { sender: 'Priya M.', avatar: 'PM', text: 'Yes! I\'ll share my screen for the diagrams.', time: '5:05 PM', self: false }
  ],
  tasks: [
    { id: 1, text: 'Complete Chapter 7 exercises', subject: 'Mathematics', due: '2026-04-01', priority: 'high', done: false },
    { id: 2, text: 'Review lecture notes on sorting algorithms', subject: 'Algorithms', due: '2026-03-30', priority: 'medium', done: true },
    { id: 3, text: 'Watch ML tutorial series (episodes 1-5)', subject: 'Machine Learning', due: '2026-04-03', priority: 'low', done: false },
    { id: 4, text: 'Prepare for physics quiz on thermodynamics', subject: 'Physics', due: '2026-03-31', priority: 'high', done: false },
    { id: 5, text: 'Submit project proposal', subject: 'Research', due: '2026-04-05', priority: 'medium', done: true }
  ]
};
