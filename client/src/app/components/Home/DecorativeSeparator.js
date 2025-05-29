const DecorativeSeparator = ({
  pattern = "dots",
  color = "red",
  className = "",
}) => {
  // Color variants
  const colors = {
    red: "text-red-700",
    gradient:
      "text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800",
    light: "text-red-200",
  };

  const selectedColor = colors[color];

  // Pattern rendering
  const renderPattern = () => {
    switch (pattern) {
      case "dots":
        return (
          <div className="flex items-center justify-center gap-2 py-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full bg-current ${
                  i === 2 ? "w-2.5 h-2.5" : ""
                }`}
                style={{
                  opacity: 0.5 + (i === 2 ? 0.5 : Math.abs(2 - i) * 0.1),
                }}
              ></div>
            ))}
          </div>
        );
      case "zigzag":
        return (
          <div className="flex justify-center py-4">
            <svg
              width="120"
              height="12"
              viewBox="0 0 120 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6L10 0L20 6L30 0L40 6L50 0L60 6L70 0L80 6L90 0L100 6L110 0L120 6L110 12L100 6L90 12L80 6L70 12L60 6L50 12L40 6L30 12L20 6L10 12L0 6Z"
                className="fill-current"
                opacity="0.7"
              />
            </svg>
          </div>
        );
      case "waves":
        return (
          <div className="flex justify-center py-4">
            <svg
              width="120"
              height="12"
              viewBox="0 0 120 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 6C10 2 20 10 30 6C40 2 50 10 60 6C70 2 80 10 90 6C100 2 110 10 120 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </div>
        );
      case "arrows":
        return (
          <div className="flex items-center justify-center gap-3 py-4">
            <svg
              width="24"
              height="8"
              viewBox="0 0 24 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 4H22M22 4L19 1M22 4L19 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="w-2 h-2 rounded-full bg-current"></div>
            <svg
              width="24"
              height="8"
              viewBox="0 0 24 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4H2M2 4L5 1M2 4L5 7"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        );
      case "diamonds":
        return (
          <div className="flex items-center justify-center gap-3 py-4">
            <div className="w-2 h-2 bg-current rotate-45"></div>
            <div className="w-3 h-3 bg-current rotate-45"></div>
            <div className="w-4 h-4 bg-current rotate-45"></div>
            <div className="w-3 h-3 bg-current rotate-45"></div>
            <div className="w-2 h-2 bg-current rotate-45"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${selectedColor} ${className}`}>{renderPattern()}</div>
  );
};

export default DecorativeSeparator;
