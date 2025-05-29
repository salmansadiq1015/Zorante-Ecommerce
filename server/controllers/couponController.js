import couponModel from "../models/couponModel.js";
import cron from "node-cron";

// Create Coupon
export const addCoupon = async (req, res) => {
  try {
    const {
      code,
      discountPercentage,
      maxDiscount,
      minPurchase,
      productIds,
      startDate,
      endDate,
    } = req.body;

    const coupon = await couponModel.findOne({ code: code });

    if (coupon) {
      return res.status(400).send({
        success: false,
        message: "Coupon already exists",
      });
    }

    const newCoupon = await couponModel.create({
      code,
      discountPercentage,
      maxDiscount,
      minPurchase,
      productIds,
      startDate,
      endDate,
    });

    res.status(200).send({
      success: true,
      message: "New coupon added successfully!",
      coupon: newCoupon,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occur while adding coupon, please try again!",
      error: error.message,
    });
  }
};

// Update Coupon
export const updateCoupon = async (req, res) => {
  try {
    const couponId = req.params.id;
    const {
      code,
      discountPercentage,
      maxDiscount,
      minPurchase,
      productIds,
      startDate,
      endDate,
      isActive,
    } = req.body;

    const coupon = await couponModel.findById(couponId);

    if (!coupon) {
      return res.status(400).send({
        success: false,
        message: "Coupon not found!",
      });
    }

    const updateCoupon = await couponModel.findByIdAndUpdate(
      { _id: coupon._id },
      {
        code: code || coupon.code,
        discountPercentage: discountPercentage || coupon.discountPercentage,
        maxDiscount: maxDiscount || coupon.maxDiscount,
        minPurchase: minPurchase || coupon.minPurchase,
        productIds: productIds || coupon.productIds,
        startDate: startDate || coupon.startDate,
        endDate: endDate || coupon.endDate,
        isActive: isActive || coupon.isActive,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Coupon updated successfully!",
      coupon: updateCoupon,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occur while updating coupon, please try again!",
      error: error.message,
    });
  }
};

// Validate and Apply Coupon By Product
export const applyCoupon = async (req, res) => {
  try {
    const { code, productId, cartTotal } = req.body;

    const coupon = await couponModel.findOne({ code, isActive: true });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired coupon" });
    }

    const currentDate = new Date();
    if (currentDate < coupon.startDate && currentDate > coupon.endDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not valid for the current date",
      });
    }

    // if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `Minimum purchase of ${coupon.minPurchase} required to apply this coupon`,
    //   });
    // }

    if (coupon.productIds.length && !coupon.productIds.includes(productId)) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not applicable to this product",
      });
    }

    if (coupon.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not active",
      });
    }

    let discount = (coupon.discountPercentage / 100) * cartTotal;
    if (discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    res
      .status(200)
      .json({ success: true, discount, finalTotal: cartTotal - discount });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occur while applying coupon, please try again!",
      error: error.message,
    });
  }
};

// Apply Coupon By Order
export const applyCouponByOrder = async (req, res) => {
  try {
    const { code, cartItems, cartTotal } = req.body;

    const coupon = await couponModel.findOne({ code, isActive: true });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired coupon" });
    }

    const currentDate = new Date();
    if (currentDate < coupon.startDate || currentDate > coupon.endDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not valid for the current date",
      });
    }

    // Check if cart meets the minimum purchase requirement
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ${coupon.minPurchase} required to apply this coupon`,
      });
    }

    if (coupon.isActive === false) {
      return res.status(400).json({
        success: false,
        message: "This coupon is not active",
      });
    }

    let totalDiscount = 0;
    let applicableProducts = [];

    for (let item of cartItems) {
      const { productId, price, quantity } = item;

      // Check if the coupon is product-specific and validate
      if (coupon.productIds.length && !coupon.productIds.includes(productId)) {
        continue;
      }

      // Calculate discount for this product
      let productTotal = price * quantity;
      let productDiscount = (coupon.discountPercentage / 100) * productTotal;

      if (productDiscount > coupon.maxDiscount) {
        productDiscount = coupon.maxDiscount;
      }

      applicableProducts.push({
        productId,
        discount: productDiscount,
        productTotal,
      });
      totalDiscount += productDiscount;
    }

    // If no products are eligible for the coupon
    if (applicableProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not applicable to any product in the cart",
      });
    }

    // Ensure total discount does not exceed the max discount
    if (totalDiscount > coupon.maxDiscount) {
      totalDiscount = coupon.maxDiscount;
    }

    const finalTotal = cartTotal - totalDiscount;

    res.status(200).json({
      success: true,
      discount: totalDiscount,
      finalTotal,
      applicableProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error occurred while applying the coupon, please try again!",
      error: error.message,
    });
  }
};

// Get All Coupons
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({}).populate("productIds", "name");
    res
      .status(200)
      .json({ success: true, message: "All coupons list!", coupons: coupons });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupons",
      error: error.message,
    });
  }
};

// Get All Active Coupons
export const getActiveCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find({ isActive: true });
    res.status(200).json({
      success: true,
      message: "All active coupons list!",
      coupons: coupons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error, please try again!",
      error: error.message,
    });
  }
};

// Coupon Detail
export const couponDetail = async (req, res) => {
  try {
    const couponId = req.params.id;
    const coupon = await couponModel
      .findById(couponId)
      .populate("productIds", "name");
    res
      .status(200)
      .send({ success: true, message: "Coupon Detail!", coupon: coupon });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon detail!",
      error: error.message,
    });
  }
};
// Update Status
export const updateCouponStatus = async (req, res) => {
  try {
    const couponId = req.params.id;
    const { status } = req.body;
    const coupon = await couponModel.findById(couponId);

    if (!coupon) {
      return res.status(404).send({
        success: false,
        message: "Coupon not found!",
      });
    }

    const updateCoupon = await couponModel.findByIdAndUpdate(
      { _id: coupon._id },
      { isActive: status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Coupon status updated!",
      coupon: updateCoupon,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch coupon detail!",
      error: error.message,
    });
  }
};

// auto Update Coupon Status

// Delete Coupons
export const deleteCoupons = async (req, res) => {
  try {
    const { id } = req.params;
    await couponModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete coupon",
      error: error.message,
    });
  }
};

//Auto Inactive Coupon
export const markInactiveCoupons = async () => {
  const coupons = await couponModel.find({});
  const currentDate = new Date();

  await Promise.all(
    coupons?.map(async (coupon) => {
      if (currentDate > coupon.endDate) {
        await couponModel.findByIdAndUpdate(
          coupon._id,
          { isActive: false },
          { new: true }
        );
      }
    })
  );
};

cron.schedule("30 22 * * *", async () => {
  try {
    await markInactiveCoupons();
    console.log("✅ Coupons marked inactive successfully");
  } catch (err) {
    console.error("❌ Error in cron job:", err.message);
  }
});

// cron.schedule("*/2 * * * *", async () => {
//   try {
//     await markInactiveCoupons();
//     console.log("✅ Coupons marked inactive successfully at", new Date());
//   } catch (err) {
//     console.error("❌ Error in cron job:", err.message);
//   }
// });
