import paypal from "paypal-rest-sdk";
import dotenv from "dotenv";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import orderModel from "../models/orderModel.js";
import Stripe from "stripe";
import sendMail from "../helper/mail.js";
import axios from "axios";
import notificationModel from "../models/notificationModel.js";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrderStripe = async (req, res) => {
  try {
    const {
      user,
      products,
      totalAmount,
      shippingFee,
      shippingAddress,
      paymentMethod,
      payment_info,
    } = req.body;

    // Validate products
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required for payment.",
      });
    }

    // Check user existence
    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Validate payment information (if provided)
    if (payment_info && payment_info.id) {
      const paymentIntentId = payment_info.id;
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      // Check if payment is successful
      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          success: false,
          message: "Payment not authorized!",
        });
      }

      // Create the order in the database
      const productDetails = await Promise.all(
        products.map(async (item) => {
          const product = await productModel.findById(item.product);
          if (!product) {
            throw new Error(`Product with ID ${item.product} not found.`);
          }
          return {
            product: product._id,
            price: product.price,
            quantity: item.quantity,
            colors: item?.colors || [],
            sizes: item?.sizes || [],
          };
        })
      );

      const order = await orderModel.create({
        user,
        products: productDetails,
        totalAmount,
        shippingFee,
        shippingAddress,
        paymentMethod,
        paymentStatus: "Completed",
        orderStatus: "Pending",
      });

      const populatedOrder = await orderModel.findById(order._id).populate({
        path: "products.product",
        select: "-colors -sizes -ratings -reviews -comments -status",
      });

      res.status(200).json({
        success: true,
        message: "Payment successful, order created.",
        order,
      });

      // // Add the order to 17Track and get the tracking ID
      // const trackingId = await addOrderInTrack(order);
      // if (!trackingId) {
      //   return res.status(500).json({
      //     success: false,
      //     message: "Failed to retrieve tracking ID from 17Track.",
      //   });
      // }

      // Send email notification to the user

      const orderDate = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(order.createdAt));

      const data = {
        user: { name: existingUser.name },
        orderId: order._id,
        orderDate: orderDate,
        shippingAddress: order.shippingAddress.address,
        items: populatedOrder.products.map((item) => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping: order.shippingFee,
        totalAmount: order.totalAmount,
        redirectlink: `${process.env.CLIENT_URL}/profile/${existingUser._id}`,
      };

      await sendMail({
        email: existingUser.email,
        subject: "Order Confirmation",
        template: "order.ejs",
        data,
      });

      // Update purchased Product
      await Promise.all(
        products.map(async (item) => {
          await productModel.updateOne(
            { _id: item.product },
            { $inc: { purchased: item.quantity } }
          );
        })
      );

      // Send email notification to the admin
      notificationModel.create({
        user: user,
        subject: "New Order",
        context: `New order placed by ${existingUser.name}. Total amount:$${order.totalAmount}`,
        type: "admin",
        redirectLink: "/dashboard/orders",
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment failed, payment info missing or invalid.",
      });
    }
  } catch (error) {
    console.log("Error while creating order:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while creating the order, please try again!",
      error: error.message,
    });
  }
};

