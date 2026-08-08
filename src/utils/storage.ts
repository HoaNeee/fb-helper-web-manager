export function getValueFromStorage(key: string, defaultValue?: any) {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return defaultValue;
}

export function setValueToStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function clearStorage() {
  localStorage.clear();
}

export function deleteValueFromStorage(key: string) {
  localStorage.removeItem(key);
}
