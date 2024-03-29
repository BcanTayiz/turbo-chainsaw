import React, { useEffect, useState } from "react";
import "../styles/Note.css";
import NoteForm from "./NoteForm";
import api from "../api";

function Note({ note, onDelete, onUpdate ,refreshNotes}) {
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US");
    const [updatedTitle, setUpdatedTitle] = useState(note.title);
    const [updatedContent, setUpdatedContent] = useState(note.content);
    const [updatedTaskTime,setUpdatedTaskTime] = useState(20)
    const [updateNoteCompleted,setUpdateNoteCompleted] = useState(false)

    const [average,setTimeAverage] = useState(0)


    const returnAverage = async (e) => {
        e.preventDefault()
        try {
            const response = await api.get(`/api/average-task-time/${updatedTitle}`);
            console.log(response.data); // Handle the response data as needed
            setTimeAverage(response.data.average_task_time)
         } catch (error) {
          alert("No data for this entry")
        }
      };

    useEffect(() => {
        setUpdatedTitle(note.title);
        setUpdatedContent(note.content);
        setUpdatedTaskTime(parseFloat(note.task_time))
        setUpdateNoteCompleted(note.completed)
    }, [note]);

    const handleUpdate = () => {
        onUpdate(note.id, updatedTitle, parseFloat(updatedTaskTime),updatedContent);
    };

    return (
        <div className={`note-container ${updateNoteCompleted ? 'completed' : ''}`}>
            <div className="content-container">
            <div className="updated-values">
                <h3>Current Task Title: {updatedTitle}</h3>
                <h4>Current Task Content: {updatedContent}</h4>
                <h5>Current Task Time: {updatedTaskTime}</h5>
            </div>
            <div className="update-container">
            <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className="note-title"
            />
             <input
                type="number"
                value={updatedTaskTime}
                onChange={(e) => setUpdatedTaskTime(e.target.value)}
                className="note-title"
            />
            <textarea
                value={updatedContent}
                onChange={(e) => setUpdatedContent(e.target.value)}
                className="note-content"
            />
            </div>
            <NoteForm noteTitle={updatedTitle} returnAverage={returnAverage} average={average}/>
            <p className="note-date">{formattedDate}</p>
            <button className="delete-button" onClick={() => onDelete(note.id)}>
                Delete
            </button>
            <button className="update-button" onClick={handleUpdate}>
                Update
            </button>
            </div>
            
            
        </div>
    );
}

export default Note;
