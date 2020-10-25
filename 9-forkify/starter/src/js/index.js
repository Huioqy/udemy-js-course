import Search from './models/Search';
import Recipe from './models/Recipe'
import List from './models/List'
import Likes from './models/Like';
import *  as searchView from './views/searchView';
import *  as recipeView from './views/recipeView';
import *  as listView from './views/listView';
import *  as likeView from './views/likeView';
import { elements, renderLoader, clearLoader } from './views/base'

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const controllSearch = async () => {

    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New Search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInpur();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (err) {
            alert('sth wrong with the search...');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controllSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

/**
 * Recipe Controller
**/
const controllRecipe = async () => {
    // 1) get recipe id from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes
        renderLoader(elements.recipe);
        recipeView.clearRecipe()

        // Hightlight selected search item
        if (state.search) searchView.hightlightSeletected(id);

        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data, await for the promise, and parseIntgredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate serving and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();

            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } catch (error) {
            clearLoader();
            console.log(error);
        }
    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controllRecipe));

/**
 * List Controller
**/
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach( el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // Handle the delte event
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);

    // Handle the update event
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
})

/**
 * Like Controller
**/
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID, 
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likeView.toggleLikeBtn(true);

        // Add like to UI list
        likeView.renderLike(newLike);

    // User has liked current recipe
    } else {
        // remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likeView.toggleLikeBtn(false);

        // remobe like from UI list
        likeView.deletLike(currentID);
    }
    likeView.toggleLikeMenu(state.likes.getNumLikes());
}

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likeView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likeView.renderLike(like))
})

// Handling recipe button clicks 
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingrediens to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Add ingrediens to like list
        controlLike();
    }
})










