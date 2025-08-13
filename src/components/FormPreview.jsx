import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DragDropCloze = ({ question, answers, onAnswerChange }) => {
  const [draggedOption, setDraggedOption] = useState(null);

  // Parse the sentence to identify blanks (marked with _____ or [blank])
  const parseSentence = (sentence) => {
    if (!sentence) return [];

    const parts = [];
    const blankPattern = /(_____|\[blank\]|\[_+\])/g;
    let lastIndex = 0;
    let match;
    let blankIndex = 0;

    while ((match = blankPattern.exec(sentence)) !== null) {
      // Add text before the blank
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: sentence.substring(lastIndex, match.index),
        });
      }

      // Add the blank
      parts.push({
        type: "blank",
        index: blankIndex,
        id: `blank_${blankIndex}`,
      });

      lastIndex = match.index + match[0].length;
      blankIndex++;
    }

    // Add remaining text
    if (lastIndex < sentence.length) {
      parts.push({
        type: "text",
        content: sentence.substring(lastIndex),
      });
    }

    return parts;
  };

  const handleOptionDragStart = (e, option) => {
    setDraggedOption(option);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnBlank = (e, blankId) => {
    e.preventDefault();
    if (draggedOption) {
      onAnswerChange(question.id, blankId, draggedOption);
      setDraggedOption(null);
    }
  };

  const removeAnswer = (blankId) => {
    onAnswerChange(question.id, blankId, "");
  };

  // Get sentence from question data - try multiple field names
  const sentence =
    question.sentence || question.previewText || question.question || "";

  // Get options from question data - try multiple field names
  const options =
    question.options || question.choices || question.answers || [];

  console.log("=== CLOZE DEBUG ===");
  console.log("Question:", question);
  console.log("Sentence found:", sentence);
  console.log("Options found:", options);
  console.log("=================");

  const sentenceParts = parseSentence(sentence);
  const usedOptions = Object.values(answers[question.id] || {}).filter(
    (val) => val !== ""
  );

  // If no sentence or no blanks found, show error
  if (!sentence || sentenceParts.length === 0) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-red-800 font-semibold mb-2">
          Cloze Question Setup Error
        </h3>
        <p className="text-red-700 mb-2">
          This cloze question is missing the sentence with blanks.
        </p>
        <details className="text-sm text-red-600">
          <summary className="cursor-pointer">Debug Information</summary>
          <pre className="mt-2 text-xs bg-red-100 p-2 rounded">
            {JSON.stringify(question, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  // If no options, show error
  if (!options || options.length === 0) {
    return (
      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-yellow-800 font-semibold mb-2">
          Missing Answer Options
        </h3>
        <p className="text-yellow-700 mb-4">
          This cloze question has a sentence but no answer options for students
          to drag.
        </p>

        {/* Show the sentence anyway */}
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">Sentence:</h4>
          <div className="text-lg leading-relaxed flex flex-wrap items-center gap-2">
            {sentenceParts.map((part, index) => {
              if (part.type === "text") {
                return (
                  <span key={index} className="text-gray-800">
                    {part.content}
                  </span>
                );
              } else {
                return (
                  <div
                    key={index}
                    className="inline-flex items-center min-w-[120px] min-h-[40px] border-2 border-dashed border-gray-400 bg-gray-100 rounded-lg px-3 py-2"
                  >
                    <div className="text-center text-gray-500 text-xs w-full">
                      [No options to drag]
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        <details className="text-sm text-yellow-600">
          <summary className="cursor-pointer">Debug Information</summary>
          <pre className="mt-2 text-xs bg-yellow-100 p-2 rounded">
            Sentence: {sentence}
            Options: {JSON.stringify(options)}
          </pre>
        </details>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-gray-700 text-lg">
        Fill in the blanks by dragging the correct words into the spaces:
      </p>

      {question.image && (
        <img
          src={question.image}
          alt="Question"
          className="max-h-48 mb-6 rounded"
        />
      )}

      {/* Sentence with drag-drop blanks */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
        <div className="text-lg leading-relaxed flex flex-wrap items-center gap-2">
          {sentenceParts.map((part, index) => {
            if (part.type === "text") {
              return (
                <span key={index} className="text-gray-800">
                  {part.content}
                </span>
              );
            } else {
              const filledAnswer = answers[question.id]?.[part.id] || "";
              return (
                <div
                  key={index}
                  className={`inline-flex items-center min-w-[120px] min-h-[40px] border-2 border-dashed rounded-lg px-3 py-2 transition-all duration-200 ${
                    filledAnswer
                      ? "border-green-400 bg-green-100"
                      : "border-gray-400 bg-white hover:border-blue-400 hover:bg-blue-50"
                  }`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDropOnBlank(e, part.id)}
                >
                  {filledAnswer ? (
                    <div className="flex items-center justify-between w-full">
                      <span className="text-green-800 font-medium text-sm">
                        {filledAnswer}
                      </span>
                      <button
                        onClick={() => removeAnswer(part.id)}
                        className="ml-2 text-red-500 hover:text-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 text-xs w-full">
                      Drop here
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
      </div>

      {/* Answer options */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-600">
          Drag these words to fill in the blanks:
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {options.map((option, index) => {
            const isUsed = usedOptions.includes(option);
            return (
              <div
                key={index}
                draggable={!isUsed}
                onDragStart={(e) => handleOptionDragStart(e, option)}
                className={`p-3 rounded-lg text-center font-medium transition-all duration-200 ${
                  isUsed
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 cursor-move"
                }`}
              >
                <div className="flex items-center justify-center">
                  {!isUsed && (
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 2a1 1 0 011 1v1h4V3a1 1 0 112 0v1h3a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h3V3a1 1 0 011-1z"></path>
                    </svg>
                  )}
                  <span className="text-sm">{option}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-yellow-600 mt-0.5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
          <div>
            <p className="text-sm text-yellow-800">
              <strong>Instructions:</strong> Drag the words from below into the
              blank spaces in the sentence above. Each word can only be used
              once. Click the ✕ to remove a word if you make a mistake.
            </p>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium">
            {usedOptions.length} /{" "}
            {sentenceParts.filter((p) => p.type === "blank").length} blanks
            filled
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                (usedOptions.length /
                  Math.max(
                    sentenceParts.filter((p) => p.type === "blank").length,
                    1
                  )) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const DragDropCategorize = ({ question, answers, onAnswerChange }) => {
  const [draggedCategory, setDraggedCategory] = useState(null);

  const handleCategoryDragStart = (e, category) => {
    setDraggedCategory(category);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDropOnCategory = (e, targetItem) => {
    e.preventDefault();
    if (draggedCategory) {
      onAnswerChange(question.id, targetItem, draggedCategory);
      setDraggedCategory(null);
    }
  };

  const removeAssignment = (item) => {
    onAnswerChange(question.id, item, "");
  };

  return (
    <div>
      <p className="mb-6 text-gray-700 text-lg">{question.question}</p>
      {question.image && (
        <img
          src={question.image}
          alt="Question"
          className="max-h-48 mb-6 rounded"
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Categories Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-blue-600">
            Categories
          </h3>
          <div className="space-y-3">
            {question.categories?.map((category, idx) => (
              <div
                key={idx}
                draggable
                onDragStart={(e) => handleCategoryDragStart(e, category)}
                className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg cursor-move shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 select-none"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M7 2a1 1 0 011 1v1h4V3a1 1 0 112 0v1h3a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h3V3a1 1 0 011-1z"></path>
                  </svg>
                  {category}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            💡 Drag categories to the items on the right
          </p>
        </div>

        {/* Items Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-600">
            Items to Categorize
          </h3>
          <div className="space-y-4">
            {question.items?.map((item, idx) => {
              const assignedCategory = answers[question.id]?.[item.name] || "";
              return (
                <div
                  key={idx}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-800">
                      {item.name}
                    </span>
                  </div>

                  <div
                    className={`min-h-[60px] border-2 border-dashed rounded-lg p-3 transition-all duration-200 ${
                      assignedCategory
                        ? "border-green-400 bg-green-50"
                        : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnCategory(e, item.name)}
                  >
                    {assignedCategory ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-green-800 font-medium">
                            {assignedCategory}
                          </span>
                        </div>
                        <button
                          onClick={() => removeAssignment(item.name)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <svg
                          className="w-8 h-8 mx-auto mb-1 opacity-50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M12 4v16m8-8H4"
                          ></path>
                        </svg>
                        <p className="text-sm">Drop category here</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Progress:</span>
          <span className="font-medium">
            {
              Object.values(answers[question.id] || {}).filter((v) => v !== "")
                .length
            }{" "}
            / {question.items?.length || 0} items categorized
          </span>
        </div>
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${
                (Object.values(answers[question.id] || {}).filter(
                  (v) => v !== ""
                ).length /
                  (question.items?.length || 1)) *
                100
              }%`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

const FormPreview = () => {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      const response = await fetch(
        `https://formback-layw.onrender.com/api/forms/${id}`
      );
      if (response.ok) {
        const formData = await response.json();
        setForm(formData);
        initializeAnswers(formData.questions);
      } else {
        alert("Form not found");
      }
    } catch (error) {
      console.error("Error fetching form:", error);
      alert("Error loading form");
    } finally {
      setLoading(false);
    }
  };

  const initializeAnswers = (questions) => {
    const initialAnswers = {};
    questions.forEach((question) => {
      if (question.type === "categorize") {
        initialAnswers[question.id] = {};
        question.items?.forEach((item) => {
          initialAnswers[question.id][item.name] = "";
        });
      } else if (question.type === "cloze") {
        initialAnswers[question.id] = {};
        // Initialize blank answers for cloze questions
        const sentence =
          question.sentence || question.previewText || question.question || "";
        const blankPattern = /(_____|\[blank\]|\[_+\])/g;
        let blankIndex = 0;
        let match;
        while ((match = blankPattern.exec(sentence)) !== null) {
          initialAnswers[question.id][`blank_${blankIndex}`] = "";
          blankIndex++;
        }
      } else if (question.type === "comprehension") {
        initialAnswers[question.id] = {};
        question.subQuestions?.forEach((subQ, idx) => {
          initialAnswers[question.id][idx] = "";
        });
      }
    });
    setAnswers(initialAnswers);
  };

  const handleAnswerChange = (questionId, subKey, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [subKey]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://formback-layw.onrender.com/api/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formId: id,
            answers: answers,
          }),
        }
      );

      if (response.ok) {
        alert("Response submitted successfully!");
        // Reset form
        initializeAnswers(form.questions);
      } else {
        alert("Error submitting response");
      }
    } catch (error) {
      console.error("Error submitting response:", error);
      alert("Error submitting response");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading form...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Form not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {form.headerImage && (
          <img
            src={form.headerImage}
            alt="Header"
            className="w-full max-h-64 object-cover rounded-lg mb-6"
          />
        )}

        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          {form.title}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {form.questions.map((question) => (
            <div
              key={question.id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold mb-4">
                Question {question.questionNo}
              </h2>

              {question.type === "categorize" && (
                <DragDropCategorize
                  question={question}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              )}

              {question.type === "cloze" && (
                <DragDropCloze
                  question={question}
                  answers={answers}
                  onAnswerChange={handleAnswerChange}
                />
              )}

              {question.type === "comprehension" && (
                <div>
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium mb-2">Passage:</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {question.paragraph}
                    </p>
                  </div>

                  {question.image && (
                    <img
                      src={question.image}
                      alt="Question"
                      className="max-h-48 mb-4 rounded"
                    />
                  )}

                  <div className="space-y-6">
                    {question.subQuestions?.map((subQ, subIdx) => (
                      <div
                        key={subIdx}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <h4 className="font-medium mb-3">
                          Question {question.questionNo}.{subIdx + 1}:{" "}
                          {subQ.question}
                        </h4>
                        <div className="space-y-2">
                          {subQ.options?.map((option, optIdx) => (
                            <label
                              key={optIdx}
                              className="flex items-center space-x-3 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={`q${question.id}_sub${subIdx}`}
                                value={option}
                                checked={
                                  answers[question.id]?.[subIdx] === option
                                }
                                onChange={(e) =>
                                  handleAnswerChange(
                                    question.id,
                                    subIdx,
                                    e.target.value
                                  )
                                }
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                              />
                              <span className="text-gray-700">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          <div className="text-center">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Submit Answers
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPreview;
