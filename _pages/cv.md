---
layout: page
permalink: /cv/
title: CV
nav: true
nav_order: 3
cv_pdf: https://drive.google.com/file/d/1PfrFnkITD714vyHC9BMsIE9A9Zxmt4NU/view?usp=sharing
last_updated: Dec. 2025
#description: My professional curriculum vitae.
_styles: >
  .post-header { display: none; }
  .post { padding-top: 0px; }
  .container { max-width: 930px !important; } /* 여기서 페이지 전체 너비를 직접 지정하세요 */
---

<div class="cv-header d-flex justify-content-between align-items-baseline mb-2" style="padding: 0 5px;">
  <h2 class="font-weight-bold" style="margin-bottom: 0;">Curriculum Vitae</h2>
  <span style="font-size: 0.9rem; color: var(--global-text-color-light);">
    Last updated: {{ page.last_updated }}
  </span>
</div>

<div class="card mt-1" style="border: 1px solid var(--global-divider-color); overflow: hidden; border-radius: 8px;">
  <div class="cv-embed" style="width: 100%; height: 800px;">
    <iframe 
      src="{{ site.data.links.cv_google_drive }}" 
      width="100%" 
      height="100%" 
      style="border: none;"
      allow="autoplay">
    </iframe>
  </div>
</div>



