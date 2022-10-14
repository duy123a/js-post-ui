import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList, toast } from './utils/';

async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    if (filterName) url.searchParams.set(filterName, filterValue);
    // reset page if needed
    if (filterName === 'title_like') url.searchParams.set('_page', 1);

    history.pushState({}, '', url);

    const { data, pagination } = await postApi.getAll(url.searchParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('handleFilterChange function fail', error);
  }
}

function registerPostDeleteEvent() {
  document.addEventListener('post-delete', async (event) => {
    try {
      const post = event.detail;
      const message = `Are you sure to remove post ${post.title}?`;
      // TODO: Use Bootstraps modal instead
      if (window.confirm(message)) {
        await postApi.remove(post.id);
        await handleFilterChange();
        toast.success('Remove post successfully');
      }
    } catch (error) {
      console.log('failed to remove post', error);
      toast.error('Fail to remove post');
    }
  });
}

(async () => {
  try {
    // set default params if null
    const url = new URL(window.location);
    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);
    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    registerPostDeleteEvent();

    // attach click event for links
    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    // attach search event
    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    // render post list
    // const queryParams = new URLSearchParams(window.location.search);
    // const { data, pagination } = await postApi.getAll(queryParams);
    // console.log(data);
    // renderPostList('postList', data);
    // renderPagination('pagination', pagination);
    handleFilterChange();
  } catch (error) {
    console.log('home.js main function error', error);
  }
})();
