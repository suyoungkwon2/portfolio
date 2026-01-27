---
layout: page
title: Projects
permalink: /projects/
#description: A growing collection of your cool projects.
nav: true
nav_order: 1
---

<!-- _pages/projects.md -->
<div class="projects">
  <!-- Filter Buttons -->
  <div class="project-filters mb-4">
    <button class="btn btn-sm btn-outline-primary active" data-filter="all">All</button>
    <button class="btn btn-sm btn-outline-primary" data-filter="AI">UX</button>
    <button class="btn btn-sm btn-outline-primary" data-filter="AI">AI</button>
    <button class="btn btn-sm btn-outline-primary" data-filter="Healthcare">Healthcare</button>
    <button class="btn btn-sm btn-outline-primary" data-filter="NLP">NLP</button>
    <button class="btn btn-sm btn-outline-primary" data-filter="Commerce">Commerce</button>
  </div>

  {% assign sorted_projects = site.projects | sort: "date" | reverse %}

  <div class="row row-cols-1 row-cols-md-2" id="project-grid">
    {% for project in sorted_projects %}
      {% include projects.liquid %}
    {% endfor %}
  </div>
</div>

<script>
  document.querySelectorAll('.project-filters button').forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active state
      document.querySelectorAll('.project-filters button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter projects
      document.querySelectorAll('#project-grid .project-item').forEach(item => {
        const tags = item.getAttribute('data-tags').split(',');
        if (filter === 'all' || tags.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
</script>
