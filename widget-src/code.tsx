const { widget } = figma
const { useSyncedState, usePropertyMenu, AutoLayout, Text, SVG, Input, Rectangle } = widget

interface TodoItem {
  id: string
  text: string
  completed: boolean
  category: string
  createdAt: number
}

const defaultComponentTasks = [
  { text: "Added empty state", category: "States" },
  { text: "Added loading state if appropriate", category: "States" },
  { text: "Added hover state if appropriate", category: "States" },
  { text: "Added focus state if appropriate", category: "States" },
  { text: "Defined all props", category: "Props & Variants" },
  { text: "Applied design variables", category: "Props & Variants" },
  { text: "Added documentation link", category: "Documentation" },
  { text: "Added component description", category: "Documentation" },
  { text: "Added alias names", category: "Documentation" },
  { text: "Named all layers properly", category: "Implementation" },
  { text: "Tested autolayout for flexibility", category: "Testing" },
  { text: "Tested with long text strings", category: "Testing" },
  { text: "Tested accessibility color contrast", category: "Accessibility" },
  { text: "Added code connect", category: "Implementation" },
  { text: "Added annotations", category: "Documentation" },
  { text: "Tested in light and dark mode", category: "Testing" },
  { text: "Composed sub components", category: "Implementation" }
]

