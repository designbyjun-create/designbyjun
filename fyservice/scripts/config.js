// config.js
// 系統設定檔

const CONFIG = {
  // 車款容量設定
  VEHICLE_CAPACITY: {
    '7座': { people: 6, luggage: 4 },
    '10座': { people: 9, luggage: 7 },
    '14座': { people: 13, luggage: 10 },
    '19座': { people: 18, luggage: 15 }
  },
  
  // 汽座年齡規則
  CAR_SEAT_RULES: {
    INFANT: { minAge: 0, maxAge: 1, name: '嬰兒座椅' },
    CHILD: { minAge: 1, maxAge: 3, name: '安全座椅' },
    BOOSTER: { minAge: 4, maxAge: 6, name: '增高墊' }
  },
  
  // 市區列表
  CITY_CENTERS: [
    '東京市區',
    '大阪市區',
    '名古屋市區',
    '福岡市區',
    '京都市區'
  ],
  
  // 行程類型
  TRIP_TYPES: {
    ONEWAY: 'oneway',
    ROUNDTRIP: 'roundtrip',
    SHUTTLE: 'shuttle'
  },
  
  // 時數建議
  HOURS_SUGGESTION: {
    oneway: '',
    roundtrip: '10',
    shuttle: ''
  },
  
  // 日期格式
  DATE_FORMAT: 'YYYY/MM/DD'
};
