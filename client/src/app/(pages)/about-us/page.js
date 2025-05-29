"use client";
import MainLayout from "@/app/components/Layout/Layout";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Users, Award, Globe, Heart, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/content/authContent";

export default function AboutUsPage() {
  const { auth } = useAuth();
  return (
    <MainLayout title="About Us - Zorante">
      <div className="min-h-screen bg-gray-50 z-10 relative">
        <div className="container mx-auto py-12 px-4 md:px-6">
          {/* Our Story */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2015, Ayoob E-commerce began as a small family
                business with a passion for delivering quality products at
                affordable prices. What started as a modest online store has now
                grown into one of the region&apos;s most trusted e-commerce
                platforms.
              </p>
              <p className="text-gray-700">
                Our journey has been defined by our commitment to customer
                satisfaction, product quality, and continuous innovation.
                Through the years, we&apos;ve expanded our product range,
                improved our services, and built a community of loyal customers
                who trust us for their shopping needs.
              </p>
            </div>
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Ayoob E-commerce story"
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Our Mission & Vision */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Our Mission & Vision
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-t-4 border-t-[#C6080A]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                  <p className="text-gray-700">
                    To provide an exceptional shopping experience by offering
                    high-quality products, competitive prices, and outstanding
                    customer service. We strive to make online shopping
                    accessible, convenient, and enjoyable for everyone.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-t-4 border-t-[#C6080A]">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-3">Our Vision</h3>
                  <p className="text-gray-700">
                    To become the leading e-commerce platform known for
                    reliability, innovation, and customer-centricity. We aim to
                    expand our reach globally while maintaining the personalized
                    touch that sets us apart from larger corporations.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Users className="h-8 w-8 text-[#C6080A]" />,
                  title: "Customer First",
                  description:
                    "We prioritize our customers' needs and feedback in everything we do.",
                },
                {
                  icon: <Award className="h-8 w-8 text-[#C6080A]" />,
                  title: "Quality",
                  description:
                    "We never compromise on the quality of products and services we offer.",
                },
                {
                  icon: <Building className="h-8 w-8 text-[#C6080A]" />,
                  title: "Integrity",
                  description:
                    "We conduct our business with honesty, transparency, and ethical practices.",
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-[#C6080A]" />,
                  title: "Innovation",
                  description:
                    "We continuously evolve and adapt to meet changing market demands.",
                },
                {
                  icon: <Heart className="h-8 w-8 text-[#C6080A]" />,
                  title: "Passion",
                  description:
                    "We are passionate about what we do and it reflects in our work.",
                },
                {
                  icon: <Globe className="h-8 w-8 text-[#C6080A]" />,
                  title: "Sustainability",
                  description:
                    "We are committed to environmentally responsible business practices.",
                },
              ].map((value, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 flex flex-col items-center text-center">
                    <div className="mb-4 p-3 bg-red-50 rounded-full">
                      {value.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                    <p className="text-gray-700">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
              Meet Our Leadership Team
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  name: "Ahmed Ayoob",
                  position: "Founder & CEO",
                  image: "/placeholder.svg?height=300&width=300",
                },
                {
                  name: "Sarah Khan",
                  position: "Chief Operations Officer",
                  image: "/placeholder.svg?height=300&width=300",
                },
                {
                  name: "Michael Chen",
                  position: "Chief Technology Officer",
                  image: "/placeholder.svg?height=300&width=300",
                },
                {
                  name: "Priya Sharma",
                  position: "Chief Marketing Officer",
                  image: "/placeholder.svg?height=300&width=300",
                },
              ].map((member, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative h-64">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-gray-600">{member.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-[#C6080A] to-[#ff4b4e] rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join the Ayoob Family
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Whether you&apos;re a customer, partner, or looking to join our
              team, we&apos;d love to connect with you. Discover the Ayoob
              difference today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={`/profile/${auth?.user?._id}?tab=support`}
                className="bg-white text-[#C6080A] px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/products"
                className="bg-transparent border border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
