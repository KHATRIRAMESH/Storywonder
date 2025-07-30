"use client";

import Link from "next/link";
import { BookOpen, Heart, Twitter, Github, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  return (
    <footer
      className="text-white mt-auto"
      style={{
        background: `linear-gradient(135deg, var(--background) 0%, #2A3A4F 50%, var(--background) 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-1">
            <Link href="/">
              <div className="flex items-center space-x-2 mb-4">
                <div
                  className="w-10 h-10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30"
                  style={{
                    background: `linear-gradient(135deg, var(--primary), var(--secondary))`,
                  }}
                >
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">
                  StoryWonderbook
                </span>
              </div>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed mb-4">
              Create magical, personalized storybooks for children with
              AI-powered story generation and character matching.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/20 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/20 transition-all"
              >
                <Github className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white/80 hover:text-white hover:bg-white/20 transition-all"
              >
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-yellow-300 mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/create-story"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Create Story
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  My Stories
                </Link>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Features
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-yellow-300 mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-yellow-300 mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white/80 hover:text-yellow-300 transition-colors"
                >
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm">
            © {new Date().getFullYear()} StoryWonderbook. All rights reserved.
          </p>
          <div className="flex items-center mt-4 md:mt-0">
            <span className="text-white/70 text-sm mr-2">Made with</span>
            <Heart className="w-4 h-4 text-pink-300 fill-current" />
            <span className="text-white/70 text-sm ml-2">
              for children everywhere
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
