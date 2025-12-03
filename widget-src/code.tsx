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
  { text: "Document keyboard navigation", category: "Documentation" },
  { text: "Include accessibility notes", category: "Documentation" },
  
  // Testing
  { text: "Test autolayout flexibility", category: "Testing" },
  { text: "Test in light and dark mode", category: "Testing" },
  { text: "Test keyboard navigation", category: "Testing" },
  { text: "Test on mobile viewport", category: "Testing" },
  { text: "Test with long text strings", category: "Testing" },
  { text: "Test with screen reader", category: "Testing" }
]

// Component type definitions
const componentTypes = [
  {
    category: "Forms",
    examples: ["Button/CTA", "Text Input", "Checkbox", "Radio Button", "Toggle/Switch", "Select/Dropdown", "Date Picker", "Search Field"],
    priorityTasks: [
      "Error state",
      "Focus state",
      "Disabled state",
      "Touch targets meet 44x44px",
      "Form fields clearly labeled",
      "Required fields indicated",
      "Error messages are clear",
      "Keyboard focus indicator visible",
      "Text contrast meets 4.5:1"
    ]
  },
  {
    category: "Navigation",
    examples: ["Nav Bar/Menu", "Breadcrumb", "Tab Group", "Pagination", "Sidebar", "Link"],
    priorityTasks: [
      "Hover state",
      "Focus state",
      "Selected state",
      "Keyboard focus indicator visible",
      "Touch targets meet 44x44px",
      "Buttons have descriptive labels",
      "Document keyboard navigation",
      "Test keyboard navigation"
    ]
  },
  {
    category: "Data",
    examples: ["Table/Data Grid", "List", "Card", "Chart/Graph", "Timeline"],
    priorityTasks: [
      "Empty state",
      "Loading state",
      "Test with long text strings",
      "Content reflows responsively",
      "Supports text scaling",
      "Supports 200% zoom",
      "Component contrast meets 3:1"
    ]
  },
  {
    category: "Layout",
    examples: ["Container/Frame", "Grid/Stack", "Divider", "Spacer", "Section Header"],
    priorityTasks: [
      "Create responsive variants",
      "Support portrait and landscape",
      "Test autolayout flexibility",
      "Content reflows responsively",
      "Supports 200% zoom",
      "No horizontal viewport text scrolling"
    ]
  },
  {
    category: "Display",
    examples: ["Badge/Tag", "Avatar", "Icon", "Tooltip", "Alert/Banner", "Status Indicator", "Progress Bar", "Skeleton Loader"],
    priorityTasks: [
      "Component contrast meets 3:1",
      "Icons have sufficient contrast",
      "Avoid color-only communication",
      "Test with color blindness simulator",
      "Alt text specified for images",
      "Supports text scaling"
    ]
  }
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
  const [componentType, setComponentType] = useSyncedState<string>('componentType', '')
  const [componentExample, setComponentExample] = useSyncedState<string>('componentExample', '')

  // Initialize todos if empty - using useEffect to avoid setting state during render
  useEffect(() => {
    if (todos.length === 0) {
      setTodos(getInitialTasks())
    }
  })

  const applyComponentTypeFilter = (typeCategory: string) => {
    const selectedType = componentTypes.find(t => t.category === typeCategory)
    if (selectedType) {
      // Enable only the priority tasks for this component type
      setEnabledTasks(selectedType.priorityTasks)
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

  const categories = ['States', 'Linting', 'Props & Variants', 'Color & Contrast', 'Touch & Interaction', 'Content & Labels', 'Layout & Zoom', 'Documentation', 'Testing']

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
        {/* Component Type Indicator (only show if type is selected) */}
        {componentType && activeTab !== 'setup' ? (
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
            <Text fontSize={12} fill="#007DE0" fontWeight={600}>{componentType}</Text>
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
        {/* Setup Tab - Component Type Selection */}
        {activeTab === 'setup' && (
          <AutoLayout 
            direction="vertical" 
            spacing={24} 
            width="fill-parent"
            padding={24}
            fill="#FFFFFF"
            cornerRadius={8}
            stroke="#E0E0E0"
            strokeWidth={1}
          >
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              <Text fontSize={18} fontWeight={700} fill="#333333">
                What type of component are you creating?
              </Text>
              <Text fontSize={14} fill="#666666">
                We'll customize your checklist based on the component type
              </Text>
            </AutoLayout>
            
            {/* Component Type Selection */}
            <AutoLayout direction="vertical" spacing={12} width="fill-parent">
              {componentTypes.map((type) => (
                <AutoLayout
                  key={type.category}
                  direction="vertical"
                  onClick={() => {
                    setComponentType(type.category)
                    setComponentExample('')
                  }}
                  spacing={4}
                  width="fill-parent"
                  padding={16}
                  fill={componentType === type.category ? "#E3F2FD" : "#FAFAFA"}
                  cornerRadius={8}
                  stroke={componentType === type.category ? "#007DE0" : "#E0E0E0"}
                  strokeWidth={componentType === type.category ? 2 : 1}
                  hoverStyle={{fill: componentType === type.category ? "#E3F2FD" : "#F5F5F5"}}
                >
                  <AutoLayout direction="horizontal" spacing={12} width="fill-parent" verticalAlignItems="center">
                    {/* Radio Button */}
                    <SVG
                      src={componentType === type.category
                        ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#007DE0" stroke-width="2"/><circle cx="10" cy="10" r="5" fill="#007DE0"/></svg>`
                        : `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="9" stroke="#999999" stroke-width="2"/></svg>`
                      }
                      width={20}
                      height={20}
                    />
                    <Text 
                      fontSize={16} 
                      fill="#333333"
                      fontWeight={componentType === type.category ? 600 : 500}
                    >
                      {type.category}
                    </Text>
                  </AutoLayout>
                  
                  {/* Examples */}
                  <AutoLayout direction="horizontal" spacing={6} width="fill-parent" padding={{left: 32}}>
                    <Text fontSize={12} fill="#999999">
                      {type.examples.length > 3 
                        ? type.examples.slice(0, 3).join(", ") + "..."
                        : type.examples.join(", ")
                      }
                    </Text>
                  </AutoLayout>
                </AutoLayout>
              ))}
            </AutoLayout>
            
            {/* Continue Button */}
            {componentType ? (
              <AutoLayout
                padding={{horizontal: 24, vertical: 12}}
                cornerRadius={8}
                fill="#007DE0"
                onClick={() => {
                  applyComponentTypeFilter(componentType)
                  setActiveTab('tasks')
                }}
                width="fill-parent"
                horizontalAlignItems="center"
                hoverStyle={{fill: "#0066B8"}}
              >
                <Text fontSize={16} fill="#FFFFFF" fontWeight={600}>Continue to Checklist</Text>
              </AutoLayout>
            ) : null}
            
            {/* Skip Option */}
            <AutoLayout
              onClick={() => {
                setComponentType('All')
                setEnabledTasks(defaultTaskTexts)
                setActiveTab('tasks')
              }}
              width="fill-parent"
              horizontalAlignItems="center"
            >
              <Text fontSize={14} fill="#007DE0" fontWeight={500}>Skip - Show all tasks</Text>
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
          const categoriesWithTodos = categories.filter(category => {
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
                {Array.from({ length: Math.ceil(categories.length / 2) }, (_, rowIndex) => (
                  <AutoLayout key={rowIndex} direction="horizontal" spacing={8} width="fill-parent">
                    {categories.slice(rowIndex * 2, rowIndex * 2 + 2).map((category) => (
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
              <Text fontSize={14} fill="#666666">Task Description</Text>
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
                  Manage Tasks
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
            {categories.map((category) => {
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