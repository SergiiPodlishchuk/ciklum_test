import './styles.css';

const refs = {
  table_calendar: document.querySelector('.table_calendar'),
  container: document.querySelector('.container'),
  new_event: document.querySelector('#new_event'),
};

function renderCalendar() {
  let arr_rows = [];
  for (let i = 10; i <= 18; i++) {
    const row_render = `
        <tr>
        <th class="time">${i}:00</th>
        <th class="point" id="cell_${i}_mon"></th>
        <th class="point" id="cell_${i}_tue"></th>
        <th class="point" id="cell_${i}_wed"></th>
        <th class="point" id="cell_${i}_thu"></th>
        <th class="point" id="cell_${i}_fri"></th>
        </tr>`;
    arr_rows.push(row_render);
  }
  return arr_rows;
}

refs.table_calendar.insertAdjacentHTML('beforeend', renderCalendar().join(''));

refs.container.addEventListener('click', renderForm_Add);

function renderForm_Add(e) {
  if (e.target.id === 'new_event') {
    refs.container.innerHTML = '';
    const renderForm = `
        <form action="">
        <label for="">
          <input type="text">
        </label>
    
        <label for="">
          <select name="" id="">
            <option value="">Maria</option>
            <option value="">Bob</option>
            <option value="">Alex</option>
          </select>
        </label>
        <label for="">
          <select name="" id=""> Day
            <option value="">Mon</option>
            <option value="">Tue</option>
            <option value="">Wed</option>
            <option value="">Thu</option>
            <option value="">Fri</option>
          </select>
        </label>
        <label for="">Time
          <select name="" id=""> Day
            <option value="">10:00</option>
            <option value="">11:00</option>
            <option value="">12:00</option>
            <option value="">13:00</option>
            <option value="">14:00</option>
            <option value="">15:00</option>
            <option value="">16:00</option>
            <option value="">17:00</option>
            <option value="">18:00</option>
    
          </select>
    
        </label>
        
        <button type="button" id="cancel">Cancel</button>
        <button type="submit" id="create">Create</button>
  

      </form>
    `;

    refs.container.insertAdjacentHTML('beforeend', renderForm);
  }
}
