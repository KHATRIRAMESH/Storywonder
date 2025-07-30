import { Heart, Sparkles, Users } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <div>
      <section id="features" className="container mx-auto px-4 py-20 ">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose StoryWonderbook?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Powered by cutting-edge AI technology to create unique, personalized
            stories
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 rounded-2xl bg-white shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              AI-Powered Stories
            </h3>
            <p className="text-gray-600">
              Advanced AI creates unique, engaging stories tailored to your
              preferences and characters.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Personalized Characters
            </h3>
            <p className="text-gray-600">
              Create stories featuring your child as the main character for a
              truly personal experience.
            </p>
          </div>

          <div className="text-center p-6 rounded-2xl bg-white shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Family Friendly
            </h3>
            <p className="text-gray-600">
              Safe, age-appropriate content that parents can trust and children
              will love.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
