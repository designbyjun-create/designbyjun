// main.js
// 主程式 - 簡化版供預覽

document.addEventListener('DOMContentLoaded', function() {
  console.log('包車行程報價產生器 - 載入完成');
  
  // 初始化
  init();
  
  // 綁定事件
  bindEvents();
  
  // 初次更新預覽
  updatePreview();
});

function init() {
  // 設定預設日期為今天
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('singleDate').value = today;
  document.getElementById('startDate').value = today;
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 2);
  document.getElementById('endDate').value = tomorrow.toISOString().split('T')[0];
}

function bindEvents() {
  // 日期類型切換
  document.querySelectorAll('input[name="dateType"]').forEach(radio => {
    radio.addEventListener('change', handleDateTypeChange);
  });
  
  // 計數器按鈕
  document.querySelectorAll('.counter-btn').forEach(btn => {
    btn.addEventListener('click', handleCounterClick);
  });
  
  // 小孩數量變化
  document.getElementById('kids').addEventListener('change', handleKidsChange);
  
  // 車款選擇
  document.querySelectorAll('input[name="vehicle"]').forEach(checkbox => {
    checkbox.addEventListener('change', updatePreview);
  });
  
  // 行程類型切換
  document.querySelectorAll('input[name^="tripType"]').forEach(radio => {
    radio.addEventListener('change', handleTripTypeChange);
  });
  
  // 時間checkbox
  document.querySelectorAll('.time-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleTimeCheckboxChange);
  });
  
  // 過夜checkbox
  document.querySelectorAll('.overnight-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleOvernightChange);
  });
  
  // 新增景點按鈕
  document.querySelectorAll('.btn-add-spot').forEach(btn => {
    btn.addEventListener('click', handleAddSpot);
  });
  
  // 複製按鈕
  document.getElementById('btnCopy').addEventListener('click', handleCopy);
  
  // 重置按鈕
  document.getElementById('btnReset').addEventListener('click', handleReset);
  
  // 手機版預覽切換
  const toggleBtn = document.getElementById('btnTogglePreview');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', togglePreview);
  }
  
  // 所有輸入框變化時更新預覽
  document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', updatePreview);
    input.addEventListener('change', updatePreview);
  });
}

function handleDateTypeChange(e) {
  const dateType = e.target.value;
  
  // 隱藏所有日期群組
  document.getElementById('singleDateGroup').classList.add('hidden');
  document.getElementById('multipleDateGroup').classList.add('hidden');
  
  // 顯示對應的日期群組
  if (dateType === 'single') {
    document.getElementById('singleDateGroup').classList.remove('hidden');
  } else if (dateType === 'multiple') {
    document.getElementById('multipleDateGroup').classList.remove('hidden');
  }
  
  updatePreview();
}

function handleCounterClick(e) {
  const btn = e.currentTarget;
  const action = btn.dataset.action;
  const targetId = btn.dataset.target;
  const input = document.getElementById(targetId);
  
  let value = parseInt(input.value) || 0;
  const min = parseInt(input.min) || 0;
  const max = parseInt(input.max) || 999;
  
  if (action === 'increase' && value < max) {
    value++;
  } else if (action === 'decrease' && value > min) {
    value--;
  }
  
  input.value = value;
  
  // 觸發 change 事件
  input.dispatchEvent(new Event('change'));
  
  // 特殊處理
  if (targetId === 'kids') {
    handleKidsChange();
  } else if (targetId === 'adults') {
    // 行李數量預設等於大人數
    const luggageInput = document.getElementById('luggage');
    if (luggageInput && !luggageInput.dataset.manuallySet) {
      luggageInput.value = value;
    }
  }
  
  updatePreview();
}

function handleKidsChange() {
  const kids = parseInt(document.getElementById('kids').value) || 0;
  const ageGroup = document.getElementById('kidsAgeGroup');
  
  if (kids === 0) {
    ageGroup.classList.add('hidden');
    ageGroup.innerHTML = '';
    updateCarSeats([]);
    return;
  }
  
  ageGroup.classList.remove('hidden');
  
  // 產生年齡選擇
  let html = '';
  for (let i = 0; i < kids; i++) {
    html += `
      <div class="kid-age-item">
        <label>小孩${i + 1}：</label>
        <select class="kid-age-select" data-kid="${i}">
          ${generateAgeOptions()}
        </select>
      </div>
    `;
  }
  
  ageGroup.innerHTML = html;
  
  // 綁定年齡選擇事件
  ageGroup.querySelectorAll('.kid-age-select').forEach(select => {
    select.addEventListener('change', handleKidAgeChange);
  });
  
  // 計算汽座
  handleKidAgeChange();
}

function generateAgeOptions() {
  let options = '';
  for (let age = 0; age <= 12; age++) {
    options += `<option value="${age}">${age}歲</option>`;
  }
  return options;
}

function handleKidAgeChange() {
  const ageSelects = document.querySelectorAll('.kid-age-select');
  const ages = Array.from(ageSelects).map(select => parseInt(select.value));
  updateCarSeats(ages);
  updatePreview();
}

function updateCarSeats(ages) {
  const seats = Calculator.calculateCarSeats(ages);
  const seatsText = Calculator.formatCarSeats(seats);
  
  const display = document.getElementById('carSeatDisplay');
  display.innerHTML = `<p class="text-muted">${seatsText}</p>`;
}

