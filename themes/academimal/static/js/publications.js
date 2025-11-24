// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
  // Auto-select tab based on page URL
  const path = window.location.pathname;
  let defaultTab = 'all';
  if (path.includes('/working-papers')) {
    defaultTab = 'working-papers';
  } else if (path.includes('/work-in-progress')) {
    defaultTab = 'work-in-progress';
  } else if (path.includes('/publications')) {
    defaultTab = 'all';
  }
  
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  // Set default tab
  tabButtons.forEach(btn => {
    if (btn.getAttribute('data-tab') === defaultTab) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  tabContents.forEach(content => {
    if (content.id === 'tab-' + defaultTab) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked button and corresponding content
      this.classList.add('active');
      const targetContent = document.getElementById('tab-' + targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
      
      // Trigger search to filter within active tab
      performSearch();
    });
  });

  // Search functionality
  const searchInput = document.getElementById('publication-search');
  if (searchInput) {
    searchInput.addEventListener('input', performSearch);
    // Initial search to handle any pre-filled values
    performSearch();
  }
});

function performSearch() {
  const searchInput = document.getElementById('publication-search');
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.toLowerCase().trim();
  const activeTab = document.querySelector('.tab-content.active');
  if (!activeTab) return;
  
  const publicationItems = activeTab.querySelectorAll('.publication-item');
  const noResults = document.getElementById('no-results');
  
  let visibleCount = 0;
  
  publicationItems.forEach(item => {
    // Get all text content from the publication item
    const text = item.textContent.toLowerCase();
    
    // Check if search term matches
    const matches = searchTerm === '' || text.includes(searchTerm);
    
    if (matches) {
      item.style.display = '';
      visibleCount++;
    } else {
      item.style.display = 'none';
    }
  });
  
  // Show/hide section headers based on visible items
  const sections = activeTab.querySelectorAll('h2');
  sections.forEach(section => {
    const sectionId = section.getAttribute('id');
    if (!sectionId) return;
    
    // Find all items that belong to this section
    // Items with data-type matching the section id, or items that come after this h2 until the next h2
    let hasVisibleItems = false;
    let currentElement = section.nextElementSibling;
    
    while (currentElement && currentElement.tagName !== 'H2') {
      if (currentElement.classList && currentElement.classList.contains('publication-item')) {
        if (currentElement.style.display !== 'none') {
          hasVisibleItems = true;
          break;
        }
      }
      currentElement = currentElement.nextElementSibling;
    }
    
    // Also check by data-type attribute
    const sectionItems = activeTab.querySelectorAll(`.publication-item[data-type="${sectionId}"]`);
    if (!hasVisibleItems) {
      hasVisibleItems = Array.from(sectionItems).some(item => item.style.display !== 'none');
    }
    
    if (hasVisibleItems) {
      section.style.display = '';
    } else {
      section.style.display = 'none';
    }
  });
  
  // Show no results message if needed
  if (visibleCount === 0 && searchTerm !== '') {
    if (noResults) noResults.style.display = 'block';
  } else {
    if (noResults) noResults.style.display = 'none';
  }
}

