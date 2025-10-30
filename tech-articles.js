(function(){
// 固定内置技术文章源
const sources = [
  { id: 'infoq', title: 'InfoQ', url: 'https://www.infoq.com/cn/feed/' },
  { id: 'juejin', title: '掘金（前端）', url: 'https://rsshub.app/juejin/category/frontend' },
  { id: 'csdn', title: 'CSDN', url: 'https://rsshub.app/csdn/home' },
  { id: 'zhihu', title: '知乎专栏', url: 'https://www.zhihu.com/rss' },
  { id: 'segmentfault', title: 'SegmentFault', url: 'https://segmentfault.com/feed' },
];
const HISTORY_KEY = 'tech_articles_history_v1';
const CURRENT_KEY = 'tech_articles_current_source_v1';
function loadHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)||'{}');
}
function saveHistory(obj) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(obj));
}
function loadCurrentSourceId() {
  return localStorage.getItem(CURRENT_KEY)||sources[0].id;
}
function saveCurrentSourceId(fid) {
  localStorage.setItem(CURRENT_KEY,fid||'');
}
function parseRSS(xml) {
  const doc = (new window.DOMParser()).parseFromString(xml, 'text/xml');
  const items = Array.from(doc.querySelectorAll('item'));
  return items.map(node => ({
    title: node.querySelector('title')?.textContent || '',
    url: node.querySelector('link')?.textContent || '',
    author: node.querySelector('author')?.textContent || node.querySelector('dc\\:creator')?.textContent || '',
    summary: node.querySelector('description')?.textContent || '',
    publishedAt: node.querySelector('pubDate')?.textContent || '',
    guid: node.querySelector('guid')?.textContent || node.querySelector('link')?.textContent || '',
  }));
}
const TechArticles = {
  articles: [],
  history: {},
  currentSourceId: '',
  isLoading: false,
  root: null,
  init(containerSelector) {
    this.root = document.querySelector(containerSelector);
    this.history = loadHistory();
    this.currentSourceId = loadCurrentSourceId();
    this.render();
  },
  render() {
    if (!this.root) return;
    this.root.innerHTML = this.renderLayout();
    this.initEvents();
    this.renderList();
  },
  renderLayout() {
    return `<section class="card news-card"><div class="card-header">
      <h3>技术文章</h3>
      <div class="card-actions">
        <select class="news-source" id="ta-feed-select" title="选择来源">
          ${sources.map(f=>`<option value="${f.id}"${f.id===this.currentSourceId?' selected':''}>${f.title}</option>`).join('')}
        </select>
        <button class="btn-refresh-tech" title="刷新">⟳</button>
      </div>
    </div>
    <div class="news-body">
      <ul class="news-list" id="ta-news-list" aria-label="最新技术文章"></ul>
      <div id="ta-empty" class="empty-state" style="display:none;">
        <div class="empty-icon">📝</div>
        <div class="empty-text">暂无技术文章</div>
        <div class="empty-hint">稍后再试或切换来源</div>
      </div>
    </div>
    </section>`;
  },
  async renderList() {
    const ul = this.root.querySelector('#ta-news-list');
    const empty = this.root.querySelector('#ta-empty');
    ul.innerHTML = '';
    empty.style.display = 'none';
    this.isLoading = true;
    const curr = sources.find(f=>f.id===this.currentSourceId);
    let all = [];
    if(curr){
      try{
        const res = await fetch(curr.url);
        const txt = await res.text();
        let items = parseRSS(txt).map(it => {
          it.feedId = curr.id;
          return it;
        });
        all = items;
      }catch(e){ }
    }
    this.articles = all;
    this.isLoading = false;
    if (!all.length) {
      empty.style.display = '';
      return;
    }
    ul.innerHTML = all.map(this.renderItem.bind(this)).join('');
    ul.querySelectorAll('.ta-item').forEach(li=>{
      li.querySelector('.ta-read')?.addEventListener('click',(e)=>{
        e.stopPropagation();
        this.markRead(li.dataset.guid,true);
      });
      li.querySelector('.ta-star')?.addEventListener('click',(e)=>{
        e.stopPropagation();
        this.toggleStar(li.dataset.guid);
      });
    });
  },
  renderItem(item) {
    const h = this.history[item.guid]||{};
    // 新闻样式复用：标题/data-tooltip浮层/作者与feed
    let tooltip = item.summary ? item.summary.replace(/<.*?>/g,'').slice(0,280) : '';
    let authorStr = '';
    if(item.author) authorStr += item.author;
    if(item.publishedAt) authorStr += (authorStr ? ' · ' : '') + item.publishedAt.slice(0,16);
    const currSource = sources.find(f=>f.id === item.feedId);
    if(currSource) authorStr += (authorStr ? ' · ' : '') + currSource.title;
    return `<li class="ta-item">
      <a href="${item.url}" class="news-title" data-tooltip="${tooltip}" target="_blank" rel="noopener">
        ${item.title}
      </a>
      <span class="news-site">${authorStr}</span>
      <button class="ta-read" title="标记为已读">👁</button>
      <button class="ta-star" title="收藏">${h.star?'⭐':'☆'}</button> 
    </li>`;
  },
  markRead(guid, v) {
    this.history[guid] = this.history[guid]||{};
    this.history[guid].read = !!v;
    saveHistory(this.history);
    this.renderList();
  },
  toggleStar(guid) {
    this.history[guid] = this.history[guid]||{};
    this.history[guid].star = !this.history[guid].star;
    saveHistory(this.history);
    this.renderList();
  },
  initEvents() {
    this.root.querySelector('.btn-refresh-tech')?.addEventListener('click',()=>{
      this.renderList();
    });
    this.root.querySelector('#ta-feed-select')?.addEventListener('change',(e)=>{
      this.currentSourceId = e.target.value;
      saveCurrentSourceId(this.currentSourceId);
      this.renderList();
    });
  },
};
window.TechArticles = TechArticles;
document.addEventListener('DOMContentLoaded',function(){
  var el=document.querySelector('#tech-articles-box');
  if(window.TechArticles&&el){
    window.TechArticles.init('#tech-articles-box');
  }
});
})();
