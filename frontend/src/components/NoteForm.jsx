import React from 'react';

function NoteForm({ noteTitle, returnAverage,average}) {
  return (
    <div>
      <button onClick={returnAverage}>Average Completion Hours of Task is: {average}</button>
    </div>
  );
}

export default NoteForm;
