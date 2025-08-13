import React, { useState, useEffect } from "react";

const CategorizeForm = ({
  onSave,
  onSaveAndContinue,
  onCancel,
  questionNo,
  initialData = null,
  isEditing = false,
}) => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([""]);
  const [items, setItems] = useState([{ name: "", belongsTo: "" }]);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setQuestion(initialData.question || "");
      setImage(initialData.image || "");
      setCategories(
        initialData.categories?.length > 0 ? initialData.categories : [""]
      );
      setItems(
        initialData.items?.length > 0
          ? initialData.items
          : [{ name: "", belongsTo: "" }]
      );
    }
  }, [initialData]);

  const addCategory = () => {
    setCategories([...categories, ""]);
  };

  const updateCategory = (index, value) => {
    const newCategories = [...categories];
    newCategories[index] = value;
    setCategories(newCategories);
  };

  const removeCategory = (index) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const addItem = () => {
    setItems([...items, { name: "", belongsTo: "" }]);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = (continueWithSameType = false) => {
    const validCategories = categories.filter((cat) => cat.trim() !== "");
    const validItems = items.filter(
      (item) => item.name.trim() !== "" && item.belongsTo.trim() !== ""
    );

    if (
      !question.trim() ||
      validCategories.length === 0 ||
      validItems.length === 0
    ) {
      alert("Please fill all required fields");
      return;
    }

    const questionData = {
      question,
      image,
      categories: validCategories,
      items: validItems,
    };

    if (continueWithSameType && onSaveAndContinue) {
      onSaveAndContinue(questionData);
    } else {
      onSave(questionData);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
            {questionNo}
          </div>
          Categorize Question
        </h2>
        <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          Question Type: Categorize
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Question *
          </label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg"
            placeholder="Enter your categorization question"
            rows="3"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Image URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-lg"
            placeholder="Add an image to enhance your question"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Categories *
            </label>
            <button
              onClick={addCategory}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Category
            </button>
          </div>
          <div className="space-y-3">
            {categories.map((category, index) => (
              <div
                key={index}
                className="flex gap-3 items-center p-4 bg-gray-50 rounded-xl border border-gray-200"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => updateCategory(index, e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  placeholder={`Category ${index + 1}`}
                />
                {categories.length > 1 && (
                  <button
                    onClick={() => removeCategory(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-700">
              Items & Belongs To *
            </label>
            <button
              onClick={addItem}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Item
            </button>
          </div>
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={index}
                className="flex gap-3 items-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
              >
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(index, "name", e.target.value)}
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200"
                  placeholder={`Item ${index + 1}`}
                />
                <div className="text-gray-400 font-medium">→</div>
                <select
                  value={item.belongsTo}
                  onChange={(e) =>
                    updateItem(index, "belongsTo", e.target.value)
                  }
                  className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-purple-100 focus:border-purple-500 transition-all duration-200 bg-white"
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((cat) => cat.trim() !== "")
                    .map((category, catIndex) => (
                      <option key={catIndex} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => handleSave(false)}
          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {isEditing ? "Update Question" : "Save Question"}
        </button>

        {!isEditing && onSaveAndContinue && (
          <button
            onClick={() => handleSave(true)}
            className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add & Continue Same Type
          </button>
        )}

        <button
          onClick={onCancel}
          className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CategorizeForm;
