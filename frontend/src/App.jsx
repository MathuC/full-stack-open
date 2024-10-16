import { useState, useEffect } from 'react'
import Note from './components/Note'
import noteService from './services/notes' //since it's a default export in services/notes, you can name it anything you want

const App = (props) => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState(
        'a new note...'
    ) 
    const [showAll, setShowAll] = useState(true)
    const [notification, setNotification] = useState([null, null])

    useEffect(() => {
        noteService
            .getAll()
            .then(initialNotes => {
                setNotes(initialNotes)
            })
    }, [])

    const toggleImportanceOf = (id) => {
        const note = notes.find(n => n.id === id)
        const changedNote = { ...note, important: !note.important }

        noteService
            .update(id, changedNote)
            .then(returnedNote => {
                setNotes(notes.map(n => n.id !== id ? n : returnedNote))
            })
            .catch(error => {
                setNotification(
                    [`Note '${note.content}' was already removed from server`, 1]
                )
                setTimeout(() => {
                    setNotification([null, null])
                }, 5000)
                setNotes(notes.filter(n => n.id !== id))
            })

    }

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5
        }
        noteService 
            .create(noteObject)
            .then(returnedNote => {
                setNotes(notes.concat(returnedNote)) //usually API's echo back the data you sent it if the update went successfully
                setNewNote('')
                setNotification(
                    [`Note '${returnedNote.content}' added`, 0]
                )
                setTimeout(() => {
                    setNotification([null, null])
                }, 5000)
            })
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }

    const notesToShow = showAll
        ? notes
        : notes.filter(note => note.important)

    const Notification = ({ message, error }) => {
        if (message === null) {
            return null
        }
        
        return (
            <div className={"notification"+ (error ? " error" : "")}>
                {message}
            </div>
        )
    }

    const Footer = () => {
        const footerStyle = {
          color: 'green',
          fontStyle: 'italic',
          fontSize: 16
        }
        return (
          <div style={footerStyle}>
            <br />
            <em>Note app, Department of Computer Science, University of Helsinki 2024</em>
          </div>
        )
    }

    return (
        <div>
            <h1>Notes</h1>
            <Notification message={notification[0]} error={notification[1]}/>
            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? 'important' : 'all' }
                </button>
            </div>
            <ul>
                {notesToShow.map(note => 
                    <Note 
                        key={note.id} 
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                )}
            </ul> 
            <form onSubmit={addNote}>
                <input 
                    value = {newNote}
                    onChange={handleNoteChange}
                    onClick= {() => setNewNote('')}
                />
                <button type="submit">save</button>
            </form> 
            <Footer />
        </div>
    )
}
  
export default App