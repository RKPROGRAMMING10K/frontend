import React, { useState, useRef } from "react";

const ClozeForm = ({
  initialData,
  onSave,
  onSaveAndContinue,
  onCancel,
  questionNo,
  isEditing,
}) => {
  const [sentence, setSentence] = useState(initialData?.sentence || "");
  const [image, setImage] = useState(initialData?.image || "");
  const [options, setOptions] = useState(initialData?.options || []);
  const [newOption, setNewOption] = useState("");
  const textareaRef = useRef(null);

  const addOption = () => {
    if (newOption.trim() && !options.includes(newOption.trim())) {
      setOptions([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const removeOption = (index) => {
    setOptions(options.filter((_, i) => i !== index));
  };

  const insertBlank = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = sentence.substring(start, end);

      if (selectedText.trim()) {
        // Add selected text to options if not already there
        if (!options.includes(selectedText.trim())) {
          setOptions([...options, selectedText.trim()]);
        }

        // Replace selected text with [blank]
        const beforeSelection = sentence.substring(0, start);
        const afterSelection = sentence.substring(end);
        const newSentence = beforeSelection + "[blank]" + afterSelection;
        setSentence(newSentence);
      } else {
        // Just insert [blank] at cursor position
        const beforeCursor = sentence.substring(0, start);
        const afterCursor = sentence.substring(end);
        const newSentence = beforeCursor + "[blank]" + afterCursor;
        setSentence(newSentence);
      }
    }
  };

  const insertUnderscore = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = sentence.substring(start, end);

      if (selectedText.trim()) {
        // Add selected text to options if not already there
        if (!options.includes(selectedText.trim())) {
          setOptions([...options, selectedText.trim()]);
        }

        // Replace selected text with underscores
        const beforeSelection = sentence.substring(0, start);
        const afterSelection = sentence.substring(end);
        const underscores = "_____";
        const newSentence = beforeSelection + underscores + afterSelection;
        setSentence(newSentence);
      } else {
        // Just insert underscores at cursor position
        const beforeCursor = sentence.substring(0, start);
        const afterCursor = sentence.substring(end);
        const newSentence = beforeCursor + "_____" + afterCursor;
        setSentence(newSentence);
      }
    }
  };

  const resetForm = () => {
    setSentence("");
    setOptions([]);
    setNewOption("");
  };

  const handleSave = (saveAndContinue = false) => {
    const blankCount = (sentence.match(/(_____|\[blank\])/g) || []).length;

    if (!sentence.trim()) {
      alert("Please enter a sentence");
      return;
    }

    if (blankCount === 0) {
      alert("Please add at least one blank in the sentence");
      return;
    }

    if (options.length < blankCount) {
      alert(
        `Please add at least ${blankCount} answer options for the ${blankCount} blank(s)`
      );
      return;
    }

    const questionData = {
      sentence,
      image,
      options,
      question: "Fill in the blanks with the correct words:",
    };

    if (saveAndContinue && onSaveAndContinue) {
      onSaveAndContinue(questionData);
    } else {
      onSave(questionData);
    }
  };

  const blankCount = (sentence.match(/(_____|\[blank\])/g) || []).length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
          {questionNo}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          Cloze Question (Drag & Drop)
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sentence with Blanks *
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Select text and click buttons to create blanks)
            </span>
          </label>
          <textarea
            ref={textareaRef}
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            className="w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            placeholder="Enter your sentence here. Then select words and click 'Make Blank' to create blanks for students to fill."
            rows="4"
          />
          <div className="flex gap-3 mt-3">
            <button
              onClick={insertBlank}
              className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Make [blank]
            </button>
            <button
              onClick={insertUnderscore}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
              Make _____
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Preview:</h3>
          <p className="text-blue-700">
            {sentence || "Your sentence preview will appear here..."}
          </p>
          {blankCount > 0 && (
            <p className="text-sm text-blue-600 mt-2">
              📊 Found {blankCount} blank{blankCount !== 1 ? "s" : ""} in your
              sentence
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Answer Options *
            <span className="text-sm font-normal text-gray-500 ml-2">
              (Students will drag these words into the blanks)
            </span>
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addOption()}
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Add an answer option"
            />
            <button
              onClick={addOption}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {options.map((option, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-purple-100 border border-purple-300 rounded-lg"
              >
                <span className="text-purple-800 font-medium text-sm">
                  {option}
                </span>
                <button
                  onClick={() => removeOption(index)}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {options.length === 0 && (
            <p className="text-gray-500 text-sm italic">
              No answer options added yet
            </p>
          )}

          {blankCount > 0 && options.length < blankCount && (
            <p className="text-orange-600 text-sm mt-2">
              ⚠️ You need at least {blankCount} options for {blankCount} blank
              {blankCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Image URL (Optional)
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter image URL (optional)"
          />
          {image && (
            <div className="mt-3">
              <img
                src={image}
                alt="Preview"
                className="max-h-32 rounded-lg border border-gray-300"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={() => handleSave(false)}
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
        >
          <svg
            className="w-5 h-5 mr-2"
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
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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
          className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ClozeForm;
