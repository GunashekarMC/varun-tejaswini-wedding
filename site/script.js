/* Varun & Tejaswini — Wedding Invitation
   Vanilla JavaScript • no frameworks, accounts, backend, cookies or analytics.
   Edit the wedding information in index.html and the photos in data/gallery-manifest.js.
*/
(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toast = $('#toast');
  let toastTimer;
  let lastFocus = null;

  function notify(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3400);
  }

  // A single, gentle reveal as each section comes into view.
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -24px 0px', threshold: 0.06 });
    reveals.forEach(el => revealObserver.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('visible'));
  }

  const siteHeader = $('#siteHeader');
  const progress = $('#pageProgress');
  let scrollQueued = false;
  function updateScroll() {
    const y = window.scrollY;
    siteHeader.classList.toggle('scrolled', y > 45);
    const available = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${available > 0 ? Math.min(100, 100 * y / available) : 0}%`;
    scrollQueued = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });
  updateScroll();

  // Countdown is calculated from a timezone-aware IST date, never the visitor's local timezone.
  const weddingTime = new Date('2026-11-19T10:45:00+05:30').getTime();
  const weddingEnd = new Date('2026-11-19T11:15:00+05:30').getTime();
  const countdownNumbers = $('#countdownNumbers');
  const countdownHeading = $('#countdownHeading');
  const countdownNote = $('#countdownNote');
  const numberNodes = [$('#cdDays'), $('#cdHours'), $('#cdMinutes'), $('#cdSeconds')];
  function updateCountdown() {
    const now = Date.now();
    if (now >= weddingTime) {
      countdownNumbers.hidden = true;
      countdownHeading.textContent = now < weddingEnd ? 'THE AUSPICIOUS MOMENT IS HERE' : 'OUR FOREVER HAS BEGUN';
      countdownNote.textContent = now < weddingEnd
        ? 'Today, two hearts begin their beautiful journey together.'
        : 'Thank you for being part of our love story and for your blessings.';
      return;
    }
    const remaining = Math.floor((weddingTime - now) / 1000);
    const values = [
      Math.floor(remaining / 86400),
      Math.floor((remaining % 86400) / 3600),
      Math.floor((remaining % 3600) / 60),
      remaining % 60
    ];
    values.forEach((value, i) => { numberNodes[i].textContent = String(value).padStart(2, '0'); });
  }
  updateCountdown();
  window.setInterval(updateCountdown, 1000);

  // Carefully curated ordering; all 29 original photos remain available in /data/photos.
  const allPhotos = Array.isArray(window.WEDDING_PHOTOS) ? window.WEDDING_PHOTOS : [];
  const galleryGrid = $('#galleryGrid');
  const galleryMore = $('#galleryMore');
  const moreButton = $('#galleryMoreButton');
  const filters = $$('.gallery-filter');
  let selectedFilter = 'all';
  let showAll = false;
  let activePhotos = [];
  let activePhotoIndex = 0;
  let tileFocus = null;

  function renderGallery() {
    const filtered = selectedFilter === 'all'
      ? allPhotos
      : allPhotos.filter(photo => photo.category === selectedFilter);
    activePhotos = selectedFilter === 'all' && !showAll ? filtered.slice(0, 12) : filtered;
    const fragment = document.createDocumentFragment();
    activePhotos.forEach((photo, index) => {
      const tile = document.createElement('button');
      tile.className = 'photo-tile';
      tile.type = 'button';
      tile.setAttribute('aria-label', `View photo ${index + 1}: ${photo.alt}`);
      tile.dataset.index = String(index);
      const img = document.createElement('img');
      img.src = photo.src;
      img.alt = photo.alt;
      img.loading = index < 5 ? 'eager' : 'lazy';
      img.decoding = 'async';
      img.width = photo.portrait ? 720 : 1080;
      img.height = photo.portrait ? 1080 : 720;
      const caption = document.createElement('span');
      caption.className = 'tile-caption';
      caption.textContent = 'VIEW MOMENT +';
      tile.append(img, caption);
      tile.addEventListener('click', () => openPhoto(index, tile));
      fragment.appendChild(tile);
    });
    galleryGrid.replaceChildren(fragment);
    const canExpand = selectedFilter === 'all' && allPhotos.length > 12;
    galleryMore.hidden = !canExpand;
    if (canExpand) {
      moreButton.innerHTML = `${showAll ? 'Show Fewer Photos' : `View All ${allPhotos.length} Photos`} <svg class="icon" aria-hidden="true"><use href="#i-grid"/></svg>`;
    }
  }
  filters.forEach(btn => btn.addEventListener('click', () => {
    selectedFilter = btn.dataset.filter;
    showAll = false;
    filters.forEach(other => {
      const isCurrent = other === btn;
      other.classList.toggle('active', isCurrent);
      other.setAttribute('aria-pressed', String(isCurrent));
    });
    renderGallery();
  }));
  moreButton.addEventListener('click', () => {
    showAll = !showAll;
    renderGallery();
    if (!showAll) $('#memories').scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
  renderGallery();

  // Fullscreen gallery: keyboard, swipe, close-on-overlay and focus return.
  const lightbox = $('#photoLightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxCounter = $('#lightboxCounter');
  function updatePhoto() {
    const photo = activePhotos[activePhotoIndex];
    if (!photo) return;
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.alt;
    lightboxCounter.textContent = `${activePhotoIndex + 1} / ${activePhotos.length}`;
  }
  function openPhoto(index, origin) {
    if (!activePhotos[index]) return;
    tileFocus = origin;
    activePhotoIndex = index;
    updatePhoto();
    openDialog(lightbox, $('#lightboxClose'));
  }
  function movePhoto(direction) {
    activePhotoIndex = (activePhotoIndex + direction + activePhotos.length) % activePhotos.length;
    updatePhoto();
  }
  $('#lightboxPrev').addEventListener('click', () => movePhoto(-1));
  $('#lightboxNext').addEventListener('click', () => movePhoto(1));
  $('#lightboxClose').addEventListener('click', () => closeDialog(lightbox, tileFocus));
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeDialog(lightbox, tileFocus);
  });
  let touchX = null;
  lightbox.addEventListener('touchstart', event => {
    touchX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });
  lightbox.addEventListener('touchend', event => {
    if (touchX === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchX) - touchX;
    if (Math.abs(delta) > 45) movePhoto(delta < 0 ? 1 : -1);
    touchX = null;
  }, { passive: true });

  const cardModal = $('#cardModal');
  $('#viewCardButton').addEventListener('click', () => openDialog(cardModal, $('#cardModalClose')));
  $('#cardModalClose').addEventListener('click', () => closeDialog(cardModal));
  cardModal.addEventListener('click', event => {
    if (event.target === cardModal) closeDialog(cardModal);
  });

  function openDialog(dialog, focusTo) {
    lastFocus = document.activeElement;
    dialog.classList.add('open');
    dialog.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    focusTo?.focus();
  }
  function closeDialog(dialog, restoreFocus = lastFocus) {
    dialog.classList.remove('open');
    dialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (restoreFocus?.isConnected) restoreFocus.focus();
  }
  document.addEventListener('keydown', event => {
    const photoOpen = lightbox.classList.contains('open');
    const cardOpen = cardModal.classList.contains('open');
    if (!photoOpen && !cardOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (photoOpen) closeDialog(lightbox, tileFocus);
      if (cardOpen) closeDialog(cardModal);
    } else if (photoOpen && event.key === 'ArrowRight') {
      event.preventDefault(); movePhoto(1);
    } else if (photoOpen && event.key === 'ArrowLeft') {
      event.preventDefault(); movePhoto(-1);
    } else if (event.key === 'Tab') {
      const currentDialog = photoOpen ? lightbox : cardModal;
      const elements = $$('button:not([disabled]), a[href]', currentDialog).filter(el => el.offsetParent !== null);
      if (!elements.length) return;
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Full calendar invites; no Google account, app credentials or backend required.
  $$('.calendar-trigger').forEach(button => button.addEventListener('click', () => {
    const kind = button.dataset.event;
    const filename = kind === 'reception' ? 'varun-tejaswini-reception.ics' : 'varun-tejaswini-muhurtha.ics';
    const a = document.createElement('a');
    a.href = `assets/${filename}`;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    notify('Calendar invitation downloaded');
  }));

  // The silent, vertical mobile background is a specially cropped version of our film.
  // On mobile, sound comes from the original film when a guest explicitly requests it.
  const heroDesktop = $('#heroDesktop');
  const heroMobile = $('#heroMobile');
  const soundToggle = $('#soundToggle');
  const soundLabel = $('#soundLabel');
  let soundEnabled = false;
  let heroIsVisible = true;
  function mobileLayout() { return window.matchMedia('(max-width: 600px)').matches; }
  function activeHeroVideo() { return mobileLayout() ? heroMobile : heroDesktop; }
  if (mobileLayout()) heroDesktop.pause(); else heroMobile.pause();
  function updateSoundButton() {
    soundToggle.setAttribute('aria-pressed', String(soundEnabled));
    soundToggle.setAttribute('aria-label', soundEnabled ? 'Mute the background video' : 'Unmute the background video');
    soundLabel.textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
    $('.sound-icon use').setAttribute('href', soundEnabled ? '#i-volume' : '#i-mute');
  }
  soundToggle.addEventListener('click', async () => {
    soundEnabled = !soundEnabled;
    heroDesktop.muted = !soundEnabled;
    if (soundEnabled) {
      try { await heroDesktop.play(); }
      catch { soundEnabled = false; heroDesktop.muted = true; notify('Sound is not available in this browser'); }
    } else if (mobileLayout()) {
      heroDesktop.pause();
    }
    updateSoundButton();
  });
  updateSoundButton();

  if ('IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(entries => {
      heroIsVisible = entries[0]?.isIntersecting ?? false;
      if (!heroIsVisible) {
        heroDesktop.pause(); heroMobile.pause();
      } else if (!document.hidden && !reducedMotion.matches) {
        const playing = activeHeroVideo();
        playing.play().catch(() => {});
        if (soundEnabled && mobileLayout()) heroDesktop.play().catch(() => {});
      }
    }, { threshold: 0.05 });
    heroObserver.observe($('#home'));
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { heroDesktop.pause(); heroMobile.pause(); }
    else if (heroIsVisible && !reducedMotion.matches) {
      activeHeroVideo().play().catch(() => {});
      if (soundEnabled && mobileLayout()) heroDesktop.play().catch(() => {});
    }
  });
  window.matchMedia('(max-width: 600px)').addEventListener?.('change', () => {
    if (!mobileLayout() && !soundEnabled) heroDesktop.muted = true;
    if (heroIsVisible && !reducedMotion.matches) activeHeroVideo().play().catch(() => {});
    if (mobileLayout() && !soundEnabled) heroDesktop.pause();
    if (!mobileLayout()) heroMobile.pause();
  });

  $$('.film-media video').forEach(video => video.addEventListener('play', () => {
    $$('.film-media video').forEach(other => { if (other !== video) other.pause(); });
    heroDesktop.pause(); heroMobile.pause();
  }));

  // Share sheet on compatible phones; otherwise copy the published URL.
  async function shareInvitation() {
    const shareText = 'You are warmly invited to the wedding of K. S. Varun & C. S. Tejaswini! Reception: 18 Nov 2026, 7 PM onwards. Muhurtha: 19 Nov 2026, 10:45–11:15 AM. A & A Convention Center, Holalu Road, Mandya.';
    const isPublished = /^https?:/.test(location.protocol);
    const shareData = {
      title: 'Varun & Tejaswini · Wedding Invitation',
      text: shareText,
      ...(isPublished ? { url: location.href.split('#')[0] } : {})
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    const copyText = isPublished ? `${shareText}\n${shareData.url}` : shareText;
    try {
      await navigator.clipboard.writeText(copyText);
      notify(isPublished ? 'Invitation link copied!' : 'Invitation details copied! Publish the site to share a link.');
    } catch {
      const field = document.createElement('textarea');
      field.value = copyText;
      field.style.cssText = 'position:fixed;left:-9999px;top:0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      notify(copied ? 'Invitation details copied!' : 'Share this invitation after publishing the website.');
    }
  }
  ['#headerShare', '#mobileShare', '#shareButton'].forEach(selector => {
    $(selector)?.addEventListener('click', shareInvitation);
  });
})();
