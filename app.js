const intervalList = document.getElementById('interval-list');
const addIntervalBtn = document.getElementById('add-interval');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resumeBtn = document.getElementById('resume');
const resetBtn = document.getElementById('reset');
const clearAllBtn = document.getElementById('clear-all');

const labelInput = document.getElementById('label');
const minutesInput = document.getElementById('minutes');
const secondsInput = document.getElementById('seconds');

const currentLabel = document.getElementById('current-label');
const countdownEl = document.getElementById('countdown');
const progressEl = document.getElementById('progress');

const intervals = [];
let currentIndex = 0;
let remainingSeconds = 0;
let timerId = null;
let isPaused = false;

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = (totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function renderIntervals() {
  intervalList.innerHTML = '';

  intervals.forEach((entry, index) => {
    const li = document.createElement('li');
    li.className = 'interval-item';

    const text = document.createElement('span');
    text.textContent = `${index + 1}. ${entry.label} - ${formatTime(entry.seconds)}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.onclick = () => {
      intervals.splice(index, 1);
      renderIntervals();
    };

    li.append(text, removeBtn);
    intervalList.appendChild(li);
  });
}

function updateStatus() {
  if (currentIndex >= intervals.length) {
    currentLabel.textContent = 'Complete 🎉';
    countdownEl.textContent = '00:00';
    progressEl.textContent = 'Workout finished!';
    clearInterval(timerId);
    timerId = null;
    pauseBtn.disabled = true;
    resumeBtn.disabled = true;
    startBtn.disabled = false;
    return;
  }

  currentLabel.textContent = intervals[currentIndex].label;
  countdownEl.textContent = formatTime(remainingSeconds);
  progressEl.textContent = `Interval ${currentIndex + 1} of ${intervals.length}`;
}

function runTimerTick() {
  timerId = setInterval(() => {
    if (remainingSeconds > 0) {
      remainingSeconds -= 1;
      countdownEl.textContent = formatTime(remainingSeconds);
      return;
    }

    currentIndex += 1;
    if (currentIndex >= intervals.length) {
      updateStatus();
      return;
    }

    remainingSeconds = intervals[currentIndex].seconds;
    updateStatus();
  }, 1000);
}

function resetState() {
  clearInterval(timerId);
  timerId = null;
  isPaused = false;
  currentIndex = 0;
  remainingSeconds = 0;
  currentLabel.textContent = 'Not started';
  countdownEl.textContent = '00:00';
  progressEl.textContent = 'Add intervals and press Start.';
  pauseBtn.disabled = true;
  resumeBtn.disabled = true;
  resetBtn.disabled = true;
  startBtn.disabled = false;
}

addIntervalBtn.addEventListener('click', () => {
  const label = labelInput.value.trim() || 'Interval';
  const minutes = Number(minutesInput.value);
  const seconds = Number(secondsInput.value);

  if (Number.isNaN(minutes) || Number.isNaN(seconds) || minutes < 0 || seconds < 0 || seconds > 59) {
    alert('Please enter valid minutes and seconds (0-59).');
    return;
  }

  const totalSeconds = minutes * 60 + seconds;
  if (totalSeconds <= 0) {
    alert('Interval must be at least 1 second.');
    return;
  }

  intervals.push({ label, seconds: totalSeconds });
  renderIntervals();
});

startBtn.addEventListener('click', () => {
  if (!intervals.length) {
    alert('Add at least one interval before starting.');
    return;
  }

  currentIndex = 0;
  remainingSeconds = intervals[0].seconds;
  updateStatus();
  runTimerTick();

  startBtn.disabled = true;
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
  resetBtn.disabled = false;
});

pauseBtn.addEventListener('click', () => {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  isPaused = true;
  pauseBtn.disabled = true;
  resumeBtn.disabled = false;
});

resumeBtn.addEventListener('click', () => {
  if (!isPaused) return;
  isPaused = false;
  runTimerTick();
  pauseBtn.disabled = false;
  resumeBtn.disabled = true;
});

resetBtn.addEventListener('click', resetState);

clearAllBtn.addEventListener('click', () => {
  intervals.length = 0;
  renderIntervals();
  resetState();
});
