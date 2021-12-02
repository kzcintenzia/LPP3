import recipes from './recipe.js';

function displayElements() {
  const resultSection = document.querySelector('.result');
  const form = document.querySelector('#form');
  const searchFilter = document.querySelector('.search__filter');

  //DISPLAY SEARCH BUTTON:
  const advancedSearchField = new SearchField();

  const deviceAdvancedSearch = advancedSearchField.createSearchField(
    'ustenciles'
  );
  searchFilter.insertAdjacentHTML('afterbegin', deviceAdvancedSearch);

  const applianceAdvancedSearch = advancedSearchField.createSearchField(
    'appareils'
  );
  searchFilter.insertAdjacentHTML('afterbegin', applianceAdvancedSearch);

  const ingredientsAdvancedSearch = advancedSearchField.createSearchField(
    'ingredients'
  );
  searchFilter.insertAdjacentHTML('afterbegin', ingredientsAdvancedSearch);

  //DISPLAY ALL RECIPE ON PAGE LOAD:
  resultSection.innerHTML = displayRecipe(recipes);
  form.reset();
}

///////////////NORMALIZE DATAS/////////////////////
function normalizeData(string) {
  return string
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

///////////////REMOVE DUPLICATE/////////////////////
function removeDuplicate(array) {
  const duplicateItems = [];
  const noDuplicate = array.filter((element) => {
    if (element in duplicateItems) {
      return false;
    }
    duplicateItems[element] = true;
    return true;
  });
  return noDuplicate;
}
class SearchField {
  constructor() {
    // eslint-disable-next-line func-names
    this.createSearchField = function (string) {
      return `
      <article class=article-${string}>
        <div class="search__filter__element ${string}">
            <span class="search__filter__label" id="currentFilter"
              >${string}</span
            >
            <input
              id="${string}Input"
              type="text"
              class="search__filter__input ${string}"
              placeholder="${string}"
            />
            <div class="arrow"></div>
          </div>
          <ul
          id="list${string}"
            class="search__filter__list ${string}"
          ></ul>
          </article>`;
    };
  }
}

//////////////THIS FUNCTION MAP THROUGH THE RECIPES ARRAY AND DISPLAY THEM///////////////
function displayRecipe(array) {
  const arraySorted = array.sort(function (a, b) {
    let x = normalizeData(a.name);
    let y = normalizeData(b.name);
    if (x > y) return 1;
    if (x < y) return -1;
    return 0;
  });
  const recipeResult = arraySorted
    .map((element) => {
      const { name } = element;
      const { time } = element;
      const allIngredients = element.ingredients;
      const intstruction = element.description;

      const ingredients = allIngredients
        .map((el) => {
          const { ingredient } = el;
          const quantityRaw = el.quantity;
          const unitRaw = el.unit;
          const quantityArray = [];
          const unitArray = [];
          quantityArray.push(quantityRaw);
          unitArray.push(unitRaw);
          const quantity = quantityArray.filter((ele) => ele !== undefined);
          const unit = unitArray.filter((item) => item !== undefined);

          return (quantity.length < 1 && unit.length < 1) ? `<p><b>${ingredient}</b> ${quantity} ${unit}</p>` : `<p><b>${ingredient}:</b> ${quantity} ${unit}</p>`;
          
        })
        .join('');

      return `<article class="recipe">
          <div class="recipe__image">
                <img src="" />
            </div>
          <div class="recipe__info">

            <div class="recipe__info__first-element">
              <h2 class="recipe__info__first-element__title">${name}</h2>
              <span class="recipe__info__first-element__time"><i class="far fa-clock"></i> ${time} minutes</span>
            </div>

            <div class="recipe__info__second-element">
              <div class="recipe__info__second-element__ingredients">${ingredients}</div>
              <p class="recipe__info__second-element__instructions">${intstruction}</p>
            </div>

          </div>
        </article>`;
    }).join('')
    return recipeResult;
}


const searchInput = document.querySelector('#searchInput');
const resultSection = document.querySelector('.result');

let inputNormalized;
let globalSearch;
let globalIngredient;
let globalAppliance;
let globalDevice;
let ingredientTagsArray = [];
let applianceTagsArray = [];
let deviceTagsArray = [];

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
  }
});

displayElements()


/////////LISTEN TO THE MAIN INPUT//////////
const listIngredient = document.querySelector(
  '.search__filter__list.ingredients'
);
const listAppliance = document.querySelector(
  '.search__filter__list.appareils'
);
const listDevice = document.querySelector('.search__filter__list.ustenciles');
const tagSection = document.querySelector('.search__tags__ingredients');

searchInput.addEventListener('input', (e) => {
  const input = e.target.value;
  inputNormalized = normalizeData(input);
  tagSection.innerHTML = '';
  ingredientTagsArray = [];
  applianceTagsArray = [];
  deviceTagsArray = [];

  if (inputNormalized.length >= 3) {
    globalSearch = searchQuery(recipes, inputNormalized);
    if (globalSearch.length < 1) {
      resultSection.innerHTML = `<p class='error-result'>Pas de recettes à afficher pour cette recherche.</p>`;
      listIngredient.innerHTML = '';
      listAppliance.innerHTML = '';
      listDevice.innerHTML = '';
    } else {
      resultSection.innerHTML = displayRecipe(globalSearch);
      globalIngredient = globalSearch.flatMap(
        (element) => element.ingredients
      );
      displayListElement(globalIngredient, 'ingredient', '', 'ingredients');

      globalAppliance = globalSearch;
      displayListElement(globalAppliance, 'appliance', '', 'appareils');

      globalDevice = globalSearch;
      displayListElement(globalDevice, 'devices', '', 'ustenciles');
    }
  } else {
    resultSection.innerHTML = displayRecipe(recipes);
    listIngredient.innerHTML = '';
    listAppliance.innerHTML = '';
    listDevice.innerHTML = '';
  }
});


const searchInputIngredient = document.querySelector('#ingredientsInput');
const searchInputAppliance = document.querySelector('#appareilsInput');
const searchInputDevice = document.querySelector('#ustencilesInput');