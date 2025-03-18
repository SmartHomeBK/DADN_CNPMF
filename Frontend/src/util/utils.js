export const setLocalStorage = (key, value) => {
  let stringData = JSON.stringify(value);
  localStorage.setItem(key, stringData);
};

export const getLocalStorage = (key) => {
  const localData = localStorage.getItem(key);
  return localData ? JSON.parse(localData) : null;
};
