"use client";
import { Style } from "@/app/utils/CommonStyle";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { IoCameraOutline } from "react-icons/io5";
import { IoIosClose } from "react-icons/io";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import axios from "axios";
import { colorOptions } from "@/app/utils/CommonFunctions";
import { FaSpinner } from "react-icons/fa";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  InfoIcon,
  PackageIcon,
  TagIcon as PriceTag,
  Settings,
  Euro,
} from "lucide-react";

export default function ProductModal({
  closeModal,
  setShowaddProduct,
  productId,
  setProductId,
  fetchProducts,
}) {
  // Form data state
  const [categoryData, setCategoryData] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [thumbnails, setThumbnails] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [colors, setColors] = useState([]);
  const [inputSize, setInputSize] = useState("");
  const [sizes, setSizes] = useState([]);
  const [trending, setTrending] = useState(false);
  const [sale, setSale] = useState({
    isActive: false,
    discountPercentage: "",
    saleExpiry: null,
  });
  const [deletedImages, setDeletedImages] = useState([]);
  const [isloading, setIsloading] = useState(false);
  const [shipping, setShipping] = useState("");

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Step validation state
  const [stepsValidation, setStepsValidation] = useState({
    1: false, // Basic Info
    2: false, // Media
    3: false, // Pricing
    4: false, // Inventory & Options
  });

  // Get Product Detail
  const getProductInfo = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/product/detail/${productId}`
      );
      if (data) {
        console.log("Product Data", data.product);
        const product = data.product;
        setName(product.name || "");
        setDescription(product.description || "");
        setShipping(product.shipping || 0);
        if (product.category && product.category._id) {
          setCategory({
            value: product.category._id,
            label: (
              <div className="flex items-center gap-1">
                <div className="w-6 h-6 rounded-full relative overflow-hidden flex items-center justify-center">
                  <Image
                    src={product.category.image || "/placeholder.svg"}
                    layout="fill"
                    alt={product.category.name}
                    className="w-full h-full"
                  />
                </div>
                {product.category.name}
              </div>
            ),
          });
        }
        setPrice(product.price || "");
        setEstimatedPrice(product.estimatedPrice || "");
        setThumbnails(
          product.thumbnails && Array.isArray(product.thumbnails)
            ? product.thumbnails
            : []
        );
        setQuantity(product.quantity || "");
        setColors(
          product.colors?.map((color) => {
            const matchedColor = colorOptions.find(
              (c) => c.value === color.code
            );
            return matchedColor
              ? matchedColor
              : {
                  value: color,
                  label: (
                    <div className="flex items-center gap-1">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                      ></div>
                      {color}
                    </div>
                  ),
                };
          }) || []
        );

        // Map size values to options
        setSizes(product.sizes || []);
        setTrending(product.trending || false);
        setSale({
          isActive: product.sale?.isActive || false,
          discountPercentage: product.sale?.discountPercentage || 0,
          saleExpiry: product.sale?.saleExpiry
            ? new Date(product.sale.saleExpiry)
            : null,
        });

        // Validate all steps after loading data
        validateAllSteps();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product data");
    }
  };

  useEffect(() => {
    if (productId) {
      getProductInfo();
    }
    // eslint-disable-next-line
  }, [productId]);

  // Get Categories
  const getCategories = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/categories/all/categories`
      );
      if (data) {
        setCategoryData(data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line
  }, []);

  // Handle Media Upload
  const handleMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    setThumbnails((prevMedia) => [...prevMedia, ...files]);
    validateStep(2);
  };

  // Handle Media Removal
  const removeMedia = (indexToRemove) => {
    setThumbnails((prevMedia) => {
      const removedItem = prevMedia[indexToRemove];
      if (typeof removedItem === "string") {
        setDeletedImages((prevDeleted) => [...prevDeleted, removedItem]);
      }
      return prevMedia.filter((_, index) => index !== indexToRemove);
    });
    validateStep(2);
  };

  // Handle Sizes
  const handleAddSize = () => {
    if (inputSize.trim() !== "" && !sizes.includes(inputSize.trim())) {
      setSizes((prev) => [...prev, inputSize.trim()]);
      setInputSize(""); // clear input
      validateStep(4);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSize();
    }
  };

  const handleRemoveSize = (sizeToRemove) => {
    setSizes((prev) => prev.filter((size) => size !== sizeToRemove));
    validateStep(4);
  };

  // Handle Sale Activation
  const toggleSale = () => {
    setSale((prevSale) => ({
      ...prevSale,
      isActive: !prevSale.isActive,
      discountPercentage: prevSale.isActive ? "" : prevSale.discountPercentage,
      saleExpiry: prevSale.isActive ? null : prevSale.saleExpiry,
    }));
    validateStep(3);
  };

  // Category Options
  const categoryOptions =
    categoryData &&
    categoryData?.map((cat) => ({
      value: cat._id,
      label: (
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 rounded-full relative overflow-hidden flex items-center justify-center">
            <Image
              src={cat.image || "/placeholder.svg"}
              layout="fill"
              alt={cat.name}
              className="w-full h-full"
            />
          </div>
          {cat.name}
        </div>
      ),
    }));

  // Step validation functions
  const validateStep = (step) => {
    let isValid = false;

    switch (step) {
      case 1: // Basic Info
        isValid = !!name && !!description && !!category;
        break;
      case 2: // Media
        isValid = thumbnails.length > 0;
        break;
      case 3: // Pricing
        isValid = !!price;
        if (sale.isActive) {
          isValid = isValid && !!sale.discountPercentage && !!sale.saleExpiry;
        }
        break;
      case 4: // Inventory & Options
        isValid = !!quantity;
        break;
      default:
        isValid = false;
    }

    setStepsValidation((prev) => ({
      ...prev,
      [step]: isValid,
    }));

    return isValid;
  };

  const validateAllSteps = () => {
    for (let i = 1; i <= totalSteps; i++) {
      validateStep(i);
    }
  };

  // Effect to validate current step when relevant fields change
  useEffect(() => {
    validateStep(1);
  }, [name, description, category]);

  useEffect(() => {
    validateStep(2);
  }, [thumbnails]);

  useEffect(() => {
    validateStep(3);
  }, [price, estimatedPrice, shipping, sale]);

  useEffect(() => {
    validateStep(4);
  }, [quantity, colors, sizes, trending]);

  // Navigation functions
  const nextStep = () => {
    if (currentStep < totalSteps && validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    } else if (!validateStep(currentStep)) {
      toast.error(`Please complete all required fields in Step ${currentStep}`);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const goToStep = (step) => {
    if (step <= currentStep || validateStep(currentStep)) {
      setCurrentStep(step);
    } else {
      toast.error(`Please complete all required fields in Step ${currentStep}`);
    }
  };

  // Submit function
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all steps before submission
    const allStepsValid = Object.values(stepsValidation).every(
      (valid) => valid
    );

    if (!allStepsValid) {
      toast.error("Please complete all required fields in all steps");
      return;
    }

    setIsloading(true);
    const productData = new FormData();
    productData.append("name", name);
    productData.append("description", description);
    productData.append("shipping", shipping);
    productData.append("category", category.value);
    productData.append("price", price);
    productData.append("estimatedPrice", estimatedPrice);

    // Handle thumbnails
    thumbnails.forEach((file) => {
      if (file instanceof File) {
        productData.append("file", file);
      } else {
        // For existing image URLs
        productData.append("existingThumbnails", file);
      }
    });

    productData.append("quantity", quantity);

    // Handle colors
    const colorIds = colors.map((color) => ({
      name: color.name || color.label,
      code: color.value,
    }));
    productData.append("colors", JSON.stringify(colorIds));

    // Handle sizes
    productData.append("sizes", sizes);

    productData.append("trending", trending);
    productData.append("sale", JSON.stringify(sale));
    productData.append("deletedImages", JSON.stringify(deletedImages));

    try {
      if (productId) {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/update/product/${productId}`,
          productData
        );

        if (data) {
          toast.success(data?.message || "Product updated successfully");
        }
      } else {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/products/create/product`,
          productData
        );
        if (data) {
          toast.success(data?.message || "Product added successfully");
        }
      }

      // Reset and close modal
      fetchProducts();
      setShowaddProduct(false);
      setProductId("");
      setDeletedImages([]);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "An error occurred");
    } finally {
      setIsloading(false);
    }
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderBasicInfoStep();
      case 2:
        return renderMediaStep();
      case 3:
        return renderPricingStep();
      case 4:
        return renderInventoryOptionsStep();
      default:
        return null;
    }
  };

  // Step 1: Basic Information
  const renderBasicInfoStep = () => {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex items-center gap-2 text-customRed mb-4 pb-2 border-b">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <InfoIcon size={18} className="text-customRed" />
          </div>
          <h3 className="text-lg font-medium">Basic Information</h3>
        </div>

        {/* Product Name */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name<span className="text-red-700">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              validateStep(1);
            }}
            className={`${Style.input} w-full`}
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Category */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category<span className="text-red-700">*</span>
          </label>
          <Select
            options={categoryOptions}
            value={category}
            onChange={(val) => {
              setCategory(val);
              validateStep(1);
            }}
            placeholder="Select category"
            required
            className="basic-single"
            classNamePrefix="select"
          />
        </div>

        {/* Description */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description<span className="text-red-700">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              validateStep(1);
            }}
            className={`${Style.input} w-full h-[8rem] md:h-[10rem]`}
            placeholder="Enter product description"
            required
          ></textarea>
        </div>
      </div>
    );
  };

  // Step 2: Media
  const renderMediaStep = () => {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex items-center gap-2 text-customRed mb-4 pb-2 border-b">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <ImageIcon size={18} className="text-customRed" />
          </div>
          <h3 className="text-lg font-medium">Product Media</h3>
        </div>

        {/* Media Upload */}
        <div className="border-2 border-dashed border-gray-300 p-6 md:p-8 flex flex-col items-center justify-center rounded-md bg-gray-50 hover:bg-gray-100/50 transition-colors duration-200 group">
          <label className="cursor-pointer flex flex-col items-center gap-4">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-red-100 flex items-center justify-center text-customRed group-hover:scale-110 transition-transform duration-300">
              <IoCameraOutline className="text-[28px] md:text-[32px]" />
            </div>
            <p className="text-sm text-gray-600 text-center max-w-xs">
              Upload product images. You can add multiple images to showcase
              your product from different angles.
            </p>
            <span className="text-white px-5 py-2.5 text-sm font-medium rounded-md bg-customRed hover:bg-red-700 transition-all duration-300 shadow-sm hover:shadow">
              Add Media
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleMediaUpload}
            />
          </label>
        </div>

        {/* Thumbnails Preview */}
        {thumbnails && thumbnails.length > 0 && (
          <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm">
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-customRed" />
              Product Images ({thumbnails.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {thumbnails?.map((file, index) => (
                <div
                  key={index}
                  className="relative aspect-square bg-gray-100 rounded-md overflow-hidden group shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Image
                    src={
                      file instanceof File ? URL.createObjectURL(file) : file
                    }
                    layout="fill"
                    objectFit="cover"
                    alt={`Product thumbnail ${index + 1}`}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
                  <button
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700"
                    aria-label="Remove image"
                  >
                    <IoIosClose className="text-[20px]" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {thumbnails.length === 0 && (
          <div className="text-center text-gray-500 italic py-4">
            No images added yet. Please add at least one product image.
          </div>
        )}
      </div>
    );
  };

  // Step 3: Pricing
  const renderPricingStep = () => {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex items-center gap-2 text-customRed mb-4 pb-2 border-b">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <PriceTag size={18} className="text-customRed" />
          </div>
          <h3 className="text-lg font-medium">Pricing Information</h3>
        </div>

        {/* Price */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price (€)<span className="text-red-700">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Euro size={16} />
            </div>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                validateStep(3);
              }}
              className={`${Style.input} w-full pl-8`}
              placeholder="Enter price in Euro"
              required
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Estimate Price */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Price (€)
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Euro size={16} />
            </div>
            <input
              type="number"
              value={estimatedPrice}
              onChange={(e) => {
                setEstimatedPrice(e.target.value);
                validateStep(3);
              }}
              className={`${Style.input} w-full pl-8`}
              placeholder="Enter estimate price in Euro"
              step="0.01"
              min="0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Original price before discount (if applicable)
          </p>
        </div>

        {/* Shipping Price */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Price (€)
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <Euro size={16} />
            </div>
            <input
              type="number"
              value={shipping}
              onChange={(e) => {
                setShipping(e.target.value);
                validateStep(3);
              }}
              className={`${Style.input} w-full pl-8`}
              placeholder="Enter shipping price in Euro"
              step="0.01"
              min="0"
            />
          </div>
        </div>

        {/* Sale Settings */}
        <div className="border rounded-md p-4 md:p-5 bg-gradient-to-r from-gray-50 to-red-50/30 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <PriceTag size={14} className="text-customRed" />
              </div>
              <span>Activate Sale</span>
              <span className="text-xs text-gray-500 hidden sm:inline">
                (Optional)
              </span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sale.isActive}
                onChange={toggleSale}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-100 
                    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                    after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-5 after:w-5 after:transition-all peer-checked:bg-customRed"
              ></div>
            </label>
          </div>

          {sale.isActive && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Discount Percentage<span className="text-red-700">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sale.discountPercentage}
                    onChange={(e) => {
                      setSale({
                        ...sale,
                        discountPercentage: e.target.value,
                      });
                      validateStep(3);
                    }}
                    className={`${Style.input} w-full pl-7`}
                    placeholder="E.g. 20"
                    min="1"
                    max="99"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    %
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sale Expiry Date<span className="text-red-700">*</span>
                </label>
                <input
                  type="date"
                  value={
                    sale.saleExpiry
                      ? new Date(sale.saleExpiry).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    setSale({
                      ...sale,
                      saleExpiry: e.target.value,
                    });
                    validateStep(3);
                  }}
                  className={`${Style.input} w-full`}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Step 4: Inventory & Options
  const renderInventoryOptionsStep = () => {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex items-center gap-2 text-customRed mb-4 pb-2 border-b">
          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
            <PackageIcon size={18} className="text-customRed" />
          </div>
          <h3 className="text-lg font-medium">Inventory & Options</h3>
        </div>

        {/* Quantity */}
        <div className="">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantity<span className="text-red-700">*</span>
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              validateStep(4);
            }}
            className={`${Style.input} w-full`}
            placeholder="Enter quantity"
            required
            min="0"
          />
        </div>

        {/* Colors */}
        <div className="border rounded-md p-4 md:p-5 bg-white shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-red-500 to-blue-500 flex items-center justify-center"></div>
            Available Colors
          </label>
          <Select
            options={colorOptions}
            value={colors}
            onChange={(val) => {
              setColors(val);
              validateStep(4);
            }}
            isMulti
            placeholder="Select colors"
            className="basic-multi-select"
            classNamePrefix="select"
          />
          <p className="text-xs text-gray-500 mt-2">
            Select all colors available for this product
          </p>
        </div>

        {/* Sizes */}
        <div className="border rounded-md p-4 md:p-5 bg-white shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-xs font-bold text-customRed">S</span>
            </div>
            Available Sizes
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={inputSize}
              onChange={(e) => setInputSize(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter a size (e.g. S, M, L, XL)"
              className={`${Style.input} border rounded p-2 flex-grow`}
            />
            <button
              type="button"
              onClick={handleAddSize}
              className="px-4 py-2 bg-customRed text-white rounded-md hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputSize.trim()}
            >
              Add
            </button>
          </div>

          {/* Display the added sizes */}
          <div className="flex flex-wrap gap-2 mt-4">
            {sizes.map((size) => (
              <span
                key={size}
                className="bg-gray-100 px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {size}
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                  aria-label={`Remove ${size}`}
                >
                  ×
                </button>
              </span>
            ))}
            {sizes.length === 0 && (
              <span className="text-xs text-gray-500 italic py-2">
                No sizes added yet
              </span>
            )}
          </div>
        </div>

        {/* Trending */}
        <div className="border rounded-md p-4 bg-gradient-to-r from-gray-50 to-red-50/30 shadow-sm">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Settings size={16} className="text-customRed" />
              <span>Mark as Trending Product</span>
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={trending}
                onChange={(e) => {
                  setTrending(e.target.checked);
                  validateStep(4);
                }}
                className="sr-only peer"
              />
              <div
                className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-100 
                    peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                    peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                    after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full 
                    after:h-5 after:w-5 after:transition-all peer-checked:bg-customRed"
              ></div>
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Trending products will be featured prominently on the homepage and
            in search results
          </p>
        </div>
      </div>
    );
  };

  // Render mobile stepper for small screens
  const renderMobileStepper = () => {
    return (
      <div className="px-4 pt-4 pb-2 border-b md:hidden">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="flex flex-col items-center relative"
              onClick={() => goToStep(step)}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                ${
                  currentStep === step
                    ? "bg-customRed text-white ring-2 ring-red-100"
                    : step < currentStep || stepsValidation[step]
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {step < currentStep || stepsValidation[step] ? (
                  <CheckCircle2 size={14} />
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium transition-colors duration-300
                ${
                  currentStep === step
                    ? "text-customRed"
                    : step < currentStep || stepsValidation[step]
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {step === 1 && "Info"}
                {step === 2 && "Media"}
                {step === 3 && "Price"}
                {step === 4 && "Stock"}
              </span>

              {/* Connector line */}
              {step < 4 && (
                <div
                  className={`absolute top-4 left-8 w-[calc(100%-1rem)] h-[2px] transition-colors duration-300
                  ${
                    step < currentStep ||
                    (stepsValidation[step] && stepsValidation[step + 1])
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render desktop stepper for larger screens
  const renderDesktopStepper = () => {
    return (
      <div className="px-4 sm:px-6 pt-3 pb-3 border-b bg-gradient-to-r from-white to-red-50/30 hidden md:block">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className="flex flex-col items-center relative"
              onClick={() => goToStep(step)}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm
                ${
                  currentStep === step
                    ? "bg-customRed text-white ring-4 ring-red-100"
                    : step < currentStep || stepsValidation[step]
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {step < currentStep || stepsValidation[step] ? (
                  <CheckCircle2 size={18} />
                ) : (
                  step
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium transition-colors duration-300
                ${
                  currentStep === step
                    ? "text-customRed"
                    : step < currentStep || stepsValidation[step]
                    ? "text-green-500"
                    : "text-gray-500"
                }`}
              >
                {step === 1 && "Basic Info"}
                {step === 2 && "Media"}
                {step === 3 && "Pricing"}
                {step === 4 && "Inventory"}
              </span>

              {/* Connector line */}
              {/* {step < 4 && (
                <div
                  className={`absolute top-5 left-10 w-[calc(100%-2.5rem)] h-[2px] transition-colors duration-300
                  ${
                    step < currentStep ||
                    (stepsValidation[step] && stepsValidation[step + 1])
                      ? "bg-green-500"
                      : "bg-gray-200"
                  }`}
                />
              )} */}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={closeModal}
      className="w-full max-w-4xl bg-white rounded-md overflow-hidden shadow min-h-[15rem] max-h-[99vh] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-customRed to-red-700 px-4 sm:px-6 py-3 sm:py-4 shadow-md">
        <h3 className="text-lg sm:text-xl font-medium text-white flex items-center gap-2">
          {productId ? (
            <>
              <PackageIcon size={20} />
              Edit Product
            </>
          ) : (
            <>
              <PackageIcon size={20} />
              Add New Product
            </>
          )}
        </h3>
        <span
          onClick={() => {
            setProductId("");
            setShowaddProduct(false);
          }}
          className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white cursor-pointer transition-colors duration-200"
        >
          <CgClose className="text-[18px]" />
        </span>
      </div>

      {/* Stepper - Different versions for mobile and desktop */}
      {renderMobileStepper()}
      {renderDesktopStepper()}

      {/* Form Content */}
      <div className="w-full flex-1 overflow-y-auto px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="h-full">
          {renderStepContent()}
        </form>
      </div>

      {/* Footer with Navigation */}
      <div className="border-t px-4 sm:px-6 py-2 sm:py-4 flex items-center justify-between bg-gray-50">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`px-3 sm:px-5 py-2 sm:py-2.5 flex items-center gap-1 sm:gap-2 rounded-md border text-sm transition-all duration-200
          ${
            currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:shadow-sm"
          }`}
        >
          <ChevronLeft size={16} />
          <span className="hidden xs:inline">Previous</span>
        </button>

        <div className="text-xs sm:text-sm text-gray-500 font-medium bg-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border border-gray-200 shadow-sm">
          Step {currentStep} of {totalSteps}
        </div>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={!stepsValidation[currentStep]}
            className={`px-3 sm:px-5 py-2 sm:py-2.5 flex items-center gap-1 sm:gap-2 rounded-md text-sm transition-all duration-200
            ${
              stepsValidation[currentStep]
                ? "bg-customRed text-white hover:bg-red-700 shadow-sm hover:shadow"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span className="hidden xs:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !Object.values(stepsValidation).every(Boolean) || isloading
            }
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-md flex items-center gap-2 text-sm transition-all duration-200
            ${
              Object.values(stepsValidation).every(Boolean) && !isloading
                ? "bg-customRed text-white hover:bg-red-700 shadow-sm hover:shadow"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isloading ? (
              <>
                <FaSpinner className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : productId ? (
              "Save Changes"
            ) : (
              "Create Product"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
