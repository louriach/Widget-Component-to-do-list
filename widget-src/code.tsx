const { widget } = figma
const { useSyncedState, usePropertyMenu, useEffect, AutoLayout, Text, SVG, Input, Rectangle } = widget

interface TodoItem {
  id: string
  text: string
  completed: boolean
  category: string
  createdAt: number
}

const defaultComponentTasks = [
  // States
  { text: "Disabled state", category: "States" },
  { text: "Empty state", category: "States" },
  { text: "Error state", category: "States" },
  { text: "Focus state", category: "States" },
  { text: "Hover state", category: "States" },
  { text: "Loading state", category: "States" },
  { text: "Selected state", category: "States" },
  
  // Linting
  { text: "Add code connect", category: "Linting" },
  { text: "Apply text styles", category: "Linting" },
  { text: "Apply variables", category: "Linting" },
  { text: "Compose sub components", category: "Linting" },
  { text: "Name all layers", category: "Linting" },
  
  // Props & variants
  { text: "Create responsive variants", category: "Props & variants" },
  { text: "Define all props", category: "Props & variants" },
  { text: "Support portrait and landscape", category: "Props & variants" },
  
  // Color & contrast
  { text: "No color-only communication", category: "Color & contrast" },
  { text: "Component contrast meets 3:1", category: "Color & contrast" },
  { text: "Large text contrast meets 3:1", category: "Color & contrast" },
  { text: "Test with color blindness simulator", category: "Color & contrast" },
  { text: "Text contrast meets 4.5:1", category: "Color & contrast" },
  
  // Touch & interaction
  { text: "Gesture alternatives provided", category: "Touch & interaction" },
  { text: "Keyboard focus indicator", category: "Touch & interaction" },
  { text: "Touch targets meet 44x44px", category: "Touch & interaction" },
  
  // Content & labels
  { text: "Alt text", category: "Content & labels" },
  { text: "Buttons have descriptive labels", category: "Content & labels" },
  { text: "Error messages are clear", category: "Content & labels" },
  { text: "Form fields clearly labeled", category: "Content & labels" },
  { text: "Icons have sufficient contrast", category: "Content & labels" },
  { text: "Required fields indicated", category: "Content & labels" },
  
  // Layout & zoom
  { text: "Content reflows responsively", category: "Layout & zoom" },
  { text: "No horizontal viewport text scrolling", category: "Layout & zoom" },
  { text: "Supports 200% zoom", category: "Layout & zoom" },
  { text: "Supports text scaling", category: "Layout & zoom" },
  
  // Documentation
  { text: "Add alias names", category: "Documentation" },
  { text: "Add component description", category: "Documentation" },
  { text: "Add documentation link", category: "Documentation" },
  { text: "Document keyboard Navigation", category: "Documentation" },
  { text: "Include accessibility notes", category: "Documentation" },
  
  // Testing
  { text: "Test autolayout flexibility", category: "Testing" },
  { text: "Test in light and dark mode", category: "Testing" },
  { text: "Test keyboard navigation", category: "Testing" },
  { text: "Test on mobile viewport", category: "Testing" },
  { text: "Test with long text strings", category: "Testing" },
  { text: "Test with screen reader", category: "Testing" },
  
  // Figma features
  { text: "Variables applied", category: "Figma features" },
  { text: "Auto layout applied", category: "Figma features" },
  { text: "Layers named", category: "Figma features" },
  { text: "Sub components created", category: "Figma features" },
  { text: "Spec sheet", category: "Figma features" },
  { text: "Code Connect", category: "Figma features" },
  { text: "Component description", category: "Figma features" },
  { text: "Component Link", category: "Figma features" }
]

