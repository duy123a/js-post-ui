import dayjs from 'dayjs';
import postApi from './api/postApi';
import { registerLightbox, setTextContent } from './utils';

function renderPostDetail(post) {
  if (!post) return;

  // render title
  setTextContent(document, '#postDetailTitle', post.title);
  // render description
  setTextContent(document, '#postDetailDescription', post.description);
  // render author
  setTextContent(document, '#postDetailAuthor', post.author);
  // render updateAt
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YY HH:mm')
  );
  // render hero image (imageUrl)
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;
    heroImage.addEventListener('error', () => {
      heroImage.style.backgroundImage = `url("https://via.placeholder.com/1368x400?text=thumbnail")`;
    });
  }
  // render edit page link
  const editPageLink = document.getElementById('goToEditPageLink');
  if (editPageLink) {
    editPageLink.href = `/add-edit-post.html?id=${post.id}`;
    const iconEdit = document.createElement('i');
    iconEdit.classList.add('fas', 'fa-edit');
    editPageLink.appendChild(iconEdit);
    const text = document.createElement('span');
    text.textContent = ' Edit Post';
    editPageLink.appendChild(text);
  }
}

(async () => {
  registerLightbox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });
  try {
    // get post id from URL
    const queryParams = new URLSearchParams(window.location.search);
    // fetch post detail API
    const postId = queryParams.get('id');
    if (!postId) return;
    const post = await postApi.getById(postId);
    renderPostDetail(post);
    // render post detail
  } catch (error) {
    console.log('post detail main function error', error);
  }
})();
