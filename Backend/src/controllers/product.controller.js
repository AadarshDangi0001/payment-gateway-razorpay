import productModel from "../models/product.model.js";


export const createProduct = async (req, res) => {
 const { image, name, description, price:{amount, currency}, category } = req.body;

 try {
   const newProduct = new productModel({
     image,
     name,
     description,
        price: { amount, currency },
     category,
   });

   const savedProduct = await newProduct.save();
   res.status(201).json(savedProduct);
 } catch (error) {
   res.status(500).json({ message: "Error creating product", error });
 }
};


export const getProducts = async (req, res) => {
 try {
   const products = await productModel.findOne();
    return res.status(200).json({
        message: "Products fetched successfully",
        products
    }
    );
 } catch (error) {
   res.status(500).json({ message: "Error fetching products", error });
 }
};