// Add Order in Track order
const addOrderInTrack = async (order) => {
  try {
    const trackingNumber = order._id.toString();

    const trackingRequestPayload = [
      {
        number: trackingNumber,
        lang: "en",
        order_no: order._id,
        order_time: new Date().toISOString().split("T")[0],
        carrier: 3011,
        final_carrier: 21051,
        auto_detection: true,
        tag: order._id.toString(),
        remark: "Order processing",
      },
    ];

    const trackingResponse = await axios.post(
      "https://api.17track.net/track/v2.2/register",
      trackingRequestPayload,
      {
        headers: {
          "17token": process.env.TRACK_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    // Log the response to understand its structure
    console.log("Track Response:", trackingResponse);
    console.log("17Track Response:", trackingResponse.data);

    // Access trackingId from the 'accepted' array
    const acceptedItem = trackingResponse.data?.data?.accepted?.[0];
    const trackingId = acceptedItem?.trackingId || null;

    if (trackingId) {
      console.log("Tracking ID:", trackingId);
      return trackingId;
    } else {
      throw new Error("Tracking ID not found in the response.");
    }
  } catch (error) {
    console.error("Error while adding order in track:", error);
    return null;
  }
};

// ------Send Strype Public Key----->
export const sendStripePublishableKey = async (req, res) => {
  res.status(200).json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
};

// New Payment
export const newPayment = async (req, res) => {
  try {
    const myPayment = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "USD",
      metadata: {
        company: "Ayoob Ecommerce",
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.status(200).send({
      success: true,
      clientSecret: myPayment.client_secret,
    });
  } catch (error) {
    console.log("Error while new payment:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while new payment, please try again!",
      error: error.message,
    });
  }
};

// --------------------------------PayPal------------------>

// PayPal Configuration
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox",
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

export const handlePayPalPayment = async (req, res) => {
  try {
    const {
      user,
      products,
      totalAmount,
      shippingFee,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Step 1: Validate input and user
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required for payment.",
      });
    }

    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Step 2: Map products to PayPal items
    const items = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await productModel.findById(product.product);
        if (!dbProduct)
          throw new Error(`Product with ID ${product.product} not found.`);
        return {
          name: dbProduct.name,
          price: parseFloat(product.price).toFixed(2),
          currency: "USD",
          quantity: product.quantity,
        };
      })
    );

    // Step 3: Calculate subtotal and total
    const subtotal = items
      .reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0)
      .toFixed(2);

    const total = (parseFloat(subtotal) + parseFloat(shippingFee)).toFixed(2);

    if (total !== parseFloat(totalAmount).toFixed(2)) {
      return res.status(400).json({
        success: false,
        message: "Total amount does not match item prices and shipping fee.",
      });
    }

    // Step 4: Create PayPal payment
    const paymentData = {
      intent: "sale",
      payer: { payment_method: "paypal" },
      redirect_urls: {
        return_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
      },
      transactions: [
        {
          item_list: { items },
          amount: {
            total: total,
            currency: "USD",
            details: {
              subtotal: subtotal,
              shipping: parseFloat(shippingFee).toFixed(2),
            },
          },
          description: "Payment for your order",
        },
      ],
    };

    paypal.payment.create(paymentData, async (err, payment) => {
      if (err) {
        console.error("PayPal Error:", err);
        return res.status(500).json({
          success: false,
          message: "Failed to create PayPal payment.",
          details: err.response,
        });
      }

      const approvalUrl = payment.links.find(
        (link) => link.rel === "approval_url"
      );
      if (!approvalUrl) {
        return res.status(500).json({
          success: false,
          message: "Approval URL not found.",
        });
      }

      // Send approval URL to the client
      res.status(200).json({
        success: true,
        approvalUrl: approvalUrl.href,
      });
    });
  } catch (error) {
    console.error("Error Handling PayPal Payment:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Handle Create Order with PayPal if Payment Success
export const handleCreateOrderWithPayPal = async (req, res) => {
  try {
    const {
      user,
      products,
      totalAmount,
      shippingFee,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Validate input
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required for payment.",
      });
    }

    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Map products to PayPal items
    const items = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await productModel.findById(product.product);
        if (!dbProduct)
          throw new Error(`Product with ID ${product.product} not found.`);
        return {
          name: dbProduct.name,
          price: parseFloat(product.price).toFixed(2),
          currency: "USD",
          quantity: product.quantity,
          colors: product?.colors || [],
          sizes: product?.sizes || [],
        };
      })
    );

    // Calculate subtotal and validate total
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const total = (subtotal + parseFloat(shippingFee)).toFixed(2);

    if (total !== parseFloat(totalAmount).toFixed(2)) {
      return res.status(400).json({
        success: false,
        message: "Total amount does not match item prices and shipping fee.",
      });
    }

    // Create the order
    const productDetails = items.map((item, index) => ({
      product: products[index].product,
      quantity: item.quantity,
      price: item.price,
      colors: item?.colors || [],
      sizes: item?.sizes || [],
    }));

    const order = await orderModel.create({
      user,
      products: productDetails,
      totalAmount,
      shippingFee,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Completed",
      orderStatus: "Pending",
    });

    const populatedOrder = await orderModel.findById(order._id).populate({
      path: "products.product",
      select: "-colors -sizes -ratings -reviews -comments -status",
    });

    // Update purchased count
    await Promise.all(
      products.map((item) =>
        productModel.updateOne(
          { _id: item.product },
          { $inc: { purchased: item.quantity } }
        )
      )
    );

    // Send email to user
    const orderDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(order.createdAt));

    const emailData = {
      user: { name: existingUser.name },
      orderId: order._id,
      orderDate,
      shippingAddress: order.shippingAddress.address,
      items: populatedOrder.products.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping: order.shippingFee,
      totalAmount: order.totalAmount,
    };

    await sendMail({
      email: existingUser.email,
      subject: "Order Confirmation",
      template: "order.ejs",
      data: emailData,
    });

    // Notify admin
    await notificationModel.create({
      user,
      subject: "New Order",
      context: `New order placed by ${existingUser.name}. Total amount: $${order.totalAmount}`,
      type: "admin",
      redirectLink: "/dashboard/orders",
    });

    res.status(200).json({
      success: true,
      message: "Payment successful, order created.",
      order,
    });
  } catch (error) {
    console.error("Error creating order with PayPal:", error);
    res
      .status(500)
      .json({ success: false, message: "Error creating order with PayPal." });
  }
};

