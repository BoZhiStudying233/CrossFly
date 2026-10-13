const tabs = [...document.querySelectorAll('[data-tab]')];

function selectTab(selectedTab) {
  tabs.forEach(tab => {
    const active = tab === selectedTab;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    document.getElementById(`panel-${tab.dataset.tab}`).hidden = !active;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let nextIndex;
    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (index + 1) % tabs.length;
        break;
      case 'ArrowLeft':
        nextIndex = (index + tabs.length - 1) % tabs.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    selectTab(tabs[nextIndex]);
    tabs[nextIndex].focus();
  });
});

const dialog = document.getElementById('figure-dialog');
const dialogImage = dialog.querySelector('img');

document.querySelectorAll('.image-expand').forEach(button => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    dialogImage.src = image.src;
    dialogImage.alt = image.alt;
    dialog.showModal();
  });
});

dialog.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

const demoSection = document.getElementById('demos');
const demoGrid = demoSection.querySelector('.demo-grid');
const demoCards = [...demoGrid.querySelectorAll('.demo-card')];
const benchmarkSection = document.getElementById('benchmark');
const methodSection = document.getElementById('method');
const resultsSection = document.getElementById('results');

function updateDemoVisibility() {
  const visibleCount = demoCards.filter(card => !card.hidden).length;
  const visible = visibleCount > 0;
  demoSection.hidden = !visible;
  demoGrid.classList.toggle('single-demo', visibleCount === 1);
  benchmarkSection.classList.toggle('band', visible);
  methodSection.classList.toggle('band', !visible);
  resultsSection.classList.toggle('band', visible);
}

demoCards.forEach(card => {
  const video = card.querySelector('video');
  video.addEventListener('error', () => {
    card.hidden = true;
    updateDemoVisibility();
  });

  // Check headers without downloading video; native controls load it on Play.
  fetch(video.dataset.src, { method: 'HEAD', cache: 'no-store' })
    .then(response => {
      if (!response.ok || !response.headers.get('content-type')?.startsWith('video/')) return;
      video.src = video.dataset.src;
      card.hidden = false;
      updateDemoVisibility();
    })
    .catch(() => {
      // Keep unavailable demos hidden without leaving an empty slot.
    });
});
