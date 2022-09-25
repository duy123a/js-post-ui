import throttle from 'lodash.throttle';

export function renderPagination(elementId, pagination) {
  const ulPagination = document.getElementById(elementId);
  if (!pagination || !ulPagination) return;

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if disable/enable prev/next link
  if (_page <= 1) ulPagination.firstElementChild?.classList.add('disabled');
  else ulPagination.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulPagination.lastElementChild?.classList.add('disabled');
  else ulPagination.lastElementChild?.classList.remove('disabled');
}

function handlePrevClick(elementId, callback) {
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;
  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  if (page > 1) callback?.(page - 1);
}

function handleNextClick(elementId, callback) {
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;
  const page = Number.parseInt(ulPagination.dataset.page) || 1;
  const totalPages = ulPagination.dataset.totalPages;
  if (page < totalPages) callback?.(page + 1);
}

export function initPagination({ elementId, defaultParams, onChange }) {
  // bind click event for prev/next link
  const ulPagination = document.getElementById(elementId);
  if (!ulPagination) return;

  // add click event for prev link
  const throttle_prevlink = throttle((elementId, callback) => {
    handlePrevClick(elementId, callback);
  }, 500);
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink)
    prevLink.addEventListener('click', (event) => {
      event.preventDefault();
      throttle_prevlink(elementId, onChange);
    });

  // add click event for next link
  const throttle_nextlink = throttle((elementId, callback) => {
    handleNextClick(elementId, callback);
  }, 500);
  const nextLink = ulPagination.lastElementChild?.firstElementChild;
  if (nextLink)
    nextLink.addEventListener('click', (event) => {
      event.preventDefault();
      throttle_nextlink(elementId, onChange);
    });
}
