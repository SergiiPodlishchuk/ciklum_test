import './styles.css';

const refs = {
  table_calendar: document.querySelector('.table_calendar'),
  container: document.querySelector('.container'),
  new_event: document.querySelector('#new_event'),
  members: document.querySelector('#members'),
  main_part_table: document.querySelector('.main_part_table'),
};

let events = [];

if (localStorage.getItem('events')) {
  events = JSON.parse(localStorage.getItem('events'));
}
console.log(events);

function filterMembers(events_arr, e) {
  let filter;

  filter = events_arr.filter(
    ({ participant }) => participant === e.target.value,
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

refs.members.addEventListener('change', e => filterMembers(events, e));

function renderCalendar(arr) {
  let arr_rows = [];
  for (let i = 10; i <= 18; i++) {
    const time = arr.filter(({ time }) => +time.slice(0, 2) === i);

    const mon = time.find(({ day }) => day === 'mon');
    const tue = time.find(({ day }) => day === 'tue');
    const wed = time.find(({ day }) => day === 'wed');
    const thu = time.find(({ day }) => day === 'thu');
    const fri = time.find(({ day }) => day === 'fri');

    const ddd = `
    <tr>
        <th class="time">${i}:00</th>
        <th class="point ${mon ? 'backGround' : ''}" id="cell_${i}_mon">${
      mon ? `${mon.text}<button type="button">X</button>` : ''
    }</th>
        <th class="point ${tue ? 'backGround' : ''}" id="cell_${i}_tue">${
      tue ? `${tue.text}<button type="button">X</button>` : ''
    }</th>
        <th class="point ${wed ? 'backGround' : ''}" id="cell_${i}_wed">${
      wed ? `${wed.text}<button type="button">X</button>` : ''
    }</th>
        <th class="point ${thu ? 'backGround' : ''}" id="cell_${i}_thu">${
      thu ? `${thu.text}<button type="button">X</button>` : ''
    }</th>
        <th class="point ${fri ? 'backGround' : ''}" id="cell_${i}_fri">${
      fri ? `${fri.text}<button type="button">X</button>` : ''
    }</th>
    </tr>
    `;

    arr_rows.push(ddd);
  }

  return arr_rows;
}

refs.main_part_table.insertAdjacentHTML(
  'beforeend',
  renderCalendar(events).join(''),
);
refs.container.addEventListener('click', renderForm_Add);
refs.table_calendar.addEventListener('click', delete_event);

function renderForm_Add(e) {
  if (e.target.id === 'new_event') {
    refs.container.innerHTML = '';
    refs.container.insertAdjacentHTML('beforeend', renderForm());

    const form = document.querySelector('#form_create_event');
    const text = document.querySelector('#text_event');
    const participant = document.querySelector('#participants');
    const day = document.querySelector('#dayId');
    const time = document.querySelector('#timeId');

    const event_Data = {
      text: '',
      participant: participant.value,
      day: day.value,
      time: time.value,
    };

    function takeValue(domElem, keyObj, method) {
      domElem.addEventListener(method, e => {
        event_Data[keyObj] = e.target.value;
      });
    }

    takeValue(text, 'text', 'input');
    takeValue(participant, 'participant', 'click');
    takeValue(day, 'day', 'click');
    takeValue(time, 'time', 'click');

    form.addEventListener('click', e => {
      if (e.target.id === 'cancel') {
        document.location.href = 'http://localhost:4040';
      }
    });

    form.addEventListener('submit', e => submitEvent(event_Data, e));
  }
}

function submitEvent(event_Data, e) {
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
}

function renderForm() {
  return `
        <form action="create" id="form_create_event">
        <label for=""> Name of the event
          <input type="text" id="text_event">
        </label>
    
        <label for=""> Participants
          <select name="participant" id="participants" required >
            <option value="Maria">Maria</option>
            <option value="Bob">Bob</option>
            <option value="Alex">Alex</option>
          </select>
        </label>
        <label for=""> Day
          <select form="form_create_event" name="day" id="dayId" required>
            <option value="mon">Monday</option>
            <option value="tue">Tuesday</option>
            <option value="wed">Wednesday</option>
            <option value="thu">Thursday</option>
            <option value="fri">Friday</option>
          </select>
        </label>
        <label for="">Time
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
  if (e.target.type === 'button') {
    const timeEvent = e.target.offsetParent.id.split('_')[1];
    const dayEvent = e.target.offsetParent.id.split('_')[2];

    const deleteEvent = events.find(
      event => event.time.split('_')[0] === timeEvent && event.day === dayEvent,
    );
    const arrfiltevent = events.filter(event => event !== deleteEvent);
    localStorage.setItem('events', JSON.stringify(arrfiltevent));
    document.location.href = 'http://localhost:4040';
  }
}

const input = document.querySelector('#members_arr');
const select = document.querySelector('#frg');

let arf = [];
select.addEventListener('change', e => {
  arf.push(e.target.value);
  input.value = arf.join();
  console.log(input.value);
});
