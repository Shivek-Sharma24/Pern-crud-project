import { sql } from "../config/db.js";

// CRUD Operations for Products.

export const getProducts = async (req, res) => {
  try {
    const products = await sql`SELECT * FROM products ORDER BY create_at DESC`;
    console.log("Products fetched:", products);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, image, price } = req.body;
  if (!name || !image || !price) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newProduct = await sql`
      INSERT INTO products (name, image, price)
      VALUES (${name}, ${image}, ${price})
      RETURNING *
    `;
    console.log('new product added :' , newProduct)
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.error("Error while creating products:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (product.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.log("Single product fetched:", product[0]);
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, image, price } = req.body;
try{
    const updatedProduct = await sql`
      UPDATE products
      SET name = ${name}, image = ${image}, price = ${price}
      WHERE id = ${id}
      RETURNING *
    `;
    if (updatedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: updatedProduct[0] });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};

export const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
    const deletedProduct = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING *
    `;
    if (deletedProduct.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ success: false, message: "internal server error" });
  }
};