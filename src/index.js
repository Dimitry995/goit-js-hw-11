import { GalleryAPI } from './fetchFotos';
import { LoadMoreBtn } from './loadMore';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
 import 'simplelightbox/dist/simple-lightbox.min.css';
const API_KEY = '32190498-c060c2ff03edf94bf531f7f07';
    let searchForm = document.querySelector('#search-form');
    let imageContainer = document.querySelector('.gallery');
    let searchBtn = document.querySelector('.search-button');
searchForm.addEventListener('submit', onFormSubmit);
const galleryAPI = new GalleryAPI();
const loadMoreBtn = new LoadMoreBtn('load-more', onLoadMoreBtn);
async function onFormSubmit(event) {
    event.preventDefault();
    galleryAPI.query = event.currentTarget.elements.searchQuery.value.trim();
    if (galleryAPI.query === '') {
        Notiflix.Notify.warning('Enter something');
        return;
    }
    galleryAPI.resetPage();
    try {
        const { hits, totalHits } = await galleryAPI.axiosAPI();
        onMarkupPhotos(hits);
        loadMoreBtn.show();
    } catch (error) {
       Notiflix.Notify.failure('Error');
    }
}
imageContainer.insertAdjacentHTML('beforeend', markupPhotos);
async function onLoadMoreBtn() {
    loadMoreBtn.loading();
    try {
        const { hits, totalHits } = await galleryAPI.axiosAPI();
        onMarkupPhotos(hits);
        loadMoreBtn.endLoading();
    } catch (error) {
       Notiflix.Notify.failure('Error');
    }
}
function onMarkupPhotos(hits) {
  const markupPhotos = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
              <a class="gallery-link" href="${largeImageURL}">
                <img class="gallery__item" src="${webformatURL}" alt="${tags}" loading="lazy" />
              </a>
              <div class="info">
                <p class="info-item">
                  <b>Likes: </b>${likes}
                </p>
                <p class="info-item">
                  <b>Views: </b>${views}
                </p>
                <p class="info-item">
                  <b>Comments: </b>${comments}
                </p>
                <p class="info-item">
                  <b>Downloads: </b>${downloads}
                </p>
              </div>
      </div>`;
      }
    )
    .join('');
    imageContainer.insertAdjacentHTML('beforeend', markupPhotos);
}
const lightbox = new SimpleLightbox('.gallery-link', {
  captionsData: 'alt',
  captionDelay: 250,
});
const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});