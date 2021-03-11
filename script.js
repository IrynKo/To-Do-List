const container = document.querySelector('.container');
const form = document.querySelector('.form')
const input = document.querySelector('#title')
const error = document.querySelector('.errorMessage');

const URL = 'https://jsonplaceholder.typicode.com/todos';
let todos = [];

const todosList = async () => {
  try {
    const response = await fetch(`${URL}?_limit=10`);
    const data = await response.json();
    todos = data;
    createToDoList(); 
  } catch (error)
    {
      throw new Error(error);
    }
       
}
todosList()

const createToDoList = () => {
    container.innerHTML = ''
    todos.forEach(item => {
    newTodo(item)
    })
}


const newTodo = (todo) => {

    let card = document.createElement('div');
    card.classList.add('d-flex','cards', 'justify-content-between',  'p-3', 'my-2', 'd-flex');
  
    let rightPart = document.createElement('div');
    rightPart.classList.add('d-flex',  'align-items-center');

    let leftPart = document.createElement('div');
    leftPart.classList.add('d-flex', 'align-items-center');
  
    let title = document.createElement('h4');
    //title.innerText = todo.title
    title.innerText = todo.title[0].toUpperCase() + todo.title.slice(1);
    let error = document.createElement('h4');
    error.classList.add('error');

    let checkbox = document.createElement('input')
    checkbox.classList.add('checkbox', 'form-check')
    checkbox.type = "checkbox";
    if (todo.completed === true) 
    {
        checkbox.checked = true
    };
    //checkbox.value = "value";
    //checkbox.id = "id";

    let button = document.createElement('button');
    button.classList.add('btn', 'btn-danger');
    button.innerText = 'Delete';
    
    button.addEventListener('click', () => {
      if (checkbox.checked)
      {
            deleteUser(todo.id)
        } else {
            error.innerHTML = 'Complete this';
            card.classList.add('invalid-input')
            setTimeout( ()=>error.innerHTML = '', 5000);
            setTimeout( ()=> card.classList.remove('invalid-input'), 5000);
        }
    })
  
    rightPart.appendChild(title);
    leftPart.append(checkbox,error,button );
    card.append(rightPart, leftPart);
    container.appendChild(card);
  
  }

  const addNewTodo = async (title) => {
   try {
     const response =  await fetch(URL, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      },
      body: JSON.stringify({
        title,
        completed: false
      })
    })
    const data = await response.json()
  
     let newTodo = {
        ...data,
       id: uuidv4(),
      }
      todos.unshift(newTodo);
      createToDoList();
    } catch (error) {
      throw new Error(error);
    }
  }

  const validate = (input) => {
    if (input.value === '') {
        error.innerText = 'Field can not be empty';
        error.classList.add('invalid');
        input.classList.add('invalid-input')
        return false
    }
    else {
        error.innerText= '';
        input.classList.remove('invalid-input')
        return true
    }
    }
  const deleteUser = async (id) => {
    try { 
      const response = await fetch(`${URL}/${id}`, {
      method: 'DELETE',
      })
      todos = [...todos.filter(item => item.id.toString() !== id.toString())];
       console.log(todos);
      createToDoList();
    } catch (error) {
        throw new Error(error)
      }  
    };

form.addEventListener('submit', e => {
    e.preventDefault();
    if (validate(input))  
    {
        addNewTodo(input.value);
        form.reset();
}
})
