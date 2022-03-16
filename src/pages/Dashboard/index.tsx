import Header from "../../components/Header";
import api from "../../services/api";
import FoodCard from "../../components/FoodCard";
import ModalAddFood from "../../components/ModalAddFood";
import ModalEditFood from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";
import { useEffect, useState } from "react";
import Food from "../../types";

const Dashboard = (): JSX.Element => {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food>({} as Food);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);

  const handleAddFood = async (food: Food) => {
    const newFood = await api.post("/foods", {
      ...food,
      available: true,
    });

    setFoods([...foods, newFood.data]);
  };

  const handleUpdateFood = async (food: Food) => {
    const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
      ...editingFood,
      ...food,
    });

    const foodsUpdated = foods.filter((f) => f.id !== food.id);
    setFoods([...foodsUpdated, foodUpdated.data]);
  };

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);
    setFoods(foodsFiltered);
  };

  const handleEditFood = async (food: Food) => {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  useEffect(() => {
    api
      .get("/foods")
      .then((response) => response.data)
      .then((data: Food[]) => setFoods(data));
  }, []);

  return (
    <>
      <Header openModal={() => setModalOpen(!modalOpen)} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={() => setModalOpen(!modalOpen)}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={() => setEditModalOpen(!editModalOpen)}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
