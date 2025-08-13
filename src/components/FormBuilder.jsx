import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategorizeForm from "./CategorizeForm";
import ClozeForm from "./ClozeForm";
import ComprehensionForm from "./ComprehensionForm";

const FormBuilder = () => {
  const [formTitle, setFormTitle] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionType, setCurrentQuestionType] = useState("");
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setHeaderImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const addQuestion = (type) => {
    setCurrentQuestionType(type);
    setEditingQuestionId(null);
  };

  const editQuestion = (questionId) => {
    const questionToEdit = questions.find((q) => q.id === questionId);
    if (questionToEdit) {
      setCurrentQuestionType(questionToEdit.type);
      setEditingQuestionId(questionId);
    }
  };

  const saveQuestion = (questionData) => {
    if (editingQuestionId) {
      // Update existing question
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestionId ? { ...q, ...questionData } : q
        )
      );
    } else {
      // Add new question
      const newQuestion = {
        id: Date.now(),
        questionNo: questions.length + 1,
        type: currentQuestionType,
        ...questionData,
      };
      setQuestions([...questions, newQuestion]);
    }

    // Reset to add another question
    setCurrentQuestionType("");
    setEditingQuestionId(null);
  };

  const saveQuestionAndContinue = (questionData) => {
    if (editingQuestionId) {
      // Update existing question
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestionId ? { ...q, ...questionData } : q
        )
      );
      setCurrentQuestionType("");
      setEditingQuestionId(null);
    } else {
      // Add new question and continue with same type
      const newQuestion = {
        id: Date.now(),
        questionNo: questions.length + 1,
        type: currentQuestionType,
        ...questionData,
      };
      setQuestions([...questions, newQuestion]);
      // Don't reset currentQuestionType to continue adding same type
    }
  };

  const cancelQuestion = () => {
    setCurrentQuestionType("");
    setEditingQuestionId(null);
  };

  const deleteQuestion = (questionId) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions
        .filter((q) => q.id !== questionId)
        .map((q, index) => ({ ...q, questionNo: index + 1 }));
      setQuestions(updatedQuestions);
    }
  };

  const saveForm = async () => {
    if (!formTitle.trim()) {
      alert("Please enter a form title");
      return;
    }

    if (questions.length === 0) {
      alert("Please add at least one question");
      return;
    }

    const formData = {
      title: formTitle,
      headerImage,
      questions,
    };

    try {
      const response = await fetch(
        "https://formback-layw.onrender.com/api/forms",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const savedForm = await response.json();
        alert(
          `Form saved successfully! Preview link: https://formback-layw.onrender.com/preview/${savedForm._id}`
        );
        navigate("/");
      } else {
        alert("Error saving form");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving form");
    }
  };

  const renderQuestionForm = () => {
    const questionToEdit = editingQuestionId
      ? questions.find((q) => q.id === editingQuestionId)
      : null;

    switch (currentQuestionType) {
      case "categorize":
        return (
          <CategorizeForm
            key={editingQuestionId || "new"}
            initialData={questionToEdit}
            onSave={saveQuestion}
            onSaveAndContinue={saveQuestionAndContinue}
            onCancel={cancelQuestion}
            questionNo={
              editingQuestionId
                ? questionToEdit?.questionNo
                : questions.length + 1
            }
            isEditing={!!editingQuestionId}
          />
        );
      case "cloze":
        return (
          <ClozeForm
            key={editingQuestionId || "new"}
            initialData={questionToEdit}
            onSave={saveQuestion}
            onSaveAndContinue={saveQuestionAndContinue}
            onCancel={cancelQuestion}
            questionNo={
              editingQuestionId
                ? questionToEdit?.questionNo
                : questions.length + 1
            }
            isEditing={!!editingQuestionId}
          />
        );
      case "comprehension":
        return (
          <ComprehensionForm
            key={editingQuestionId || "new"}
            initialData={questionToEdit}
            onSave={saveQuestion}
            onSaveAndContinue={saveQuestionAndContinue}
            onCancel={cancelQuestion}
            questionNo={
              editingQuestionId
                ? questionToEdit?.questionNo
                : questions.length + 1
            }
            isEditing={!!editingQuestionId}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create New Form
                </h1>
                <p className="text-gray-600 mt-1">
                  Build engaging forms with multiple question types
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                Questions:{" "}
                <span className="font-semibold text-indigo-600">
                  {questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            Form Details
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Form Title *
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition-all duration-200 text-lg"
                placeholder="Enter an engaging form title"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Header Image (Optional)
              </label>
              <div
                className="w-full p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-indigo-400 transition-all duration-200 cursor-pointer bg-gray-50 hover:bg-gray-100"
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() =>
                  document.getElementById("headerImageInput").click()
                }
              >
                {headerImage ? (
                  <div className="text-center">
                    <img
                      src={headerImage}
                      alt="Header preview"
                      className="max-h-32 mx-auto rounded-lg mb-3 object-cover"
                    />
                    <p className="text-sm text-gray-600">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400 mb-4"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <span className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        Upload an image
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
                <input
                  id="headerImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Questions List */}
        {questions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              Questions ({questions.length})
            </h2>
            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {q.questionNo}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              q.type === "categorize"
                                ? "bg-blue-100 text-blue-800"
                                : q.type === "cloze"
                                ? "bg-green-100 text-green-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">
                          {q.question ||
                            q.sentence ||
                            q.paragraph?.substring(0, 80) + "..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => editQuestion(q.id)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Edit Question"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteQuestion(q.id)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete Question"
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Question Section */}
        {!currentQuestionType && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
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
              </div>
              {questions.length === 0
                ? "Add Your First Question"
                : "Add Another Question"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div
                className="p-6 border-2 border-blue-200 rounded-xl hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => addQuestion("categorize")}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14-7l2 2-2 2M5 7l2 2-2 2m0 11l2-2-2-2m14 2l-2-2 2-2"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Categorize
                </h3>
                <p className="text-gray-600">
                  Create questions where users match items to categories
                </p>
              </div>

              <div
                className="p-6 border-2 border-green-200 rounded-xl hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => addQuestion("cloze")}
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">Cloze</h3>
                <p className="text-gray-600">
                  Fill-in-the-blank questions with drag & drop
                </p>
              </div>

              <div
                className="p-6 border-2 border-purple-200 rounded-xl hover:border-purple-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => addQuestion("comprehension")}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <svg
                    className="w-6 h-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  Comprehension
                </h3>
                <p className="text-gray-600">
                  Reading passages with multiple choice questions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Question Form */}
        {currentQuestionType && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                {editingQuestionId ? "Edit" : "Create"}{" "}
                {currentQuestionType.charAt(0).toUpperCase() +
                  currentQuestionType.slice(1)}{" "}
                Question
              </h2>
              <button
                onClick={cancelQuestion}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Cancel
              </button>
            </div>
            {renderQuestionForm()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            disabled={questions.length === 0}
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {showPreview ? "Hide Preview" : "Preview Form"}
          </button>
          <button
            onClick={saveForm}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!formTitle || questions.length === 0}
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
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Complete Form
          </button>
        </div>

        {/* Preview */}
        {showPreview && questions.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Form Preview</h2>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Live Preview
              </span>
            </div>

            {/* Form Header Preview */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
              {headerImage && (
                <div className="mb-6">
                  <img
                    src={headerImage}
                    alt="Header"
                    className="w-full max-h-64 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
              <h3 className="text-3xl font-bold text-gray-900 text-center">
                {formTitle || "Untitled Form"}
              </h3>
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {questions.length} Question{questions.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
            {/* Questions Preview */}
            <div className="space-y-6">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {q.questionNo}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">
                      Question {q.questionNo}
                    </h4>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        q.type === "categorize"
                          ? "bg-blue-100 text-blue-800"
                          : q.type === "cloze"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {q.type.charAt(0).toUpperCase() + q.type.slice(1)}
                    </span>
                  </div>
                  {/* Render question preview based on type */}
                  {q.type === "categorize" && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-800 font-medium mb-3">
                          {q.question}
                        </p>
                        {q.image && (
                          <img
                            src={q.image}
                            alt="Question"
                            className="max-h-40 rounded-lg shadow-sm mb-3"
                          />
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                          <h5 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
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
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z"
                              />
                            </svg>
                            Categories
                          </h5>
                          <div className="space-y-2">
                            {q.categories?.map((cat, idx) => (
                              <div
                                key={idx}
                                className="bg-white px-3 py-2 rounded-md border border-blue-100 text-gray-700"
                              >
                                {cat}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <h5 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
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
                                d="M4 6h16M4 10h16M4 14h16M4 18h16"
                              />
                            </svg>
                            Items & Mapping
                          </h5>
                          <div className="space-y-2">
                            {q.items?.map((item, idx) => (
                              <div
                                key={idx}
                                className="bg-white px-3 py-2 rounded-md border border-green-100 text-gray-700 flex items-center justify-between"
                              >
                                <span>{item.name}</span>
                                <span className="text-xs bg-green-100 px-2 py-1 rounded-full">
                                  → {item.belongsTo}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {q.type === "cloze" && (
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-100">
                        <p className="text-gray-800 font-medium mb-3">
                          {q.sentence}
                        </p>
                        {q.image && (
                          <img
                            src={q.image}
                            alt="Question"
                            className="max-h-40 rounded-lg shadow-sm mb-3"
                          />
                        )}
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <h5 className="font-semibold text-yellow-800 mb-3 flex items-center gap-2">
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
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z"
                            />
                          </svg>
                          Drag & Drop Options
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {q.options?.map((option, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-2 bg-white border border-yellow-300 text-yellow-800 rounded-lg text-sm font-medium shadow-sm"
                            >
                              {option}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {q.type === "comprehension" && (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
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
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                          Reading Passage
                        </h5>
                        <p className="text-gray-700 leading-relaxed">
                          {q.paragraph}
                        </p>
                      </div>
                      {q.image && (
                        <img
                          src={q.image}
                          alt="Question"
                          className="max-h-40 rounded-lg shadow-sm"
                        />
                      )}
                      <div className="space-y-4">
                        {q.subQuestions?.map((subQ, idx) => (
                          <div
                            key={idx}
                            className="bg-purple-50 rounded-lg p-4 border border-purple-200"
                          >
                            <p className="font-semibold text-purple-800 mb-3">
                              Question {q.questionNo}.{idx + 1}: {subQ.question}
                            </p>
                            <div className="grid gap-2">
                              {subQ.options?.map((option, optIdx) => (
                                <div
                                  key={optIdx}
                                  className={`p-2 rounded-md border ${
                                    option === subQ.correctAnswer
                                      ? "bg-green-100 border-green-300 text-green-800 font-medium"
                                      : "bg-white border-purple-200 text-gray-700"
                                  }`}
                                >
                                  <span className="font-medium">
                                    {optIdx + 1}.
                                  </span>{" "}
                                  {option}
                                  {option === subQ.correctAnswer && (
                                    <span className="ml-2 text-green-600">
                                      ✓ Correct
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
