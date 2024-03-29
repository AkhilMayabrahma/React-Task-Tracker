import React from 'react'
import { useState,useEffect } from 'react'
import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask'

function App() {
  const [showAddTask, setShowAddTask] = useState(false)
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const getTasks = async () => {
         const taskFromServer = await fetchTasks()
         setTasks(taskFromServer)
    }
    getTasks()
    //dependency array
  }, [])


  //Fetch Tasks 
  const fetchTasks = async () => {
    const res = await fetch('http://localhost:5000/tasks')
    const data = await res.json()
    return data   
  }

   //Fetch task 
   const fetchTask = async (id) => {
    const res = await fetch(`http://localhost:5000/tasks/${id}`)
    const data = await res.json()
    return data   
  }
  //AddTask
  const addTask = async (task) => {
    // const id = Math.floor(Math.random() * 10000) + 1
    // const newTask = { id, ...task }
    // console.log(newTask)
    // setTasks([...tasks, newTask])
    const res = await fetch('http://localhost:5000/tasks',
    {
      method: "POST",
      headers: { 
        'Content-type': 'application/json'
      },
      body: JSON.stringify(task)
    }) 
  
    const data = await res.json()

    setTasks([...tasks, data])
  }


  //Delete
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method: "DELETE"
    })

    setTasks(tasks.filter((task) => task.id !== id))
  }

  //Toogle Remainder
  const toggleReminder = async (id) => {
    const taskToToggle  = await fetchTask(id)
    const updatedTask = { ...taskToToggle, reminder: !taskToToggle.reminder}  
    
    const res = await fetch(`http://localhost:5000/tasks/${id}`,
    {
      method: "PUT",
      headers: { 
        'Content-type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    }) 
    
    const data = await res.json()

    setTasks(tasks.map((task) => task.id === id ? { ...task, reminder: data.reminder } : task))
  }

  return (
    <div className="container">
      <Header onAdd={() => setShowAddTask(!showAddTask)} showAdd={showAddTask} />
      {showAddTask && <AddTask onAdd={addTask} />}
      {tasks.length > 0 && !showAddTask ? <Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder} /> : ""
      }   
       </div>
  );
}



// class App extends React.Component{
//   render() {
//     return <h1>Hello from a class</h1>
//   }
// }


export default App;
