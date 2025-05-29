import Link from "next/link";
import { FaGreaterThan } from "react-icons/fa6";

const Breadcrumb = ({ path }) => {
  const segments = path.split("/").filter(Boolean);

  const isId = (segment) => /^[a-f\d]{24}$/i.test(segment); // Regex for MongoDB ObjectId

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      {segments
        .filter(
          (segment, index) => !(index === segments.length - 1 && isId(segment))
        )
        .map((segment, index) => {
          const isLast = index === segments.length - 1;
          const segmentPath = "/" + segments.slice(0, index + 1).join("/");

          return (
            <div key={index} className="flex items-center">
              {!isLast ? (
                <Link href={segmentPath}>
                  <span className="hover:underline text-red-500 capitalize">
                    {segment}
                  </span>
                </Link>
              ) : (
                <span className="text-gray-800 font-medium capitalize">
                  {segment}
                </span>
              )}
              {!isLast && (
                <span className="">
                  <FaGreaterThan className="text-[13px] ml-1" />
                </span>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Breadcrumb;
