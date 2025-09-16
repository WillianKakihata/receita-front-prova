import { useState } from "react";
import type { Ingredient } from "../interfaces/Ingredient";
import type { Recipe } from "../interfaces/Recipe";

export function RecipeItem({ recipe, deleteRecipe, updateRecipe, addIngredientToRecipe, removeIngredientFromRecipe, allIngredients }:
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