// Create Order through Admin Panel
export const createOrderAdmin = async (req, res) => {
  try {
    const {
      user,
      products,
      totalAmount,
      shippingFee,
      shippingAddress,
      paymentMethod,
    } = req.body;

    // Validate input
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products are required for payment.",
      });
    }

    const existingUser = await userModel.findById(user);
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Map products to PayPal items
    const items = await Promise.all(
      products.map(async (product) => {
        const dbProduct = await productModel.findById(product.product);
        if (!dbProduct)
          throw new Error(`Product with ID ${product.product} not found.`);
        return {
          name: dbProduct.name,
          price: parseFloat(product.price).toFixed(2),
          currency: "USD",
          quantity: product.quantity,
          colors: product?.colors || [],
          sizes: product?.sizes || [],
        };
      })
    );

    // Calculate subtotal and validate total
    const subtotal = items.reduce(
      (sum, item) => sum + parseFloat(item.price) * item.quantity,
      0
    );
    const total = (subtotal + parseFloat(shippingFee)).toFixed(2);

    console.log("Total:", total, totalAmount);

    // if (total !== parseFloat(totalAmount).toFixed(2)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Total amount does not match item prices and shipping fee.",
    //   });
    // }

    // Create the order
    const productDetails = items.map((item, index) => ({
      product: products[index].product,
      quantity: item.quantity,
      price: item.price,
      colors: item?.colors || [],
      sizes: item?.sizes || [],
    }));

    const order = await orderModel.create({
      user,
      products: productDetails,
      totalAmount: total,
      shippingFee,
      shippingAddress,
      paymentMethod,
      paymentStatus: "Completed",
      orderStatus: "Pending",
    });

    const populatedOrder = await orderModel.findById(order._id).populate({
      path: "products.product",
      select: "-colors -sizes -ratings -reviews -comments -status",
    });

    // Update purchased count
    await Promise.all(
      products.map((item) =>
        productModel.updateOne(
          { _id: item.product },
          { $inc: { purchased: item.quantity } }
        )
      )
    );

    // Send email to user
    const orderDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(order.createdAt));

    const emailData = {
      user: { name: existingUser.name },
      orderId: order._id,
      orderDate,
      shippingAddress: order.shippingAddress.address,
      items: populatedOrder.products.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping: order.shippingFee,
      totalAmount: order.totalAmount,
    };

    // await sendMail({
    //   email: existingUser.email,
    //   subject: "Order Confirmation",
    //   template: "order.ejs",
    //   data: emailData,
    // });

    // Notify admin
    await notificationModel.create({
      user,
      subject: "New Order",
      context: `New order placed by ${existingUser.name}. Total amount: $${order.totalAmount}`,
      type: "admin",
      redirectLink: "/dashboard/orders",
    });

    res.status(200).json({
      success: true,
      message: "Order created successfully.",
      order,
    });
  } catch (error) {
    console.error("Error creating order with PayPal:", error);
    res.status(500).json({
      success: false,
      message: "Error creating order with PayPal.",
      error: error.message,
    });
  }
};

