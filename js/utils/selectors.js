export function setTextContent(parent, selector, text) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function getUlPagination() {
  return document.getElementById('pagination');
}

export function setFieldValue(form, selector, value) {
  if (!form) return;
  const field = form.querySelector(selector);
  if (field) field.value = value;
}

export function setBackgroundImage(parent, selector, imageUrl) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  if (element) element.style.backgroundImage = `url("${imageUrl}")`;
}
