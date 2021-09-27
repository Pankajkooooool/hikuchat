
const socket = io('https://hikuchat.herokuapp.com/');

const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');
//Get username and room from Url
const { username , room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});



//join Chatroom
socket.emit('joinRoom', {username,room});

// get rooms and Users
socket.on('roomUsers', ({room, users}) =>{
 outputRoomName(room);
 outputUsers(users);
 
});

var inc = new Audio('inc.mp3');
var join = new Audio('whatsapp.mp3');

//Message from server
socket.on('message',(message) =>{
    
    outputMessage(message);

    //scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;
   

});
//Recieve custom experimentation code
socket.on('recieve',(message) =>{
    outputMessage(message);
    
    
    chatMessage.scrollTop = chatMessage.scrollHeight;
});



chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    //Get message text
    let msg = e.target.elements.msg.value;
   
    msg = msg.trim();

  if (!msg) {
    return false;
  }
    append(msg);

    // Emit the message to the server
    socket.emit('chatMessage',msg);
   
    //clear INput
    e.target.elements.msg.value='';
    e.target.elements.msg.focus();
   
});



//Output mesage to dom
function outputMessage(message){
  const d= new Date();
    const div = document.createElement('div');
    div.classList.add('message');
    
   
    div.innerHTML=`	<p class="meta">${message.username} <span>${d.getHours()>12?d.getHours()-12:d.getHours()}:${d.getMinutes()}</span></p>
    <p class="text">
       ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    inc.play();
}
// Out put messages to the users side


//Add room name to dom 
function outputRoomName(room) {
    roomName.innerText =room;

}
//Add users to DOM
function outputUsers(users){
    usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    usersList.appendChild(li);
  });
}
//append
const append =( message)=>{
  const div = document.createElement('div');
  const d= new Date();
    div.classList.add('message');
    div.classList.add('right');

    
   
    div.innerHTML=`	<p class="meta">You  <span>${d.getHours()>12?d.getHours()-12:d.getHours()}:${d.getMinutes()}</span></p>
    <p class="text">
       ${message}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
   
    chatMessage.scrollTop = chatMessage.scrollHeight;
}