// export const handlePayPalPayment = async (req, res) => {
//   try {
//     const {
//       user,
//       products,
//       totalAmount,
//       shippingFee,
//       shippingAddress,
//       paymentMethod,
//     } = req.body;

//     // Step 1: Validate input and user
//     if (!Array.isArray(products) || products.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Products are required for payment.",
//       });
//     }

//     const existingUser = await userModel.findById(user);
//     if (!existingUser) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found.",
//       });
//     }

//     // Step 2: Map products to PayPal items
//     const items = products.map((product) => ({
//       name: product.name,
//       price: product.price,
//       currency: "USD",
//       quantity: product.quantity,
//     }));

//     // Step 3: Create PayPal payment
//     const paymentData = {
//       intent: "sale",
//       payer: { payment_method: "paypal" },
//       redirect_urls: {
//         return_url: `${process.env.CLIENT_URL}/payment/success`,
//         cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
//       },
//       transactions: [
//         {
//           item_list: { items },
//           amount: { total: totalAmount, currency: "USD" },
//           description: "Payment for your order",
//         },
//       ],
//     };

//     paypal.payment.create(paymentData, async (err, payment) => {
//       if (err) {
//         console.error("PayPal Error:", err);
//         return res.status(500).json({
//           success: false,
//           message: "Failed to create PayPal payment.",
//         });
//       }

//       const approvalUrl = payment.links.find(
//         (link) => link.rel === "approval_url"
//       );
//       if (!approvalUrl) {
//         return res.status(500).json({
//           success: false,
//           message: "Approval URL not found.",
//         });
//       }

//       // Send approval URL to the client
//       res.status(200).json({
//         success: true,
//         approvalUrl: approvalUrl.href,
//       });

//       // Step 4: Asynchronously create the order after sending the response
//       try {
//         const productDetails = await Promise.all(
//           products.map(async (item) => {
//             const product = await productModel.findById(item.product);
//             if (!product) {
//               throw new Error(`Product with ID ${item.product} not found.`);
//             }
//             return {
//               product: product._id,
//               quantity: item.quantity,
//               price: product.price,
//             };
//           })
//         );

//         await orderModel.create({
//           user,
//           products: productDetails,
//           totalAmount,
//           shippingFee,
//           shippingAddress,
//           paymentMethod,
//           paymentStatus: "Pending",
//           orderStatus: "Pending",
//         });
//       } catch (orderError) {
//         console.error("Order Creation Error:", orderError);
//       }
//     });
//   } catch (error) {
//     console.error("Error Handling PayPal Payment:", error);
//     res.status(500).json({ success: false, message: "Internal server error." });
//   }
// };

// Get ALl Orders ----------- Only for Admin

