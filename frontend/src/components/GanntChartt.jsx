import React, { useState ,useEffect} from 'react';
import '../styles/GanttChard.css'
import api from '../api';

function GanttChart({ data ,refreshNotes}) {
  let cumulativeSum = 0; // Initialize cumulative sum
  const lastIndex = data.length - 1; // Get the index of the last element
  const startDateTime = new Date(data[0].created_at);

  const [compState,setCompState] = useState(false)
  const [ids, setIds] = useState([]);

// Veri listesinden sadece id değerlerini alarak bir dizi oluştur
useEffect(() => {
    const idsArray = data.filter(item => item.completed).map(item => item.id);
    setIds(idsArray);
  }, [data]);
   // Her data değiştiğinde yeniden oluştur


const handleCompleted = (id) => {
    const completedIds = [...ids]; // Copy the current ids list
    const isCompleted = completedIds.includes(id); // Check if the id is already completed

    // Toggle the completion state
    setCompState(!isCompleted);

    // If the id is already completed, remove it from the list; otherwise, add it to the list
    if (isCompleted) {
        const index = completedIds.indexOf(id);
        completedIds.splice(index, 1); // Remove the id from the list
    } else {
        completedIds.push(id); // Add the id to the list
    }

    // Update the ids state with the updated list
    setIds(completedIds);

    // Call the API to mark the task as completed
    api.post(`/api/mark-as-completed/${id}/`, { completed: !isCompleted })
        .then((res) => {
            if (res.status === 200) {
                if(!isCompleted == true){
                    alert("Task is Completed!");
                }else{
                    alert("Task opened again.")
                }
                refreshNotes()
                
            } else {
                alert("Task Couldn't be completed");
            }
        })
        .catch((err) => alert(err));
};



  return (
    <div className="gantt-chart">
      {data.map((note, index) => {
        cumulativeSum += note.task_time;
        const endDate = new Date(startDateTime.getTime() + cumulativeSum * 3600000);
        const startDate = new Date(endDate - note.task_time * 3600000);


        // Convert start and end dates to readable strings
        const startTimeString = startDate.toLocaleString(); 
        const endTimeString = endDate.toLocaleString();
        
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Generate a random color for each task bar
        return (

          <div>
            <div
            key={note.id +10000}
            className="task-bar"
            style={{
              width: `${10}px`,
              left: `${-20}px`,
              top: `${index * 40}px`,
              backgroundColor: ids.includes(note.id) ? "grey" : randomColor // Set random color for each task bar
            }}
          >
            <span className="tooltip_index">{`${startTimeString} - ${endTimeString} start-end time`}</span>
          </div>
        
          <div
            key={note.id}
            className="task-bar"
            style={{
              width: `${note.task_time/data.length}px`,
              left: `${(cumulativeSum - note.task_time)/data.length}px`,
              top: `${index * 40}px`,
              backgroundColor: ids.includes(note.id) ? "grey" : randomColor // Set random color for each task bar
            }}
          >
            
            <span className="tooltip">{`${note.title} - ${note.task_time} hours`}<button onClick={() => handleCompleted(note.id)} className='completed'>✅</button></span>
          </div>
          </div>
        );
      })}

      {/* Total bar */}
      <div
        className="total-bar"
        style={{
          width: `${cumulativeSum/data.length}px`,
          left: '0px',
          top: `${(lastIndex + 1) * 53}px` // Position the total bar below the last task bar
        }}
      >
        <span className="tooltip">{`Total hours: ${cumulativeSum}`}</span>
      </div>
    </div>
  );
}

export default GanttChart;
