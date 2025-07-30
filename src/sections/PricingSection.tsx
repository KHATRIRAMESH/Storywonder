import { Button } from "@/components/ui/button";
import Link from "next/link";

export const PricingSection = () => {
  return (
    <div>
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Start for free, upgrade when you need more stories
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="p-8 rounded-2xl bg-white shadow-lg border">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $0<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li>• 3 stories per month</li>
              <li>• Basic customization</li>
              <li>• Community support</li>
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">
                Get Started
              </Button>
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl border-2 border-blue-600">
            <h3 className="text-xl font-semibold mb-2">Pro</h3>
            <div className="text-3xl font-bold mb-4">
              $9<span className="text-lg opacity-80">/month</span>
            </div>
            <ul className="space-y-3 opacity-90 mb-6">
              <li>• 20 stories per month</li>
              <li>• Advanced customization</li>
              <li>• Priority support</li>
              <li>• Export to PDF</li>
            </ul>
            <Link href="/sign-up">
              <Button className="w-full bg-white text-blue-600 hover:bg-gray-50">
                Start Pro Trial
              </Button>
            </Link>
          </div>

          <div className="p-8 rounded-2xl bg-white shadow-lg border">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Premium
            </h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $19<span className="text-lg text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li>• Unlimited stories</li>
              <li>• Premium themes</li>
              <li>• Dedicated support</li>
              <li>• Commercial license</li>
            </ul>
            <Link href="/sign-up">
              <Button variant="outline" className="w-full">
                Go Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
