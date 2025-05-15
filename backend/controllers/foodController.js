import foodModel from "../models/foodModel.js";
import fs from "fs";

const addFood = async (req, res) => {
    console.log("Received request body:", req.body);
    console.log("Received file:", req.file);

    let image_filename = `${req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    });
    try {
        await food.save();
        console.log("Saved food:", food);
        res.json({
            success: true,
            message: "Food added successfully",
            data: food,
        });

    } catch (error) {
        console.log("Error saving food:", error);
        res.status(500).json({
            success: false,
            message: "Error adding food",
            error: error.message
        });
    }
}

const listFood = async (req, res) => {
    try {
        const food = await foodModel.find({});
        res.json({
            success: true,
            message: "Food list fetched successfully",
            data: food,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching food list",
        });
    }
}

const removeFood = async (req, res) => {
    try {
        const food = await foodModel.findById(req.body.id);
        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        fs.unlink(`uploads/${food.image}`, () => { });
        await foodModel.findByIdAndDelete(req.body.id);
        res.json({
            success: true,
            message: "Food removed successfully",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error removing food",
            error: error.message
        });
    }
}
export { addFood, listFood, removeFood };