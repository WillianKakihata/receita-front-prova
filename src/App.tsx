import { useEffect, useState } from "react";
import type { Ingredient } from "./interfaces/Ingredient";
import type { Recipe } from "./interfaces/Recipe";
import { IngredientItem } from "./components/IngredientItem";
import { RecipeItem } from "./components/RecipeItem";

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeCost, setNewRecipeCost] = useState(10.14);
  const [newIngredientName, setNewIngredientName] = useState("");

  const API_RECIPES = "http://localhost:3000/recipe";
  const API_INGREDIENTS = "http://localhost:3000/ingredient";

  async function fetchRecipes() {
    const res = await fetch(API_RECIPES);
    setRecipes(await res.json())
  }
  async function fetchIngredients() {
    const res = await fetch(API_INGREDIENTS);
    setIngredients(await res.json())
  }

  useEffect(() => {
    fetchRecipes();
    fetchIngredients();
  }, []);

  async function createRecipe(name: string, cost: number) {
    await fetch(API_RECIPES, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, time_preparation: 0, aproxim_cost: cost, ingredients: [] })
    });
    fetchRecipes();
    setNewRecipeName("");
    setNewRecipeCost(10.14);
  }
  async function deleteRecipe(id: string) {
    await fetch(`${API_RECIPES}/${id}`, { method: "DELETE" });
    fetchRecipes();
    fetchIngredients();
  }
  async function updateRecipe(id: string, data: Partial<Recipe>) {
    const res = await fetch(`${API_RECIPES}/${id}`,
      {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    fetchRecipes();
    return res.ok
  }
  async function addIngredientToRecipe(recipeId: string, ingredientId: string) {
    await fetch(`${API_RECIPES}/${recipeId}/addingredient/${ingredientId}`,
      { method: "PUT" });
    fetchRecipes()
  }
  async function removeIngredientFromRecipe(recipeId: string, ingredientId: string) {
    await fetch(`${API_RECIPES}/${recipeId}/removeingredient/${ingredientId}`, { method: "PUT" });
    fetchRecipes()
  }
  async function createIngredient(name: string) {
    await fetch(API_INGREDIENTS,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    fetchIngredients()
  }
  async function deleteIngredient(id: string) {
    await fetch(`${API_INGREDIENTS}/${id}`, { method: "DELETE" });
    fetchIngredients()
  }
  async function updateIngredient(id: string, data: Partial<Ingredient>) {
    const res = await fetch(`${API_INGREDIENTS}/${id}`,
      {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
    fetchIngredients();
    return res.ok
  }

  return (
    <div>
    <h2 className="w-screen bg-cyan-500 flex justify-center align-center text-[20px] text-white">Prova  (TEMA 2) - RECEITA e INGREDIENTES</h2>
      <div className="p-5 flex justify-center align-center gap-5">
        <div className="w-1/2 h-180 overflow-scroll gap 2 ">
          <h2 className="text-xl mb-3 justify-center align-center flex">Recipes</h2>
          <div className="flex gap-2 mb-3 align-center flex justify-center ">
            <input value={newRecipeName} onChange={e => setNewRecipeName(e.target.value)} placeholder="Recipe Name" className="border p-1" />
            <input type="number" step="0.01" value={newRecipeCost} onChange={e => setNewRecipeCost(Number(e.target.value))} placeholder="Cost" className="border p-1 w-24" />
            <button onClick={() => createRecipe(newRecipeName, newRecipeCost)} className="bg-green-600 text-white px-2 rounded">Create</button>
          </div>
          {recipes.map(r => (
            <RecipeItem
              key={r._id} recipe={r} deleteRecipe={deleteRecipe} updateRecipe={updateRecipe}
              addIngredientToRecipe={addIngredientToRecipe} removeIngredientFromRecipe={removeIngredientFromRecipe}
              allIngredients={ingredients}
            />
          ))}
        </div>

        <div className="w-1/2 h-180 overflow-scroll">
          <h2 className="text-xl mb-3 justify-center align-center flex">Ingredients</h2>
          <div className="flex gap-2 mb-3 align-center flex justify-center">
            <input placeholder="Name" value={newIngredientName} onChange={e => setNewIngredientName(e.target.value)} className="border p-1" />
            <button onClick={() => { createIngredient(newIngredientName); setNewIngredientName("") }} className="bg-green-600 text-white px-2 rounded">Create</button>
          </div>
          {ingredients.map(ing => (
            <IngredientItem key={ing._id} ingredient={ing} deleteIngredient={deleteIngredient} updateIngredient={updateIngredient} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
