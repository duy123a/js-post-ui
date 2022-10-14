import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { truncateText } from './common';
import { setTextContent } from './selectors';
dayjs.extend(relativeTime);

function createPostElement(post) {
  if (!post) return;
  try {
    // find and clone template
    const postTemplate = document.getElementById('postItemTemplate');
    if (!postTemplate) return;

    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return;

    // update title, description, author
    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 130));
    setTextContent(liElement, '[data-id="author"]', post.author);

    // update thumbnail
    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) {
      thumbnailElement.src = post.imageUrl;
      thumbnailElement.addEventListener('error', () => {
        thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
      });
    }

    // calculate timespan
    setTextContent(liElement, '[data-id="timeSpan"]', `- ${dayjs(post.updatedAt).fromNow()}`);

    // attach events
    // go to post detail when click on div.post-item
    const divElement = liElement.firstElementChild;
    if (divElement) {
      divElement.addEventListener('click', (event) => {
        // if event triggered from menu -> ignore
        const menu = liElement.querySelector('[data-id="menu"]');
        if (menu && menu.contains(event.target)) return;

        window.location.assign(`/post-detail.html?id=${post.id}`);
      });
    }

    // add click event to edit button
    const editButton = liElement.querySelector('[data-id="edit"]');
    if (editButton) {
      editButton.addEventListener('click', (event) => {
        // prevent event bubbling to parent (don't use it when using analytics!)
        // event.stopPropagation();
        window.location.assign(`/add-edit-post.html?id=${post.id}`);
      });
    }

    // add remove event to remove button
    const removeButton = liElement.querySelector('[data-id="remove"]');
    if (removeButton) {
      removeButton.addEventListener('click', (event) => {
        const customEvent = new CustomEvent('post-delete', {
          bubbles: true,
          detail: post,
        });
        removeButton.dispatchEvent(customEvent);
      });
    }

    return liElement;
  } catch (error) {
    console.log('failed to create post item', error);
  }
}

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;
  const ulElement = document.getElementById(elementId);
  if (!ulElement) return;

  // clear current list
  ulElement.textContent = '';

  postList.forEach((post, idx) => {
    const liElement = createPostElement(post);
    ulElement.appendChild(liElement);
  });
}
