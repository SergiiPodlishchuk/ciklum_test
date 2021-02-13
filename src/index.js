import './styles.css';

const refs = {
  table_calendar: document.querySelector('.table_calendar'),
  container: document.querySelector('.container'),
  new_event: document.querySelector('#new_event'),
  members: document.querySelector('#members'),
  main_part_table: document.querySelector('.main_part_table'),
  noButton: document.querySelector('#noButton'),
  yesButton: document.querySelector('#yesButton'),
};

let events = [];

if (localStorage.getItem('events')) {
  events = JSON.parse(localStorage.getItem('events'));
}

refs.members.addEventListener('change', e => filterMembers(events, e));

refs.main_part_table.insertAdjacentHTML(
  'beforeend',
  renderCalendar(events).join(''),
);
refs.container.addEventListener('click', renderForm_Add);

refs.table_calendar.addEventListener('click', delete_event);

refs.main_part_table.addEventListener('dragstart', e => {
  e.target.classList.add(`selected`);
});

refs.main_part_table.addEventListener('drop', onDrop);

refs.main_part_table.addEventListener('dragover', e => e.preventDefault());

function filterMembers(events_arr, e) {
  let filter;

  filter = events_arr.filter(({ participant }) =>
    participant.includes(e.target.value),
  );

  if (e.target.value === 'All_members') {
    filter = events;
  }

  refs.main_part_table.innerHTML = '';

  refs.main_part_table.insertAdjacentHTML(
    'beforeend',
    renderCalendar(filter).join(''),
  );
}

function renderCalendar(arr) {
  let arr_rows = [];
  for (let i = 10; i <= 18; i++) {
    const time = arr.filter(({ time }) => +time.slice(0, 2) === i);

    const days = ['mon', 'tue', 'wed', 'thu', 'fri'];

    let tr_arr = [];

    for (const dayCurent of days) {
      const day = time.find(({ day }) => day === dayCurent);

      const tr = `<th class="point ${
        day ? 'backGround' : ''
      }" id="cell_${i}_${dayCurent}" draggable="true">
        ${day ? `${day.text}<button type="button">X</button>` : ''}
      </th>
    `;
      tr_arr.push(tr);
    }

    const ddd = `
        <tr>
          <th class="time">${i}:00</th>
          ${tr_arr.join('')}
        </tr>
    `;

    arr_rows.push(ddd);
  }

  return arr_rows;
}

function renderForm_Add(e) {
  if (e.target.id === 'new_event') {
    refs.container.innerHTML = '';
    refs.container.insertAdjacentHTML('beforeend', renderForm());

    const form = document.querySelector('#form_create_event');
    const text = document.querySelector('#text_event');
    const participant = document.querySelector('#participants');
    const day = document.querySelector('#dayId');
    const time = document.querySelector('#timeId');
    const input_members = document.querySelector('#members_list');

    const event_Data = {
      text: '',
      participant: participant.value,
      day: day.value,
      time: time.value,
    };
    let arf = [];
    participant.addEventListener('change', e => {
      arf.push(e.target.value);
      input_members.value = arf;
      event_Data.participant = [...arf];
    });

    function takeValue(domElem, keyObj, method) {
      domElem.addEventListener(method, e => {
        let value = e.target.value;
        event_Data[keyObj] = value;
      });
    }

    takeValue(text, 'text', 'input');
    takeValue(day, 'day', 'click');
    takeValue(time, 'time', 'click');

    form.addEventListener('click', e => {
      if (e.target.id === 'cancel') {
        location.reload();
      }
    });

    form.addEventListener('submit', e => submitEvent(event_Data, e));
  }
}

