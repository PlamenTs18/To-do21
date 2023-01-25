import './style.css';

let selectedTask;

function moveInProgress() {
  if (selectedTask && taskboard.querySelector('#todo').contains(selectedTask)) {
    var data = {
      title: selectedTask.querySelector('h5').innerHTML,
      description: selectedTask.querySelector('div').innerHTML,
      completed: 'false',
      isInProgress: 'true',
    };
    fetch(`http://localhost:3000/tasks/${selectedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      location.reload();
      selectedTask.style.background = '#ffffff';
      selectedTask = null;
    });
  }
}

function moveInDone() {
  if (
    selectedTask &&
    taskboard.querySelector('#progress').contains(selectedTask)
  ) {
    var data = {
      title: selectedTask.querySelector('h5').innerHTML,
      description: selectedTask.querySelector('div').innerHTML,
      completed: 'true',
      isInProgress: 'false',
    };
    fetch(`http://localhost:3000/tasks/${selectedTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => {
      location.reload();
      selectedTask.style.background = '#ffffff';
      selectedTask = null;
    });
  }
}
taskboard.getElementById('moveInDone').addEventListener('click', moveInDone);

taskboard
  .getElementById('moveInProgress')
  .addEventListener('click', moveInProgress);

function subm() {
  var title = taskboard.getElementById('title').value;
  var description = taskboard.getElementById('description').value;

  var data = {
    title: title,
    description: description,
    completed: 'false',
    isInProgress: 'false',
  };

  fetch('http://localhost:3000/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 201) {
        console.log('Task created successfully');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
taskboard.getElementById('btn').addEventListener('click', subm);

fetch('http://localhost:3000/tasks')
  .then((x) => x.json())
  .then((tasks) => {
    var parent = taskboard.getElementById('todoColumn');
    tasks.forEach((task) => {
      if (task.completed === 'true') {
        parent = taskboard.getElementById('doneColumn');
      } else if (task.isInProgress === 'true') {
        parent = taskboard.getElementById('inProgressColumn');
      } else {
        parent = taskboard.getElementById('todoColumn');
      }
      parent.innerHTML += `<div class="taskBox" id="${task.id}">
        <h5>${task.title}</h5>
        <div>${task.description}</div>
      </div>`;
    });
  })
  .catch((error) => console.error(error));

const taskClickHandler = (event) => {
  let thisTask = event.target.closest(`.taskBox`);

  if (selectedTask) {
    selectedTask.style.background = '#ffffff';
  }
  if (selectedTask === thisTask) {
    selectedTask = undefined;
    thisTask.style.background = '#ffffff';
  } else {
    thisTask.style.background = '#7749f8';
    selectedTask = thisTask;
  }
};

taskboard
  .getElementById('todoColumn')
  .addEventListener('click', taskClickHandler);
taskboard
  .getElementById('inProgressColumn')
  .addEventListener('click', taskClickHandler);
