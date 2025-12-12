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
  
  // Props & Variants
  { text: "Create responsive variants", category: "Props & Variants" },
  { text: "Define all props", category: "Props & Variants" },
  { text: "Support portrait and landscape", category: "Props & Variants" },
  
  // Color & Contrast
  { text: "Avoid color-only communication", category: "Color & Contrast" },
  { text: "Component contrast meets 3:1", category: "Color & Contrast" },
  { text: "Large text contrast meets 3:1", category: "Color & Contrast" },
  { text: "Test with color blindness simulator", category: "Color & Contrast" },
  { text: "Text contrast meets 4.5:1", category: "Color & Contrast" },
  
  // Touch & Interaction
  { text: "Gesture alternatives provided", category: "Touch & Interaction" },
  { text: "Keyboard focus indicator visible", category: "Touch & Interaction" },
  { text: "Touch targets meet 44x44px", category: "Touch & Interaction" },
  
  // Content & Labels
  { text: "Alt text specified for images", category: "Content & Labels" },
  { text: "Buttons have descriptive labels", category: "Content & Labels" },
  { text: "Error messages are clear", category: "Content & Labels" },
  { text: "Form fields clearly labeled", category: "Content & Labels" },
  { text: "Icons have sufficient contrast", category: "Content & Labels" },
  { text: "Required fields indicated", category: "Content & Labels" },
  
  // Layout & Zoom
  { text: "Content reflows responsively", category: "Layout & Zoom" },
  { text: "No horizontal viewport text scrolling", category: "Layout & Zoom" },
  { text: "Supports 200% zoom", category: "Layout & Zoom" },
  { text: "Supports text scaling", category: "Layout & Zoom" },
  
  // Documentation
  { text: "Add alias names", category: "Documentation" },
  { text: "Add component description", category: "Documentation" },
  { text: "Add documentation link", category: "Documentation" },
  { text: "Document keyboard Navigation", category: "Documentation" },
  { text: "Include accessibility notes", category: "Documentation" },
  
  // Testing
  { text: "Test autolayout flexibility", category: "Testing" },
  { text: "Test in light and dark mode", category: "Testing" },
  { text: "Test keyboard Navigation", category: "Testing" },
  { text: "Test on mobile viewport", category: "Testing" },
  { text: "Test with long text strings", category: "Testing" },
  { text: "Test with screen reader", category: "Testing" }
]

