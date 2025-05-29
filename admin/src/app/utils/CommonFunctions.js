export const sizeOptions = [
  // Clothing Sizes (Unisex)
  { value: "XS", label: "Extra Small" },
  { value: "S", label: "Small" },
  { value: "M", label: "Medium" },
  { value: "L", label: "Large" },
  { value: "XL", label: "Extra Large" },
  { value: "XXL", label: "2X Large" },
  { value: "XXXL", label: "3X Large" },

  // Men's Clothing Sizes
  { value: "28", label: "28 Waist" },
  { value: "30", label: "30 Waist" },
  { value: "32", label: "32 Waist" },
  { value: "34", label: "34 Waist" },
  { value: "36", label: "36 Waist" },
  { value: "38", label: "38 Waist" },

  // Women's Clothing Sizes
  { value: "0", label: "0" },
  { value: "2", label: "2" },
  { value: "4", label: "4" },
  { value: "6", label: "6" },
  { value: "8", label: "8" },
  { value: "10", label: "10" },

  // Shoes Sizes (US)
  { value: "6", label: "US 6" },
  { value: "7", label: "US 7" },
  { value: "8", label: "US 8" },
  { value: "9", label: "US 9" },
  { value: "10", label: "US 10" },
  { value: "11", label: "US 11" },
  { value: "12", label: "US 12" },

  // Shoes Sizes (EU)
  { value: "36", label: "EU 36" },
  { value: "37", label: "EU 37" },
  { value: "38", label: "EU 38" },
  { value: "39", label: "EU 39" },
  { value: "40", label: "EU 40" },
  { value: "41", label: "EU 41" },
  { value: "42", label: "EU 42" },

  // Kids Clothing Sizes
  { value: "2T", label: "Toddler 2T" },
  { value: "3T", label: "Toddler 3T" },
  { value: "4T", label: "Toddler 4T" },

  // Baby Sizes
  { value: "NB", label: "Newborn" },
  { value: "3M", label: "3 Months" },
  { value: "6M", label: "6 Months" },
  { value: "9M", label: "9 Months" },
  { value: "12M", label: "12 Months" },

  // Bedding Sizes
  { value: "Twin", label: "Twin" },
  { value: "Full", label: "Full" },
  { value: "Queen", label: "Queen" },
  { value: "King", label: "King" },
  { value: "California King", label: "California King" },

  // General Product Sizes
  { value: "Small", label: "Small" },
  { value: "Medium", label: "Medium" },
  { value: "Large", label: "Large" },
  { value: "XLarge", label: "Extra Large" },

  // Volume Sizes (Liquids)
  { value: "250ml", label: "250 ml" },
  { value: "500ml", label: "500 ml" },
  { value: "1L", label: "1 Liter" },
  { value: "2L", label: "2 Liters" },

  // Weight Sizes (Grocery)
  { value: "250g", label: "250 grams" },
  { value: "500g", label: "500 grams" },
  { value: "1kg", label: "1 kilogram" },
  { value: "2kg", label: "2 kilograms" },

  // Miscellaneous Sizes
  { value: "OneSize", label: "One Size Fits All" },
  { value: "adjustable", label: "Adjustable" },
];

export const colorData = [
  // Basic Colors
  { value: "#FFFFFF", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#808080", label: "Gray" },
  { value: "#C0C0C0", label: "Silver" },

  // Primary Colors
  { value: "#FF0000", label: "Red" },
  { value: "#0000FF", label: "Blue" },
  { value: "#FFFF00", label: "Yellow" },

  // Secondary Colors
  { value: "#FFA500", label: "Orange" },
  { value: "#800080", label: "Purple" },
  { value: "#008000", label: "Green" },

  // Pastel Colors
  { value: "#FFB6C1", label: "Light Pink" },
  { value: "#ADD8E6", label: "Light Blue" },
  { value: "#FFFFE0", label: "Light Yellow" },
  { value: "#E6E6FA", label: "Lavender" },

  // Metallic Colors
  { value: "#FFD700", label: "Gold" },
  { value: "#CD7F32", label: "Bronze" },

  // Neutral Colors
  { value: "#F5F5DC", label: "Beige" },
  { value: "#D2B48C", label: "Tan" },
  { value: "#8B4513", label: "Brown" },
  { value: "#FFF8DC", label: "Cornsilk" },

  // Jewel Tones
  { value: "#50C878", label: "Emerald" },
  { value: "#8A2BE2", label: "Amethyst" },
  { value: "#FF6347", label: "Ruby" },

  // Vibrant Colors
  { value: "#FF69B4", label: "Hot Pink" },
  { value: "#00FFFF", label: "Cyan" },
  { value: "#7FFF00", label: "Chartreuse" },

  // Dark Shades
  { value: "#2F4F4F", label: "Dark Slate Gray" },
  { value: "#556B2F", label: "Dark Olive Green" },
  { value: "#8B0000", label: "Dark Red" },
  { value: "#191970", label: "Midnight Blue" },

  // Miscellaneous Colors
  { value: "#FF4500", label: "Coral" },
  { value: "#B0E0E6", label: "Powder Blue" },
  { value: "#FFE4C4", label: "Bisque" },
  { value: "#FAEBD7", label: "Antique White" },
];

export const colorOptions = colorData.map((color) => ({
  value: color.value,
  name: color.label,
  label: (
    <div className="flex items-center gap-1">
      <div
        className="w-3 h-3 rounded-full"
        style={{ backgroundColor: color.value }}
      ></div>
      {color.label}
    </div>
  ),
}));
