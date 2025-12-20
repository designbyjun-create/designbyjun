// formatter.js
// 格式產生器

const Formatter = {
  // 格式化日期
  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  },
  
  // 格式化日期範圍
  formatDateRange(startDate, endDate) {
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);
    
    if (start === end) {
      return start;
    }
    
    return `${start}-${end}`;
  },
  
  // 格式化單日行程
  formatSingleDayTrip(data, dayData) {
    const parts = [];
    
    // 時間
    if (dayData.time) {
      parts.push(dayData.time);
    }
    
    // 行程內容
    const tripContent = this.formatTripContent(dayData);
    if (tripContent) {
      parts.push(tripContent);
    }
    
    // 車款
    if (dayData.vehicle) {
      parts.push(`(${dayData.vehicle})`);
    }
    
    return parts.join(' ');
  },
  
  // 格式化多日行程
  formatMultiDayTrip(data, daysData) {
    const lines = [];
    
    daysData.forEach((dayData, index) => {
      const dateStr = this.getDateForDay(data.startDate, index);
      const monthDay = dateStr.split('/').slice(1).join('/'); // MM/DD
      
      const parts = [monthDay];
      
      // 時間
      if (dayData.time) {
        parts.push(dayData.time);
      }
      
      // 行程內容
      const tripContent = this.formatTripContent(dayData);
      if (tripContent) {
        parts.push(tripContent);
      }
      
      // 車款
      if (dayData.vehicle) {
        parts.push(`(${dayData.vehicle})`);
      }
      
      lines.push(parts.join(' '));
    });
    
    return lines.join('\n');
  },
  
  // 格式化行程內容
  formatTripContent(dayData) {
    const { tripType, origin, destination, spots, themePark, hours, overnight, overnightLocation } = dayData;
    
    let content = '';
    
    // 起點
    let startPoint = overnight && overnight.isPrevious ? `*宿${origin}` : origin;
    
    switch (tripType) {
      case 'oneway':
        // 單程：起點至終點-單程
        content = `${startPoint}至${destination}-單程`;
        break;
        
      case 'roundtrip':
        // 往返一日遊：起點往返景點>景點一日遊(Xh)
        const spotsStr = spots && spots.length > 0 ? spots.join('>') : '';
        content = `${startPoint}往返${spotsStr}一日遊`;
        if (hours) {
          content += `(${hours}小時)`;
        }
        break;
        
      case 'shuttle':
        // 接送來回：起點樂園接送來回
        const park = themePark || '樂園';
        content = `${startPoint}${park}接送來回`;
        break;
    }
    
    // 過夜標註
    if (overnight && overnight.stayLocal && overnightLocation) {
      content += `*宿${overnightLocation}`;
      // 如果有時數建議，可能需要調整為10小時
    }
    
    return content;
  },
  
  // 取得特定天的日期
  getDateForDay(startDate, dayIndex) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + dayIndex);
    return this.formatDate(date.toISOString().split('T')[0]);
  },
  
  // 產生完整報價格式
  generateQuote(formData) {
    const lines = [];
    
    // 日期
    if (formData.dateType === 'single') {
      lines.push(`日期：${this.formatDate(formData.singleDate)}`);
    } else if (formData.dateType === 'multiple') {
      lines.push(`日期：${this.formatDateRange(formData.startDate, formData.endDate)}`);
    }
    
    // 人數
    const peopleStr = Calculator.formatPeople(formData.adults, formData.kids, formData.kidsAges);
    lines.push(`人數：${peopleStr}`);
    
    // 行李
    const luggageStr = Calculator.formatLuggage(formData.luggage, formData.stroller, formData.carryOn);
    lines.push(`行李：${luggageStr}`);
    
    // 汽座
    if (formData.carSeats && formData.carSeats !== '無需汽座') {
      lines.push(`汽座：${formData.carSeats}`);
    }
    
    // 車款
    if (formData.vehicles && formData.vehicles.length > 0) {
      const vehicleStr = formData.vehicles.join('/');
      lines.push(`車款：${vehicleStr}`);
    }
    
    // 行程
    lines.push('行程：');
    
    if (formData.dateType === 'single' && formData.days && formData.days.length > 0) {
      lines.push(this.formatSingleDayTrip(formData, formData.days[0]));
    } else if (formData.days && formData.days.length > 0) {
      lines.push(this.formatMultiDayTrip(formData, formData.days));
    }
    
    return lines.join('\n');
  }
};
