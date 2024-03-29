import bot from './assets/bot.svg'
import user from './assets/user.svg'


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

//! Loading Functionality for the APP
//? ____________________________________________

const loader = (element) => {

  element.textContent = ''

  loadInterval = setInterval(() => {
    element.textContent += '.'

    if (element.textContent === '....') {
      element.textContent = ''
    }
  }, 300)
}



//! TextTyping feature for the Application
//? ____________________________________________

const typeText = (element, text) => {

  let index = 0;

  let interval = setInterval(() => {

    if (index < text.length) {
      element.innerHTML += text.charAt(index)
      index++
    }
    else
      clearInterval(interval)

  }, 20);


}

//! Unique ID Generator  function
//? ____________________________________________

const generateUniqueId = () => {
  const timeStamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16)

  return `id-${timeStamp}-${hexadecimalString}`
}


//!  function
//? ____________________________________________

const chatStripe = (isAi, value, uniqueId) => {

  return `
   <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">

         <div class="profile">
          <img src=${isAi ? bot : user}
           alt="${isAi ? 'bot' : 'user'}"
           >
         </div>

         <div class="message" id = ${uniqueId}>
          ${value}
         </div>

      </div>
    </div>

  `
}




//! Function for handling the Submit event
//? ____________________________________________

const handleSubmit = async (event) => {
  event.preventDefault()

  const data = new FormData(form)

  //* User's CharStripe  _____

  let uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(false, data.get('prompt'), uniqueId)


  //? This will clear the text area of the Form

  form.reset()

  //* Bot's CharStripe  _____

  uniqueId = generateUniqueId()
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId)


  //? This code will scroll the text automatically as the message will become 
  //? larger in size (in terms of lines)

  chatContainer.scrollTop = chatContainer.scrollHeight

  const messageDiv = document.getElementById(uniqueId)
  loader(messageDiv)


  //! Fetch Data from the Server
  //? as Bot's response to the query

  const response = await fetch('https://chat-gpt-server-mu.vercel.app/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      prompt: data.get('prompt')
    })
  })

  clearInterval(loadInterval)
  messageDiv.innerHTML = ''

  if (response.ok) {
    const data = await response.json()
    // Ye samjh me ni aaya
    const parsedData = data.bot.trim()
    typeText(messageDiv, parsedData)
  }
  else {
    const err = await response.text()
    messageDiv.innerHTML = 'Something went wrong'
    alert(err)
  }

}



form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e)
  }
})
