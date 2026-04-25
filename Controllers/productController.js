const Product = require("../Models/Product");
const Seller = require("../Models/Seller");
const mongoose = require("mongoose");

// GET PRODUCTS BY TYPE CONTROLLER
exports.getProductsByType = async (req, res) => {
  try {
    const productType = req.params.productType;

    const products = await Product.find({
      productType: productType
    }).populate("seller");

    res.status(200).json({
      success: true,
      products
    });

  } catch (error) {
    console.error('BACKEND ERROR', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// GET SINGLE PRODUCT BY ID CONTROLLER
exports.getSingleProduct = async (req, res) => {
  const _id = req.params.productId;
  if(!_id){
    res.status(400).json({ success: false, message: "No Product Id"});
  }
  const products = await Product.find({ _id })
  .populate({path:"seller", select:"firmName"})
  .lean();
  res.json({ success: true, products});
}

// GET RELATED PRODUCTS CONTROLLER
exports.getRelatedProducts = async (req, res) => {
  try {
    const { productType, id } = req.params;
    // Validation
    if (!productType || !id) {
      return res.status(400).json({ success: false, message: 'No product Details',});
    }
    const objectId = new mongoose.Types.ObjectId(id);
    // Fetch related products (same type, exclude clicked product)
    const products = await Product.find({ productType, _id: { $ne: objectId }}).limit(20).populate("seller");
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch related products',
      error: error.message,
    });
  }
}

// UPLOAD NEW PRODUCT FOR SELL BY SELLER CONTROLLER
exports.newProductUpload = async (req, res) => {
  try {
    const product = req.body;
    // Parse variants safely
    const variant = product.variants ? JSON.parse(product.variants) : [];

    // Cloudinary URLs
    const mainImage = req.files.mainImage?.[0];
    const images = req.files.images || [];
    const mainImageUrl = mainImage?.path;
    const imageUrls = images.map(file => file.path);

    const newProduct = await Product.create({
      productType: product.productType,
      productName: product.productName,
      brandName: product.brandName,
      productdetails: product.productdetails,
      productcolour: product.productColour,
      productstyle: product.productStyle,
      productmaterial: product.productMaterial,
      productgender: product.productGender,
      productdimensions: product.productDimensions,
      productprice: product.price,
      discount: product.discount,
      discountPrice: product.discountPrice,
      productsize: product.productsize,
      mainImage: mainImageUrl, // first image
      images: imageUrls, // all images
      availableProduct: product.availableProduct,
      seller: req.seller?._id,
      variants: variant,
    });

    await Seller.findByIdAndUpdate(
      req.seller._id,
      { $push: { products: newProduct._id } },
      { new: true }
    );

    if (req.io) {
      req.io.to(req.seller._id.toString()).emit("new_product", {
        message: "Your new product was successfully listed!",
        productName: newProduct.productName
      });
    }

    return res.status(201).json({
      Status: "Success",
      result: true,
      product: newProduct,
    });

  } catch (error) {
    console.error("Product Upload Error:", error);
    return res.status(500).json({
      Status: "Failed",
      message: "Product upload failed",
    });
  }
}

// SEARCH AND FILTER API
exports.searchProducts = async (req, res) => {
  try {
    const { keyword, minPrice, maxPrice, sort } = req.query;

    let query = {};

    // 🔍 Search by name, brand or type
    if (keyword) {
      query.$or = [
        { productName: { $regex: keyword, $options: "i" } },
        { brandName: { $regex: keyword, $options: "i" } },
        { productType: { $regex: keyword, $options: "i" } }
      ];
    }

    // 💰 Price filter
    if (minPrice || maxPrice) {
      query.productprice = {};
      if (minPrice) query.productprice.$gte = Number(minPrice);
      if (maxPrice) query.productprice.$lte = Number(maxPrice);
    }
    // Category filter
    if (req.query.category) {
      query.productType = req.query.category;
    }

    // Gender filter
    if (req.query.gender) {
      query.productgender = req.query.gender;
    }

    // Brand filter
    if (req.query.brand) {
      query.brandName = req.query.brand;
    }

    // 🛒 Fetch products
    let products = await Product.find(query).populate("seller");

    // 🔄 Sorting
    if (sort === "price") {
      products.sort((a, b) => a.productprice - b.productprice);
    } else if (sort === "-price") {
      products.sort((a, b) => b.productprice - a.productprice);
    }

    res.json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE PRODUCT CONTROLLER
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Verify ownership
    if (product.seller.toString() !== req.seller._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this product' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (req.io) {
      req.io.to(req.seller._id.toString()).emit("update_product", {
        message: "Product information updated successfully!",
        productName: updatedProduct.productName
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error("Product Update Error:", error);
    res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message
    });
  }
};