// Component definitions with priority tasks
const components = [
  { 
    name: "Accordion", 
    category: "Navigation & structure",
    description: "A vertically stacked set of expandable sections that reveal or hide content.",
    priorityTasks: ["Hover state", "Focus state", "Keyboard focus indicator ", "Test keyboard navigation", "Icons have sufficient contrast", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Alert", 
    category: "Messaging & feedback",
    description: "A prominent message that alerts users to important information, system events, or actions requiring attention.",
    priorityTasks: ["Component contrast meets 3:1", "Icons have sufficient contrast", "No color-only communication", "Text contrast meets 4.5:1", "Error messages are clear", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Avatar", 
    category: "Media & visual content",
    description: "A small visual representation of a user, entity, or object—often an image, initials, or icon.",
    priorityTasks: ["Alt text", "Component contrast meets 3:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Badge", 
    category: "Media & visual content",
    description: "A compact indicator used to display status, counts, or attributes.",
    priorityTasks: ["Component contrast meets 3:1", "Text contrast meets 4.5:1", "Supports text scaling", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Image", 
    category: "Media & visual content",
    description: "Media for capturing attention and communicating messages through photos or graphics.",
    priorityTasks: ["Alt text", "Test with color blindness simulator", "Text contrast meets 4.5:1", "Create responsive variants", "Responsive size options", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Video",
    category: "Media & visual content",
    description: "A player for displaying and controlling video content with playback controls and accessibility features.",
    priorityTasks: ["Alt text", "Touch targets meet 44x44px", "Keyboard focus indicator", "Test keyboard navigation", "Component contrast meets 3:1", "Icons have sufficient contrast", "No color-only communication", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Breadcrumb",
    category: "Navigation & structure",
    description: "A navigation pattern showing the user's position in the site hierarchy.",
    priorityTasks: ["Hover state", "Focus state", "Keyboard focus indicator", "Buttons have descriptive labels", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Button",
    category: "Actions & buttons",
    description: "A trigger for an action such as submitting a form, opening a dialog, or navigating.",
    priorityTasks: ["Hover state", "Focus state", "Disabled state", "Loading state", "Touch targets meet 44x44px", "Text contrast meets 4.5:1", "Keyboard focus indicator", "Buttons have descriptive labels", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Icon Button",
    category: "Actions & buttons",
    description: "A button represented by an icon without visible text, designed for compact actions.",
    priorityTasks: ["Hover state", "Focus state", "Disabled state", "Touch targets meet 44x44px", "Icons have sufficient contrast", "Keyboard focus indicator", "Buttons have descriptive labels", "Component contrast meets 3:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Calendar",
    category: "Inputs & form controls",
    description: "A visual date selection grid.",
    priorityTasks: ["Focus state", "Touch targets meet 44x44px", "Keyboard focus indicator", "Test keyboard navigation", "Form fields clearly labeled", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Card / Tile",
    category: "Navigation & structure",
    description: "A contained block that groups related content and actions.",
    priorityTasks: ["Hover state", "Empty state", "Test with long text strings", "Content reflows responsively", "Component contrast meets 3:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Checkbox",
    category: "Inputs & form controls",
    description: "A control that allows users to select one or multiple independent options.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Touch targets meet 44x44px", "Form fields clearly labeled", "Keyboard focus indicator", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Combobox",
    category: "Inputs & form controls",
    description: "A combination of input and dropdown that lets users select or type a value.",
    priorityTasks: ["Focus state", "Empty state", "Loading state", "Form fields clearly labeled", "Keyboard focus indicator", "Test keyboard navigation", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Dialog",
    category: "Overlays & layering",
    description: "A modal UI element that captures user focus and requires interaction.",
    priorityTasks: ["Focus state", "Keyboard focus indicator", "Test keyboard navigation", "Component contrast meets 3:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Dropdown",
    category: "Inputs & form controls",
    description: "A floating menu of selectable actions or options.",
    priorityTasks: ["Hover state", "Focus state", "Touch targets meet 44x44px", "Keyboard focus indicator", "Test keyboard navigation", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "File Upload",
    category: "Inputs & form controls",
    description: "A component that allows users to select and upload one or more files with drag-and-drop support.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Form fields clearly labeled", "Touch targets meet 44x44px", "Keyboard focus indicator", "Error messages are clear", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Input Field",
    category: "Inputs & form controls",
    description: "A field for entering or editing text.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Form fields clearly labeled", "Required fields indicated", "Text contrast meets 4.5:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Navigation",
    category: "Navigation & structure",
    description: "A component for navigating between major sections or categories.",
    priorityTasks: ["Hover state", "Focus state", "Selected state", "Touch targets meet 44x44px", "Keyboard focus indicator", "Test keyboard navigation", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Pagination",
    category: "Navigation & structure",
    description: "A control for navigating between pages of content.",
    priorityTasks: ["Hover state", "Focus state", "Disabled state", "Touch targets meet 44x44px", "Keyboard focus indicator", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Popover",
    category: "Overlays & layering",
    description: "A non-modal, contextual layer that presents supplementary content.",
    priorityTasks: ["Focus state", "Keyboard focus indicator", "Test keyboard navigation", "Component contrast meets 3:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Progress",
    category: "Progress & status",
    description: "A visual indicator representing progress toward completion.",
    priorityTasks: ["Component contrast meets 3:1", "No color-only communication", "Text contrast meets 4.5:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Timeline",
    category: "Progress & status",
    description: "Shows progress on a process over time with steps that can indicate success, warning, or critical states.",
    priorityTasks: ["Component contrast meets 3:1", "No color-only communication", "Text contrast meets 4.5:1", "Icons have sufficient contrast", "Test with long text strings", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Radio",
    category: "Inputs & form controls",
    description: "A control that allows users to select a single option from a group of mutually exclusive choices.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Touch targets meet 44x44px", "Form fields clearly labeled", "Keyboard focus indicator", "Required fields indicated", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Select",
    category: "Inputs & form controls",
    description: "A control for selecting one item from a predefined list.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Empty state", "Form fields clearly labeled", "Required fields indicated", "Keyboard focus indicator", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Sidebar",
    category: "Navigation & structure",
    description: "A vertical, persistent panel used for navigation or secondary content.",
    priorityTasks: ["Create responsive variants", "Content reflows responsively", "Touch targets meet 44x44px", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Slider",
    category: "Inputs & form controls",
    description: "A control allowing users to select a numeric value by dragging a handle.",
    priorityTasks: ["Focus state", "Disabled state", "Touch targets meet 44x44px", "Keyboard focus indicator", "Form fields clearly labeled", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Switch",
    category: "Inputs & form controls",
    description: "A binary toggle representing an on/off state.",
    priorityTasks: ["Hover state", "Focus state", "Disabled state", "Touch targets meet 44x44px", "Form fields clearly labeled", "No color-only communication", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Table",
    category: "Data & lists",
    description: "A structured, sortable display of rows and columns.",
    priorityTasks: ["Empty state", "Loading state", "Test with long text strings", "Content reflows responsively", "Supports 200% zoom", "Text contrast meets 4.5:1", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Tree View",
    category: "Data & lists",
    description: "A hierarchical structure with nested levels of navigation for organizing large amounts of information.",
    priorityTasks: ["Hover state", "Focus state", "Selected state", "Keyboard focus indicator", "Test keyboard navigation", "Icons have sufficient contrast", "Touch targets meet 44x44px", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Tabs",
    category: "Navigation & structure",
    description: "A set of horizontally or vertically arranged triggers that switch between views.",
    priorityTasks: ["Hover state", "Focus state", "Selected state", "Touch targets meet 44x44px", "Keyboard focus indicator", "Test keyboard navigation", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Textarea",
    category: "Inputs & form controls",
    description: "A multi-line input field.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Form fields clearly labeled", "Required fields indicated", "Test with long text strings", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Message",
    category: "Messaging & feedback",
    description: "A callout component for displaying supplementary, non-critical content or context to users.",
    priorityTasks: ["Component contrast meets 3:1", "Text contrast meets 4.5:1", "Icons have sufficient contrast", "Test with long text strings", "Content reflows responsively", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Toast",
    category: "Messaging & feedback",
    description: "An ephemeral notification that appears temporarily without blocking UI.",
    priorityTasks: ["Component contrast meets 3:1", "Text contrast meets 4.5:1", "No color-only communication", "Icons have sufficient contrast", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Toggle",
    category: "Actions & buttons",
    description: "A selectable, often pill-shaped control for switching between states or options.",
    priorityTasks: ["Hover state", "Focus state", "Selected state", "Touch targets meet 44x44px", "No color-only communication", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  },
  { 
    name: "Tooltip",
    category: "Overlays & layering",
    description: "A small contextual hint that appears on hover or focus.",
    priorityTasks: ["Component contrast meets 3:1", "Text contrast meets 4.5:1", "Keyboard focus indicator", "Test keyboard navigation", "Variables applied", "Auto layout applied", "Layers named", "Sub components created", "Spec sheet", "Code Connect", "Component description", "Component Link"]
  }
]

// Group components by category for display
const categories = [
  "Actions & buttons",
  "Inputs & form controls",
  "Navigation & structure",
  "Data & lists",
  "Media & visual content",
  "Overlays & layering",
  "Messaging & feedback",
  "Progress & status"
]

// Pre-compute the default task texts once for performance
const defaultTaskTexts = defaultComponentTasks.map(task => task.text)
const defaultTaskTextsSet = new Set(defaultTaskTexts)

function Widget() {
  const getInitialTasks = (): TodoItem[] => {
    return defaultComponentTasks.map((task, index) => ({
      id: `task-${index}`,
      text: task.text,
      completed: false,
      category: task.category || 'States',
      createdAt: Date.now() + index
    }))
  }

  const [todos, setTodos] = useSyncedState<TodoItem[]>('todos', [])
  const [newTodoText, setNewTodoText] = useSyncedState('newTodoText', '')
  const [newComponentDescription, setNewComponentDescription] = useSyncedState('newComponentDescription', '')
  const [selectedCategory, setSelectedCategory] = useSyncedState('selectedCategory', 'Actions & buttons')
  const [activeTab, setActiveTab] = useSyncedState('activeTab', 'setup')
  const [enabledTasks, setEnabledTasks] = useSyncedState('enabledTasks', defaultTaskTexts)
  const [expandedCategories, setExpandedCategories] = useSyncedState<string[]>('expandedCategories', [])
  const [selectedComponent, setSelectedComponent] = useSyncedState<string>('selectedComponent', '')
  // Track completion state per component: { componentName: { taskId: boolean } }
  const [completionsByComponent, setCompletionsByComponent] = useSyncedState<{ [key: string]: { [key: string]: boolean } }>('completionsByComponent', {})
  // Track custom components added by user
  const [customComponents, setCustomComponents] = useSyncedState<Array<{ name: string, category: string, description: string, priorityTasks: string[] }>>('customComponents', [])

  // Combine default and custom components
  const allComponents = [...components, ...customComponents]

  // Initialize todos if empty - using useEffect to avoid setting state during render
  useEffect(() => {
    if (todos.length === 0) {
      setTodos(getInitialTasks())
    }
  })

  const applyComponentFilter = (componentName: string) => {
    const selected = allComponents.find(c => c.name === componentName)
    if (selected) {
      // Enable only the priority tasks for this component
      setEnabledTasks(selected.priorityTasks)
      // Expand all categories by default
      const taskCategories = ['States', 'Linting', 'Props & variants', 'Color & contrast', 'Touch & interaction', 'Content & labels', 'Layout & zoom', 'Documentation', 'Testing', 'Figma features']
      setExpandedCategories(taskCategories)
    }
  }

  const addComponent = () => {
    if (newTodoText.trim()) {
      const newComponent = {
        name: newTodoText.trim(),
        category: selectedCategory,
        description: newComponentDescription.trim() || 'Custom component',
        priorityTasks: defaultTaskTexts // Use all default tasks for custom components
      }
      setCustomComponents([...customComponents, newComponent])
      // Set this as the selected component and navigate to tasks
      setSelectedComponent(newComponent.name)
      setEnabledTasks(defaultTaskTexts)
      // Expand all categories by default
      const taskCategories = ['States', 'Linting', 'Props & variants', 'Color & contrast', 'Touch & interaction', 'Content & labels', 'Layout & zoom', 'Documentation', 'Testing', 'Figma features']
      setExpandedCategories(taskCategories)
      setNewTodoText('')
      setNewComponentDescription('')
      setActiveTab('tasks')
    }
  }

  const toggleTodo = (id: string) => {
    if (!selectedComponent) return
    
    const componentCompletions = completionsByComponent[selectedComponent] || {}
    const isCompleted = componentCompletions[id] || false
    
    setCompletionsByComponent({
      ...completionsByComponent,
      [selectedComponent]: {
        ...componentCompletions,
        [id]: !isCompleted
      }
    })
  }

  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category))
    } else {
      setExpandedCategories([...expandedCategories, category])
    }
  }

  const deleteCustomTask = (taskText: string) => {
    // Remove the task from todos
    setTodos(todos.filter(todo => todo.text !== taskText))
    // Remove from enabled tasks
    setEnabledTasks(enabledTasks.filter(t => t !== taskText))
  }

  const toggleTaskEnabled = (taskText: string) => {
    if (enabledTasks.includes(taskText)) {
      setEnabledTasks(enabledTasks.filter(text => text !== taskText))
    } else {
      setEnabledTasks([...enabledTasks, taskText])
    }
  }

  const getCategoryColor = (category: string): string => {
    // Using static mapping only
    if (category === 'States') return '#4CAF50'
    if (category === 'Linting') return '#607D8B'
    if (category === 'Props & variants') return '#2196F3'
    if (category === 'Color & contrast') return '#FF9800'
    if (category === 'Touch & interaction') return '#9C27B0'
    if (category === 'Content & labels') return '#00BCD4'
    if (category === 'Layout & zoom') return '#795548'
    if (category === 'Documentation') return '#FF5722'
    if (category === 'Testing') return '#F44336'
    if (category === 'Figma features') return '#3F51B5'
    return '#9E9E9E'
  }

  const taskCategories = ['States', 'Linting', 'Props & variants', 'Color & contrast', 'Touch & interaction', 'Content & labels', 'Layout & zoom', 'Documentation', 'Testing', 'Figma features']

  return (
    <AutoLayout
      direction="vertical"
      spacing={8}
      padding={2}
      cornerRadius={12}
      fill="#71AFBE"
      width={560}
    >

      {/* Tab Content */}
      <AutoLayout
        direction="vertical"
        width="fill-parent"
      >
        {/* Tab Navigation - only show after proceeding from setup */}
        {selectedComponent && activeTab !== 'setup' ? (
          <AutoLayout direction="horizontal" spacing={12} width="fill-parent" verticalAlignItems="center" fill={"#001D24"} cornerRadius={{topLeft: 10, topRight: 10, bottomLeft: 0, bottomRight: 0}} padding={6}>
          {/* Home button */}
          <AutoLayout
            cornerRadius={4}
            width="hug-contents"
            horizontalAlignItems="center"
            verticalAlignItems="center"
            spacing={4}
            padding={{left: 4, right: 6, top: 4, bottom: 4}}
            hoverStyle={
              {stroke: "#71AFBE"}
            }
            onClick={() => {
              setActiveTab('setup')
              setSelectedComponent('')
            }}
          >
            <SVG
              src={`<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 6L2.5 6M2.5 6L6 9.5M2.5 6L6 2.5" stroke="#71AFBE" stroke-linecap="round" stroke-linejoin="round"/></svg>`}
              width={12}
              height={12}
            />
            <Text fontSize={11} fill="#71AFBE" fontWeight={600}>Back to component list</Text>
          </AutoLayout>
          
          {/* Spacer to push Reset button to the right */}
          <AutoLayout width="fill-parent" height={1} />
          
          {/* Reset button */}
          <AutoLayout
                onClick={() => {
                  if (selectedComponent) {
                    const newCompletions = { ...completionsByComponent }
                    delete newCompletions[selectedComponent]
                    setCompletionsByComponent(newCompletions)
                  }
                }}
                cornerRadius={4}
                width="hug-contents"
                horizontalAlignItems="center"
                verticalAlignItems="center"
                spacing={4}
                padding={4}
                hoverStyle={
                  {stroke: "#71AFBE"}
                }
          >
            <SVG
              src={`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>`}
            />
            <Text fontSize={11} fill="#71AFBE" fontWeight={600}>Reset</Text>
          </AutoLayout>
        </AutoLayout>
      ) : null}
      
      {/* Divider below navigation */}
      {selectedComponent && activeTab !== 'setup' ? (
        <Rectangle width="fill-parent" height={1} fill="#172D33" />
      ) : null}
        {/* Setup Tab - Component Selection */}
        {activeTab === 'setup' && (
          <AutoLayout 
            direction="vertical" 
            spacing={8} 
            width="fill-parent"
            padding={8}
            fill="#001D24"
            cornerRadius={10}
          >            
            
            {/* Component List - Grouped by Category */}
              <AutoLayout direction="vertical" fill="#001D24" spacing={12} padding={{horizontal: 12, vertical: 12}} cornerRadius={4} stroke="#234650" strokeWidth={1} width="fill-parent">
              {categories.map(category => {
                const categoryComponents = allComponents.filter(comp => comp.category === category).sort((a, b) => a.name.localeCompare(b.name))
                if (categoryComponents.length === 0) return null
                
                return (
                  <AutoLayout key={category} direction="vertical" spacing={8} width="fill-parent">
                    {/* Category Title */}
                    <Text fontSize={11} fill="#71AFBE" fontWeight={600} letterSpacing={0.5}>
                      {category.toUpperCase()}
                    </Text>
                    
                    {/* Components in this category */}
                    <AutoLayout spacing={4} direction="vertical" width="fill-parent">
                      {Array.from({ length: Math.ceil(categoryComponents.length / 3) }, (_, rowIndex) => {
                        const rowItems = categoryComponents.slice(rowIndex * 3, rowIndex * 3 + 3)
                        return (
                          <AutoLayout key={rowIndex} direction="horizontal" spacing={4} width="fill-parent">
                            {rowItems.map((comp) => {
                              // Check if all tasks for this component are completed
                              const componentCompletions = completionsByComponent[comp.name] || {}
                              const componentTasks = todos.filter(todo => comp.priorityTasks.includes(todo.text))
                              const allCompleted = componentTasks.length > 0 && componentTasks.every(task => componentCompletions[task.id])
                              
                              return (
                              <AutoLayout
                                key={comp.name}
                                direction="horizontal"
                                onClick={() => setSelectedComponent(selectedComponent === comp.name ? '' : comp.name)}
                                spacing={6}
                                width="fill-parent"
                                height={32}
                                padding={{horizontal: 8, vertical: 8}}
                                fill={selectedComponent === comp.name ? "#172D33" : "#072027"}
                                cornerRadius={6}
                                stroke={selectedComponent === comp.name ? "#71AFBE" : "#172D33"}
                                strokeWidth={1}
                                hoverStyle={{fill: "#172D33"}}
                                verticalAlignItems="center"
                                horizontalAlignItems="start"
                              >
                                <Text 
                                  fontSize={12} 
                                  fill="#d1d1d1"
                                  fontWeight={600}
                                  width="fill-parent"
                                >
                                  {comp.name}
                                </Text>
                                
                                {/* Right side icons: completion badge if all complete, otherwise selection checkmark if selected */}
                                {allCompleted ? (
                                  <SVG
                                    src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/></svg>`}
                                    width={16}
                                    height={16}
                                  />
                                ) : selectedComponent === comp.name ? (
                                  <SVG
                                    src={`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D1D1D1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`}
                                    width={12}
                                    height={12}
                                  />
                                ) : null}
                              </AutoLayout>
                              )
                            })}
                            {/* Add spacers for incomplete rows */}
                            {Array.from({ length: 3 - rowItems.length }).map((_, i) => (
                              <AutoLayout key={`spacer-${i}`} width="fill-parent" height={1} />
                            ))}
                          </AutoLayout>
                        )
                      })}
                    </AutoLayout>
                  </AutoLayout>
                )
              })}
            
            {/* Continue Button */}
            <AutoLayout
              padding={{horizontal: 24, vertical: 8}}
              cornerRadius={6}
              fill={selectedComponent ? "#71AFBE" : "#001D24"}
              stroke={selectedComponent ? "#8FDAED" : "#234650"}
              strokeWidth={1}
              onClick={selectedComponent ? () => {
                applyComponentFilter(selectedComponent)
                setActiveTab('tasks')
              } : undefined}
              width="fill-parent"
              horizontalAlignItems="center"
              hoverStyle={selectedComponent ? {fill: "#A2CFDA"} : undefined}
            >
              <Text fontSize={12} fill={selectedComponent ? "#001D24" : "#638F9A"} fontWeight={700}>
                {selectedComponent ? `Start a checklist for ${selectedComponent}` : "Select a component to start"}
              </Text>
            </AutoLayout>
            </AutoLayout>
            

            
            {/* Don't know option */}
            <AutoLayout
              direction="horizontal"
              spacing={12}
              width="fill-parent"
              padding={12}
              fill="#172D33"
              cornerRadius={4}
              stroke="#234650"
              strokeWidth={1}
              verticalAlignItems="center"
            >
              <AutoLayout direction="vertical" spacing={2} width="fill-parent">
                <Text fontSize={14} fontWeight={600} fill="#fff">
                  Component not on the list?
                </Text>
                <Text fontSize={13} fill="#d1d1d1">
                  Start with the full checklist and customise.
                </Text>
              </AutoLayout>
              
              <AutoLayout
                padding={{horizontal: 12, vertical: 8}}
                cornerRadius={6}
                fill="#71AFBE"
                stroke="#8FDAED"
                strokeWidth={1}
                onClick={() => {
                  setSelectedComponent('Custom')
                  setEnabledTasks(defaultTaskTexts)
                  setActiveTab('settings')
                }}
                hoverStyle={{fill: "#A2CFDA"}}
              >
                <Text fontSize={12} fill="#001D24" fontWeight={700}>Make custom component</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        )}

        {/* Tasks Tab - Component-specific checklist */}
        {activeTab === 'tasks' && (() => {
          // Pre-compute all data structures for faster rendering
          const enabledTasksSet = new Set(enabledTasks)
          const visibleTodos = todos.filter(todo => enabledTasksSet.has(todo.text))
          const expandedCategoriesSet = new Set(expandedCategories)
          const componentCompletions = completionsByComponent[selectedComponent] || {}
          
          // Group todos by category once instead of filtering multiple times
          const todosByCategory = new Map<string, TodoItem[]>()
          for (const todo of visibleTodos) {
            if (!todosByCategory.has(todo.category)) {
              todosByCategory.set(todo.category, [])
            }
            todosByCategory.get(todo.category)!.push(todo)
          }
          
          // Filter categories that have todos
          const categoriesWithTodos = taskCategories.filter(category => {
            const categoryTodos = todosByCategory.get(category)
            return categoryTodos && categoryTodos.length > 0
          })
          
          return (
          <AutoLayout fill={"#001D24"} cornerRadius={{topLeft: 0, topRight: 0, bottomLeft: 10, bottomRight: 10}} direction="vertical" padding={4} spacing={4} width="fill-parent">
            {/* Component Title */}
            <AutoLayout
              direction="horizontal"
              spacing={8}
              width="fill-parent"
              padding={{horizontal: 14, vertical: 12}}
              fill="#71AFBE"
              cornerRadius={4}
            >
              {/* Icon */}
              <SVG
                src={`<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_3232_34034)"><path d="M7.52876 0.471629C7.78911 0.21128 8.21121 0.211279 8.47161 0.471629L11.221 3.22114C11.4814 3.4815 11.4814 3.9036 11.221 4.16395L8.47161 6.91346C8.21121 7.17382 7.78911 7.17382 7.52876 6.91346L4.77925 4.16395C4.5189 3.9036 4.5189 3.4815 4.77925 3.22114L7.52876 0.471629Z" fill="#072027"/><path d="M3.22017 4.77925C3.48052 4.5189 3.90262 4.5189 4.16298 4.77925L6.91249 7.52876C7.17284 7.78911 7.17284 8.21121 6.91249 8.47161L4.16298 11.221C3.90262 11.4814 3.48052 11.4814 3.22017 11.221L0.470653 8.47161C0.210304 8.21121 0.210303 7.78911 0.470653 7.52876L3.22017 4.77925Z" fill="#072027"/><path d="M11.8364 4.77925C12.0968 4.5189 12.5188 4.5189 12.7792 4.77925L15.5287 7.52876C15.7891 7.78911 15.7891 8.21121 15.5287 8.47161L12.7792 11.221C12.5188 11.4814 12.0968 11.4814 11.8364 11.221L9.08684 8.47161C8.82652 8.21121 8.82652 7.78911 9.08684 7.52876L11.8364 4.77925Z" fill="#072027"/><path d="M7.52876 9.08684C7.78911 8.82652 8.21121 8.82652 8.47161 9.08684L11.221 11.8364C11.4814 12.0968 11.4814 12.5188 11.221 12.7792L8.47161 15.5287C8.21121 15.7891 7.78911 15.7891 7.52876 15.5287L4.77925 12.7792C4.5189 12.5188 4.5189 12.0968 4.77925 11.8364L7.52876 9.08684Z" fill="#072027"/></g><defs><clipPath id="clip0_3232_34034"><rect width="16" height="16" fill="white"/></clipPath></defs></svg>`}
                width={16}
                height={16}
              />
              
              {/* Text Content */}
              <AutoLayout direction="vertical" spacing={2} width="fill-parent">
                <Text fontSize={14} lineHeight={16} fill="#072027" fontWeight={700} width={"fill-parent"}>
                  {selectedComponent}
                </Text>
                <Text fontSize={13} fill="#203E46" width={"fill-parent"}>
                  {allComponents.find(c => c.name === selectedComponent)?.description || ''}
                </Text>
              </AutoLayout>
            </AutoLayout>
            
            {visibleTodos.length === 0 ? (
              <AutoLayout
                direction="vertical"
                cornerRadius={4}
                spacing={8}
                padding={24}
                width="fill-parent"
                horizontalAlignItems="center"
              >
                <Text fontSize={16} fill="#71AFBE">
                  No tasks to show
                </Text>
                <Text fontSize={14} fill="#d1d1d1">
                  Add tasks or adjust settings to see your checklist
                </Text>
              </AutoLayout>
            ) : (
              // Full-width categories with 2-column task layout inside
              categoriesWithTodos.map((category) => {
                const categoryTodos = todosByCategory.get(category)
                if (!categoryTodos || categoryTodos.length === 0) return null
                
                const isExpanded = expandedCategoriesSet.has(category)
                const completedCount = categoryTodos.filter(t => componentCompletions[t.id]).length
                const totalCount = categoryTodos.length
                
                return (
                  <AutoLayout 
                    key={category} 
                    direction="vertical" 
                    width="fill-parent"
                    overflow="visible"
                    stroke="#234650"
                    strokeWidth={1}
                    cornerRadius={6}
                  >
                    {/* Accordion Header */}
                    <AutoLayout
                      cornerRadius={6}
                      direction="horizontal"
                      spacing={8}
                      padding={{horizontal: 12, vertical: 12}}
                      fill="#172D33"
                      width="fill-parent"
                      verticalAlignItems="center"
                      stroke="#234650"
                      strokeWidth={1}
                    >
                      {/* Clickable area for expand/collapse */}
                      <AutoLayout
                        direction="horizontal"
                        spacing={8}
                        width="fill-parent"
                        verticalAlignItems="center"
                        onClick={() => toggleCategory(category)}
                      >
                        {/* Expand/Collapse Icon */}
                        <SVG
                          src={isExpanded
                            ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
                            : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
                          }
                        />
                        
                        <AutoLayout direction="vertical" width="fill-parent">
                          <Text fontSize={12} fontWeight={600} fill="#fff">
                            {category}
                          </Text>
                          <Text fontSize={12} fill="#d1d1d1">
                            {completedCount} of {totalCount} completed
                          </Text>
                        </AutoLayout>
                      </AutoLayout>
                      
                        {/* Complete all / Uncheck all button */}
                        <AutoLayout
                          onClick={() => {
                            const newCompletions = { ...componentCompletions }
                            if (completedCount === totalCount) {
                              // Uncheck all tasks in this category
                              categoryTodos.forEach(todo => {
                                newCompletions[todo.id] = false
                              })
                            } else {
                              // Mark all tasks in this category as complete
                              categoryTodos.forEach(todo => {
                                newCompletions[todo.id] = true
                              })
                            }
                            setCompletionsByComponent({
                              ...completionsByComponent,
                              [selectedComponent]: newCompletions
                            })
                          }}
                          cornerRadius={4}
                          width="hug-contents"
                          horizontalAlignItems="center"
                          verticalAlignItems="center"
                          spacing={4}
                          padding={4}
                          hoverStyle={{stroke: "#71AFBE"}}
                        >
                          <Text fontSize={11} fill="#71AFBE" fontWeight={600}>
                            {completedCount === totalCount ? "Uncheck all" : "Check all"}
                          </Text>
                        </AutoLayout>

                      {/* Progress Badge */}
                      <AutoLayout
                        padding={{horizontal: 8, vertical: 4}}
                        cornerRadius={12}
                        fill={completedCount === totalCount ? "#71AFBE" : "#172D33"}
                      >
                        <Text fontSize={11} fill={completedCount === totalCount ? "#001D24" : "#71AFBE"} fontWeight={600}>
                          {Math.round((completedCount / totalCount) * 100)}%
                        </Text>
                      </AutoLayout>
                      
                    </AutoLayout>
                    
                    {/* Accordion Content - 2 column layout for tasks */}
                    {isExpanded && (
                      <AutoLayout direction="vertical" spacing={4} width="fill-parent" padding={{left: 8, right: 8, top: 8, bottom: 8}}>
                        {Array.from({ length: Math.ceil(categoryTodos.length / 2) }, (_, rowIndex) => {
                          const rowItems = categoryTodos.slice(rowIndex * 2, rowIndex * 2 + 2)
                          return (
                            <AutoLayout key={rowIndex} direction="horizontal" spacing={4} width="fill-parent">
                              {rowItems.map((todo, itemIndex) => {
                                const isCompleted = componentCompletions[todo.id] || false
                                return (
                                <AutoLayout
                                  key={todo.id}
                                  direction="horizontal"
                                  verticalAlignItems="center"
                                  spacing={8}
                                  padding={{horizontal: 4, vertical: 4}}
                                  cornerRadius={16}
                                  fill={isCompleted ? "#172D33" : "#072027"}
                                  width={248}
                                  onClick={() => toggleTodo(todo.id)}
                                >
                                  {/* Checkbox */}
                                  <SVG
                                    src={isCompleted 
                                      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
                                      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
                                    }
                                  />

                                  {/* Task Text */}
                                  <Text 
                                    fontSize={12} 
                                    lineHeight={12}
                                    fill={isCompleted ? "#71AFBE" : "#d1d1d1"}
                                    textDecoration={isCompleted ? "strikethrough" : "none"}
                                    width="fill-parent"
                                  >
                                    {todo.text}
                                  </Text>
                                </AutoLayout>
                                )
                              })}
                              {/* Add spacer if this row has only one item */}
                              {rowItems.length === 1 && <AutoLayout width={248} height={1} />}
                            </AutoLayout>
                          )
                        })}
                      </AutoLayout>
                    )}
                  </AutoLayout>
                )
              })
            )}
          </AutoLayout>
          )
        })()}

        {/* Settings Tab */}
        {activeTab === 'settings' && (() => {
          // Pre-compute all data structures for faster rendering
          const enabledTasksSet = new Set(enabledTasks)
          const expandedCategoriesSet = new Set(expandedCategories)
          
          // Pre-group default tasks and custom tasks by category
          const defaultTasksByCategory = new Map<string, Array<{text: string, category: string}>>()
          const customTasksByCategory = new Map<string, Array<{text: string, category: string}>>()
          
          // Group default tasks
          for (const task of defaultComponentTasks) {
            if (!defaultTasksByCategory.has(task.category)) {
              defaultTasksByCategory.set(task.category, [])
            }
            defaultTasksByCategory.get(task.category)!.push(task)
          }
          
          // Group custom tasks
          for (const todo of todos) {
            if (!defaultTaskTextsSet.has(todo.text)) {
              if (!customTasksByCategory.has(todo.category)) {
                customTasksByCategory.set(todo.category, [])
              }
              customTasksByCategory.get(todo.category)!.push({ text: todo.text, category: todo.category })
            }
          }
          
          return (
          <AutoLayout direction="vertical" spacing={8} width="fill-parent" fill={"#001D24"} cornerRadius={4} padding={4}>
            {/* Header with Title, Description and Enable All Button */}
            <AutoLayout direction="horizontal" fill="#072027" cornerRadius={4} padding={16} spacing={12} width="fill-parent" verticalAlignItems="center" stroke="#172D33" strokeWidth={1}>
              {/* Text Content */}
              <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                <Text fontSize={16} fill="#fff" fontWeight={600}>
                  Manage tasks
                </Text>
                <Text fontSize={13} fill="#d1d1d1">
                  Choose which tasks appear in your checklist
                </Text>
              </AutoLayout>
              
              {/* Enable All Button */}
              <AutoLayout
                padding={{horizontal: 12, vertical: 8}}
                cornerRadius={6}
                onClick={() => setEnabledTasks(defaultTaskTexts)}
                width="hug-contents"
                horizontalAlignItems="center"
                fill="#71AFBE"
                stroke="#8FDAED"
                strokeWidth={1}
                hoverStyle={{fill: "#A2CFDA"}}
              >
                <Text fontSize={12} fill="#001D24" fontWeight={700}>Enable all tasks</Text>
              </AutoLayout>
            </AutoLayout>
            
            {/* Task Categories and Items - Accordion Style */}
            {taskCategories.map((category) => {
              // Use pre-grouped data instead of filtering
              const defaultCategoryTasks = defaultTasksByCategory.get(category) || []
              const customCategoryTasks = customTasksByCategory.get(category) || []
              const allCategoryTasks = [...defaultCategoryTasks, ...customCategoryTasks]
              
              if (allCategoryTasks.length === 0) return null
              
              const isExpanded = expandedCategoriesSet.has(category)
              
              // Count enabled tasks
              let enabledCount = 0
              for (const task of allCategoryTasks) {
                if (enabledTasksSet.has(task.text)) enabledCount++
              }
              const totalCount = allCategoryTasks.length
              
              return (
                <AutoLayout 
                  key={category} 
                  direction="vertical" 
                  width="fill-parent"
                  overflow="visible"
                  stroke="#172D33"
                  strokeWidth={1}
                  cornerRadius={4}
                >
                  {/* Accordion Header */}
                  <AutoLayout
                    cornerRadius={4}
                    direction="horizontal"
                    spacing={12}
                    padding={{horizontal: 12, vertical: 12}}
                    fill="#072027"
                    width="fill-parent"
                    verticalAlignItems="center"
                    onClick={() => toggleCategory(category)}
                    stroke="#172D33"
                    strokeWidth={1}
                  >
                    {/* Expand/Collapse Icon */}
                    <SVG
                      src={isExpanded
                        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
                        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
                      }
                    />
                    
                    <AutoLayout direction="vertical" spacing={2} width="fill-parent">
                      <Text fontSize={14} fontWeight={600} fill="#fff">
                        {category}
                      </Text>
                      <Text fontSize={12} fill="#d1d1d1">
                        {enabledCount} of {totalCount} enabled
                      </Text>
                    </AutoLayout>               
                    
                    {/* Status Badge */}
                    <AutoLayout
                      padding={{horizontal: 8, vertical: 4}}
                      cornerRadius={12}
                      fill={enabledCount === totalCount ? "#71AFBE" : "#172D33"}
                    >
                      <Text fontSize={11} fill={enabledCount === totalCount ? "#001D24" : "#71AFBE"} fontWeight={600}>
                        {enabledCount}/{totalCount}
                      </Text>
                    </AutoLayout>
                  </AutoLayout>
                  
                  {/* Accordion Content - 2 column layout for tasks */}
                  {isExpanded && (
                    <AutoLayout direction="vertical" spacing={4} width="fill-parent" padding={{horizontal: 12, vertical: 12, top: 8, bottom: 8}}>
                      {Array.from({ length: Math.ceil(allCategoryTasks.length / 2) }, (_, rowIndex) => {
                        const rowItems = allCategoryTasks.slice(rowIndex * 2, rowIndex * 2 + 2)
                        return (
                          <AutoLayout key={rowIndex} direction="horizontal" spacing={4} width="fill-parent">
                            {rowItems.map((task) => {
                              const isCustomTask = !defaultTaskTextsSet.has(task.text)
                              
                              return (
                                <AutoLayout
                                  key={task.text}
                                  direction="horizontal"
                                  spacing={8}
                                  padding={{horizontal: 0, vertical: 4}}
                                  width={268}
                                  verticalAlignItems="center"
                                >
                                  <SVG
                                    src={enabledTasksSet.has(task.text)
                                      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#71AFBE" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
                                      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#172D33" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
                                    }
                                    onClick={() => toggleTaskEnabled(task.text)}
                                  />
                                  <Text 
                                    fontSize={14} 
                                    fill={enabledTasksSet.has(task.text) ? "#d1d1d1" : "#172D33"}
                                    width="fill-parent"
                                    onClick={() => toggleTaskEnabled(task.text)}
                                  >
                                    {task.text}
                                  </Text>
                                  
                                  {/* Delete button for custom tasks */}
                                  {isCustomTask && (
                                    <AutoLayout
                                      padding={4}
                                      cornerRadius={4}
                                      hoverStyle={{fill: "#172D33"}}
                                      onClick={() => deleteCustomTask(task.text)}
                                    >
                                      <SVG
                                        src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`}
                                        width={16}
                                        height={16}
                                      />
                                    </AutoLayout>
                                  )}
                                </AutoLayout>
                              )
                            })}
                            {/* Add spacer if this row has only one item */}
                            {rowItems.length === 1 && <AutoLayout width={248} height={1} />}
                          </AutoLayout>
                        )
                      })}
                    </AutoLayout>
                  )}
                </AutoLayout>
              )
            })}
            
            {/* Add Custom Task Section */}
            <AutoLayout 
              direction="vertical" 
              spacing={16} 
              width="fill-parent"
              padding={16}
              fill="#072027"
              cornerRadius={4}
              stroke="#172D33"
              strokeWidth={1}
            >
              <Text fontSize={14} fontWeight={600} fill="#fff">
                Add custom component
              </Text>

              {/* Component Name Input */}
              <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                <Text fontSize={12} fill="#d1d1d1">Component name</Text>
                <AutoLayout
                  padding={12}
                  fill="#001D24"
                  stroke="#71AFBE"
                  strokeWidth={1}
                  cornerRadius={6}
                  width="fill-parent"
                >
                  <Input
                    value={newTodoText}
                    placeholder=""
                    onTextEditEnd={(e) => setNewTodoText(e.characters)}
                    fontSize={12}
                    fill="#d1d1d1"
                    inputBehavior="wrap"
                    width="fill-parent"
                  />
                </AutoLayout>
              </AutoLayout>
              
              {/* Component Description Input */}
              <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                <Text fontSize={12} fill="#d1d1d1">Component description</Text>
                <AutoLayout
                  padding={12}
                  fill="#001D24"
                  stroke="#172D33"
                  strokeWidth={1}
                  cornerRadius={6}
                  width="fill-parent"
                >
                  <Input
                    value={newComponentDescription}
                    placeholder=""
                    onTextEditEnd={(e) => setNewComponentDescription(e.characters)}
                    fontSize={12}
                    fill="#d1d1d1"
                    inputBehavior="wrap"
                    width="fill-parent"
                  />
                </AutoLayout>
              </AutoLayout>              
              
              {/* Category Selection */}
              <AutoLayout direction="vertical" spacing={8} width="fill-parent">
                <Text fontSize={12} fill="#d1d1d1">Category</Text>
                <AutoLayout direction="vertical" spacing={8} width="fill-parent">
                  {/* Create rows with 2 columns each */}
                  {Array.from({ length: Math.ceil(categories.length / 2) }, (_, rowIndex) => (
                    <AutoLayout key={rowIndex} direction="horizontal" spacing={8} width="fill-parent">
                      {categories.slice(rowIndex * 2, rowIndex * 2 + 2).map((category) => (
                        <AutoLayout
                          key={category}
                          direction="horizontal"
                          onClick={() => setSelectedCategory(category)}
                          spacing={6}
                          width="fill-parent"
                          verticalAlignItems="center"
                        >
                          {/* Radio Button */}
                          <SVG
                            src={selectedCategory === category 
                              ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="#71AFBE" stroke-width="2"/><circle cx="8" cy="8" r="4" fill="#71AFBE"/></svg>`
                              : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="#172D33" stroke-width="2"/></svg>`
                            }
                            width={16}
                            height={16}
                          />
                          <Text 
                            fontSize={12} 
                            fill="#d1d1d1"
                            fontWeight={selectedCategory === category ? 600 : 400}
                          >
                            {category}
                          </Text>
                        </AutoLayout>
                      ))}
                    </AutoLayout>
                  ))}
                </AutoLayout>
              </AutoLayout>
              
              {/* Add Button */}
              <AutoLayout
                  padding={{horizontal: 12, vertical: 8}}
                  cornerRadius={6}
                  onClick={newTodoText.trim() ? addComponent : undefined}
                  width="hug-contents"
                  horizontalAlignItems="center"
                  fill={newTodoText.trim() ? "#71AFBE" : "#172D33"}
                  stroke={newTodoText.trim() ? "#8FDAED" : "#172D33"}
                  strokeWidth={1}
                  hoverStyle={newTodoText.trim() ? {fill: "#A2CFDA"} : undefined}
                  opacity={newTodoText.trim() ? 1 : 0.5}
                >
                <Text fontSize={12} fill={newTodoText.trim() ? "#001D24" : "#414B4D"} fontWeight={700}>Add component</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
          )
        })()}
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(Widget)