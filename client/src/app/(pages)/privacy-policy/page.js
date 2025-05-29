"use client";
import MainLayout from "@/app/components/Layout/Layout";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  Lock,
  Smartphone,
  AlertTriangle,
  Eye,
  KeyRound,
  CreditCard,
  UserCheck,
} from "lucide-react";
import axios from "axios";

export default function PrivacyPolicy() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/privacy/fetch/privacy`
      );
      setData(data.privacy);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <MainLayout title="Privacy Policy - Zorante">
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-12 px-4 md:px-6">
          {/* Introduction */}
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <ShieldCheck className="h-16 w-16 text-[#C6080A] mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Your Security Is Our Priority
            </h2>
            <p className="text-gray-700">
              At Zorante E-commerce, we implement industry-leading security
              measures to protect your personal information and ensure safe
              transactions. This page outlines the steps we take to secure your
              account and provides guidance on how you can enhance your
              security.
            </p>
          </div>

          {/* Security Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Our Security Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <Lock className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        Secure Authentication
                      </h3>
                      <p className="text-gray-700">
                        We use advanced authentication protocols to verify your
                        identity when you log in. Our system supports strong
                        password requirements and multi-factor authentication
                        for enhanced security.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <CreditCard className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        Secure Payments
                      </h3>
                      <p className="text-gray-700">
                        All payment information is encrypted using
                        industry-standard SSL/TLS encryption. We comply with PCI
                        DSS standards to ensure secure credit card processing,
                        and we never store your full credit card details on our
                        servers.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <Eye className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        Data Protection
                      </h3>
                      <p className="text-gray-700">
                        Your personal data is protected using advanced
                        encryption techniques. We regularly update our security
                        systems and conduct security audits to identify and
                        address potential vulnerabilities.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-red-50 rounded-full">
                      <AlertTriangle className="h-6 w-6 text-[#C6080A]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold mb-2">
                        Fraud Detection
                      </h3>
                      <p className="text-gray-700">
                        Our advanced fraud detection system monitors
                        transactions in real-time to identify suspicious
                        activities. If we detect unusual activity on your
                        account, we&apos;ll alert you immediately and take steps
                        to secure your account.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Security Best Practices */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Security Best Practices
            </h2>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Protect Your Account</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <KeyRound className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">Create a Strong Password</p>
                    <p className="text-gray-700">
                      Use a unique password that includes a mix of uppercase and
                      lowercase letters, numbers, and special characters. Avoid
                      using easily guessable information like birthdays or
                      names.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <Smartphone className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Enable Two-Factor Authentication (2FA)
                    </p>
                    <p className="text-gray-700">
                      Add an extra layer of security by enabling 2FA in your
                      account settings. This requires a verification code in
                      addition to your password when logging in from a new
                      device.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <UserCheck className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">
                      Regularly Review Your Account Activity
                    </p>
                    <p className="text-gray-700">
                      Check your order history and account activity regularly.
                      If you notice any unauthorized transactions or suspicious
                      activity, report it immediately.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4">Safe Shopping Tips</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <Lock className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">Shop on Secure Connections</p>
                    <p className="text-gray-700">
                      Always ensure you&apos;re on a secure connection (look for
                      &quot;https://&quot; in the URL) when shopping online.
                      Avoid making purchases or accessing your account on public
                      Wi-Fi networks.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">Be Wary of Phishing Attempts</p>
                    <p className="text-gray-700">
                      We will never ask for sensitive information via email or
                      text message. If you receive suspicious communications
                      claiming to be from Zorante E-commerce, do not click on
                      any links or provide any information.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="p-1 bg-red-50 rounded-full mt-0.5">
                    <CreditCard className="h-4 w-4 text-[#C6080A]" />
                  </div>
                  <div>
                    <p className="font-medium">Monitor Your Payment Methods</p>
                    <p className="text-gray-700">
                      Regularly check your credit card and bank statements for
                      unauthorized charges. Set up alerts with your financial
                      institutions to be notified of unusual activity.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Security Alerts */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Current Security Alerts
            </h2>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-red-50 rounded-full">
                    <AlertTriangle className="h-6 w-6 text-[#C6080A]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">
                      Phishing Alert: April 2025
                    </h3>
                    <p className="text-gray-700 mb-4">
                      We&apos;ve detected phishing emails claiming to be from
                      Zorante E-commerce asking customers to update their
                      payment information due to &quot;security concerns.&quot;
                      These emails are NOT from us. We will never ask you to
                      provide sensitive information via email or direct you to
                      external websites to update your account details.
                    </p>
                    <div className="bg-red-50 border-l-4 border-red-500 p-4">
                      <p className="text-red-800">
                        <span className="font-bold">
                          How to identify phishing attempts:
                        </span>
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-red-800 mt-2">
                        <li>Check the sender&apos;s email address carefully</li>
                        <li>
                          Look for grammatical errors or unusual formatting
                        </li>
                        <li>
                          Hover over links before clicking to see the actual URL
                        </li>
                        <li>Be suspicious of urgent requests or threats</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Security Issues */}
          <div className="bg-gradient-to-r z-10 relative from-[#C6080A] to-[#ff4b4e] rounded-lg p-8 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Report Security Issues
              </h2>
              <p className="mb-6">
                If you suspect your account has been compromised or want to
                report a security concern, please contact our security team
                immediately.
              </p>
              <div className="inline-block bg-white text-[#C6080A] rounded-lg p-4">
                <p className="font-bold">Security Contact Information:</p>
                <p>Email: security@zorantestore.com</p>
                <p>Phone: +1 (555) 987-6543</p>
                <p>Available 24/7 for security emergencies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
