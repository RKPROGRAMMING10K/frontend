import React, { useState, useEffect } from "react";

const ComprehensionForm = ({
  onSave,
  onSaveAndContinue,
  onCancel,
  questionNo,
  initialData = null,
  isEditing = false,
}) => {
  const [paragraph, setParagraph] = useState("");
  const [image, setImage] = useState("");
  const [subQuestions, setSubQuestions] = useState([
    { question: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);

  // Initialize form with existing data when editing
  useEffect(() => {
    if (initialData) {
      setParagraph(initialData.paragraph || "");
      setImage(initialData.image || "");
      setSubQuestions(
        initialData.subQuestions?.length > 0
          ? initialData.subQuestions
          : [{ question: "", options: ["", "", "", ""], correctAnswer: "" }]
      );
    }
  }, [initialData]);

  const addSubQuestion = () => {
    setSubQuestions([
      ...subQuestions,
      { question: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const removeSubQuestion = (index) => {
    setSubQuestions(subQuestions.filter((_, i) => i !== index));
  };

  const updateSubQuestion = (index, field, value) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[index][field] = value;
    setSubQuestions(newSubQuestions);
  };

  const updateOption = (subIndex, optionIndex, value) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[subIndex].options[optionIndex] = value;
    setSubQuestions(newSubQuestions);
  };

  const addOption = (subIndex) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[subIndex].options.push("");
    setSubQuestions(newSubQuestions);
  };

  const removeOption = (subIndex, optionIndex) => {
    const newSubQuestions = [...subQuestions];
    if (newSubQuestions[subIndex].options.length > 2) {
      newSubQuestions[subIndex].options.splice(optionIndex, 1);
      setSubQuestions(newSubQuestions);
    }
  };

  const setCorrectAnswer = (subIndex, option) => {
    const newSubQuestions = [...subQuestions];
    newSubQuestions[subIndex].correctAnswer = option;
    setSubQuestions(newSubQuestions);
  };

  const handleSave = (continueWithSameType = false) => {
    if (!paragraph.trim()) {
      alert("Please enter a paragraph");
      return;
    }

    const validSubQuestions = subQuestions.filter(
      (subQ) =>
        subQ.question.trim() !== "" &&
        subQ.options.some((opt) => opt.trim() !== "") &&
        subQ.correctAnswer.trim() !== ""
    );

    if (validSubQuestions.length === 0) {
      alert(
        "Please add at least one valid sub-question with options and correct answer"
      );
      return;
    }

    const questionData = {
      paragraph,
      image,
      subQuestions: validSubQuestions,
    };

    if (continueWithSameType && onSaveAndContinue) {
      onSaveAndContinue(questionData);
    } else {
      onSave(questionData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">
        Comprehension Question {questionNo}
      </h2>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paragraph *
          </label>
          <textarea
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter the paragraph for comprehension"
            rows="6"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter image URL"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Sub Questions *
            </label>
            <button
              onClick={addSubQuestion}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              + Add Sub Question
            </button>
          </div>

          {subQuestions.map((subQ, subIndex) => (
            <div
              key={subIndex}
              className="border border-gray-200 rounded-lg p-4 mb-4"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">
                  Question {questionNo}.{subIndex + 1}
                </h4>
                {subQuestions.length > 1 && (
                  <button
                    onClick={() => removeSubQuestion(subIndex)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={subQ.question}
                  onChange={(e) =>
                    updateSubQuestion(subIndex, "question", e.target.value)
                  }
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sub question"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Options
                  </label>
                  {subQ.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex gap-2 mb-2">
                      <span className="flex items-center px-3 py-2 bg-gray-100 rounded text-sm">
                        {optionIndex + 1}.
                      </span>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) =>
                          updateOption(subIndex, optionIndex, e.target.value)
                        }
                        className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Option ${optionIndex + 1}`}
                      />
                      <button
                        onClick={() => setCorrectAnswer(subIndex, option)}
                        className={`px-3 py-2 rounded text-sm transition-colors ${
                          subQ.correctAnswer === option
                            ? "bg-green-500 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {subQ.correctAnswer === option
                          ? "✓ Correct"
                          : "Mark Correct"}
                      </button>
                      {subQ.options.length > 2 && (
                        <button
                          onClick={() => removeOption(subIndex, optionIndex)}
                          className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addOption(subIndex)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                  >
                    + Add Option
                  </button>
                </div>

                {subQ.correctAnswer && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      <strong>Correct Answer:</strong> {subQ.correctAnswer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={() => handleSave(false)}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
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
              d="M5 13l4 4L19 7"
            />
          </svg>
          {isEditing ? "Update Question" : "Save Question"}
        </button>

        {!isEditing && onSaveAndContinue && (
          <button
            onClick={() => handleSave(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
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
            Add & Continue Same Type
          </button>
        )}

        <button
          onClick={onCancel}
          className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ComprehensionForm;
