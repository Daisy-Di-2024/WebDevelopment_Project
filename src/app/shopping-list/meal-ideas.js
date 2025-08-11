"use client";
import { useState, useEffect } from 'react';

async function fetchMealIdeas(ingredient) {
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error", error);
  }
}

export default function MealIdeas({ ingredient }) {

  let [meals, setMeals] = useState([]);

  function loadMealIdeas() {
    fetchMealIdeas(ingredient).then(data => {
      setMeals(data.meals || []);
    });
  }

  useEffect(loadMealIdeas, [ingredient]);

  return (
    <div>
      <h1 >Meal Ideas</h1>
      <label>Here are some meal ideas using broccoli:</label>
      <ul>
        {meals.map((meal) => (
          <li key={meal.idMeal}>{meal.strMeal}</li>
        ))}
      </ul>
    </div>

  );
}