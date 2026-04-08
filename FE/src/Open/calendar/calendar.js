console.log("script start");

window.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");
  const viewMonth = document.getElementById("viewMonth");
  if (!viewMonth) {
    console.error("viewMonth not found");
    return;
  }

  const now = new Date();
  viewMonth.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  viewMonth.addEventListener("change", generateCalendar);

  generateCalendar();
});

function generateCalendar() {
  console.log("generate called");
  const selectedMonth = document.getElementById("viewMonth").value;
  if (!selectedMonth) return;

  const [year, month] = selectedMonth.split('-').map(Number);

  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);

  const daysInMonth = lastDay.getDate();

  // ★ 月曜始まりに変換
  let startDay = firstDay.getDay();
  startDay = (startDay === 0) ? 6 : startDay - 1;

  const events = JSON.parse(localStorage.getItem("events")) || [];

  const listCalendar = document.getElementById("listCalendar");
  listCalendar.innerHTML = '';

  // 月曜始まりに変更
  const weekdays = ['月', '火', '水', '木', '金', '土', '日'];

  weekdays.forEach(day => {
    const header = document.createElement('div');
    header.className = 'day-header';
    header.textContent = day;
    listCalendar.appendChild(header);
  });

  // 空白
  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'day empty';
    listCalendar.appendChild(empty);
  }

  // 日付
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'day';

    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    dayDiv.innerHTML = `<div class="day-number">${day}</div>`;

    const dayEvents = events.filter(e => e.date === dateStr);

    if (dayEvents.length > 0) {
      const dot = document.createElement('div');
      dot.className = 'event-dot';
      dayDiv.appendChild(dot);
    }

    // ★ 常にクリック可能にする
    dayDiv.onclick = () => showDayEvents(dayEvents, dateStr);

    listCalendar.appendChild(dayDiv);
  }

  // ★ 最後の行を埋める（重要）
  const totalCells = startDay + daysInMonth;
  const remaining = (7 - (totalCells % 7)) % 7;

  for (let i = 0; i < remaining; i++) {
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
        内容：${e.content}<br>
        参加者：${e.members}
      </div><hr>`;
    });
  }

  text.innerHTML = content;
  popup.classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}