function submitEvent(event_Data, e) {
  e.preventDefault();
  const eventAgain = events.find(
    event => event.time === event_Data.time && event.day === event_Data.day,
  );
  if (eventAgain) {
    e.preventDefault();
    const alert = `
    <div class="alert">
        <div class="big_red_x">x</div>
        <p class="alert_text">Failed to create an event. Time slot is already booked</p>
        <button type="button" class="close_alert">x</button>
    </div>`;

    refs.container.insertAdjacentHTML('beforebegin', alert);
    const closeAlert = document.querySelector('.close_alert');
    const alertWind = document.querySelector('.alert');
    closeAlert.addEventListener('click', () => {
      alertWind.remove();
    });
    return;
  }
  events.push(event_Data);
  localStorage.setItem('events', JSON.stringify(events));
  location.reload();
}

function renderForm() {
  return `
        <form action="create" id="form_create_event" target="">
        <label for=""> Name of the event:
          <input type="text" id="text_event">
        </label>
    
        <label for=""> Participants:
        <input type="text" id="members_list">
          <select name="participant" id="participants" required >
            <option value="Maria">Maria</option>
            <option value="Bob">Bob</option>
            <option value="Alex">Alex</option>
          </select>
        </label>
        <label for=""> Day:
          <select form="form_create_event" name="day" id="dayId" required>
            <option value="mon">Monday</option>
            <option value="tue">Tuesday</option>
            <option value="wed">Wednesday</option>
            <option value="thu">Thursday</option>
            <option value="fri">Friday</option>
          </select>
        </label>
        <label for="">Time:
          <select name="time" id="timeId" required>
            <option value="10_00">10:00</option>
            <option value="11_00">11:00</option>
            <option value="12_00">12:00</option>
            <option value="13_00">13:00</option>
            <option value="14_00">14:00</option>
            <option value="15_00">15:00</option>
            <option value="16_00">16:00</option>
            <option value="17_00">17:00</option>
            <option value="18_00">18:00</option>
          </select>
        </label>

        <div class="buttons">
            <button type="button" id="cancel">Cancel</button>
            <button type="submit" id="create">Create</button>
        </div>

      </form>
    `;
}

function delete_event(e) {
  const confirm = document.querySelector('#confirm_block');

  if (e.target.type === 'button') {
    confirm.classList.remove('displayNone');
    const timeEvent = e.target.offsetParent.id.split('_')[1];
    const dayEvent = e.target.offsetParent.id.split('_')[2];
    const deleteEvent = events.find(
      event => event.time.split('_')[0] === timeEvent && event.day === dayEvent,
    );
    const arrfiltevent = events.filter(event => event !== deleteEvent);

    confirm.addEventListener('click', e => {
      if (e.target.id === 'yesButton') {
        events = arrfiltevent;
        localStorage.setItem('events', JSON.stringify(events));

        refs.main_part_table.innerHTML = '';
        refs.main_part_table.insertAdjacentHTML(
          'beforeend',
          renderCalendar(arrfiltevent).join(''),
        );
        confirm.classList.add('displayNone');
      } else if (e.target.id === 'noButton') {
        confirm.classList.add('displayNone');
      }
    });
  }
}

function onDrop(e) {
  e.preventDefault();

  const activeElement = refs.main_part_table.querySelector(`.selected`);
  const currentElement = e.target;
  const isMoveable =
    activeElement !== currentElement &&
    currentElement.classList.contains(`point`);
  if (!isMoveable) {
    return;
  }

  const activeTime = activeElement.id.split('_')[1];
  const activeDay = activeElement.id.split('_')[2];

  const changeEvent = events.find(
    event => event.time.split('_')[0] === activeTime && event.day === activeDay,
  );

  const arrfiltevent = events.filter(event => event !== changeEvent);

  const currentTime = `${currentElement.id.split('_')[1]}_00`;
  const currentDay = currentElement.id.split('_')[2];

  changeEvent.time = currentTime;
  changeEvent.day = currentDay;

  arrfiltevent.push(changeEvent);
  localStorage.setItem('events', JSON.stringify(arrfiltevent));
  activeElement.classList.remove(`selected`);
  refs.main_part_table.innerHTML = '';
  refs.main_part_table.insertAdjacentHTML(
    'beforeend',
    renderCalendar(arrfiltevent).join(''),
  );
}
