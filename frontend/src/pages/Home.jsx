import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note"
import "../styles/Home.css"
import GanttChart from "../components/GanntChartt";
import NoteForm from "../components/NoteForm";

import { Navigate,useNavigate } from "react-router-dom";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [taskTime,setTaskTime] = useState('')
    const [ganttChartValue,setGanttChartValue] = useState(false)
    const [average,setTimeAverage] = useState(0)

    const [formData, setFormData] = useState('');

    const navigate = useNavigate();

    const handleFormSubmit = (data) => {
        setFormData(data);
      };

    useEffect(() => {
        getNotes();
    }, []);


    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
            })
            .catch((err) => {
                alert(err);
                // Navigate to the login page on error
                navigate("/login");
            });
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        let task_time_new = parseFloat(taskTime);
        setTaskTime(task_time_new); // Make sure taskTime is properly set here
        api
            .post("/api/notes/", { title, task_time: task_time_new, content }) // Use task_time instead of task_time_new as the key
            .then((res) => {
                if (res.status === 201) alert("Task created!");
                else alert("Failed to make Task.");
                getNotes();
            })
            .catch((err) => alert(err));
    };


    
    

    const onUpdate = async (id, title,task_time, content) => {
        console.log(id, title,task_time, content)
        let task_time_new = parseFloat(task_time)
        try {
            const response = await api.put(`/api/notes/update/${id}/`, { title, task_time:task_time_new,content });
            if (response.status === 200) {
                alert("Task updated!");
                 // Assuming getNotes() is a function to refresh the notes list
                 getNotes();
            } else {
                alert("Failed to update note.");
            }
            
        } catch (error) {
            alert("An error occurred while updating note.");
        }
    };

    const returnAverage = async (e) => {
        e.preventDefault()
        try {
            const response = await api.get(`/api/average-task-time/${title}`);
            console.log(response.data); // Handle the response data as needed
            setTimeAverage(response.data.average_task_time)
         } catch (error) {
          alert("No data for this entry")
        }
      };

      const refreshNotes = () => {
        // Fetch or update notes data from the server
        // For example, refetch notes data from the API
        getNotes(); // This is just an example, replace it with your actual function to fetch notes
      };
    

    return (
        <div>
            <div style={{maxWidth:"100%"}}>
                <header>
                <h2>Task Manager</h2>
                    
                </header>

                <div className="gantt-chart-container">
                    <div className="gantt-chart-button">
                        <button onClick={() => setGanttChartValue(!ganttChartValue)}>Show Gantt Chart</button>
                    </div>
                    
                    {ganttChartValue && notes.length > 0 && (
                        <div className="ganttChart">
                            <GanttChart data={notes} refreshNotes={refreshNotes}/>
                        </div>
                    )}
                </div>

                
                <div className="note-main">
                    {notes.map((note) => (
                        <Note note={note} onDelete={deleteNote} key={note.id} onUpdate={onUpdate} />
                    ))}
                </div>
                
            </div>
            <header>
                <h2>Create a Task</h2>
            </header>
            
            <form onSubmit={createNote} className="form-create">
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="Task Time">Task Time:</label>
                <NoteForm noteTitle={title} returnAverage={returnAverage} average={average}/>
                <br />
                <input
                    type="number"
                    id="task_time"
                    name="task_time"
                    required
                    onChange={(e) => setTaskTime(e.target.value)}
                    value={taskTime}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                ></textarea>
                <br />
                <input type="submit" value="Submit"></input>
            </form>
        </div>
    );
}

export default Home;