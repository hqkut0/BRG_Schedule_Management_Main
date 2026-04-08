console.log("script start");

// ↓ ここに自分の API キーとスプレッドシート ID を入れる
const API_KEY = "AIzaSyD1HeeWFR683nXErYKaVNG0CyejaokJfqU";
const SPREADSHEET_ID = "1QRGXJ54JZqEtpnszNoYTo1b8rnFK6eQcOx9xvpeYvE8";
const SHEET_NAME = "Sheet1";  

// fetch でスプレッドシートの行データを取得
async function fetchSheetData() {
  const range = `${SHEET_NAME}!A2:D`; 
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${API_KEY}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    if (!json.values) return [];
    
    // json.values からオブジェクト配列を作成
    return json.values.map(row => {
      return {
        date: row[0],    // yyyy-mm-dd
        title: row[1],
        content: row[2],
        members: row[3]
      };
    });

  } catch (e) {
    console.error("Sheets fetch error:", e);
    return [];
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("viewMonth").value = `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}`;
  document.getElementById("viewMonth").addEventListener("change", generateCalendar);
  
  // Google Sheets からデータを先に読み込む
  window.sheetEvents = await fetchSheetData();
  console.log("sheet events:", window.sheetEvents);

  generateCalendar();
});

function generateCalendar() {
  const selectedMonth = document.getElementById("viewMonth").value;
  if (!selectedMonth) return;

  const [year, month] = selectedMonth.split('-').map(Number);

  const firstDay = new Date(year, month - 1, 1);
  let startDay = firstDay.getDay();
  startDay = (startDay === 0) ? 6 : startDay - 1;

  const events = window.sheetEvents || [];

  const listCalendar = document.getElementById("listCalendar");
  listCalendar.innerHTML = '';

  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];
  weekdays.forEach(day => {
    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = day;
    listCalendar.appendChild(header);
  });

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'day empty';
    listCalendar.appendChild(empty);
  }

  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';
    dayDiv.innerHTML = `<div class="day-number">${d}</div>`;

    const dayEvents = events.filter(e => e.date === dateStr);

    if (dayEvents.length > 0) {
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      dayDiv.appendChild(dot);
    }

    dayDiv.onclick = () => showDayEvents(dayEvents, dateStr);
    listCalendar.appendChild(dayDiv);
  }

  // 埋め
  const totalCells = startDay + daysInMonth;
  const rem = (7 - (totalCells % 7)) % 7;
  for (let i = 0; i < rem; i++) {
    const empty = document.createElement('div');
    empty.className = 'day empty';
    listCalendar.appendChild(empty);
  }
}

function showDayEvents(events, date) {
  const popup = document.getElementById("popup");
  const text = document.getElementById("popupText");

  let content = `<strong>${date} の予定</strong><br><br>`;
  if (events.length === 0) {
    content += "予定はありません";
  } else {
    events.forEach(e => {
      content += `<div>
        <strong>${e.title}</strong><br>
        〇内容：${e.content}<br>
        〇参加者：${e.members}
      </div><hr>`;
    });
  }

  text.innerHTML = content;
  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}