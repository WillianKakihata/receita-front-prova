import { useEffect, useState } from "react";

interface Ingredient {
  _id: string;
  name: string;
}

interface Recipe {
  _id: string;
  name: string;
  time_preparation: number;
  aproxim_cost: number;
  ingredientsId: string[];
}

function IngredientItem({ ingredient, deleteIngredient, updateIngredient }: {
  ingredient: Ingredient;
  deleteIngredient: (id: string) => void;
  updateIngredient: (id: string, data: Partial<Ingredient>) => Promise<boolean>;
}) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(ingredient.name);

  return (
    <div className="flex gap-2 border p-2 mb-1 rounded items-center">
      {!editMode ? (
        <span>{ingredient.name}</span>
      ) : (
        <input value={name} onChange={(e) => setName(e.target.value)} className="border p-1 w-32" />
      )}
      <button onClick={() => deleteIngredient(ingredient._id)} className="bg-red-600 text-white px-1 rounded">X</button>
      <button
        onClick={() => {
          if (editMode) {
            updateIngredient(ingredient._id, { name }).then(ok => { if (ok) setEditMode(false) });
          } else setEditMode(true);
        }}
        className={`px-1 rounded ${editMode ? "bg-green-600 text-white" : "bg-blue-600 text-white"}`}
      >
        {editMode ? "Save" : "Edit"}
      </button>
    </div>
  );
}

function RecipeItem({ recipe, deleteRecipe, updateRecipe, addIngredientToRecipe, removeIngredientFromRecipe, allIngredients }:
  {
    recipe: Recipe;
    deleteRecipe: (id: string) => void;
    updateRecipe: (id: string, data: Partial<Recipe>) => Promise<boolean>;
    addIngredientToRecipe: (recipeId: string, ingredientId: string) => void;
    removeIngredientFromRecipe: (recipeId: string, ingredientId: string) => void;
    allIngredients: Ingredient[];
  }) {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(recipe.name);
  const [aproximCost, setAproximCost] = useState(recipe.aproxim_cost.toFixed(2));
  const [selectedIngredient, setSelectedIngredient] = useState("");

  const recipeIngredients = recipe.ingredientsId
    .map(id => allIngredients.find(i => i._id === id))
    .filter(Boolean) as Ingredient[];

  return (
    <div className="border p-3 mb-3 rounded w-150 items-centeR">
      {!editMode ? (
        <h3>{recipe.name} - ${recipe.aproxim_cost.toFixed(2)}</h3>
      ) : (
        <div className="flex gap-2 mb-2">
          <input value={name} onChange={(e) => setName(e.target.value)} className="border p-1" placeholder="Recipe Name" />
          <input type="number" step="0.01" value={aproximCost} onChange={(e) => setAproximCost(e.target.value)} className="border p-1 w-24" placeholder="Cost" />
        </div>
      )}

      <div className="flex gap-2 my-2">
        <button onClick={() => deleteRecipe(recipe._id)} className="bg-red-600 text-white px-2 rounded">Delete</button>
        <button
          onClick={() => {
            if (editMode) {
              updateRecipe(recipe._id, { name, aproxim_cost: parseFloat(aproximCost) }).then(ok => { if (ok) setEditMode(false) })
            } else setEditMode(true)
          }}
          className="bg-blue-600 text-white px-2 rounded"
        >
          {editMode ? "Save" : "Edit"}
        </button>
      </div>

      <div>
        <h4>Ingredients</h4>
        <ul>
          {recipeIngredients.map(ing => (
            <li key={ing._id} className="flex gap-2">
              {ing.name}
              <button onClick={() => removeIngredientFromRecipe(recipe._id, ing._id)} className="text-red-500">X</button>
            </li>
          ))}
        </ul>
        <div className="flex gap-1 mt-2">
          <select value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)} className="border p-1">
            <option value="">Select Ingredient</option>
            {allIngredients.map(ing => (
              <option key={ing._id} value={ing._id}>{ing.name}</option>
            ))}
          </select>
          <button
            onClick={() => { if (selectedIngredient) { addIngredientToRecipe(recipe._id, selectedIngredient); setSelectedIngredient("") } }}
            className="bg-green-600 text-white px-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newRecipeName, setNewRecipeName] = useState("");
  const [newRecipeCost, setNewRecipeCost] = useState(0);
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
    setNewRecipeCost(0);
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
    <h2 className="w-screen bg-cyan-500 flex justify-center align-center text-[20px]">Prova - TEMA 2 RECEITA e INGREDIENTES</h2>
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
