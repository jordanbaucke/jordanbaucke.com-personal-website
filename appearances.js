// Timeline functionality for appearances page
(function() {
  'use strict';

  // Timeline data - add new entries at the top (most recent first)
  // premiere: ISO 8601 date string (e.g. "2024-03-15T19:00:00.000Z") – stored in data-premiere, drives the counter
  const timelineData = [
    {
      year: 2024,
      month: 'March',
      title: 'Podcast Interview - Salesforce Journey and Career Insights',
      description: 'Interview discussing my journey with Salesforce since 2008, experiences in startups and enterprise, certifications, burnout awareness, and advice for engineers starting their careers.',
      videoId: '9mXU-4nW0rY',
      premiere: '2024-03-15T19:00:00.000Z'
    }
  ];

  function formatDiff(ms) {
    var sign = ms < 0 ? -1 : 1;
    ms = Math.abs(ms);
    var d = Math.floor(ms / 86400000);
    ms %= 86400000;
    var h = Math.floor(ms / 3600000);
    ms %= 3600000;
    var m = Math.floor(ms / 60000);
    ms %= 60000;
    var s = Math.floor(ms / 1000);
    var frac = Math.floor(ms % 1000);
    var pad = function(n, len) { return String(n).padStart(len, '0'); };
    return {
      days: d,
      str: pad(d, 3) + 'd ' + pad(h, 2) + 'h ' + pad(m, 2) + 'm ' + pad(s, 2) + 's ' + pad(frac, 3) + 'ms',
      past: sign > 0
    };
  }

  function updateCounters() {
    var now = Date.now();
    document.querySelectorAll('.timeline-item[data-premiere]').forEach(function(item) {
      var counterEl = item.querySelector('.timeline-counter');
      if (!counterEl) return;
      var premiereMs = new Date(item.getAttribute('data-premiere')).getTime();
      if (isNaN(premiereMs)) return;
      var diff = now - premiereMs;
      var out = formatDiff(diff);
      counterEl.textContent = out.str + (out.past ? ' since premiere' : ' until premiere');
      counterEl.setAttribute('aria-label', out.str + (out.past ? ' since premiere' : ' until premiere'));
    });
  }

  function runCounterLoop() {
    updateCounters();
    setInterval(updateCounters, 10);
  }

  function renderTimeline() {
    const container = document.querySelector('.timeline-items');
    if (!container) return;

    let currentYear = null;
    let html = '';

    timelineData.forEach((entry, index) => {
      if (entry.year !== currentYear) {
        html += `<div class="timeline-year-marker">${entry.year}</div>`;
        currentYear = entry.year;
      }

      var dataPremiere = entry.premiere ? ` data-premiere="${entry.premiere}"` : '';
      var counterBlock = entry.premiere
        ? '<div class="timeline-counter" aria-live="polite" aria-atomic="true"></div>'
        : '';

      html += `
        <div class="timeline-item" data-year="${entry.year}" data-month="${entry.month}"${dataPremiere}>
          <div class="timeline-marker">
            <div class="timeline-dot"></div>
            <div class="timeline-month">${entry.month}</div>
          </div>
          <div class="timeline-content">
            <h3>${entry.title}</h3>
            ${entry.description ? `<p>${entry.description}</p>` : ''}
            ${counterBlock}
            ${entry.videoId ? `
              <div class="timeline-video">
                <iframe 
                  src="https://www.youtube.com/embed/${entry.videoId}" 
                  frameborder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowfullscreen>
                </iframe>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    if (document.querySelector('.timeline-item[data-premiere]')) {
      runCounterLoop();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderTimeline);
  } else {
    renderTimeline();
  }
})();
