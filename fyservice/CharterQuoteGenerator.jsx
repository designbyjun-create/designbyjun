import React, { useState, useEffect } from 'react';

export default function CharterQuoteGenerator() {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    adults: 2,
    kids: 0,
    luggage: 2,
    origin: '',
    destination: '',
    time: '',
    useTime: false
  });

  const [preview, setPreview] = useState('');

  useEffect(() => {
    updatePreview();
  }, [formData]);

  const updatePreview = () => {
    const { date, adults, kids, luggage, origin, destination, time, useTime } = formData;
    
    let output = '';
    
    // 日期
    if (date) {
      const d = new Date(date);
      const formatted = `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
      output += `日期：${formatted}\n`;
    }
    
    // 人數
    if (adults > 0 || kids > 0) {
      output += `人數：${adults}大`;
      if (kids > 0) output += `${kids}小`;
      output += '\n';
    }
    
    // 行李
    if (luggage > 0) {
      output += `行李：${luggage}件\n`;
    }
    
    // 行程
    if (origin && destination) {
      output += '行程：\n';
      if (useTime && time) {
        output += `${time} `;
      }
      output += `${origin}至${destination}-單程`;
    }
    
    setPreview(output || '請填寫左側資訊，預覽將即時更新');
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCounter = (field, delta) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

  const copyToClipboard = () => {
    if (preview.includes('請填寫')) {
      alert('請先完成資料填寫');
      return;
    }
    navigator.clipboard.writeText(preview).then(() => {
      alert('✓ 已複製到剪貼簿');
    });
  };

  const reset = () => {
    if (window.confirm('確定要重置所有資料嗎？')) {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        adults: 2,
        kids: 0,
        luggage: 2,
        origin: '',
        destination: '',
        time: '',
        useTime: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <header className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">包車行程報價產生器</h1>
        <button
          onClick={reset}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          🔄 重置
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* 左側編輯區 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 基本資訊 */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-blue-900">📅 基本資訊</h2>
            </div>
            <div className="p-6 space-y-6">
              {/* 日期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="h-px bg-gray-200" />

              {/* 人數 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">👥 人數</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">大人</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCounter('adults', -1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={formData.adults}
                        onChange={(e) => handleChange('adults', parseInt(e.target.value) || 0)}
                        className="w-16 text-center px-2 py-1 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={() => handleCounter('adults', 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">小孩</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCounter('kids', -1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition font-bold"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={formData.kids}
                        onChange={(e) => handleChange('kids', parseInt(e.target.value) || 0)}
                        className="w-16 text-center px-2 py-1 border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={() => handleCounter('kids', 1)}
                        className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-200" />

              {/* 行李 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">🧳 行李</label>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">行李件數</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCounter('luggage', -1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition font-bold"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={formData.luggage}
                      onChange={(e) => handleChange('luggage', parseInt(e.target.value) || 0)}
                      className="w-16 text-center px-2 py-1 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => handleCounter('luggage', 1)}
                      className="w-8 h-8 border border-gray-300 rounded-lg hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 transition font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 行程編輯 */}
          <section className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-blue-50 px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-blue-900">🗺️ 行程編輯</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={formData.useTime}
                    onChange={(e) => handleChange('useTime', e.target.checked)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">指定時間</span>
                </label>
                {formData.useTime && (
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleChange('time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">起點</label>
                <input
                  type="text"
                  value={formData.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                  placeholder="例：成田機場"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">終點</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  placeholder="例：東京市區"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </section>
        </div>

        {/* 右側預覽區 */}
        <div className="lg:col-span-3">
          <section className="bg-white rounded-lg shadow-md overflow-hidden sticky top-4">
            <div className="bg-white px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">📄 即時預覽</h2>
            </div>
            <div className="p-6">
              <pre className="font-mono text-sm leading-relaxed text-gray-900 whitespace-pre-wrap min-h-[200px]">
                {preview}
              </pre>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={copyToClipboard}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-base shadow-sm"
              >
                📋 複製格式
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
