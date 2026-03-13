// emmascript.js
console.log('FixIt Core loaded ✅');

document.addEventListener('DOMContentLoaded', () => {
  const backPage = document.body.dataset.back;
  const nextPage = document.body.dataset.next;
  const backBtn  = document.getElementById('backBtn');
  const nextBtn  = document.getElementById('nextBtn');

  // ✅ Central gate for enabling Next (exposed to other scripts)
  function updateNextState() {
    if (!nextBtn) return;

    const details   = document.getElementById('details');
    const overLimit = (() => {
      if (!details) return false;
      const max = parseInt(details.dataset.max || details.getAttribute('maxlength') || '200', 10);
      return (details.value || '').length > max;
    })();

    const photoInput = document.getElementById('photo-input');
    const photoOK    = photoInput ? photoInput.dataset.valid === '1' : true;

    const mapBox = document.getElementById('map');
    const geoOK  = mapBox ? mapBox.dataset.valid === '1' : true;

    let enabledByChoices;
    const anyChecked = document.querySelector(
      '.surface-form input[type="radio"]:checked, .surface-form input[type="checkbox"]:checked'
    );
    const anySelectedIssue = document.querySelector('.issue-btn.is-selected');

    if (anyChecked || anySelectedIssue) {
      enabledByChoices = true;
    } else {
      const hasChoices = document.querySelector(
        '.surface-form input[type="radio"], .surface-form input[type="checkbox"], .issue-btn'
      );
      enabledByChoices = !hasChoices;
    }

    nextBtn.disabled = !(enabledByChoices && !overLimit && photoOK && geoOK);
    nextBtn.classList.toggle('is-selected', !nextBtn.disabled);
  }

  // Expose globally so emmageolocation.js can call it
  window.FixIt = { updateNextState };

  // Initial check
  updateNextState();

  // Back/Next button clicks
  if (backBtn && backPage) {
    backBtn.addEventListener('click', e => {
      e.preventDefault();
      backBtn.classList.add('is-selected');
      setTimeout(() => (window.location.href = backPage), 150);
    });
  }

  if (nextBtn && nextPage) {
    nextBtn.addEventListener('click', e => {
      e.preventDefault();
      if (!nextBtn.disabled) {
        nextBtn.classList.add('is-selected');
        setTimeout(() => (window.location.href = nextPage), 150);
      }
    });
  }
});

