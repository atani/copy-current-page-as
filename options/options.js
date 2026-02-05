const DEFAULT_SETTINGS = {
  defaultMode: 'markdown',
};

const statusElement = document.getElementById('status');
const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));

async function loadSettings() {
  const settings = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  const mode = settings.defaultMode || DEFAULT_SETTINGS.defaultMode;

  const target = modeInputs.find((input) => input.value === mode);
  if (target) target.checked = true;
}

async function saveMode(value) {
  await chrome.storage.sync.set({ defaultMode: value });
  statusElement.textContent = 'Saved';
  window.setTimeout(() => {
    statusElement.textContent = '';
  }, 1200);
}

modeInputs.forEach((input) => {
  input.addEventListener('change', async (event) => {
    if (!event.target.checked) return;
    await saveMode(event.target.value);
  });
});

loadSettings();
