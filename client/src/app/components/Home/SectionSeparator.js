import { ShoppingBag, Sparkles, Tag, Layers } from "lucide-react";

const SectionSeparator = ({
  title,
  subtitle,
  icon = "none",
  variant = "simple",
  className = "",
  children,
}) => {
  // Icon selection
  const IconComponent = () => {
    switch (icon) {
      case "bag":
        return <ShoppingBag size={20} className="text-red-700" />;
      case "sparkles":
        return <Sparkles size={20} className="text-red-700" />;
      case "tag":
        return <Tag size={20} className="text-red-700" />;
      case "layers":
        return <Layers size={20} className="text-red-700" />;
      default:
        return null;
    }
  };

  // Render different separator variants
  const renderSeparator = () => {
    switch (variant) {
      case "wave":
        return (
          <div className="relative py-4 md:py-5">
            <div className="absolute left-0 right-0 top-0 py-2 bg-gradient-to-b from-white to-transparent"></div>
            <div className="flex items-center justify-center mb-6">
              <div className="h-px bg-gradient-to-r from-transparent via-red-200 to-transparent w-full max-w-xs"></div>
              <div className="mx-4 bg-red-50 rounded-full p-2 shadow-sm">
                <IconComponent />
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-red-200 to-transparent w-full max-w-xs"></div>
            </div>
            <div className="text-center mb-3">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {title}
              </h2>
              {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
            </div>
            <div className="wave-separator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 120"
                className="w-full h-auto"
              >
                <path
                  fill="#FECACA"
                  fillOpacity="0.3"
                  d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,58.7C1200,64,1320,64,1380,64L1440,64L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
                ></path>
              </svg>
            </div>
            {children}
          </div>
        );
      case "angle":
        return (
          <div className="relative py-3 md:py-5">
            <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-br from-red-50 to-white"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-3">
                <div className="h-0.5 bg-gradient-to-r from-transparent via-red-300 to-transparent w-full max-w-md"></div>
              </div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 px-6 py-2 rounded-md shadow-md mb-4">
                  <IconComponent />
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    {title}
                  </h2>
                </div>
                {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
              </div>
              <div className="angle-separator">
                <div className="h-8 bg-gradient-to-r from-red-50 via-red-100 to-red-50 transform -skew-y-1"></div>
              </div>
            </div>
            {children}
          </div>
        );
      case "curve":
        return (
          <div className="relative py-3 md:py-5">
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 relative z-10">
                  {title}
                </h2>
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-red-200/50 rounded-full transform -rotate-1"></div>
              </div>
              {subtitle && <p className="text-gray-500 mt-3">{subtitle}</p>}
            </div>
            <div className="flex items-center justify-center mb-3 overflow-hidden">
              <div className="flex items-center gap-3 px-4">
                <div className="h-px bg-red-200 w-16 md:w-32"></div>
                <div className="rounded-full bg-gradient-to-r from-red-600 to-red-700 p-2 shadow-md">
                  <IconComponent />
                </div>
                <div className="h-px bg-red-200 w-16 md:w-32"></div>
              </div>
            </div>
            <div className="curve-separator">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1440 100"
                className="w-full h-auto"
              >
                <path
                  fill="#FEE2E2"
                  d="M0,32L48,37.3C96,43,192,53,288,53.3C384,53,480,43,576,48C672,53,768,75,864,74.7C960,75,1056,53,1152,42.7C1248,32,1344,32,1392,32L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                ></path>
              </svg>
            </div>
            {children}
          </div>
        );
      case "diamond":
        return (
          <div className="relative py-3 md:py-5">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-100 rotate-45 rounded-sm"></div>
                <div className="relative z-10 bg-white rounded-full p-2">
                  <IconComponent />
                </div>
              </div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                {title}
              </h2>
              {subtitle && <p className="text-gray-500 mt-2">{subtitle}</p>}
            </div>
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-red-700 rotate-45 opacity-80"
                    style={{ opacity: 0.2 + i * 0.2 }}
                  ></div>
                ))}
                <div className="w-3 h-3 bg-red-700 rotate-45"></div>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-red-700 rotate-45 opacity-80"
                    style={{ opacity: 1 - i * 0.2 }}
                  ></div>
                ))}
              </div>
            </div>
            {children}
          </div>
        );
      case "simple":
      default:
        return (
          <div className="relative py-3 md:py-5">
            <div className="flex items-center justify-center mb-3">
              <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent w-full max-w-lg"></div>
              {icon !== "none" && (
                <div className="mx-4 bg-white rounded-full p-1.5 shadow-sm border border-red-100">
                  <IconComponent />
                </div>
              )}
              <div className="h-px bg-gradient-to-r from-transparent via-red-300 to-transparent w-full max-w-lg"></div>
            </div>
            <div className="text-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                {title}
              </h2>
              {subtitle && (
                <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>
              )}
            </div>
            {children}
          </div>
        );
    }
  };

  return <div className={className}>{renderSeparator()}</div>;
};

export default SectionSeparator;