function Widget() {
  const getInitialTasks = (): TodoItem[] => {
    return defaultComponentTasks.map((task, index) => ({
      id: `task-${index}`,
      text: task.text,
      completed: false,
      category: task.category,
      createdAt: Date.now() + index
    }))
  }

  const [todos, setTodos] = useSyncedState<TodoItem[]>('todos', getInitialTasks())
  const [newTodoText, setNewTodoText] = useSyncedState('newTodoText', '')
  const [selectedCategory, setSelectedCategory] = useSyncedState('selectedCategory', 'States')
  const [activeTab, setActiveTab] = useSyncedState('activeTab', 'tasks')
  const [enabledTasks, setEnabledTasks] = useSyncedState('enabledTasks', defaultComponentTasks.map(task => task.text))

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

  const toggleTaskEnabled = (taskText: string) => {
    if (enabledTasks.includes(taskText)) {
      setEnabledTasks(enabledTasks.filter(text => text !== taskText))
    } else {
      setEnabledTasks([...enabledTasks, taskText])
    }
  }

  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      'States': '#4CAF50',
      'Props & Variants': '#2196F3',
      'Documentation': '#FF9800',
      'Testing': '#F44336',
      'Accessibility': '#795548',
      'Implementation': '#607D8B'
    }
    return colors[category] || '#9E9E9E'
  }

  const categories = ['States', 'Props & Variants', 'Documentation', 'Implementation', 'Testing', 'Accessibility']
  const visibleTodos = todos.filter(todo => enabledTasks.includes(todo.text))

  return (
    <AutoLayout
      direction="vertical"
      spacing={0}
      padding={12}
      cornerRadius={12}
      fill="#f0f0f0"
      stroke="#E0E0E0"
      strokeWidth={1}
      width={400}
      effect={{
        type: "drop-shadow",
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        blur: 8,
      }}
    >
      {/* Tab Navigation */}
      <AutoLayout direction="horizontal" spacing={0} width="fill-parent">
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 16, vertical: 12}}
          fill={activeTab === 'tasks' ? "#FFFFFF" : "transparent"}
          cornerRadius={{topLeft: 12, topRight: 0, bottomLeft: 0, bottomRight: 0}}
          onClick={() => setActiveTab('tasks')}
          width="fill-parent"
          horizontalAlignItems="center"
        >
          <Text fontSize={14} fill={activeTab === 'tasks' ? '#2196F3' : '#666666'} fontWeight={600}>Tasks</Text>
        </AutoLayout>
        
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 16, vertical: 12}}
          fill={activeTab === 'new' ? "#FFFFFF" : "transparent"}
          onClick={() => setActiveTab('new')}
          width="fill-parent"
          horizontalAlignItems="center"
        >
          <Text fontSize={14} fill={activeTab === 'new' ? '#2196F3' : '#666666'} fontWeight={600}>New Task</Text>
        </AutoLayout>
        
        <AutoLayout
          direction="horizontal"
          spacing={8}
          padding={{horizontal: 16, vertical: 12}}
          fill={activeTab === 'settings' ? "#FFFFFF" : "transparent"}
          cornerRadius={{topLeft: 0, topRight: 12, bottomLeft: 0, bottomRight: 0}}
          onClick={() => setActiveTab('settings')}
          width="fill-parent"
          horizontalAlignItems="center"
        >
          <Text fontSize={14} fill={activeTab === 'settings' ? '#2196F3' : '#666666'} fontWeight={600}>Settings</Text>
        </AutoLayout>
      </AutoLayout>

      {/* Tab Content */}
      <AutoLayout
        direction="vertical"
        spacing={16}
        padding={16}
        width="fill-parent"
        fill="#FFFFFF"
        cornerRadius={{topLeft: 0, topRight: 0, bottomLeft: 12, bottomRight: 12}}
      >
        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <AutoLayout direction="vertical" spacing={8} width="fill-parent">
            {visibleTodos.length === 0 ? (
              <AutoLayout
                direction="vertical"
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
              visibleTodos.map((todo) => (
                <AutoLayout
                  key={todo.id}
                  direction="horizontal"
                  spacing={8}
                  padding={8}
                  cornerRadius={8}
                  fill={todo.completed ? "#F5F5F5" : "#FFFFFF"}
                  stroke="#E9E9E9"
                  strokeWidth={1}
                  width="fill-parent"
                  effect={todo.completed ? undefined : {
                    type: "drop-shadow",
                    color: { r: 0.8, g: 0.8, b: 0.8, a: 1 },
                    offset: { x: 0, y: 1 },
                    blur: 4,
                  }}
                >
                  {/* Checkbox */}
                  <SVG
                    src={todo.completed 
                      ? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`
                      : `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
                    }
                    onClick={() => toggleTodo(todo.id)}
                  />

                  {/* Task Content */}
                  <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                    <Text 
                      fontSize={14} 
                      fill={todo.completed ? "#999999" : "#333333"}
                      textDecoration={todo.completed ? "strikethrough" : "none"}
                      width="fill-parent"
                    >
                      {todo.text}
                    </Text>
                    
                    {/* Category Tag */}
                    <AutoLayout
                      padding={{horizontal: 8, vertical: 4}}
                      cornerRadius={12}
                      fill={getCategoryColor(todo.category)}
                      width="hug-contents"
                    >
                      <Text fontSize={12} fill="#FFFFFF" fontWeight={500}>
                        {todo.category}
                      </Text>
                    </AutoLayout>
                  </AutoLayout>
                </AutoLayout>
              ))
            )}
          </AutoLayout>
        )}

        {/* New Task Tab */}
        {activeTab === 'new' && (
          <AutoLayout direction="vertical" spacing={16} width="fill-parent">
            <Text fontSize={18} fontWeight={600} fill="#333333">
              Add Custom Task
            </Text>
            
            {/* Category Selection */}
            <AutoLayout direction="vertical" spacing={8} width="fill-parent">
              <Text fontSize={14} fill="#666666">Category</Text>
              <AutoLayout direction="horizontal" spacing={8} width="fill-parent">
                {categories.map((category) => (
                  <AutoLayout
                    key={category}
                    padding={{horizontal: 12, vertical: 8}}
                    cornerRadius={6}
                    fill={selectedCategory === category ? getCategoryColor(category) : "#F5F5F5"}
                    stroke={selectedCategory === category ? "transparent" : "#E0E0E0"}
                    strokeWidth={1}
                    onClick={() => setSelectedCategory(category)}
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
            
            <Text fontSize={14} fill="#666666">
              Choose which tasks appear in your checklist. Unchecked tasks will be hidden but not deleted.
            </Text>
            
            {/* Task Categories and Items */}
            <AutoLayout direction="vertical" spacing={12} width="fill-parent">
              {categories.map((category) => (
                <AutoLayout key={category} direction="vertical" spacing={8} width="fill-parent">
                  <Text fontSize={14} fontWeight={600} fill={getCategoryColor(category)}>
                    {category}
                  </Text>
                  
                  {defaultComponentTasks
                    .filter(task => task.category === category)
                    .map((task) => (
                      <AutoLayout
                        key={task.text}
                        direction="horizontal"
                        spacing={8}
                        padding={8}
                        width="fill-parent"
                        horizontalAlignItems="center"
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
                        >
                          {task.text}
                        </Text>
                      </AutoLayout>
                    ))}
                </AutoLayout>
              ))}
            </AutoLayout>
            
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
          </AutoLayout>
        )}
      </AutoLayout>
    </AutoLayout>
  )
}

widget.register(Widget)