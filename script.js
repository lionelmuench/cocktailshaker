document.addEventListener('DOMContentLoaded', () => {
    // Helper function to clear previous results
    function clearResults() {
        const resultsContainer = document.querySelector('.recipes-display');
        resultsContainer.innerHTML = '';
    }

    // Function to toggle content visibility
    function toggleContent(sectionId) {
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(section => {
            section.style.display = 'none';
        });
        clearResults();
        const activeSection = document.querySelector(`#${sectionId}-content`);
        activeSection.style.display = 'block';
    }

    // Function to create and display cocktail data in the DOM
    function displayCocktailData(cocktail) {
        const resultsContainer = document.querySelector('.recipes-display');
        clearResults();

        const cocktailElem = document.createElement('div');
        cocktailElem.classList.add('cocktail');

        const cocktailName = document.createElement('h2');
        cocktailName.textContent = cocktail.strDrink;

        const cocktailImage = document.createElement('img');
        cocktailImage.src = cocktail.strDrinkThumb;
        cocktailImage.alt = cocktail.strDrink;

        const cocktailInstructions = document.createElement('p');
        cocktailInstructions.textContent = cocktail.strInstructions;

        // Build the list of ingredients
        const ingredientsList = document.createElement('ul');
        for (let i = 1; i <= 15; i++) {
            const ingredient = cocktail[`strIngredient${i}`];
            const measure = cocktail[`strMeasure${i}`];
            if (ingredient) {
                const ingredientItem = document.createElement('li');
                ingredientItem.textContent = `${measure ? measure : ''} ${ingredient}`;
                ingredientsList.appendChild(ingredientItem);
            }
        }
        const instructionsHeading = document.createElement('h3');
        instructionsHeading.textContent = 'Instructions:';
    
        const ingredientsHeading = document.createElement('h3');
        ingredientsHeading.textContent = 'Ingredients:';

        cocktailElem.appendChild(cocktailName);
        cocktailElem.appendChild(cocktailImage);
        cocktailElem.appendChild(ingredientsHeading);
        cocktailElem.appendChild(ingredientsList);
        cocktailElem.appendChild(instructionsHeading);
        cocktailElem.appendChild(cocktailInstructions);

        resultsContainer.appendChild(cocktailElem);
    }

    // Function to fetch cocktail data by name
    function fetchCocktailByName(cocktailName) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks) {
                    displayCocktailData(data.drinks[0]);
                } else {
                    console.log('No cocktails found with that name.');
                    // Optionally, display a user-friendly message on the page
                }
            })
            .catch(error => {
                console.error('Error fetching cocktail data:', error);
                // Optionally, display a user-friendly message on the page
            });
    }

    // Function to fetch a random cocktail
    function fetchRandomCocktail() {
        fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                if (data.drinks) {
                    displayCocktailData(data.drinks[0]);
                } else {
                    alert('No random cocktail found.');
                }
            })
            .catch(error => {
                console.error('Error fetching random cocktail:', error);
                alert('An error occurred while fetching a random cocktail.');
            });
    }

    function makeResultsClickable() {
        const results = document.querySelectorAll('.recipes-display p');
        results.forEach(result => {
            result.style.cursor = 'pointer';
            result.addEventListener('click', () => {
                fetchCocktailByName(result.textContent);
            });
        });
    }

    // Function to fetch cocktails by ingredient
    function fetchCocktailsByIngredient(ingredient) {
        fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`)
            .then(response => response.json())
            .then(data => {
                if (data.drinks) {
                    const resultsContainer = document.querySelector('.recipes-display');
                    clearResults();
                    data.drinks.forEach(drink => {
                        const drinkName = document.createElement('p');
                        drinkName.textContent = drink.strDrink;
                        resultsContainer.appendChild(drinkName);
                    });
                    makeResultsClickable(); // Make the results clickable
                } else {
                    console.log('No cocktails found with that ingredient.');
                    // Optionally, display a user-friendly message on the page
                }
            })
            .catch(error => {
                console.error('Error fetching cocktails by ingredient:', error);
                // Optionally, display a user-friendly message on the page
            });
    }

    // Function to animate shaker
    function animateShaker() {
        const shaker = document.getElementById('cocktail-shaker');
        shaker.classList.add('shaker-animation');
        setTimeout(() => {
            shaker.classList.remove('shaker-animation');
        }, 1000); // Duration of the shake animation
    }

    // Add event listeners to header sections
    document.querySelectorAll('.header-section').forEach(section => {
        section.addEventListener('click', function () {
            toggleContent(this.id);
        });
    });

    // Add event listener for shaker animation and random cocktail fetch
    document.getElementById('cocktail-shaker').addEventListener('click', function () {
        animateShaker();
        fetchRandomCocktail();
    });

    // Add event listener for search functionality
    document.getElementById('cocktail-search-button').addEventListener('click', function () {
        const cocktailName = document.getElementById('cocktail-search-input').value;
        if (cocktailName) {
            fetchCocktailByName(cocktailName);
        } else {
            alert('Please enter a cocktail name.');
        }
    });

    // Add event listener for ingredient search functionality
    document.getElementById('ingredient-search-button').addEventListener('click', function () {
        const ingredient = document.getElementById('ingredient-search-input').value;
        if (ingredient) {
            fetchCocktailsByIngredient(ingredient);
        } else {
            alert('Please enter an ingredient.');
        }
    });
});