export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("user", "name email number avatar addressDetails bankDetails")
      .populate({
        path: "products.product",
        select: "-colors -sizes -ratings -reviews -comments -status",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All order list!",
      orders: orders,
    });
  } catch (error) {
    console.log("Error while get all orders:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while get all orders, please try again!",
      error: error.message,
    });
  }
};

// Get User Orders
export const allUserOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await orderModel
      .find({ user: userId })
      .populate("user", "name email number avatar addressDetails bankDetails")
      .populate({
        path: "products.product",
        select: "-colors -sizes -ratings -reviews -comments -status",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email avatar",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All user orders list!",
      orders: orders,
    });
  } catch (error) {
    console.log("Error while get user orders:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while get user orders, please try again!",
      error: error.message,
    });
  }
};

// Order By Status
export const allOrdersByStatus = async (req, res) => {
  try {
    const status = req.params.status;
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "Login required!",
      });
    }

    const orders = await orderModel
      .find({ orderStatus: status, user: userId })
      .populate("user", "name email number avatar addressDetails bankDetails")
      .populate({
        path: "products.product",
        select: "-colors -sizes -ratings -reviews -comments -status",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "All order list by status!",
      orders: orders,
    });
  } catch (error) {
    console.log("Error while get orders by status:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while get  orders by status, please try again!",
      error: error.message,
    });
  }
};

// Get Order Detail
export const orderDetail = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderModel
      .findById({ _id: orderId })
      .populate("user", "name email number avatar addressDetails bankDetails")
      .populate({
        path: "products.product",
        select: "-colors -sizes -ratings -reviews -comments -status",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "name email avatar",
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      message: "Order Detail",
      order: order,
    });
  } catch (error) {
    console.log("Error while get order detail:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while get order detail, please try again!",
      error: error.message,
    });
  }
};

// Update Order/payment Status
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { paymentStatus, orderStatus, trackingId, shippingCarrier } =
      req.body;

    console.log("PS:", paymentStatus, "OS:", orderStatus);

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found!",
      });
    }

    const updateOrder = await orderModel.findByIdAndUpdate(
      { _id: order._id },
      {
        paymentStatus: paymentStatus || order.paymentStatus,
        orderStatus: orderStatus || order.orderStatus,
        trackingId: trackingId || order.trackingId,
        shippingCarrier: shippingCarrier || order.shippingCarrier,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Order status updated!",
      order: updateOrder,
    });
  } catch (error) {
    console.log("Error while update order status:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while update order status, please try again!",
      error: error.message,
    });
  }
};

// Delete Order
export const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found!",
      });
    }

    await orderModel.findByIdAndDelete(order._id);

    res.status(200).send({
      success: true,
      message: "Order deleted successfully!",
    });
  } catch (error) {
    console.log("Error while delete order:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while delete order, please try again!",
      error: error.message,
    });
  }
};

// Return/Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { orderStatus } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found!",
      });
    }

    const updateOrder = await orderModel.findByIdAndUpdate(
      { _id: order._id },
      {
        orderStatus: orderStatus || order.paymentStatus,
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Cancel request send successfully!",
      order: updateOrder,
    });
  } catch (error) {
    console.log("Error while cancel order:", error);
    res.status(500).send({
      success: false,
      message: "Error occured while cancel order, please try again!",
      error: error.message,
    });
  }
};

// Delete All Users
export const deleteAllOrders = async (req, res) => {
  try {
    const { orderIds } = req.body;

    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).send({
        success: false,
        message: "No valid user IDs provided.",
      });
    }

    await orderModel.deleteMany({
      _id: { $in: orderIds },
    });

    res.status(200).send({
      success: true,
      message: "All orders deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting orders:", error);
    res.status(500).send({
      success: false,
      message: "Error occurred while orders notifications. Please try again!",
      error: error.message,
    });
  }
};

// Total Revenue & orders
// export const getTotalRevenue = async (req, res) => {
//   try {
//     const currentMonth = new Date();
//     const previousMonth = new Date();
//     previousMonth.setMonth(previousMonth.getMonth() - 1);

