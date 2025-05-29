"use client";
import MainLayout from "@/app/components/Layout/Layout";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  Lock,
  ShieldCheck,
  KeyRound,
  UserCheck,
  EyeOff,
} from "lucide-react";

export default function AccountSecurity() {
  return (
    <MainLayout
      title="Account Security - Zorante"
      description={
        "How we keep your account safe and what you can do to protect it."
      }
    >
      <div className="min-h-screen bg-transparent relative z-10">
        <div className="container mx-auto py-12 px-4 md:px-6">
          {/* Last Updated */}
          <div className="mb-8 text-right">
            <p className="text-gray-500">Last Updated: April 14, 2025</p>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <AlertCircle className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Introduction</h2>
                  <p className="text-gray-700 mb-4">
                    At Zorante, we prioritize the security of your personal and
                    account information. This policy explains our security
                    practices and what steps you can take to ensure your account
                    remains protected.
                  </p>
                  <p className="text-gray-700">
                    By using our services, you agree to adhere to the following
                    guidelines to help safeguard your data.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Password Guidelines */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <KeyRound className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Password Guidelines
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Use strong, unique passwords for your account. Avoid using
                    common words, names, or easily guessed information.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>
                      Use at least 8 characters, including uppercase, lowercase,
                      numbers, and symbols
                    </li>
                    <li>
                      Avoid using the same password across multiple websites
                    </li>
                    <li>
                      Change your password periodically and avoid sharing it
                      with others
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Two-Factor Authentication (2FA)
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Enable 2FA on your Zorante account for an extra layer of
                    security. This helps protect your account even if your
                    password is compromised.
                  </p>
                  <p className="text-gray-700">
                    We support SMS and authenticator apps for 2FA. You can
                    manage your 2FA settings in your account security
                    preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Alerts */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <EyeOff className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">Login Alerts</h2>
                  <p className="text-gray-700 mb-4">
                    Stay informed about activity on your account. We&apos;ll
                    send you an alert for any suspicious login or access
                    attempt.
                  </p>
                  <p className="text-gray-700">
                    If you receive an alert that wasn&apos;t you, change your
                    password immediately and contact our support team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Secure Your Devices */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-50 rounded-full">
                  <Lock className="h-6 w-6 text-[#C6080A]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-3">
                    Secure Your Devices
                  </h2>
                  <p className="text-gray-700 mb-4">
                    Keep your devices secure by using updated software and
                    antivirus tools. Avoid using public or shared devices to
                    access your Zorante account.
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-gray-700">
                    <li>Use device passwords or biometric locks</li>
                    <li>Keep operating systems and apps up to date</li>
                    <li>Be cautious of phishing emails or suspicious links</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Security Team */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-bold mb-3">
                Need Help with Account Security?
              </h2>
              <p className="text-gray-700 mb-4">
                If you believe your account has been compromised or have
                questions about account security, reach out to our security
                support team:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">Zorante Security Support</p>
                <p>Email: security@zorantestore.com</p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Hours: Monday-Friday, 9am-6pm EST</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
