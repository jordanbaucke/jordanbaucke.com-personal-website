/**
 * Philosophy quotes carousel: show one quote at a time with Random and Next.
 */
(function () {
  function init() {
    var track = document.querySelector('.quotes-carousel-track');
    if (!track) return;

    var quotes = track.querySelectorAll('.philosophy-quote');
    var n = quotes.length;
    if (n === 0) return;

    var currentIndex = -1;

    function showIndex(index) {
      quotes.forEach(function (q, i) {
        q.classList.toggle('active', i === index);
      });
      currentIndex = index;
    }

    function randomIndex() {
      return Math.floor(Math.random() * n);
    }

    function showRandom() {
      var idx = randomIndex();
      if (n > 1) {
        while (idx === currentIndex) idx = randomIndex();
      }
      showIndex(idx);
    }

    function showNext() {
      showIndex((currentIndex + 1) % n);
    }

    showRandom();

    var btnRandom = document.getElementById('quotes-random');
    var btnNext = document.getElementById('quotes-next');
    if (btnRandom) btnRandom.addEventListener('click', showRandom);
    if (btnNext) btnNext.addEventListener('click', showNext);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