//     const revenueData = await orderModel.aggregate([
//       {
//         $facet: {
//           currentMonth: [
//             {
//               $match: {
//                 createdAt: {
//                   $gte: new Date(
//                     currentMonth.getFullYear(),
//                     currentMonth.getMonth(),
//                     1
//                   ),
//                   $lt: new Date(
//                     currentMonth.getFullYear(),
//                     currentMonth.getMonth() + 1,
//                     1
//                   ),
//                 },
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
//                 totalOrders: { $sum: 1 },
//               },
//             },
//           ],
//           previousMonth: [
//             {
//               $match: {
//                 createdAt: {
//                   $gte: new Date(
//                     previousMonth.getFullYear(),
//                     previousMonth.getMonth(),
//                     1
//                   ),
//                   $lt: new Date(
//                     previousMonth.getFullYear(),
//                     previousMonth.getMonth() + 1,
//                     1
//                   ),
//                 },
//               },
//             },
//             {
//               $group: {
//                 _id: null,
//                 totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
//                 totalOrders: { $sum: 1 },
//               },
//             },
//           ],
//         },
//       },
//     ]);

//     const currentMonthData = revenueData[0].currentMonth[0] || {
//       totalRevenue: 0,
//       totalOrders: 0,
//     };
//     const previousMonthData = revenueData[0].previousMonth[0] || {
//       totalRevenue: 0,
//       totalOrders: 0,
//     };

//     const { totalRevenue: currentRevenue, totalOrders: currentOrders } =
//       currentMonthData;
//     const { totalRevenue: previousRevenue, totalOrders: previousOrders } =
//       previousMonthData;

//     // Calculate percentage changes
//     const revenuePercentageChange =
//       previousRevenue > 0
//         ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
//         : null;

//     const ordersPercentageChange =
//       previousOrders > 0
//         ? ((currentOrders - previousOrders) / previousOrders) * 100
//         : null;

//     res.status(200).send({
//       success: true,
//       message: "Total revenue and orders fetched successfully!",
//       currentMonth: {
//         totalRevenue: currentRevenue,
//         totalOrders: currentOrders,
//       },
//       previousMonth: {
//         totalRevenue: previousRevenue,
//         totalOrders: previousOrders,
//       },
//       percentageChange: {
//         revenue:
//           revenuePercentageChange !== null
//             ? `${revenuePercentageChange.toFixed(2)}%`
//             : "0%",
//         orders:
//           ordersPercentageChange !== null
//             ? `${ordersPercentageChange.toFixed(2)}%`
//             : "0%",
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching revenue data:", error);
//     res.status(500).send({
//       success: false,
//       message: "Error occurred while fetching revenue data, please try again!",
//       error: error.message,
//     });
//   }
// };

