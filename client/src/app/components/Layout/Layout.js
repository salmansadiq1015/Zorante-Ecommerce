import { Helmet } from "react-helmet";
import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
  title,
  description,
  keywords,
  author,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) {
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 200 && currentScrollY > lastScrollY + 10) {
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY - 10) {
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta property="og:title" content={ogTitle} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={ogUrl} />
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={twitterTitle} />
        <meta name="twitter:description" content={twitterDescription} />
        <meta name="twitter:image" content={twitterImage} />
        <title>{title}</title>
      </Helmet>
      <div
        className={`sticky top-0 left-0 w-full z-[99999] bg-white text-black shadow-md transition-transform duration-300 ${
          showHeader ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <Header />
      </div>
      <main className="flex-grow overflow-hidden bg-whitw text-black relative ">
        <div className="absolute top-[-2rem] sm:top-[-6rem] right-[-2rem] sm:right-[-6rem] w-[8rem] sm:w-[20rem] h-[8rem] sm:h-[20rem] bg-red-500 rounded-full z-[1]"></div>
        <div
          className="absolute top-[-2rem] right-[-2rem] w-[8rem] sm:w-[20rem] h-[8rem] sm:h-[20rem] bg-red-200 rounded-full z-0"
          style={{
            borderRadius: "140px 200px 104px 86px",
            WebkitBorderRadius: "140px 200px 104px 86px",
            MozBorderRadius: "140px 200px 104px 86px",
          }}
        ></div>

        {children}

        <div
          className="absolute bottom-[-6rem] left-[-6rem] w-[8rem] sm:w-[20rem] h-[8rem] sm:h-[20rem] bg-red-500 rounded-full z-[1]"
          style={{
            borderRadius: "140px 75px 200px 161px",
            WebkitBorderRadius: "140px 75px 200px 161px",
            MozBorderRadius: " 140px 75px 200px 161px",
          }}
        ></div>
        <div
          className="absolute bottom-[-2rem] left-[-2rem] w-[8rem] sm:w-[20rem] h-[8rem] sm:h-[20rem] bg-red-200 rounded-full z-0"
          style={{
            borderRadius: "140px 75px 200px 161px",
            WebkitBorderRadius: "140px 75px 200px 161px",
            MozBorderRadius: " 140px 75px 200px 161px",
          }}
        ></div>
      </main>
      <Footer />
    </div>
  );
}

MainLayout.defaultProps = {
  title: "Zorante – Online Shopping for Electronics, Fashion & More",
  description:
    "Shop online at Zorante for the latest fashion, electronics, home appliances, beauty products, and more. Enjoy great discounts, secure payment options, and fast delivery across Pakistan.",
  keywords:
    "Zorante shopping, online store Pakistan, buy electronics online, fashion shopping, home appliances, beauty products, best e-commerce Pakistan, mobile phones, fast delivery shopping, best online deals",
  author: "Zorante",
  ogTitle: "Zorante – Your Trusted Online Shopping Destination",
  ogDescription:
    "Zorante brings you a seamless online shopping experience with a wide range of products, great discounts, and fast nationwide delivery.",
  ogImage: "/assets/zorante-preview.jpg",
  ogUrl: "https://www.zorante.com",
  twitterCard: "summary_large_image",
  twitterTitle: "Zorante – Shop Electronics, Fashion & More Online",
  twitterDescription:
    "Find the best deals on fashion, electronics, home essentials, and more at Zorante. Secure payments & fast delivery across Pakistan.",
  twitterImage: "/assets/zorante-preview.jpg",
};
