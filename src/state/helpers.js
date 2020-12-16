export function loadState(name, defaultValue) {
  return JSON.parse(localStorage.getItem(name)) || defaultValue;
}

export function saveState(name, state) {
  localStorage.setItem(name, JSON.stringify(state));
}
