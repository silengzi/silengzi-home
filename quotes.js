// 名言列表数据文件
// 这里可以添加大量的自定义名言数据

const quotes = [
  { content: '平时多关注岗位需求，让职业规划与市场趋势同步。', author: '提醒你' }
  // 可以继续添加更多名言...
];

// 导出名言列表
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quotes;
} else if (typeof window !== 'undefined') {
  window.quotes = quotes;
}