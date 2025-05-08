import foodModel from "../models/foodModel.js";
import multer from "multer";
import fs from "fs";

const addFood = async (req, res) => {
    let image_filename = `{req.file.filename}`;
    const food = new foodModel({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename,
    });
    try {
        await food.save();
        res.json({
            success: true,
            message: "TSuccessfully added food",
            food: food,
        })
        
        }
    catch (error) {
        console.error(error);
        res.json({
            success: false,
            message: "Failed to add food",
        });
    }
}

export { addFood }