export const getTotalRevenue = async (req, res) => {
  try {
    const currentMonth = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(previousMonth.getMonth() - 1);

    // Helper function to get the start and end of a month
    const getMonthRange = (date) => {
      const start = new Date(date.getFullYear(), date.getMonth(), 1);
      const end = new Date(date.getFullYear(), date.getMonth() + 1, 1);
      return { start, end };
    };

    const currentMonthRange = getMonthRange(currentMonth);
    const previousMonthRange = getMonthRange(previousMonth);

    const revenueData = await orderModel.aggregate([
      {
        $facet: {
          allTime: [
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
                totalOrders: { $sum: 1 },
              },
            },
          ],
          currentMonth: [
            {
              $match: {
                createdAt: {
                  $gte: currentMonthRange.start,
                  $lt: currentMonthRange.end,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
                totalOrders: { $sum: 1 },
              },
            },
          ],
          previousMonth: [
            {
              $match: {
                createdAt: {
                  $gte: previousMonthRange.start,
                  $lt: previousMonthRange.end,
                },
              },
            },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
                totalOrders: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]);

    // Extract data or use defaults
    const [allTimeData = { totalRevenue: 0, totalOrders: 0 }] =
      revenueData[0].allTime;
    const [currentData = { totalRevenue: 0, totalOrders: 0 }] =
      revenueData[0].currentMonth;
    const [previousData = { totalRevenue: 0, totalOrders: 0 }] =
      revenueData[0].previousMonth;

    const formatPercentage = (current, previous) => {
      if (previous > 0) {
        const change = ((current - previous) / previous) * 100;
        return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
      }
      return current > 0 ? "+100.00%" : "0.00%";
    };

    const revenuePercentageChange = formatPercentage(
      currentData.totalRevenue,
      previousData.totalRevenue
    );
    const ordersPercentageChange = formatPercentage(
      currentData.totalOrders,
      previousData.totalOrders
    );

    res.status(200).json({
      success: true,
      message: "Total revenue and orders fetched successfully!",
      allTime: allTimeData,
      currentMonth: currentData,
      previousMonth: previousData,
      percentageChange: {
        revenue: revenuePercentageChange,
        orders: ordersPercentageChange,
      },
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).json({
      success: false,
      message: "Error occurred while fetching revenue data. Please try again!",
      error: error.message,
    });
  }
};

// Revenue Analytics
export const getRevenueAnalyticsData = async (req, res) => {
  try {
    const { startDate, endDate } = req.params;

    console.log("Date:", startDate, endDate);

    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date();

    start.setHours(0, 0, 0, 0);

    end.setHours(23, 59, 59, 999);

    // Aggregate revenue data by day
    const revenueData = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          day: "$_id",
          totalRevenue: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).send({
      success: true,
      message: "Revenue analytics data fetched successfully!",
      data: revenueData,
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).send({
      success: false,
      message: "Error occurred while fetching revenue data, please try again!",
      error: error.message,
    });
  }
};

// Get All Revenue Analytics
export const getAllRevenueAnalyticsData = async (req, res) => {
  try {
    // Aggregate revenue data by day
    const revenueData = await orderModel.aggregate([
      {
        $group: {
          _id: { $dayOfMonth: "$createdAt" },
          totalRevenue: { $sum: { $toDouble: "$totalAmount" } },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          day: "$_id",
          totalRevenue: 1,
          _id: 0,
        },
      },
    ]);

    res.status(200).send({
      success: true,
      message: "Revenue analytics data fetched successfully!",
      data: revenueData,
    });
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    res.status(500).send({
      success: false,
      message: "Error occurred while fetching revenue data, please try again!",
      error: error.message,
    });
  }
};

// Revenue By Category
export const getRevenueByCategory = async (req, res) => {
  try {
    const revenueData = await orderModel.aggregate([
      { $unwind: "$products" },

      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      { $unwind: "$productDetails" },

      {
        $lookup: {
          from: "categories",
          localField: "productDetails.category",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },

      { $unwind: "$categoryDetails" },

      {
        $addFields: {
          revenue: { $multiply: ["$products.quantity", "$products.price"] },
        },
      },

      {
        $group: {
          _id: "$categoryDetails.name",
          totalRevenue: { $sum: "$revenue" },
        },
      },

      { $sort: { totalRevenue: -1 } },
    ]);

    console.log("Revenue by Category: ", revenueData);

    res.status(200).send({
      success: true,
      message: "Revenue by Category",
      revenueData: revenueData,
    });
  } catch (error) {
    console.error("Error fetching revenue by category: ", error);
    res.status(500).send({
      success: false,
      message: "Error fetching revenue data",
      error: error.message,
    });
  }
};

// Track Order
export const trackOrder = async (req, res) => {
  try {
    const { trackingNumber } = req.body;

    const response = await axios.post(
      "https://api.17track.net/track",
      {
        number: trackingNumber,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.TRACK_API_KEY}`,
        },
      }
    );

    res.status(200).send({
      success: true,
      message: "Order Tracked",
      orderDetails: response.data,
    });
  } catch (error) {
    console.error("Error tracking order: ", error);
    res.status(500).send({
      success: false,
      message: "Error tracking order",
      error: error.message,
    });
  }
};

// Get User Buy Products for add review
export const getUserBuyProducts = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await orderModel
      .find({ user: userId, orderStatus: "Delivered" })
      .populate({
        path: "products.product",
        select: "-colors -sizes -comments -status",
        populate: {
          path: "category",
          select: "name",
        },
      })
      .exec();

    let boughtProducts = [];

    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (item.product) {
          const reviews = Array.isArray(item.product.reviews)
            ? item.product.reviews
            : [];

          // Check if the user has already reviewed this product
          const userHasReviewed = reviews.some(
            (review) => review.user.toString() === userId.toString()
          );

          if (!userHasReviewed) {
            const categoryName = item.product.category
              ? item.product.category.name
              : "Uncategorized";

            boughtProducts.push({
              productId: item.product._id,
              productName: item.product.name,
              productImage: item.product.thumbnails[0],
              categoryName: categoryName,
              orderDate: order.createdAt,
              quantity: item.quantity,
            });
          }
        } else {
          console.log("Product is null or undefined, skipping...");
        }
      });
    });

    // If no products are available for review
    if (boughtProducts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No products available for review.",
      });
    }

    res.status(200).json({
      success: true,
      products: boughtProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message:
        "Error occurred while retrieving user purchased products, please try again!",
      error: error.message,
    });
  }
};

// Conversion Rate
export const getConversionRate = async (req, res) => {
  try {
    const totalUsers = await userModel.countDocuments();

    const uniqueBuyers = await orderModel.distinct("user");

    const conversionRate = ((uniqueBuyers.length / totalUsers) * 100).toFixed(
      2
    );

    // Step 4: Send response
    res.status(200).json({
      success: true,
      conversionRate: `${conversionRate}%`,
      totalUsers,
      uniqueBuyers: uniqueBuyers.length,
    });
  } catch (error) {
    console.error("Error while calculating conversion rate:", error);
    res.status(500).send({
      success: false,
      message:
        "Error occurred while calculating the conversion rate. Please try again!",
      error: error.message,
    });
  }
};

// Add comment to Order
export const addCommentToOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { comment, image } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found!",
      });
    }

    const commentData = {
      user: req.user._id,
      question: comment,
      image,
    };

    order.comments?.push(commentData);

    await order.save();

    // await orderModel.findByIdAndUpdate(order._id, order, {
    //   new: true,
    //   runValidators: true,
    // });

    res.status(200).send({
      success: true,
      message: "Comment added successfully!",
      order: order,
    });
  } catch (error) {
    console.error("Error adding comment to order:", error);
    res.status(500).send({
      success: false,
      message: "Error adding comment to order, please try again!",
      error: error.message,
    });
  }
};

// Add Reply to Comment
export const addReplyToComment = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { reply, image, commentId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found!",
      });
    }

    const comment = order.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).send({
        success: false,
        message: "Comment not found!",
      });
    }

    const replyData = {
      user: req.user._id,
      reply: reply,
      image,
      createdAt: new Date().toISOString(),
    };

    if (!comment.questionReplies) {
      comment.questionReplies = [];
    }

    comment.questionReplies?.push(replyData);

    await order?.save();

    // await orderModel.findByIdAndUpdate(order._id, order, {
    //   new: true,
    //   runValidators: true,
    // });

    res.status(200).send({
      success: true,
      message: "Reply added successfully!",
      order: order,
    });
  } catch (error) {
    console.error("Error adding reply to comment:", error);
    res.status(500).send({
      success: false,
      message: "Error adding reply to comment, please try again!",
      error: error.message,
    });
  }
};
