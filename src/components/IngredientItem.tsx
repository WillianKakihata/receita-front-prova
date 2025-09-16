import { useState } from "react";
import type { Ingredient } from "../interfaces/Ingredient";

export function IngredientItem({ ingredient, deleteIngredient, updateIngredient }: {
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