import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getIconByName } from "../utilities/icons";

const Categories = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); 

  useEffect(() => {
    fetch("https://ec2-54-145-44-94.compute-1.amazonaws.com/Categorias/list")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleCategoryClick = (category) => {
    const newSelectedCategory = selectedCategory === category ? null : category;
    setSelectedCategory(newSelectedCategory);
    onCategorySelect(newSelectedCategory);
  };

  return (
    <div className="w-full flex justify-left gap-48 mb-6 flex-wrap">
      {categories.map((category) => (
        <CategoryButton
          key={category.id}
          label={category.titulo}
          category={category.titulo}
          iconName={category.icono}
          onClick={() => handleCategoryClick(category.titulo)}
        />
      ))}
    </div>
  );
};

const CategoryButton = ({ label, category, onClick, isActive, iconName }) => {
  return (
    <button
      className={`${
        isActive ? "font-bold text-black" : ""
      } hover:underline focus:outline-none focus:shadow-outline-blue flex flex-col items-center gap-2 text-[#717171] px-2 py-1 rounded-lg`}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={getIconByName(iconName)} size="sm" />
      {label}
    </button>
  );
};

export default Categories;
