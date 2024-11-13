// Sidebar toggle functionality
function toggleSidebar(id) {
  const sidebar = document.getElementById(id);
  if (sidebar) {
    sidebar.classList.toggle('active');
    updateMainContentMargins();
  }
}

// Book toggle functionality
function toggleBook(bookNumber) {
  const bookContent = document.getElementById(`book${bookNumber}`);
  const bookTitle = bookContent.previousElementSibling;
  
  // Toggle the active class for the content
  bookContent.classList.toggle('active');
  bookTitle.classList.toggle('active');
}

// Make functions available globally
window.toggleSidebar = toggleSidebar;
window.toggleBook = toggleBook;

// Resize functionality
function initializeResizing() {
  const sidebars = document.querySelectorAll('.sidebar');
  
  sidebars.forEach(sidebar => {
    const handle = document.createElement('div');
    handle.className = 'resize-handle';
    sidebar.appendChild(handle);
    
    let isResizing = false;
    let startX;
    let startWidth;
    
    handle.addEventListener('mousedown', (e) => {
      isResizing = true;
      startX = e.pageX;
      startWidth = parseInt(getComputedStyle(sidebar).width, 10);
      handle.classList.add('active');
      
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => {
        isResizing = false;
        handle.classList.remove('active');
        document.removeEventListener('mousemove', handleMouseMove);
      }, { once: true });
    });
    
    function handleMouseMove(e) {
      if (!isResizing) return;
      
      const minWidth = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--min-sidebar-width'), 10);
      const maxWidth = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--max-sidebar-width'), 10);
      
      const movement = e.pageX - startX;
      let newWidth;
      
      if (sidebar.classList.contains('left')) {
        newWidth = startWidth + movement;
      } else {
        newWidth = startWidth - movement;
      }
      
      // Constrain width between min and max values
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      
      sidebar.style.width = `${newWidth}px`;
      updateMainContentMargins();
    }
  });
}

// Update main content margins based on sidebar widths
function updateMainContentMargins() {
  const mainContent = document.querySelector('.main-content');
  const leftSidebar = document.getElementById('leftSidebar');
  const rightTopSidebar = document.getElementById('rightTopSidebar');
  
  const leftWidth = leftSidebar.classList.contains('active') 
    ? leftSidebar.offsetWidth 
    : 0;
  const rightWidth = rightTopSidebar.classList.contains('active') 
    ? rightTopSidebar.offsetWidth 
    : 0;
  
  mainContent.style.marginLeft = `${leftWidth}px`;
  mainContent.style.marginRight = `${rightWidth}px`;
}

// Initialize sidebars for desktop view
function initializeSidebars() {
  if (window.innerWidth > 900) {
    ['leftSidebar', 'rightTopSidebar', 'rightBottomSidebar'].forEach(id => {
      document.getElementById(id).classList.add('active');
    });
  }
  initializeResizing();
  updateMainContentMargins();
}

// Handle resize events
window.addEventListener('resize', () => {
  const isDesktop = window.innerWidth > 900;
  const sidebars = ['leftSidebar', 'rightTopSidebar', 'rightBottomSidebar'];
  
  sidebars.forEach(id => {
    const sidebar = document.getElementById(id);
    if (isDesktop) {
      sidebar.classList.add('active');
    } else {
      sidebar.classList.remove('active');
    }
  });
  
  updateMainContentMargins();
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeSidebars);