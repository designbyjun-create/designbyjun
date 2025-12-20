// calculator.js
// 計算邏輯（汽座、車款建議等）

const Calculator = {
  // 計算汽座需求
  calculateCarSeats(kidsAges) {
    const seats = {
      infant: 0,
      child: 0,
      booster: 0
    };
    
    kidsAges.forEach(age => {
      if (age >= 0 && age <= 1) {
        seats.infant++;
      } else if (age >= 1 && age <= 3) {
        seats.child++;
      } else if (age >= 4 && age <= 6) {
        seats.booster++;
      }
    });
    
    return seats;
  },
  
  // 格式化汽座顯示
  formatCarSeats(seats) {
    const parts = [];
    let total = 0;
    
    if (seats.infant > 0) {
      parts.push(`${seats.infant}個嬰兒座椅`);
      total += seats.infant;
    }
    if (seats.child > 0) {
      parts.push(`${seats.child}個安全座椅`);
      total += seats.child;
    }
    if (seats.booster > 0) {
      parts.push(`${seats.booster}個增高墊`);
      total += seats.booster;
    }
    
    // 最多顯示2個
    if (total > 2) {
      return '需要汽座（超過2個，請手動確認）';
    }
    
    return parts.length > 0 ? parts.join('、') : '無需汽座';
  },
  
  // 建議車款
  suggestVehicle(adults, kids, luggage, tripType) {
    const totalPeople = adults + kids;
    const totalLuggage = luggage;
    
    // 一日遊不考慮行李
    const considerLuggage = tripType === 'oneway' || tripType === 'shuttle';
    
    const suitable = [];
    
    Object.entries(CONFIG.VEHICLE_CAPACITY).forEach(([vehicle, capacity]) => {
      const peopleOk = totalPeople <= capacity.people;
      const luggageOk = !considerLuggage || totalLuggage <= capacity.luggage;
      
      if (peopleOk && luggageOk) {
        suitable.push(vehicle);
      }
    });
    
    return suitable;
  },
  
  // 判斷是否需要多台車
  needMultipleVehicles(adults, kids, luggage) {
    const totalPeople = adults + kids;
    
    // 超過18人一定需要多台
    if (totalPeople > 18) {
      return true;
    }
    
    // 10人以上可能需要10+7
    if (totalPeople >= 10 && luggage > 7) {
      return true;
    }
    
    return false;
  },
  
  // 格式化人數顯示
  formatPeople(adults, kids, kidsAges) {
    let result = `${adults}大`;
    
    if (kids > 0) {
      const agesStr = kidsAges.map(age => `${age}歲`).join('+');
      result += `${kids}小(${agesStr})`;
    }
    
    return result;
  },
  
  // 格式化行李顯示
  formatLuggage(luggage, stroller, carryOn) {
    const parts = [`${luggage}件`];
    
    if (stroller > 0) {
      parts.push(`${stroller}推車`);
    }
    if (carryOn > 0) {
      parts.push(`${carryOn}登機箱`);
    }
    
    return parts.join('+');
  }
};
