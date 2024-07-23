const socket = io("http://localhost:3000");

let allNotes = [];

socket.on("connect",(x)=>{
    socket.emit("load")
})

function addNote(){
    let note ={
        title:document.getElementById("noteTitle").value,
        description:document.getElementById("noteDesc").value
    }
    socket.emit("addNote",note)
}
socket.on("allNotes",data=>{
    allNotes = data
    displayNotes()
})

function displayNotes(){
    let cartona = ``;
    for (let i = 0; i < allNotes.length; i++) {
        cartona+=`  <div class="col-md-4">
        <div class="border bg-white text-dark rounded-3 p-5 text-center mb-5">
            <h3>${allNotes[i]['title']}</h3>
            <p>${allNotes[i]['description']}</p>
            <button class="btn btn-danger" onclick="deleteNote('${allNotes[i]._id}')">Delete</button>
            <button class="btn btn-success" onclick="updateNote('${allNotes[i]._id}')">Update</button>
        </div>
    </div>`
    }
    document.getElementById("rows").innerHTML = cartona;
}

function deleteNote(id){
   socket.emit("deleteNote",id)
}

async function updateNote(id) {
    const noteUpdate = allNotes.find((e) => e._id === id);
  
    if (!noteUpdate) {
      alert("Note not found.");
      return;
    }
    const updatedTitle = prompt("Update Note Title:", noteUpdate.title);
    const updatedDescription = prompt("Update Note Description:", noteUpdate.description);
  
    if (updatedTitle !== null && updatedDescription !== null) {
   
        noteUpdate.title = updatedTitle;
        noteUpdate.description = updatedDescription;
  
        socket.emit("updateNote", {
          id,
          title: updatedTitle,
          description: updatedDescription,
        });
      } 
    }
  
  
