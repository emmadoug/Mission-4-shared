// emmageolocation.js
console.log('FixIt Geolocation + Features loaded ✅');

document.addEventListener('DOMContentLoaded', () => {
  const updateNextState = () => window.FixIt?.updateNextState?.();

  /* Javascript: 3 meaningful interactions: 
     (1) "Other" text field (emmaissue page)
     ========================================================= */
  (function setupOtherToggle() {
    document.querySelectorAll('.issue-grid, .content').forEach(group => {
      const buttons = group.querySelectorAll('.issue-btn');
      buttons.forEach(button => {
        button.addEventListener('click', () => {
          buttons.forEach(b => b.classList.remove('is-selected'));
          button.classList.add('is-selected');
          updateNextState();

          if (document.body.id === 'emmaissue') {
            const otherBtn  = document.querySelector('.issue-btn[data-issue="Other"]');
            const otherWrap = document.getElementById('other-wrap');
            if (otherBtn && otherWrap) {
              otherWrap.style.display = otherBtn.classList.contains('is-selected') ? 'block' : 'none';
            }
          }
        });
      });
    });

    if (document.body.id === 'emmaissue') {
      const otherBtn  = document.querySelector('.issue-btn[data-issue="Other"]');
      const otherWrap = document.getElementById('other-wrap');
      if (otherBtn && otherWrap) {
        otherWrap.style.display = otherBtn.classList.contains('is-selected') ? 'block' : 'none';
      }
    }
  })();

  /* =========================================================
     (2) Live character counter with 200-character limit on emmadescribe and emmabout pages
     ========================================================= */
  (function setupCharCounter() {
    const details = document.getElementById('details');
    const counter = document.getElementById('char-count');
    const msg     = document.getElementById('char-msg');
    if (!details || !counter) return;

    const max = parseInt(details.dataset.max || details.getAttribute('maxlength') || '200', 10);

    function paint(state, text) {
      counter.classList.remove('count-ok', 'count-error');
      counter.classList.add(state);
      if (msg) msg.textContent = text || '';
    }

    function sync() {
      const len = (details.value || '').length;
      counter.textContent = String(len);

      if (len > max) {
        paint('count-error', 'Over character limit');
        details.classList.add('over-limit');
      } else {
        paint('count-ok', '');
        details.classList.remove('over-limit');
      }
      updateNextState();
    }

    sync();
    details.addEventListener('input', sync);
  })();

  /* =========================================================
     (3) Image preview (upload max 3 photos with preview) on emmauploadphoto page
     ========================================================= */
  (function setupImagePreview() {
    const input   = document.getElementById('photo-input');
    const preview = document.getElementById('photo-preview');
    const errorEl = document.getElementById('photo-error');
    if (!input || !preview) return;

    const MAX_FILES  = 3;
    const MAX_BYTES  = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    let galleryCount = 0;

    function setValidity(ok, msg='') {
      input.dataset.valid = ok ? '1' : '0';
      if (errorEl) errorEl.textContent = msg;
      updateNextState();
    }

    function addThumb(file) {
      const url = URL.createObjectURL(file);

      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.alignItems = 'center';
      wrap.style.gap = '6px';

      const img = document.createElement('img');
      img.src = url;
      img.alt = 'Selected photo preview';
      img.style.maxWidth = '120px';
      img.style.maxHeight = '120px';
      img.style.borderRadius = '8px';
      img.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'remove-photo';
      removeBtn.textContent = 'Remove';

      removeBtn.addEventListener('click', () => {
        URL.revokeObjectURL(url);
        wrap.remove();
        galleryCount = Math.max(0, galleryCount - 1);
        setValidity(galleryCount > 0, '');
      });

      wrap.appendChild(img);
      wrap.appendChild(removeBtn);
      preview.appendChild(wrap);
    }

    input.addEventListener('change', () => {
      const files = Array.from(input.files || []);
      if (!files.length) return;

      const file = files[0];

      if (!validTypes.includes(file.type)) {
        setValidity(galleryCount > 0, 'Please choose JPG, PNG, WebP, or GIF.');
        input.value = '';
        return;
      }
      if (file.size > MAX_BYTES) {
        setValidity(galleryCount > 0, 'Each file must be ≤ 5 MB.');
        input.value = '';
        return;
      }
      if (galleryCount >= MAX_FILES) {
        setValidity(true, `Limit reached (${MAX_FILES}). Remove one to add another.`);
        input.value = '';
        return;
      }

      addThumb(file);
      galleryCount += 1;
      setValidity(true, '');

      input.value = '';
    });

    setValidity(false, '');
  })();

  /* =========================================================
     Add Web API feature: Geolocation + Leaflet map
     ========================================================= */
  (function setupGeoMap() {
    const btn     = document.getElementById('locateBtn');
    const mapBox  = document.getElementById('map');
    const addr    = document.getElementById('manual-address');
    const errorEl = document.getElementById('geo-error');
    if (!mapBox) return;

    mapBox.dataset.valid = '0';

    const map = L.map('map').setView([-36.8485, 174.7633], 12);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    setTimeout(() => map.invalidateSize(), 0);

    const marker = L.marker([-36.8485, 174.7633], { draggable: true }).addTo(map);

    function markValid() {
      mapBox.dataset.valid = '1';
      if (btn) btn.classList.add('is-selected');
      if (errorEl) errorEl.textContent = '';
      updateNextState();
    }

    function markInvalid(msg) {
      mapBox.dataset.valid = '0';
      if (errorEl) errorEl.textContent = msg || '';
      updateNextState();
    }

    marker.on('dragend', () => {
      const { lat, lng } = marker.getLatLng();
      map.setView([lat, lng], 16);
      markValid();
    });

    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      map.setView(e.latlng, 16);
      markValid();
    });

    if (btn) {
      btn.type = 'button';
      btn.addEventListener('click', () => {
        btn.classList.add('is-selected');

        const isHttps     = location.protocol === 'https:';
        const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(location.hostname);

        if ((!isHttps && !isLocalhost) || !('geolocation' in navigator)) {
          markInvalid('Map not loading. Drag the pin to your location, or type it in the box below.');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const { latitude, longitude } = coords;
            marker.setLatLng([latitude, longitude]);
            map.setView([latitude, longitude], 16);
            markValid();
          },
          () => {
            markInvalid('Could not get your location. Drag the pin or type an address below.');
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      });
    }

    if (addr) {
      addr.addEventListener('input', () => {
        if (addr.value.trim().length > 4) {
          markValid();
        } else {
          markInvalid('');
        }
      });
    }
  })();
});
