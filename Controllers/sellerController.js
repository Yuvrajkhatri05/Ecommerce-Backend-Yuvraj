const Seller = require("../Models/Seller");
const bcrypt = require("bcrypt");
const { createTokenForSeller } = require("../Services/JWTgenerate");

// VERIFY CONTROLLER
exports.verify = async(req, res) => {
  if (!req.seller || !req.cookies.token) {
    return res.json({ loggedIn: false });
  }
  const seller = await Seller.findById(req.seller._id).select("sellerName firmName email").lean();
  res.json({
    loggedIn: true,
    seller
  });
}

//   RECIEVED ORDERS CONTROLLER
exports.recievedOrders = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id)
        .select("orders")
        .populate({
          path: "orders",
          populate: {
            path: "items.product",
            model: "product"
          }
        })
        .lean();
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }
    res.status(200).json({ success: true, seller});
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// GET PRODUCTS CONTROLLER
exports.getProducts = async (req, res) => {
    try{
        if (!req.seller) {
            return res.json({ loggedIn: false });
        }
        console.log(req.seller);
        const seller = await Seller.findById(req.seller._id).select("sellerName products").populate("products").lean();
        res.json({
            loggedIn: true,
            seller
        });
    } catch (error){
        res.status(500).json({
            loggedIn: false,
            error: error.message
        });
    }
}

// LOGOUT CONTROLLER
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false
  });
  return res.json({ success: true });
}

// SIGNUP CONTROLLER
exports.signup = async(req, res) => {
    const seller = req.body;
    const newSeller = await Seller.create({
    sellerName: seller.sellerName,
    firmName: seller.firmName,
    password: seller.password,
    mobileNo: seller.mobileNo,
    email: seller.email,
    address: seller.address,
    state: seller.state,
    accountNo: seller.accountNo,
    branchName: seller.branchName,
   });
   return res.status(201).json({
        Status: "Success",
        result: true,
    });
}

// LOGIN CONTROLLER
exports.login = async(req, res) => {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if(!seller) {
        return res.status(401).json("Seller not found");
    }
    try{
        const isMatch = await bcrypt.compare(password, seller.password);
        if(isMatch) {
            const sellerToken = createTokenForSeller(seller);
            delete seller.password;
            return res.cookie("token", sellerToken,{
                  httpOnly: true,
                  secure: false,    
                  sameSite: "lax",
                  maxAge: 1 * 60 * 60 * 1000 
            }).json({ 
                message: "Loging Success",
                result: true,
                seller: {
                  _id: seller._id,
                  sellerName: seller.sellerName,
                  firmName: seller.firmName,
                  email: seller.email,
                  orders: seller.orders,
                  products: seller.products,
                  token: sellerToken
                },
            });
        }else {
            return res.json({
                result: false,
                error: "Invalid email or password",
            });
        }
    }catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Server error",
            result: false,
        });
    }   
}

// UPDATE PROFILE CONTROLLER
exports.updateProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller._id);
    if (!seller) {
      return res.status(404).json({ success: false, message: "Seller not found" });
    }

    const { sellerName, firmName, email, mobileNo, password } = req.body;
    
    if (sellerName) seller.sellerName = sellerName;
    if (firmName) seller.firmName = firmName;
    if (email) seller.email = email;
    if (mobileNo) seller.mobileNo = mobileNo;
    if (password) seller.password = password;

    await seller.save(); // This triggers the pre('save') hook for password hashing
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      seller: {
        _id: seller._id,
        sellerName: seller.sellerName,
        firmName: seller.firmName,
        email: seller.email,
        orders: seller.orders,
        products: seller.products
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}