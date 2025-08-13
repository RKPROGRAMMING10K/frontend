# Form Builder Frontend

A modern React-based form builder application that allows users to create interactive forms with multiple question types including categorize, cloze (fill-in-the-blank), and comprehension questions.

## 🚀 Features

### Form Creation
- **Multi-Question Forms**: Create single forms containing multiple questions of different types
- **Question Types**:
  - **Categorize**: Drag-and-drop questions where users match items to categories
  - **Cloze**: Fill-in-the-blank questions with draggable options
  - **Comprehension**: Reading passage with multiple-choice sub-questions
- **Image Upload**: Support for header images and question-specific images
- **Live Preview**: Real-time preview of forms as you build them

### User Experience
- **Draft Mode**: Add and edit questions before final form submission
- **Question Management**: Edit, delete, and reorder questions
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, professional interface with Tailwind CSS

## 🛠 Technology Stack

- **Framework**: React 19.1.1 with Vite
- **Styling**: Tailwind CSS 3.4.17
- **Routing**: React Router DOM 7.8.0
- **Build Tool**: Vite 7.1.0
- **Package Manager**: npm

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (version 18.0 or higher)
- **npm** (comes with Node.js)
- **Backend server** running on port 5000

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone <repository-url>
cd assign/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or next available port)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/           # React components
│   │   ├── FormBuilder.jsx   # Main form creation interface
│   │   ├── CategorizeForm.jsx # Categorize question form
│   │   ├── ClozeForm.jsx     # Cloze question form
│   │   ├── ComprehensionForm.jsx # Comprehension question form
│   │   └── FormList.jsx      # List of created forms
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── package.json            # Dependencies and scripts
└── vite.config.js          # Vite configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎯 How It Works

### Form Building Workflow

1. **Create Form Header**
   - Enter form title
   - Upload optional header image (drag & drop supported)

2. **Add Questions**
   - Choose from three question types
   - Fill in question details
   - Upload question-specific images
   - Preview questions in real-time

3. **Question Types**

   **Categorize Questions:**
   - Add categories and items
   - Users will drag items to correct categories
   - Perfect for classification exercises

   **Cloze Questions:**
   - Create sentences with blanks
   - Add draggable options
   - Users fill blanks by dragging options

   **Comprehension Questions:**
   - Add reading passage
   - Create multiple sub-questions
   - Each sub-question has multiple choice options

4. **Form Management**
   - Edit questions before saving
   - Delete unwanted questions
   - Preview complete form
   - Save form to backend

### API Integration

The frontend communicates with the backend through REST APIs:

- `POST /api/forms` - Save new forms
- `GET /api/forms` - Retrieve all forms
- `GET /api/forms/:id` - Get specific form
- `DELETE /api/forms/:id` - Delete form

## 🎨 Styling

The application uses Tailwind CSS for styling with:
- **Gradient backgrounds** for visual appeal
- **Card-based layouts** for content organization
- **Hover effects** and transitions for interactivity
- **Responsive grid systems** for different screen sizes
- **Color-coded question types** for easy identification

## 🔍 Key Components

### FormBuilder.jsx
- Main form creation interface
- Handles state management for entire form
- Manages question editing and preview
- Coordinates with individual question forms

### Question Forms (CategorizeForm, ClozeForm, ComprehensionForm)
- Individual components for each question type
- Support both creation and editing modes
- Handle validation and data formatting
- Provide type-specific interfaces

### FormList.jsx
- Displays all created forms
- Provides form management options
- Links to form editing and preview

## 🌐 Environment Configuration

Create a `.env` file (if needed):
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder will contain the production build ready for deployment.

### Deploy to Static Hosting
The built files can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static file hosting service

## 🔧 Development

### Adding New Question Types
1. Create new component in `src/components/`
2. Add to question type selection in `FormBuilder.jsx`
3. Update backend schema to handle new question type
4. Add preview rendering logic

### Customizing Styles
- Modify `tailwind.config.js` for theme changes
- Update component classes for styling changes
- Add custom CSS in `src/index.css`

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

**Dependencies Issues**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Build Errors**
```bash
# Check for TypeScript/ESLint errors
npm run lint
```

## 📞 Support

For issues and questions:
1. Check console errors in browser developer tools
2. Verify backend server is running on port 5000
3. Ensure all dependencies are properly installed
4. Check network requests in browser DevTools

## 🔄 Updates

To update dependencies:
```bash
npm update
```

Check for major version updates:
```bash
npm outdated
```

---

**Note**: This frontend application requires the backend server to be running for full functionality. See the backend README for setup instructions.
