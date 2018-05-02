import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global App State 
 * - Search object
 * - Current recipe object
 * - Shopping List
 * - Liked recipes

*/
const state = {};


/** 
 * SEARCH CONTROLLER 
**/
const controlSearch = async () => {
    // 1) Get query from view
    //const query = searchView.getInput(); //TODO
    //Testing
    const query = 'pizza';

    if (query) {
        // 2) new search object and add to state
        state.search = new Search(query);
        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch(err) {
            alert('Something went wrong! ', err);
            clearLoader();
            console.log(err)
        }

    }

}

//Search button press
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

// TESTING - adjusting controlSearch
window.addEventListener('load', e => {
    e.preventDefault();
    controlSearch();
});

//Pagiatnion of recipes
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    let goToPage;
    btn && (
        goToPage = parseInt(btn.dataset.goto, 10)
    )
    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);
});


/** 
 * RECIPE CONTROLLER 
**/
const controlRecipe = async () => {
    const id = window.location.hash.replace('#', '');
    if(id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Create a new recipe Object
        state.recipe = new Recipe(id);

        // TESTING
        window.r = state.recipe;

        try {
            //Get recipe Data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //Calc servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            //Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch(err) {
            alert('Error processing recipe! ');
            clearLoader();
            console.log(err);
        }

    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach( e => window.addEventListener(e, controlRecipe));