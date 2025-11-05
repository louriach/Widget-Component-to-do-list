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
  { text: "Empty state", category: "States" },
  { text: "Hover state", category: "States" },
  { text: "Focus state", category: "States" },
  { text: "Error state", category: "States" },
  { text: "Disabled state", category: "States" },
  { text: "Loading state", category: "States" },
  { text: "Selected state", category: "States" },
  
  // Linting
  { text: "Name all layers properly", category: "Linting" },
  { text: "Apply variables", category: "Linting" },
  { text: "Apply text styles", category: "Linting" },
  { text: "Compose sub components", category: "Linting" },
  { text: "Add code connect", category: "Linting" },
  
  // Props & Variants
  { text: "Define all props", category: "Props & Variants" },
  { text: "Create responsive variants", category: "Props & Variants" },
  { text: "Support portrait and landscape", category: "Props & Variants" },
  
  // Color & Contrast
  { text: "Text contrast meets 4.5:1", category: "Color & Contrast" },
  { text: "UI component contrast meets 3:1", category: "Color & Contrast" },
  { text: "Large text contrast meets 3:1", category: "Color & Contrast" },
  { text: "Avoid color-only communication", category: "Color & Contrast" },
  { text: "Test with color blindness simulator", category: "Color & Contrast" },
  
  // Touch & Interaction
  { text: "Touch targets minimum 44x44px", category: "Touch & Interaction" },
  { text: "Keyboard focus indicator visible", category: "Touch & Interaction" },
  { text: "Gesture alternatives provided", category: "Touch & Interaction" },
  
  // Content & Labels
  { text: "Buttons have descriptive labels", category: "Content & Labels" },
  { text: "Form fields clearly labeled", category: "Content & Labels" },
  { text: "Required fields indicated", category: "Content & Labels" },
  { text: "Error messages are clear", category: "Content & Labels" },
  { text: "Icons have sufficient contrast", category: "Content & Labels" },
  { text: "Alt text specified for images", category: "Content & Labels" },
  
  // Layout & Zoom
  { text: "Supports 200% zoom", category: "Layout & Zoom" },
  { text: "No horizontal viewport scrolling for text", category: "Layout & Zoom" },
  { text: "Content reflows responsively", category: "Layout & Zoom" },
  { text: "Supports text scaling", category: "Layout & Zoom" },
  
  // Documentation
  { text: "Add component description", category: "Documentation" },
  { text: "Add documentation link", category: "Documentation" },
  { text: "Add alias names", category: "Documentation" },
  { text: "Document keyboard navigation", category: "Documentation" },
  { text: "Include accessibility notes", category: "Documentation" },
  
  // Testing
  { text: "Test autolayout flexibility", category: "Testing" },
  { text: "Test with long text strings", category: "Testing" },
  { text: "Test in light and dark mode", category: "Testing" },
  { text: "Test with screen reader", category: "Testing" },
  { text: "Test keyboard navigation", category: "Testing" },
  { text: "Test on mobile viewport", category: "Testing" }
]

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
  const [activeTab, setActiveTab] = useSyncedState('activeTab', 'tasks')
  const [enabledTasks, setEnabledTasks] = useSyncedState('enabledTasks', defaultComponentTasks.map(task => task.text))
  const [expandedCategories, setExpandedCategories] = useSyncedState<string[]>('expandedCategories', [])

  // Initialize todos if empty - using useEffect to avoid setting state during render
  useEffect(() => {
    if (todos.length === 0) {
      setTodos(getInitialTasks())
    }
  })

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
  const visibleTodos = todos.filter(todo => enabledTasks.includes(todo.text))

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
      <AutoLayout direction="horizontal" spacing={6} width="fill-parent">
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 12, vertical: 12}}
          stroke={activeTab === 'tasks' ? "#005AA1" : "#E0E0E0"}
          strokeWidth={1}
          cornerRadius={8}
          fill={activeTab === 'tasks' ? "#007DE0" : "#F5F5F5"}
          onClick={() => setActiveTab('tasks')}
          width="hug-contents"
          horizontalAlignItems="center"
        >
          <SVG
            src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${activeTab === 'tasks' ? '#ffffff' : '#666666'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 5H3"/><path d="M16 12H3"/><path d="M11 19H3"/><path d="m15 18 2 2 4-4"/></svg>`}
          />
          <Text fontSize={14} fill={activeTab === 'tasks' ? '#fff' : '#666666'} fontWeight={600}>Tasks</Text>
        </AutoLayout>
        
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 12, vertical: 12}}
          stroke={activeTab === 'settings' ? "#005AA1" : "#E0E0E0"}
          strokeWidth={1}
          cornerRadius={8}
          fill={activeTab === 'settings' ? "#007DE0" : "#F5F5F5"}
          onClick={() => setActiveTab('settings')}
          width="hug-contents"
          horizontalAlignItems="center"
        >
          <SVG
            src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${activeTab === 'settings' ? '#ffffff' : '#666666'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 17H5"/><path d="M19 7h-9"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>`}
          />
          <Text fontSize={14} fill={activeTab === 'settings' ? '#fff' : '#666666'} fontWeight={600}>Settings</Text>
        </AutoLayout>
        
        {/* Spacer to push Add custom task to the right */}
        <AutoLayout width="fill-parent" height={1} />
        
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 12, vertical: 12}}
          stroke={activeTab === 'new' ? "#005AA1" : "#E0E0E0"}
          strokeWidth={1}
          cornerRadius={8}
          fill={activeTab === 'new' ? "#007DE0" : "#F5F5F5"}
          onClick={() => setActiveTab('new')}
          width="hug-contents"
          horizontalAlignItems="center"
        >
          <SVG
            src={`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${activeTab === 'new' ? '#ffffff' : '#666666'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`}
          />
          <Text fontSize={14} fill={activeTab === 'new' ? '#fff' : '#666666'} fontWeight={600}>Custom task</Text>
        </AutoLayout>
      </AutoLayout>

      {/* Tab Content */}
      <AutoLayout
        direction="vertical"
        spacing={16}
        width="fill-parent"
        fill="#F5F5F5"
      >
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
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
              categories.map((category) => {
                const categoryTodos = visibleTodos.filter(todo => todo.category === category)
                if (categoryTodos.length === 0) return null
                
                const isExpanded = expandedCategories.includes(category)
                const completedCount = categoryTodos.filter(t => t.completed).length
                const totalCount = categoryTodos.length
                
                return (
                  <AutoLayout 
                    key={category} 
                    direction="vertical" 
                    width="fill-parent"
                    overflow="visible"
                  >
                    {/* Accordion Header */}
                    <AutoLayout
                      cornerRadius={4}
                      direction="horizontal"
                      spacing={12}
                      padding={{horizontal: 12, vertical: 12}}
                      fill="#FAFAFA"
                      width="fill-parent"
                      verticalAlignItems="center"
                      onClick={() => toggleCategory(category)}
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
                        fill={completedCount === totalCount ? "#4CAF50" : "#2196F3"}
                      >
                        <Text fontSize={11} fill="#FFFFFF" fontWeight={600}>
                          {Math.round((completedCount / totalCount) * 100)}%
                        </Text>
                      </AutoLayout>
                    </AutoLayout>
                    
                    {/* Accordion Content */}
                    {isExpanded && (
                      <AutoLayout direction="vertical" spacing={8} width="fill-parent" padding={{horizontal: 12, vertical: 12, top: 8, bottom: 8}}>
                        {categoryTodos.map((todo) => (
                          <AutoLayout
                            key={todo.id}
                            direction="horizontal"
                            spacing={8}
                            padding={2}
                            cornerRadius={12}
                            fill={todo.completed ? "#F9F9F9" : "#FFFFFF"}
                            width="fill-parent"
                          >
                            {/* Checkbox */}
                            <SVG
                              src={todo.completed 
                                ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
                                : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
                              }
                              onClick={() => toggleTodo(todo.id)}
                            />

                            {/* Task Text */}
                            <Text 
                              fontSize={14} 
                              fill={todo.completed ? "#999999" : "#333333"}
                              textDecoration={todo.completed ? "strikethrough" : "none"}
                              width="fill-parent"
                              onClick={() => toggleTodo(todo.id)}
                            >
                              {todo.text}
                            </Text>
                          </AutoLayout>
                        ))}
                      </AutoLayout>
                    )}
                  </AutoLayout>
                )
              })
            )}
          </AutoLayout>
        )}

        {/* New Task Tab */}
        {activeTab === 'new' && (
          <AutoLayout direction="vertical" spacing={12} width="fill-parent">
            <Text fontSize={14} fontWeight={600} fill="#333333">
              Add custom task
            </Text>
            
            {/* Category Selection */}
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              <Text fontSize={14} fill="#666666">Category</Text>
              <AutoLayout direction="vertical" spacing={8} width="fill-parent">
                <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
                  {categories.slice(0, 3).map((category) => (
                    <AutoLayout
                      key={category}
                      padding={{horizontal: 12, vertical: 8}}
                      cornerRadius={6}
                      fill={selectedCategory === category ? "#2196F3" : "#F5F5F5"}
                      stroke={selectedCategory === category ? "#2196F3" : "#E0E0E0"}
                      strokeWidth={1}
                      onClick={() => setSelectedCategory(category)}
                      width="fill-parent"
                      horizontalAlignItems="center"
                    >
                      <Text 
                        fontSize={12} 
                        fill={selectedCategory === category ? "#FFFFFF" : "#666666"}
                        fontWeight={selectedCategory === category ? 600 : 400}
                      >
                        {category}
                      </Text>
                    </AutoLayout>
                  ))}
                </AutoLayout>
                <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
                  {categories.slice(3).map((category) => (
                    <AutoLayout
                      key={category}
                      padding={{horizontal: 12, vertical: 8}}
                      cornerRadius={6}
                      fill={selectedCategory === category ? "#2196F3" : "#F5F5F5"}
                      stroke={selectedCategory === category ? "#2196F3" : "#E0E0E0"}
                      strokeWidth={1}
                      onClick={() => setSelectedCategory(category)}
                      width="fill-parent"
                      horizontalAlignItems="center"
                    >
                      <Text 
                        fontSize={12} 
                        fill={selectedCategory === category ? "#FFFFFF" : "#666666"}
                        fontWeight={selectedCategory === category ? 600 : 400}
                      >
                        {category}
                      </Text>
                    </AutoLayout>
                  ))}
                </AutoLayout>
              </AutoLayout>
            </AutoLayout>
            
            {/* Task Input */}
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              <Text fontSize={14} fill="#666666">Task Description</Text>
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
            
            {/* Add Button */}
            <AutoLayout
              padding={{horizontal: 16, vertical: 12}}
              cornerRadius={6}
              fill="#2196F3"
              onClick={addTodo}
              width="fill-parent"
              horizontalAlignItems="center"
            >
              <Text fontSize={14} fill="#FFFFFF" fontWeight={500}>Add Task</Text>
            </AutoLayout>
          </AutoLayout>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <AutoLayout direction="vertical" spacing={16} width="fill-parent">
            <Text fontSize={18} fontWeight={600} fill="#333333">
              Manage Tasks
            </Text>
            
            {/* Enable All Button */}
            <AutoLayout
              padding={{horizontal: 16, vertical: 12}}
              cornerRadius={6}
              fill="#4CAF50"
              onClick={() => setEnabledTasks(defaultComponentTasks.map(task => task.text))}
              width="fill-parent"
              horizontalAlignItems="center"
            >
              <Text fontSize={14} fill="#FFFFFF" fontWeight={500}>Enable All Tasks</Text>
            </AutoLayout>
            
            <Text fontSize={14} fill="#666666">
              Choose which tasks appear in your checklist. Unchecked tasks will be hidden but not deleted.
            </Text>
            
            {/* Task Categories and Items - Accordion Style */}
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              {categories.map((category) => {
                const categoryTasks = defaultComponentTasks.filter(task => task.category === category)
                const isExpanded = expandedCategories.includes(category)
                const enabledCount = categoryTasks.filter(task => enabledTasks.includes(task.text)).length
                const totalCount = categoryTasks.length
                
                return (
                  <AutoLayout 
                    key={category} 
                    direction="vertical" 
                    spacing={0} 
                    width="fill-parent"
                    cornerRadius={8}
                    stroke={isExpanded ? "#E0E0E0" : undefined}
                    strokeWidth={isExpanded ? 1 : 0}
                    overflow="visible"
                  >
                    {/* Accordion Header */}
                    <AutoLayout
                      direction="horizontal"
                      spacing={12}
                      padding={{horizontal: 12, vertical: 12}}
                      cornerRadius={isExpanded ? {topLeft: 8, topRight: 8} : 8}
                      fill="#FAFAFA"
                      width="fill-parent"
                      verticalAlignItems="center"
                      onClick={() => toggleCategory(category)}
                    >
                      {/* Expand/Collapse Icon */}
                      <SVG
                        src={isExpanded
                          ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
                          : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666666" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
                        }
                      />
                      
                      <AutoLayout direction="vertical" spacing={2} width="fill-parent">
                        <Text fontSize={15} fontWeight={600} fill="#333333">
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
                        fill={enabledCount === totalCount ? "#4CAF50" : enabledCount === 0 ? "#CCCCCC" : "#2196F3"}
                      >
                        <Text fontSize={11} fill="#FFFFFF" fontWeight={600}>
                          {enabledCount}/{totalCount}
                        </Text>
                      </AutoLayout>
                    </AutoLayout>
                    
                    {/* Accordion Content */}
                    {isExpanded && (
                      <AutoLayout direction="vertical" spacing={6} width="fill-parent" padding={{horizontal: 12, vertical: 12, top: 8, bottom: 8}}>
                        {categoryTasks.map((task) => (
                          <AutoLayout
                            key={task.text}
                            direction="horizontal"
                            spacing={8}
                            padding={8}
                            cornerRadius={6}
                            fill={enabledTasks.includes(task.text) ? "#FFFFFF" : "#F9F9F9"}
                            stroke="#E9E9E9"
                            strokeWidth={1}
                            width="fill-parent"
                            verticalAlignItems="center"
                          >
                            <SVG
                              src={enabledTasks.includes(task.text)
                                ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/><path d="m7 10 2 2 3-3"/></svg>`
                                : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="10" r="8"/></svg>`
                              }
                              onClick={() => toggleTaskEnabled(task.text)}
                            />
                            <Text 
                              fontSize={13} 
                              fill={enabledTasks.includes(task.text) ? "#333333" : "#999999"}
                              width="fill-parent"
                              onClick={() => toggleTaskEnabled(task.text)}
                            >
                              {task.text}
                            </Text>
                          </AutoLayout>
                        ))}
                      </AutoLayout>
                    )}
                  </AutoLayout>
                )
              })}
            </AutoLayout>
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(Widget)