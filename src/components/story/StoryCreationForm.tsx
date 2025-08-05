"use client";

import { useState, useRef } from "react";
import { useStoryCreation } from "@/hooks/useStoryApiNew";
import { themes, storyLengths, genderOptions } from "@/constant/StoryOptions";

import { Button } from "@/components/ui/button";
import { ApiUtils } from "@/lib";
// import type { StoryCreationData, Story } from "@/lib/apiService";
import { StoryCreationData, Story } from "@/types";
import Image from "next/image";

interface StoryCreationFormProps {
  onSuccess?: (storyId: number) => void;
  onCancel?: () => void;
}

export function StoryCreationForm({
  onSuccess,
  onCancel,
}: StoryCreationFormProps) {
  const [formData, setFormData] = useState<Partial<StoryCreationData>>({
    childName: "",
    childAge: 5,
    childGender: "girl",
    theme: "",
    storyLength: "medium",
    interests: [],
    isPublic: false,
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { createStory, creating, error } = useStoryCreation();
  const [createdStory, setCreatedStory] = useState<Story | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validate form data
    const validationErrors = ApiUtils.validateStoryData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const storyData: StoryCreationData = {
        childName: formData.childName!,
        childAge: formData.childAge!,
        childGender: formData.childGender!,
        interests: formData.interests || [],
        theme: formData.theme!,
        storyLength: formData.storyLength!,
        isPublic: formData.isPublic || false,
        image: selectedImage || undefined,
      };

      const newStory = await createStory(storyData);
      setCreatedStory(newStory);
      onSuccess?.(parseInt(newStory.id));
    } catch (err) {
      console.error("Story creation failed:", err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "childAge" ? parseInt(value) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(["Image file must be smaller than 5MB"]);
        return;
      }

      setSelectedImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (createdStory) {
    return (
      <div className="text-center py-8">
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          <h3 className="font-bold">Story Created Successfully!</h3>
          <p>Your story &quot;{createdStory.title}&quot; is being generated.</p>
        </div>
        <Button onClick={() => onSuccess?.(parseInt(createdStory.id))}>
          View Story
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Create a New Story
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {errors.length > 0 && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <ul className="list-disc list-inside">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              About Your Child
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="childName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Child&apos;s Name *
                </label>
                <input
                  type="text"
                  id="childName"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter child's name"
                  disabled={creating}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="childAge"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age *
                </label>
                <select
                  id="childAge"
                  name="childAge"
                  value={formData.childAge}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={creating}
                  required
                >
                  {Array.from({ length: 10 }, (_, i) => i + 3).map((age) => (
                    <option key={age} value={age}>
                      {age} years old
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="childGender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Gender *
              </label>
              <select
                id="childGender"
                name="childGender"
                value={formData.childGender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={creating}
                required
              >
                {genderOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Story Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Story Settings
            </h3>

            <div>
              <label
                htmlFor="theme"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Theme *
              </label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={creating}
                required
              >
                <option value="">Select a theme</option>
                {themes.map((theme, index) => (
                  <option key={index} value={theme}>
                    {theme}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="storyLength"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Story Length *
              </label>
              <select
                id="storyLength"
                name="storyLength"
                value={formData.storyLength}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={creating}
                required
              >
                {storyLengths.map((length) => (
                  <option key={length.value} value={length.value}>
                    {length.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Child Image Upload */}
          <div>
            <label
              htmlFor="childImage"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Child&apos;s Photo (Optional)
            </label>
            <p className="text-sm text-gray-500 mb-2">
              Upload a photo to make the story more personalized. Maximum file
              size: 5MB
            </p>

            {imagePreview ? (
              <div className="mb-4">
                <Image
                  src={imagePreview}
                  alt="Child preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-300"
                />
                <Button
                  type="button"
                  onClick={removeImage}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  disabled={creating}
                >
                  Remove Image
                </Button>
              </div>
            ) : (
              <input
                ref={fileInputRef}
                type="file"
                id="childImage"
                name="childImage"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={creating}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={creating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating Story..." : "Create Story"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
