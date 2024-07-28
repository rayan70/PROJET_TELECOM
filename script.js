document.addEventListener('DOMContentLoaded', () => {
  const calendar = document.getElementById('calendar');
  const modal = document.getElementById('event-modal');
  const closeModal = document.querySelector('.close');
  const eventForm = document.getElementById('event-form');
  const deleteEventBtn = document.getElementById('delete-event');
  const prevWeekBtn = document.getElementById('prev-week');
  const nextWeekBtn = document.getElementById('next-week');
  const currentMonthYear = document.getElementById('current-month-year');
  const searchButton = document.getElementById('search-button');
  const searchDateInput = document.getElementById('search-date');

  let events = JSON.parse(localStorage.getItem('events')) || [];
  let currentDate = new Date();
  let currentEvent = null;
  let members = JSON.parse(localStorage.getItem('members')) || [];
  let members2 = JSON.parse(localStorage.getItem('members2')) || [];

  const getWeekStartDate = (date) => {
    const startDate = new Date(date);
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // adjust for Sunday
    return new Date(startDate.setDate(diff));
  };

  const getWeekEndDate = (date) => {
    const startDate = getWeekStartDate(date);
    return new Date(startDate.setDate(startDate.getDate() + 6));
  };

  const createCalendar = (date) => {
    calendar.innerHTML = '';

    const startDate = getWeekStartDate(date);
    const endDate = getWeekEndDate(date);
    currentMonthYear.innerText = `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

    const headers = ['Member', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    headers.forEach(header => {
      const div = document.createElement('div');
      div.className = 'header';
      div.innerText = header;
      calendar.appendChild(div);
    });

    const allMembers = [...members, ...members2.map(m => ({ nom: m.nom2, prenom: m.nom3 }))];

    allMembers.forEach(member => {
      const memberHeader = document.createElement('div');
      memberHeader.className = 'member-header';
      memberHeader.innerText = member.nom + ' ' + member.prenom;
      calendar.appendChild(memberHeader);

      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(day.getDate() + i);

        const dayDiv = document.createElement('div');
        dayDiv.className = 'day';
        // Set time to noon to avoid timezone issues
        day.setHours(12, 0, 0, 0);
        dayDiv.dataset.date = day.toISOString().split('T')[0];
        dayDiv.dataset.member = member.nom; // Store member info in data attribute
        dayDiv.innerText = day.getDate();

        if (day.getDay() === 0) { // 0 is Sunday
          dayDiv.classList.add('sunday');
        }

        dayDiv.addEventListener('click', () => openModal(dayDiv.dataset.date, member.nom));
        calendar.appendChild(dayDiv);

        renderEventsForDay(dayDiv.dataset.date, member.nom);
      }
    });
  };

  const openModal = (date, member) => {
    modal.style.display = 'block';
    currentEvent = events.find(event => event.date === date && event.member === member) || null;
    if (currentEvent) {
      eventForm.elements['event-title'].value = currentEvent.title;
      eventForm.elements['event-date'].value = currentEvent.date;
      eventForm.elements['event-member'].value = currentEvent.member;
    } else {
      eventForm.reset();
      eventForm.elements['event-date'].value = date;
      eventForm.elements['event-member'].value = member;
    }
  };

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    currentEvent = null;
  });

  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = eventForm.elements['event-title'].value;
    const date = eventForm.elements['event-date'].value;
    const member = eventForm.elements['event-member'].value;
    if (currentEvent) {
      currentEvent.title = title;
      currentEvent.date = date;
      currentEvent.member = member;
    } else {
      events.push({ title, date, member });
    }
    localStorage.setItem('events', JSON.stringify(events));
    createCalendar(currentDate);
    modal.style.display = 'none';
    currentEvent = null;
  });

  deleteEventBtn.addEventListener('click', () => {
    if (currentEvent) {
      deleteEvent(currentEvent);
      createCalendar(currentDate);
      modal.style.display = 'none';
      currentEvent = null;
    }
  });

  const renderEventsForDay = (date, member) => {
    const dayEvents = events.filter(event => event.date === date && event.member === member);
    dayEvents.forEach(event => {
      const dayDiv = calendar.querySelector(`.day[data-date="${event.date}"][data-member="${member}"]`);
      const eventDiv = document.createElement('div');
      eventDiv.className = 'event';
      eventDiv.innerText = event.title;
      dayDiv.appendChild(eventDiv);
    });
  };

  const deleteEvent = (eventToDelete) => {
    events = events.filter(event => !(event.title === eventToDelete.title && event.date === eventToDelete.date && event.member === eventToDelete.member));
    localStorage.setItem('events', JSON.stringify(events));
  };

  const changeWeek = (increment) => {
    currentDate.setDate(currentDate.getDate() + increment * 7);
    createCalendar(currentDate);
  };

  prevWeekBtn.addEventListener('click', () => changeWeek(-1));
  nextWeekBtn.addEventListener('click', () => changeWeek(1));

  searchButton.addEventListener('click', () => {
    const searchDate = new Date(searchDateInput.value);
    if (!isNaN(searchDate)) {
      currentDate = searchDate;
      createCalendar(currentDate);
    }
  });

  createCalendar(currentDate);
});

// Member Management
let dataPro = JSON.parse(localStorage.getItem('members')) || [];

let nom = document.getElementById('new-member-nom');
let prenom = document.getElementById('new-member-prenom');
let mat = document.getElementById('new-member-mat');
let tele = document.getElementById('new-member-tele');
let submit = document.getElementById('add-member-btn');

let isUpdate = false;
let updateIndex = null;

submit.onclick = function() {
  let newPro = {
    nom: nom.value,
    prenom: prenom.value,
    mat: mat.value,
    tele: tele.value,
  };

  if (isUpdate) {
    dataPro[updateIndex] = newPro;
    isUpdate = false;
    updateIndex = null;
    submit.textContent = 'Ajouter';
  } else {
    dataPro.push(newPro);
  }

  localStorage.setItem('members', JSON.stringify(dataPro));
  showData();
  nom.value = '';
  prenom.value = '';
  mat.value = '';
  tele.value = '';
};

function showData() {
  let table = '';
  for (let i = 0; i < dataPro.length; i++) {
    table += `
      <tr>
        <td>${dataPro[i].nom}</td>
        <td>${dataPro[i].prenom}</td>
        <td>${dataPro[i].mat}</td>
        <td>${dataPro[i].tele}</td>
        <td><button onclick="updateData(${i})" id="update">Modifier</button></td>
        <td><button onclick="deleteData(${i})" id="delete">Supprimer</button></td>
      </tr>`;
  }
  document.querySelector('#members-table tbody').innerHTML = table;
}

function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.setItem('members', JSON.stringify(dataPro));
  showData();
}

function updateData(i) {
  nom.value = dataPro[i].nom;
  prenom.value = dataPro[i].prenom;
  mat.value = dataPro[i].mat;
  tele.value = dataPro[i].tele;
  isUpdate = true;
  updateIndex = i;
  submit.textContent = 'Mettre à jour';
}

showData();


let nom2 = document.getElementById('new-member-nom2');
let nom3 = document.getElementById('new-member-nom3');
let submit2 = document.getElementById('ranger-btn');

let dataPro2 = JSON.parse(localStorage.getItem('members2')) || [];

submit2.onclick = function() {
  let newPro2 = {
    nom2: nom2.value,
    nom3: nom3.value
  };
  
  console.log(newPro2);

  dataPro2.push(newPro2);
  localStorage.setItem('members2', JSON.stringify(dataPro2));
  showData2();
};

function showData2() {
  let table2 = '';
  for (let i = 0; i < dataPro2.length; i++) {
    table2 += `
      <tr>
        <td>${dataPro2[i].nom2}</td>
        <td>${dataPro2[i].nom3}</td>
        <td><button onclick="deleteData2(${i})" id="delete">Supprimer</button></td>
      </tr>`;
  }
  document.querySelector('#ranger_table tbody').innerHTML = table2;
}

function deleteData2(i) {
  dataPro2.splice(i, 1);
  localStorage.setItem('members2', JSON.stringify(dataPro2));
  showData2();
}
showData2();