// Component definitions with priority tasks
const components = [
  { 
    name: "Accordion", 
    category: "Navigation & structure",
    description: "A vertically stacked set of expandable sections that reveal or hide content.",
    priorityTasks: ["Hover state", "Focus state", "Keyboard focus indicator visible", "Test keyboard Navigation", "Icons have sufficient contrast"]
  },
  { 
    name: "Alert", 
    category: "Messaging & feedback",
    description: "A prominent message that communicates important information requiring user attention.",
    priorityTasks: ["Component contrast meets 3:1", "Icons have sufficient contrast", "Avoid color-only communication", "Text contrast meets 4.5:1", "Error messages are clear"]
  },
  { 
    name: "Avatar", 
    category: "Media & visual content",
    description: "A small visual representation of a user, entity, or object—often an image, initials, or icon.",
    priorityTasks: ["Alt text specified for images", "Component contrast meets 3:1"]
  },
  { 
    name: "Badge", 
    category: "Media & visual content",
    description: "A compact indicator used to display status, counts, or attributes.",
    priorityTasks: ["Component contrast meets 3:1", "Text contrast meets 4.5:1", "Supports text scaling"]
  },
  { 
    name: "Breadcrumb", 
    category: "Navigation & structure",
    description: "A navigation pattern showing the user's position in the site hierarchy.",
    priorityTasks: ["Hover state", "Focus state", "Keyboard focus indicator visible", "Buttons have descriptive labels"]
  },
  { 
    name: "Button", 
    category: "Actions & buttons",
    description: "A trigger for an action such as submitting a form, opening a dialog, or navigating.",
    priorityTasks: ["Hover state", "Focus state", "Disabled state", "Loading state", "Touch targets meet 44x44px", "Text contrast meets 4.5:1", "Keyboard focus indicator visible", "Buttons have descriptive labels"]
  },
  { 
    name: "Calendar", 
    category: "Inputs & form controls",
    description: "A visual date selection grid.",
    priorityTasks: ["Focus state", "Touch targets meet 44x44px", "Keyboard focus indicator visible", "Test keyboard Navigation", "Form fields clearly labeled"]
  },
  { 
    name: "Card", 
    category: "Navigation & structure",
    description: "A contained block that groups related content and actions.",
    priorityTasks: ["Hover state", "Empty state", "Test with long text strings", "Content reflows responsively", "Component contrast meets 3:1"]
  },
  { 
    name: "Checkbox", 
    category: "Inputs & form controls",
    description: "A control that allows users to select one or multiple independent options.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Touch targets meet 44x44px", "Form fields clearly labeled", "Keyboard focus indicator visible"]
  },
  { 
    name: "Combobox", 
    category: "Inputs & form controls",
    description: "A combination of input and dropdown that lets users select or type a value.",
    priorityTasks: ["Focus state", "Empty state", "Loading state", "Form fields clearly labeled", "Keyboard focus indicator visible", "Test keyboard Navigation"]
  },
  { 
    name: "Data table", 
    category: "Data & lists",
    description: "A structured grid for displaying and manipulating tabular data.",
    priorityTasks: ["Empty state", "Loading state", "Test with long text strings", "Content reflows responsively", "Supports 200% zoom", "Text contrast meets 4.5:1"]
  },
  { 
    name: "Date picker", 
    category: "Inputs & form controls",
    description: "A control for selecting a specific date, often with an integrated calendar.",
    priorityTasks: ["Focus state", "Form fields clearly labeled", "Touch targets meet 44x44px", "Keyboard focus indicator visible", "Test keyboard Navigation"]
  },
  { 
    name: "Dialog", 
    category: "Overlays & layering",
    description: "A modal UI element that captures user focus and requires interaction.",
    priorityTasks: ["Focus state", "Keyboard focus indicator visible", "Test keyboard Navigation", "Component contrast meets 3:1"]
  },
  { 
    name: "Dropdown menu", 
    category: "Actions & buttons",
    description: "A floating menu of selectable actions or options.",
    priorityTasks: ["Hover state", "Focus state", "Touch targets meet 44x44px", "Keyboard focus indicator visible", "Test keyboard Navigation"]
  },
  { 
    name: "Form", 
    category: "Inputs & form controls",
    description: "A structured collection of inputs used for submitting information.",
    priorityTasks: ["Form fields clearly labeled", "Required fields indicated", "Error messages are clear", "Test keyboard Navigation"]
  },
  { 
    name: "Input", 
    category: "Inputs & form controls",
    description: "A field for entering or editing text.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Form fields clearly labeled", "Required fields indicated", "Text contrast meets 4.5:1"]
  },
  { 
    name: "Navigation menu", 
    category: "Navigation & structure",
    description: "A component for navigating between major sections or categories.",
    priorityTasks: ["Hover state", "Focus state", "Selected state", "Touch targets meet 44x44px", "Keyboard focus indicator visible", "Test keyboard Navigation"]
  },
  { 
    name: "Pagination", 
    category: "Navigation & structure",
    description: "A control for navigating between pages of content.",
    priorityTasks: ["Hover state", "Focus state", "Disabled state", "Touch targets meet 44x44px", "Keyboard focus indicator visible"]
  },
  { 
    name: "Popover", 
    category: "Overlays & layering",
    description: "A non-modal, contextual layer that presents supplementary content.",
    priorityTasks: ["Focus state", "Keyboard focus indicator visible", "Test keyboard Navigation", "Component contrast meets 3:1"]
  },
  { 
    name: "Progress", 
    category: "Progress & status",
    description: "A visual indicator representing progress toward completion.",
    priorityTasks: ["Component contrast meets 3:1", "Avoid color-only communication", "Text contrast meets 4.5:1"]
  },
  { 
    name: "Select", 
    category: "Inputs & form controls",
    description: "A control for selecting one item from a predefined list.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Empty state", "Form fields clearly labeled", "Required fields indicated", "Keyboard focus indicator visible"]
  },
  { 
    name: "Sidebar", 
    category: "Navigation & structure",
    description: "A vertical, persistent panel used for navigation or secondary content.",
    priorityTasks: ["Create responsive variants", "Content reflows responsively", "Touch targets meet 44x44px"]
  },
  { 
    name: "Slider", 
    category: "Inputs & form controls",
    description: "A control allowing users to select a numeric value by dragging a handle.",
    priorityTasks: ["Focus state", "Disabled state", "Touch targets meet 44x44px", "Keyboard focus indicator visible", "Form fields clearly labeled"]
  },
  { 
    name: "Switch", 
    category: "Inputs & form controls",
    description: "A binary toggle representing an on/off state.",
    priorityTasks: ["Hover state", "Focus state", "Disabled state", "Touch targets meet 44x44px", "Form fields clearly labeled", "Avoid color-only communication"]
  },
  { 
    name: "Table", 
    category: "Data & lists",
    description: "A structured, sortable display of rows and columns.",
    priorityTasks: ["Empty state", "Loading state", "Test with long text strings", "Content reflows responsively", "Supports 200% zoom", "Text contrast meets 4.5:1"]
  },
  { 
    name: "Tabs", 
    category: "Navigation & structure",
    description: "A set of horizontally or vertically arranged triggers that switch between views.",
    priorityTasks: ["Hover state", "Focus state", "Selected state", "Touch targets meet 44x44px", "Keyboard focus indicator visible", "Test keyboard Navigation"]
  },
  { 
    name: "Textarea", 
    category: "Inputs & form controls",
    description: "A multi-line input field.",
    priorityTasks: ["Focus state", "Disabled state", "Error state", "Form fields clearly labeled", "Required fields indicated", "Test with long text strings"]
  },
  { 
    name: "Toast", 
    category: "Messaging & feedback",
    description: "An ephemeral notification that appears temporarily without blocking UI.",
    priorityTasks: ["Component contrast meets 3:1", "Text contrast meets 4.5:1", "Avoid color-only communication", "Icons have sufficient contrast"]
  },
  { 
    name: "Toggle", 
    category: "Actions & buttons",
    description: "A selectable, often pill-shaped control for switching between states or options.",
    priorityTasks: ["Hover state", "Focus state", "Selected state", "Touch targets meet 44x44px", "Avoid color-only communication"]
  },
  { 
    name: "Tooltip", 
    category: "Overlays & layering",
    description: "A small contextual hint that appears on hover or focus.",
    priorityTasks: ["Component contrast meets 3:1", "Text contrast meets 4.5:1", "Keyboard focus indicator visible", "Test keyboard Navigation"]
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
  const [selectedCategory, setSelectedCategory] = useSyncedState('selectedCategory', 'States')
  const [activeTab, setActiveTab] = useSyncedState('activeTab', 'setup')
  const [enabledTasks, setEnabledTasks] = useSyncedState('enabledTasks', defaultTaskTexts)
  const [expandedCategories, setExpandedCategories] = useSyncedState<string[]>('expandedCategories', [])
  const [selectedComponent, setSelectedComponent] = useSyncedState<string>('selectedComponent', '')

  // Initialize todos if empty - using useEffect to avoid setting state during render
  useEffect(() => {
    if (todos.length === 0) {
      setTodos(getInitialTasks())
    }
  })

  const applyComponentFilter = (componentName: string) => {
    const selected = components.find(c => c.name === componentName)
    if (selected) {
      // Enable only the priority tasks for this component
      setEnabledTasks(selected.priorityTasks)
    }
  }

  const addTodo = () => {
    if (newTodoText.trim()) {
      const newTodo: TodoItem = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        category: selectedCategory,
        createdAt: Date.now()
      }
      setTodos([...todos, newTodo])
      // Automatically enable the new custom task so it appears in the Tasks tab
      setEnabledTasks([...enabledTasks, newTodo.text])
      setNewTodoText('')
      setActiveTab('tasks')
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
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
    if (category === 'Props & Variants') return '#2196F3'
    if (category === 'Color & Contrast') return '#FF9800'
    if (category === 'Touch & Interaction') return '#9C27B0'
    if (category === 'Content & Labels') return '#00BCD4'
    if (category === 'Layout & Zoom') return '#795548'
    if (category === 'Documentation') return '#FF5722'
    if (category === 'Testing') return '#F44336'
    return '#9E9E9E'
  }

  const taskCategories = ['States', 'Linting', 'Props & Variants', 'Color & Contrast', 'Touch & Interaction', 'Content & Labels', 'Layout & Zoom', 'Documentation', 'Testing']

  return (
    <AutoLayout
      direction="vertical"
      spacing={8}
      padding={4}
      cornerRadius={12}
      fill="#F5F5F5"
      stroke="#E0E0E0"
      strokeWidth={1}
      width={560}
    >
      {/* Tab Navigation */}
      <AutoLayout direction="horizontal" spacing={6} width="fill-parent" fill={"#007DE0"} cornerRadius={8} padding={6}>
        {/* Component Type Indicator (only show if component is selected) */}
        {selectedComponent && activeTab !== 'setup' ? (
          <AutoLayout
            direction="horizontal"
            spacing={6}
            padding={{horizontal: 10, vertical: 8}}
            cornerRadius={4}
            fill="#ffffff"
            width="hug-contents"
            verticalAlignItems="center"
            onClick={() => setActiveTab('setup')}
            hoverStyle={{fill: "#F5F5F5"}}
          >
            <Text fontSize={12} fill="#007DE0" fontWeight={600}>{selectedComponent}</Text>
            <SVG
              src={`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#007DE0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`}
              width={12}
              height={12}
            />
          </AutoLayout>
        ) : null}
        
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 8, vertical: 8}}
          cornerRadius={4}
          fill={activeTab === 'tasks' ? "#ffffff" : "#007DE0"}
          hoverStyle={activeTab === 'tasks' ? undefined : {fill: "#1A8AE3"}}
          onClick={() => setActiveTab('tasks')}
          width="hug-contents"
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <SVG
            src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${activeTab === 'tasks' ? '#007DE0' : '#ffffff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 5H3"/><path d="M16 12H3"/><path d="M11 19H3"/><path d="m15 18 2 2 4-4"/></svg>`}
          />
          <Text fontSize={14} fill={activeTab === 'tasks' ? '#007DE0' : '#ffffff'} fontWeight={600}>Tasks</Text>
        </AutoLayout>
        
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 8, vertical: 8}}
          cornerRadius={4}
          fill={activeTab === 'settings' ? "#ffffff" : "#007DE0"}
          hoverStyle={activeTab === 'settings' ? undefined : {fill: "#1A8AE3"}}
          onClick={() => setActiveTab('settings')}
          width="hug-contents"
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <SVG
            src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${activeTab === 'settings' ? '#007DE0' : '#ffffff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`}
          />
          <Text fontSize={14} fill={activeTab === 'settings' ? '#007DE0' : '#ffffff'} fontWeight={600}>Settings</Text>
        </AutoLayout>
        
        {/* Spacer to push Add custom task to the right */}
        <AutoLayout width="fill-parent" height={1} />
        
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 8, vertical: 8}}
          cornerRadius={4}
          fill={activeTab === 'new' ? "#ffffff" : "#007DE0"}
          hoverStyle={activeTab === 'new' ? undefined : {fill: "#1A8AE3"}}
          onClick={() => setActiveTab('new')}
          width="hug-contents"
          horizontalAlignItems="center"
          verticalAlignItems="center"
        >
          <SVG
            src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${activeTab === 'new' ? '#007DE0' : '#ffffff'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`}
          />
          <Text fontSize={14} fill={activeTab === 'new' ? '#007DE0' : '#ffffff'} fontWeight={600}>Custom task</Text>
        </AutoLayout>
      </AutoLayout>

      {/* Tab Content */}
      <AutoLayout
        direction="vertical"
        spacing={16}
        width="fill-parent"
        fill="#F5F5F5"
      >
        {/* Setup Tab - Component Selection */}
        {activeTab === 'setup' && (
          <AutoLayout 
            direction="vertical" 
            spacing={20} 
            width="fill-parent"
            padding={24}
            fill="#FFFFFF"
            cornerRadius={8}
            stroke="#E0E0E0"
            strokeWidth={1}
          >
            <AutoLayout direction="vertical" spacing={4} width="fill-parent">
              <Text fontSize={18} fontWeight={700} fill="#333333">
                What component are you building?
              </Text>
              <Text fontSize={14} fill="#666666">
                Select a component to get a customized checklist
              </Text>
            </AutoLayout>
            
            {/* Component List - Flat Alphabetical */}
            <AutoLayout direction="vertical" spacing={4} width="fill-parent">
              {/* Sort components alphabetically */}
              {(() => {
                const sortedComponents = [...components].sort((a, b) => a.name.localeCompare(b.name))
                return Array.from({ length: Math.ceil(sortedComponents.length / 3) }, (_, rowIndex) => {
                  const rowItems = sortedComponents.slice(rowIndex * 3, rowIndex * 3 + 3)
                  return (
                    <AutoLayout key={rowIndex} direction="horizontal" spacing={4} width="fill-parent">
                      {rowItems.map((comp) => (
                        <AutoLayout
                          key={comp.name}
                          direction="horizontal"
                          onClick={() => setSelectedComponent(comp.name)}
                          spacing={6}
                          width="fill-parent"
                          height={48}
                          padding={{horizontal: 8, vertical: 8}}
                          fill={selectedComponent === comp.name ? "#E3F2FD" : "#FFFFFF"}
                          cornerRadius={6}
                          stroke={selectedComponent === comp.name ? "#007DE0" : "#E0E0E0"}
                          strokeWidth={1}
                          hoverStyle={{fill: selectedComponent === comp.name ? "#E3F2FD" : "#F5F5F5"}}
                          verticalAlignItems="end"
                          horizontalAlignItems="start"
                        >
                          <Text 
                            fontSize={13} 
                            fill="#333333"
                            fontWeight={500}
                          >
                            {comp.name}
                          </Text>
                        </AutoLayout>
                      ))}
                      {/* Add spacers for incomplete rows */}
                      {Array.from({ length: 3 - rowItems.length }).map((_, i) => (
                        <AutoLayout key={`spacer-${i}`} width="fill-parent" height={1} />
                      ))}
                    </AutoLayout>
                  )
                })
              })()}
            </AutoLayout>
            
            {/* Continue Button */}
            {selectedComponent ? (
              <AutoLayout
                padding={{horizontal: 24, vertical: 12}}
                cornerRadius={8}
                fill="#007DE0"
                onClick={() => {
                  applyComponentFilter(selectedComponent)
                  setActiveTab('tasks')
                }}
                width="fill-parent"
                horizontalAlignItems="center"
                hoverStyle={{fill: "#0066B8"}}
              >
                <Text fontSize={16} fill="#FFFFFF" fontWeight={600}>Continue to checklist</Text>
              </AutoLayout>
            ) : null}
            
            {/* Don't know option */}
            <AutoLayout
              direction="vertical"
              spacing={12}
              width="fill-parent"
              padding={12}
              fill="#FFFFFF"
              cornerRadius={8}
              stroke="#4B4B4B"
              strokeWidth={1}
              verticalAlignItems="center"
            >
              <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                <Text fontSize={14} fontWeight={600} fill="#4B4B4B">
                  Not sure what component you're building?
                </Text>
                <Text fontSize={13} fill="#4B4B4B">
                  Start with the full checklist and customise as you go.
                </Text>
              </AutoLayout>
              
              <AutoLayout
                padding={{horizontal: 12, vertical: 8}}
                cornerRadius={6}
                fill="#4B4B4B"
                onClick={() => {
                  setSelectedComponent('Custom')
                  setEnabledTasks(defaultTaskTexts)
                  setActiveTab('tasks')
                }}
                hoverStyle={{fill: "#000000"}}
              >
                <Text fontSize={14} fill="#FFFFFF" fontWeight={600}>Make custom component</Text>
              </AutoLayout>
            </AutoLayout>
          </AutoLayout>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (() => {
          // Pre-compute all data structures for faster rendering
          const enabledTasksSet = new Set(enabledTasks)
          const visibleTodos = todos.filter(todo => enabledTasksSet.has(todo.text))
          const expandedCategoriesSet = new Set(expandedCategories)
          
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
          <AutoLayout fill={"#ffffff"} cornerRadius={8} direction="vertical" padding={4} spacing={4} width="fill-parent">
            {visibleTodos.length === 0 ? (
              <AutoLayout
                direction="vertical"
                cornerRadius={4}
                spacing={8}
                padding={24}
                width="fill-parent"
                horizontalAlignItems="center"
              >
                <Text fontSize={16} fill="#999999">
                  No tasks to show
                </Text>
                <Text fontSize={14} fill="#CCCCCC">
                  Add tasks or adjust settings to see your checklist
                </Text>
              </AutoLayout>
            ) : (
              // Full-width categories with 2-column task layout inside
              categoriesWithTodos.map((category) => {
                const categoryTodos = todosByCategory.get(category)
                if (!categoryTodos || categoryTodos.length === 0) return null
                
                const isExpanded = expandedCategoriesSet.has(category)
                const completedCount = categoryTodos.filter(t => t.completed).length
                const totalCount = categoryTodos.length
                
                return (
                  <AutoLayout 
                    key={category} 
                    direction="vertical" 
                    width="fill-parent"
                    overflow="visible"
                    stroke="#eeeeee"
                    strokeWidth={1}
                    cornerRadius={8}
                  >
                    {/* Accordion Header */}
                    <AutoLayout
                      cornerRadius={8}
                      direction="horizontal"
                      spacing={12}
                      padding={{horizontal: 12, vertical: 12}}
                      fill="#FAFAFA"
                      width="fill-parent"
                      verticalAlignItems="center"
                      onClick={() => toggleCategory(category)}
                      stroke="#eeeeee"
                      strokeWidth={1}
                    >
                      {/* Expand/Collapse Icon */}
                      <SVG
                        src={isExpanded
                          ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
                          : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
                        }
                      />
                      
                      <AutoLayout direction="vertical" spacing={2} width="fill-parent">
                        <Text fontSize={14} fontWeight={600} fill="#333333">
                          {category}
                        </Text>
                        <Text fontSize={12} fill="#999999">
                          {completedCount} of {totalCount} completed
                        </Text>
                      </AutoLayout>
                      
                      {/* Progress Badge */}
                      <AutoLayout
                        padding={{horizontal: 8, vertical: 4}}
                        cornerRadius={12}
                        fill={completedCount === totalCount ? "#D0FCD1" : "#D0E9FC"}
                      >
                        <Text fontSize={11} fill={completedCount === totalCount ? "#055D08" : "#05385D"} fontWeight={600}>
                          {Math.round((completedCount / totalCount) * 100)}%
                        </Text>
                      </AutoLayout>
                    </AutoLayout>
                    
                    {/* Accordion Content - 2 column layout for tasks */}
                    {isExpanded && (
                      <AutoLayout direction="vertical" spacing={4} width="fill-parent" padding={{horizontal: 12, vertical: 12, top: 8, bottom: 8}}>
                        {Array.from({ length: Math.ceil(categoryTodos.length / 2) }, (_, rowIndex) => {
                          const rowItems = categoryTodos.slice(rowIndex * 2, rowIndex * 2 + 2)
                          return (
                            <AutoLayout key={rowIndex} direction="horizontal" spacing={4} width="fill-parent">
                              {rowItems.map((todo, itemIndex) => (
                                <AutoLayout
                                  key={todo.id}
                                  direction="horizontal"
                                  spacing={8}
                                  padding={{horizontal: 0, vertical: 4}}
                                  cornerRadius={12}
                                  fill={todo.completed ? "#E8FAE9" : "#FFFFFF"}
                                  width={248}
                                >
                                  {/* Checkbox */}
                                  <SVG
                                    src={todo.completed 
                                      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0E5F12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
                                      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
                                    }
                                    onClick={() => toggleTodo(todo.id)}
                                  />

                                  {/* Task Text */}
                                  <Text 
                                    fontSize={14} 
                                    fill={todo.completed ? "#0E5F12" : "#333333"}
                                    textDecoration={todo.completed ? "strikethrough" : "none"}
                                    width="fill-parent"
                                    onClick={() => toggleTodo(todo.id)}
                                  >
                                    {todo.text}
                                  </Text>
                                </AutoLayout>
                              ))}
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

        {/* New Task Tab */}
        {activeTab === 'new' && (
          <AutoLayout 
            direction="vertical" 
            spacing={16} 
            width="fill-parent"
            padding={16}
            fill="#FFFFFF"
            cornerRadius={8}
            stroke="#E0E0E0"
            strokeWidth={1}
          >
            <Text fontSize={16} fontWeight={600} fill="#333333">
              Add custom task
            </Text>
            
            {/* Category Selection */}
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              <Text fontSize={14} fill="#666666">Category</Text>
              <AutoLayout direction="vertical" spacing={8} width="fill-parent">
                {/* Create rows with 2 columns each */}
                {Array.from({ length: Math.ceil(taskCategories.length / 2) }, (_, rowIndex) => (
                  <AutoLayout key={rowIndex} direction="horizontal" spacing={8} width="fill-parent">
                    {taskCategories.slice(rowIndex * 2, rowIndex * 2 + 2).map((category) => (
                      <AutoLayout
                        key={category}
                        direction="horizontal"
                        onClick={() => setSelectedCategory(category)}
                        spacing={8}
                        width="fill-parent"
                        verticalAlignItems="center"
                      >
                        {/* Radio Button */}
                        <SVG
                          src={selectedCategory === category 
                            ? `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="#2196F3" stroke-width="2"/><circle cx="8" cy="8" r="4" fill="#2196F3"/></svg>`
                            : `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="7" stroke="#999999" stroke-width="2"/></svg>`
                          }
                          width={16}
                          height={16}
                        />
                        <Text 
                          fontSize={13} 
                          fill="#333333"
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
            
            {/* Task Input */}
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              <Text fontSize={14} fill="#666666">Task description</Text>
              <AutoLayout
                padding={12}
                fill="#FFFFFF"
                stroke="#E0E0E0"
                strokeWidth={1}
                cornerRadius={6}
                width="fill-parent"
              >
                <Input
                  value={newTodoText}
                  placeholder="Enter task description..."
                  onTextEditEnd={(e) => setNewTodoText(e.characters)}
                  fontSize={14}
                  fill="#333333"
                  inputBehavior="wrap"
                  width="fill-parent"
                />
              </AutoLayout>
            </AutoLayout>
            
            {/* Add Button */}
            <AutoLayout
                padding={{horizontal: 12, vertical: 8}}
                cornerRadius={16}
                onClick={() => setEnabledTasks(defaultTaskTexts)}
                width="hug-contents"
                horizontalAlignItems="center"
                stroke="#055D08"
                strokeWidth={1}
              >
              <Text fontSize={14} fill="#055D08" fontWeight={500}>Add task</Text>
            </AutoLayout>
          </AutoLayout>
        )}

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
          <AutoLayout direction="vertical" spacing={8} width="fill-parent" fill={"#ffffff"} cornerRadius={8} padding={4}>
            {/* Header with Title, Description and Enable All Button */}
            <AutoLayout direction="horizontal" fill="#FFFFFF" cornerRadius={8} padding={16} spacing={12} width="fill-parent" verticalAlignItems="center">
              {/* Text Content */}
              <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                <Text fontSize={16} fill="#333333" fontWeight={600}>
                  Manage tasks
                </Text>
                <Text fontSize={13} fill="#666666">
                  Choose which tasks appear in your checklist
                </Text>
              </AutoLayout>
              
              {/* Enable All Button */}
              <AutoLayout
                padding={{horizontal: 12, vertical: 8}}
                cornerRadius={16}
                onClick={() => setEnabledTasks(defaultTaskTexts)}
                width="hug-contents"
                horizontalAlignItems="center"
                stroke="#055D08"
                strokeWidth={1}
              >
                <Text fontSize={14} fill="#055D08" fontWeight={500}>Enable all tasks</Text>
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
                  stroke="#eeeeee"
                  strokeWidth={1}
                  cornerRadius={8}
                >
                  {/* Accordion Header */}
                  <AutoLayout
                    cornerRadius={8}
                    direction="horizontal"
                    spacing={12}
                    padding={{horizontal: 12, vertical: 12}}
                    fill="#FAFAFA"
                    width="fill-parent"
                    verticalAlignItems="center"
                    onClick={() => toggleCategory(category)}
                    stroke="#eeeeee"
                    strokeWidth={1}
                  >
                    {/* Expand/Collapse Icon */}
                    <SVG
                      src={isExpanded
                        ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
                        : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
                      }
                    />
                    
                    <AutoLayout direction="vertical" spacing={2} width="fill-parent">
                      <Text fontSize={14} fontWeight={600} fill="#333333">
                        {category}
                      </Text>
                      <Text fontSize={12} fill="#999999">
                        {enabledCount} of {totalCount} enabled
                      </Text>
                    </AutoLayout>               
                    
                    {/* Status Badge */}
                    <AutoLayout
                      padding={{horizontal: 8, vertical: 4}}
                      cornerRadius={12}
                      fill={enabledCount === totalCount ? "#D0FCD1" : "#D0E9FC"}
                    >
                      <Text fontSize={11} fill={enabledCount === totalCount ? "#055D08" : "#05385D"} fontWeight={600}>
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
                                      ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
                                      : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
                                    }
                                    onClick={() => toggleTaskEnabled(task.text)}
                                  />
                                  <Text 
                                    fontSize={14} 
                                    fill={enabledTasksSet.has(task.text) ? "#333333" : "#999999"}
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
                                      hoverStyle={{fill: "#F5F5F5"}}
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
          </AutoLayout>
          )
        })()}
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(Widget)