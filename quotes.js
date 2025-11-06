// 名言列表数据文件
// 这里可以添加大量的自定义名言数据

const quotes = [
  { content: '平时多关注岗位需求，让职业规划与市场趋势同步。', author: '提醒你' },
  { content: '技术是基础，但销售意识决定高度。不要只埋头写代码，要学会用专业的语言和作品展示价值。', author: '提醒你' },
  { content: '每完成一件事情，及时总结与沉淀。不要做过就忘，让每一次经历都成为成长的积累。', author: '提醒你' },
];

// 导出名言列表
if (typeof module !== 'undefined' && module.exports) {
  module.exports = quotes;
} else if (typeof window !== 'undefined') {
  window.quotes = quotes;
}