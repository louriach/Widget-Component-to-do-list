# Design System Component Checklist Widget

A comprehensive Figma widget that helps design system teams build consistent, accessible components by providing curated checklists for 35+ common UI components.

## 🎯 Overview

Building design system components requires careful attention to states, accessibility, responsive behavior, and Figma-specific features. This widget provides an interactive checklist system that guides designers through all the essential tasks for creating production-ready components.

## ✨ Key Features

### 📋 Component-Specific Checklists
- **35+ Pre-configured Components**: From Accordions to Tooltips, each with tailored task lists
- **Organized by Category**: Components grouped into logical categories (Actions & Buttons, Navigation & Structure, Data & Lists, etc.)
- **Smart Task Lists**: Priority tasks curated based on industry-standard design system documentation

### 🎨 Comprehensive Task Categories
Each component checklist includes tasks across multiple categories:
- **States & Variants** - Hover, focus, disabled, loading states
- **Accessibility** - WCAG compliance, keyboard navigation, screen reader support
- **Content & Labels** - Clear labeling, error messages, descriptive text
- **Layout & Zoom** - Responsive behavior, zoom support, flexible layouts
- **Testing** - Cross-device testing, keyboard navigation, color blindness simulation
- **Figma Features** - Variables, auto layout, component documentation, Code Connect

### 🔧 Custom Component Support
- Create custom components with your own descriptions and categories
- Custom components automatically include all default task categories
- Seamlessly integrates with the pre-built component library

### 📊 Progress Tracking
- **Component-Specific State**: Each component maintains independent completion tracking
- **Category Progress Indicators**: Visual progress badges showing completion percentage per category
- **Completion Badges**: Visual indicators for 100% completed components
- **Bulk Actions**: "Check all" and "Uncheck all" buttons for quick category management

### 🎨 Modern UI
- Dark teal color scheme optimized for focus and readability
- Expandable accordion layout for organized task management
- Two-column task grid for efficient space usage
- Hover states and visual feedback throughout

## 🛠️ Tech Stack

### Core Technologies
- **TypeScript** - Type-safe widget development
- **Figma Widget API** - Native Figma widget functionality
- **React-like Architecture** - Component-based structure with hooks

### Key Dependencies
- **esbuild** - Fast bundling and compilation
- **@figma/widget-typings** - TypeScript definitions for Figma Widget API
- **@typescript-eslint** - Code quality and consistency

### State Management
- **useSyncedState** - Persistent state across widget instances and sessions
- Component-specific completion tracking with nested state objects
- Accordion expansion state management

## 🚀 Getting Started

### Prerequisites
Download and install [Node.js](https://nodejs.org/en/download/) which includes NPM.

### Installation

1. Clone the repository:
```bash
git clone https://github.com/louriach/Widget-Component-to-do-list.git
cd Widget-Component-to-do-list
```

2. Install dependencies:
```bash
npm install
```

3. Build the widget:
```bash
npm run build
```

### Development

For active development with auto-recompilation:

1. Open the project in [Visual Studio Code](https://code.visualstudio.com/)
2. Run the build task: **Terminal > Run Build Task...** → Select **"npm: watch"**
3. The widget will automatically rebuild when you save changes to `widget-src/code.tsx`

### Loading in Figma

1. Open Figma Desktop App
2. Go to **Menu > Widgets > Development > Import widget from manifest**
3. Select the `manifest.json` file from this project
4. The widget will appear in your Widgets panel

## 📖 Usage

### Starting a Component Checklist

1. **Open the widget** in any Figma file
2. **Select a component** from the categorized list (e.g., Button, Modal, Dropdown)
3. **Click "Start a checklist for [Component]"** to begin
4. **Check off tasks** as you complete them - your progress is automatically saved

### Using Custom Components

1. Click **"Make custom component"** on the home screen
2. Enter a **component name** and **description**
3. Select a **category** for organization
4. Click **"Add component"** to create your custom checklist
5. Your custom component will appear in the appropriate category on the home screen

### Managing Tasks

- **Check/Uncheck Individual Tasks**: Click any task row to toggle completion
- **Check All in Category**: Click "Check all" button in any accordion header
- **Uncheck All in Category**: When all tasks are complete, the button changes to "Uncheck all"
- **Reset Component**: Click "Reset" in the top navigation to clear all checkboxes for the current component
- **Expand/Collapse Categories**: Click accordion headers to show/hide tasks

### Navigation

- **Back to Home**: Click the back arrow in the top-left to return to component selection
- **Component Selection**: Select a different component to switch checklists (progress is saved per component)

## 📁 Project Structure

```
Widget-Component-to-do-list/
├── widget-src/
│   └── code.tsx          # Main widget code
├── dist/
│   └── code.js           # Compiled JavaScript (generated)
├── manifest.json         # Widget manifest configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md
```

## 🎨 Component Library

The widget includes 35 pre-configured components across 9 categories:

- **Actions & Buttons**: Button, Icon Button, Link
- **Navigation & Structure**: Accordion, Breadcrumb, Menu, Pagination, Stepper, Tabs
- **Data & Lists**: Badge, Card, Chip, List, Table, Tree View
- **Inputs & Form Controls**: Checkbox, Combobox, Date Picker, Dropdown, File Upload, Input, Radio, Search, Select, Slider, Switch, Textarea, Toggle
- **Messaging & Feedback**: Alert/Notification, Message, Toast
- **Overlays & Layering**: Dialog, Popover, Tooltip
- **Progress & Status**: Progress, Spinner, Timeline
- **Media & Visual Content**: Avatar, Icon, Image, Video
- **Layout**: Divider

Each component includes carefully curated priority tasks based on documentation from leading design systems (Carbon, Material, Atlassian, GOV.UK, and more).

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or request features via [Issues](https://github.com/louriach/Widget-Component-to-do-list/issues)
- Submit pull requests with improvements
- Suggest new components or task categories

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Resources

- [Figma Widget Documentation](https://www.figma.com/widget-docs/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Figma Plugin/Widget Community](https://www.figma.com/community/widgets)

---

**Built with ❤️ for design system teams**