function handleTripTypeChange(e) {
  const editor = e.target.closest('.day-editor');
  const tripType = e.target.value;
  
  // 隱藏所有特定類型的欄位
  editor.querySelector('.destination-group').classList.add('hidden');
  editor.querySelector('.spots-group').classList.add('hidden');
  editor.querySelector('.theme-park-group').classList.add('hidden');
  
  // 顯示對應的欄位
  if (tripType === 'oneway') {
    editor.querySelector('.destination-group').classList.remove('hidden');
  } else if (tripType === 'roundtrip') {
    editor.querySelector('.spots-group').classList.remove('hidden');
  } else if (tripType === 'shuttle') {
    editor.querySelector('.theme-park-group').classList.remove('hidden');
  }
  
  updatePreview();
}

function handleTimeCheckboxChange(e) {
  const checkbox = e.currentTarget;
  const day = checkbox.dataset.day;
  const timeInput = document.querySelector(`.time-input[data-day="${day}"]`);
  
  if (checkbox.checked) {
    timeInput.classList.remove('hidden');
  } else {
    timeInput.classList.add('hidden');
    timeInput.value = '';
  }
  
  updatePreview();
}

function handleOvernightChange(e) {
  const checkbox = e.currentTarget;
  const day = checkbox.dataset.day;
  const details = document.querySelector(`.overnight-details[data-day="${day}"]`);
  
  if (checkbox.checked) {
    details.classList.remove('hidden');
    
    // 自動帶入終點作為過夜地點
    const destination = document.querySelector(`.destination-input[data-day="${day}"]`);
    const location = document.querySelector(`.overnight-location[data-day="${day}"]`);
    if (destination && location) {
      location.value = destination.value;
    }
  } else {
    details.classList.add('hidden');
  }
  
  updatePreview();
}

function handleAddSpot(e) {
  const btn = e.currentTarget;
  const day = btn.dataset.day;
  const container = document.querySelector(`.spots-container[data-day="${day}"]`);
  
  const spotHtml = `
    <div class="spot-item">
      <input type="text" class="form-input spot-input" placeholder="景點名稱">
      <button type="button" class="btn-remove-spot">×</button>
    </div>
  `;
  
  container.insertAdjacentHTML('beforeend', spotHtml);
  
  // 綁定刪除按鈕
  const newSpot = container.lastElementChild;
  newSpot.querySelector('.btn-remove-spot').addEventListener('click', handleRemoveSpot);
  newSpot.querySelector('.spot-input').addEventListener('input', updatePreview);
}

function handleRemoveSpot(e) {
  const spotItem = e.currentTarget.closest('.spot-item');
  spotItem.remove();
  updatePreview();
}

function updatePreview() {
  const formData = collectFormData();
  const quoteText = Formatter.generateQuote(formData);
  
  const previewOutput = document.getElementById('previewOutput');
  if (quoteText) {
    previewOutput.textContent = quoteText;
  } else {
    previewOutput.innerHTML = '<p class="text-muted">請填寫左側資訊，預覽將即時更新</p>';
  }
}

function collectFormData() {
  const data = {
    dateType: document.querySelector('input[name="dateType"]:checked')?.value,
    singleDate: document.getElementById('singleDate')?.value,
    startDate: document.getElementById('startDate')?.value,
    endDate: document.getElementById('endDate')?.value,
    adults: parseInt(document.getElementById('adults')?.value) || 0,
    kids: parseInt(document.getElementById('kids')?.value) || 0,
    kidsAges: [],
    luggage: parseInt(document.getElementById('luggage')?.value) || 0,
    stroller: parseInt(document.getElementById('stroller')?.value) || 0,
    carryOn: parseInt(document.getElementById('carryOn')?.value) || 0,
    carSeats: document.getElementById('carSeatDisplay')?.textContent?.trim() || '',
    vehicles: [],
    days: []
  };
  
  // 小孩年齡
  document.querySelectorAll('.kid-age-select').forEach(select => {
    data.kidsAges.push(parseInt(select.value));
  });
  
  // 車款
  document.querySelectorAll('input[name="vehicle"]:checked').forEach(checkbox => {
    data.vehicles.push(checkbox.value);
  });
  
  // 行程資料（目前只處理 Day 1）
  const day1Editor = document.querySelector('.day-editor[data-day="1"]');
  if (day1Editor) {
    const dayData = {
      tripType: day1Editor.querySelector('input[name="tripType_1"]:checked')?.value,
      time: day1Editor.querySelector('.time-checkbox')?.checked ? 
            day1Editor.querySelector('.time-input')?.value : '',
      origin: day1Editor.querySelector('.origin-input')?.value || '',
      destination: day1Editor.querySelector('.destination-input')?.value || '',
      spots: [],
      themePark: day1Editor.querySelector('.theme-park-select')?.value || '',
      hours: day1Editor.querySelector('.hours-select')?.value || '',
      overnight: {
        stayLocal: day1Editor.querySelector('.overnight-checkbox')?.checked || false,
        isPrevious: false
      },
      overnightLocation: day1Editor.querySelector('.overnight-location')?.value || '',
      vehicle: data.vehicles.join('/')
    };
    
    // 景點
    day1Editor.querySelectorAll('.spot-input').forEach(input => {
      if (input.value) {
        dayData.spots.push(input.value);
      }
    });
    
    data.days.push(dayData);
  }
  
  return data;
}

function handleCopy() {
  const previewText = document.getElementById('previewOutput').textContent;
  
  if (!previewText || previewText.includes('請填寫')) {
    showToast('請先完成資料填寫');
    return;
  }
  
  navigator.clipboard.writeText(previewText).then(() => {
    showToast('✓ 已複製到剪貼簿');
  }).catch(err => {
    console.error('複製失敗:', err);
    showToast('複製失敗，請手動複製');
  });
}

function handleReset() {
  if (confirm('確定要重置所有資料嗎？')) {
    location.reload();
  }
}

function togglePreview() {
  const panel = document.querySelector('.preview-panel');
  panel.classList.toggle('collapsed');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMessage = toast.querySelector('.toast-message');
  
  toastMessage.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}
