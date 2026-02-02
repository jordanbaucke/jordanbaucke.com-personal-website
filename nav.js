// Navigation configuration - single source of truth
// Order is consistent across all pages
const navItems = [
  { href: 'index.html', icon: 'fas fa-home', text: 'Home' },
  { href: 'podcasts.html', icon: 'fas fa-podcast', text: 'Podcasts' },
  { href: 'library.html', icon: 'fas fa-book', text: 'Library' },
  { href: 'appearances.html', icon: 'fas fa-video', text: 'Appearances' },
  { href: 'investing.html', icon: 'fas fa-chart-line', text: 'Investing' },
  { href: 'https://www.linkedin.com/in/jordanbaucke', icon: 'fab fa-linkedin', text: 'LinkedIn' },
  { href: 'https://github.com/jordanbaucke', icon: 'fab fa-github', text: 'GitHub' }
];

function loadNavigation() {
  const nav = document.querySelector('nav');
  if (!nav) return;

  // Build navigation - same on all pages
  let navHTML = '';
  
  // Hamburger button for mobile
  navHTML += '<button class="nav-toggle" id="nav-toggle" aria-label="Toggle navigation" aria-expanded="false"><span></span><span></span><span></span></button>';
  
  // Navigation items container
  navHTML += '<div class="nav-menu" id="nav-menu">';
  
  navItems.forEach(item => {
    if (item.type === 'popover') {
      // Create popover button
      navHTML += `<button class="popover-btn" id="${item.id}-popover-btn" aria-expanded="false" aria-haspopup="true"><i class="${item.icon}"></i> ${item.text}</button>`;
    } else {
      // Regular link
      navHTML += `<a href="${item.href}"><i class="${item.icon}"></i> ${item.text}</a>`;
    }
  });
  
  navHTML += '</div>'; // Close nav-menu
  
  nav.innerHTML = navHTML;
  
  // Add contact popover HTML after navigation is built
  if (document.getElementById('contact-popover-btn')) {
    const contactPopover = document.createElement('div');
    contactPopover.id = 'contact-popover';
    contactPopover.className = 'popover hidden';
    contactPopover.innerHTML = `
      <div class="popover-content">
        <h3>Contact</h3>
        <p>Get in touch with me:</p>
        <p>
          <a href="mailto:jordan.baucke@gmail.com"><i class="fas fa-envelope"></i> Email</a><br />
          <a href="https://t.me/jordanbaucke" target="_blank" rel="noopener noreferrer"><i class="fab fa-telegram"></i> Telegram</a>
        </p>
        <button class="popover-close" id="contact-close-btn">Close</button>
      </div>
    `;
    // Insert popover right after the nav element
    nav.parentNode.insertBefore(contactPopover, nav.nextSibling);
  }
}


// Popover functionality
function initPopover() {
  // Initialize AI Boy Scout popover (if exists on page)
  const aiboyPopoverBtn = document.getElementById('aiboy-popover-btn');
  const aiboyPopover = document.getElementById('aiboy-popover');
  const aiboyCloseBtn = document.getElementById('aiboy-close-btn');

  if (aiboyPopoverBtn && aiboyPopover && aiboyCloseBtn) {
    aiboyPopoverBtn.addEventListener('click', () => {
      aiboyPopover.classList.toggle('hidden');
      aiboyPopoverBtn.setAttribute('aria-expanded', aiboyPopover.classList.contains('hidden') ? 'false' : 'true');
    });

    aiboyCloseBtn.addEventListener('click', () => {
      aiboyPopover.classList.add('hidden');
      aiboyPopoverBtn.setAttribute('aria-expanded', 'false');
    });
  }

  // Initialize Contact popover
  const contactPopoverBtn = document.getElementById('contact-popover-btn');
  const contactPopover = document.getElementById('contact-popover');
  const contactCloseBtn = document.getElementById('contact-close-btn');

  if (contactPopoverBtn && contactPopover) {
    contactPopoverBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isHidden = contactPopover.classList.contains('hidden');
      contactPopover.classList.toggle('hidden');
      contactPopoverBtn.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      
      // Update popover position to align with button (desktop only)
      if (isHidden && window.innerWidth >= 768) {
        setTimeout(() => {
          const btnRect = contactPopoverBtn.getBoundingClientRect();
          const headerRect = document.querySelector('header').getBoundingClientRect();
          contactPopover.style.right = (headerRect.right - btnRect.right) + 'px';
        }, 10);
      }
    });

    if (contactCloseBtn) {
      contactCloseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        contactPopover.classList.add('hidden');
        contactPopoverBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // Close popovers when clicking outside
  document.addEventListener('click', (e) => {
    // Close contact popover if clicking outside
    if (contactPopover && contactPopoverBtn) {
      if (!contactPopover.contains(e.target) && !contactPopoverBtn.contains(e.target)) {
        contactPopover.classList.add('hidden');
        contactPopoverBtn.setAttribute('aria-expanded', 'false');
      }
    }
    
    // Close AI Boy Scout popover if clicking outside
    if (aiboyPopover && aiboyPopoverBtn) {
      if (!aiboyPopover.contains(e.target) && !aiboyPopoverBtn.contains(e.target)) {
        aiboyPopover.classList.add('hidden');
        aiboyPopoverBtn.setAttribute('aria-expanded', 'false');
      }
    }
  });
}

// Hamburger menu functionality
function initHamburgerMenu() {
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const contactPopover = document.getElementById('contact-popover');
  const contactPopoverBtn = document.getElementById('contact-popover-btn');
  
  function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
    // Close contact popover when menu closes
    if (contactPopover && contactPopoverBtn) {
      contactPopover.classList.add('hidden');
      contactPopoverBtn.setAttribute('aria-expanded', 'false');
    }
  }
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', !isExpanded);
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      document.body.classList.toggle('nav-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navMenu.classList.contains('active') && 
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        closeMenu();
      }
    });
    
    // Close menu when clicking a nav link (mobile)
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth < 768) {
          closeMenu();
        }
      });
    });
    
    // Close menu on window resize if switching to desktop/tablet
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth >= 768 && navMenu.classList.contains('active')) {
          closeMenu();
        }
      }, 250);
    });
  }
}

// Load navigation and initialize popovers
function initializeNav() {
  loadNavigation();
  // Small delay to ensure DOM is ready
  setTimeout(() => {
    initPopover();
    initHamburgerMenu();
  }, 0);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeNav);
} else {
  initializeNav();
}
