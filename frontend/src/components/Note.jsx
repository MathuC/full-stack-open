const Note = ({note, toggleImportance}) => {
    const label = note.important 
        ? 'make not important' : 'make important'
    return( 
        <li className="note">
            {note.content}&nbsp;&nbsp;&nbsp;
            <button onClick = {toggleImportance}>{label}</button>
        </li>
    )
}

export default Note