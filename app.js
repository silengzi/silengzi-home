(function(){
  const dom = {
    body: document.body,
    searchInput: document.getElementById('search-input'),
    searchGo: document.getElementById('search-go'),
    engineIndicator: document.getElementById('engine-indicator'),
    shortcuts: document.getElementById('shortcuts'),
    addShortcut: document.getElementById('btn-add-shortcut'),
    themeBtn: document.getElementById('btn-theme'),
    settingsBtn: document.getElementById('btn-settings'),
    settings: document.getElementById('settings'),
    wallpaperUrl: document.getElementById('wallpaper-url'),
    blurAmount: document.getElementById('blur-amount'),
    saveSettings: document.getElementById('btn-save-settings'),
    wallpaper: document.getElementById('wallpaper'),
    clock: document.getElementById('clock'),
    help: document.getElementById('help'),
    weatherLoc: document.getElementById('weather-location'),
    weatherTemp: document.getElementById('weather-temp'),
    weatherSummary: document.getElementById('weather-summary'),
    weatherRefresh: document.getElementById('btn-refresh-weather'),
    quote: document.getElementById('quote'),
    quoteFrom: document.getElementById('quote-from'),
    quoteRefresh: document.getElementById('btn-refresh-quote'),
    
    shortcutTpl: document.getElementById('shortcut-item-tpl'),
    categoryTpl: document.getElementById('category-item-tpl'),
    // 新增的DOM元素
    categoriesTree: document.getElementById('categories-tree'),
    addCategory: document.getElementById('btn-add-category'),
    toggleSidebar: document.getElementById('btn-toggle-sidebar'),
    gridView: document.getElementById('btn-grid-view'),
    listView: document.getElementById('btn-list-view'),
    compactView: document.getElementById('btn-compact-view'),
    sortSelect: document.getElementById('sort-select'),
    shortcutsSearch: document.getElementById('shortcuts-search'),
    filterRecent: document.getElementById('btn-filter-recent'),
    filterFrequent: document.getElementById('btn-filter-frequent'),
    filterPinned: document.getElementById('btn-filter-pinned'),
    batchMode: document.getElementById('btn-batch-mode'),
    currentCategoryTitle: document.getElementById('current-category-title'),
    shortcutsCount: document.getElementById('shortcuts-count'),
    shortcutsEmpty: document.getElementById('shortcuts-empty'),
    categoryDialog: document.getElementById('category-dialog'),
    categoryDialogTitle: document.getElementById('category-dialog-title'),
    categoryNameInput: document.getElementById('category-name-input'),
    categoryIconInput: document.getElementById('category-icon-input'),
    categoryParentSelect: document.getElementById('category-parent-select'),
    saveCategory: document.getElementById('btn-save-category'),
    deleteCategory: document.getElementById('btn-delete-category'),
    batchDialog: document.getElementById('batch-dialog'),
    batchCount: document.getElementById('batch-count'),
    batchMove: document.getElementById('btn-batch-move'),
    batchPin: document.getElementById('btn-batch-pin'),
    batchUnpin: document.getElementById('btn-batch-unpin'),
    batchDelete: document.getElementById('btn-batch-delete'),
    // HTML书签导入相关DOM
    importBookmarks: document.getElementById('btn-import-bookmarks'),
    bookmarkImportDialog: document.getElementById('bookmark-import-dialog'),
    fileDropZone: document.getElementById('file-drop-zone'),
    bookmarkFileInput: document.getElementById('bookmark-file-input'),
    fileInfo: document.getElementById('file-info'),
    fileName: document.getElementById('file-name'),
    fileSize: document.getElementById('file-size'),
    importPreview: document.getElementById('import-preview'),
    bookmarkCount: document.getElementById('bookmark-count'),
    categoryCount: document.getElementById('category-count'),
    duplicateCount: document.getElementById('duplicate-count'),
    mappingList: document.getElementById('mapping-list'),
    duplicateStrategy: document.getElementById('duplicate-strategy'),
    autoCreateCategories: document.getElementById('auto-create-categories'),
    fetchFavicons: document.getElementById('fetch-favicons'),
    generateTags: document.getElementById('generate-tags'),
    parseFile: document.getElementById('btn-parse-file'),
    startImport: document.getElementById('btn-start-import'),
    importProgress: document.getElementById('import-progress'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    importResult: document.getElementById('import-result'),
    resultSuccess: document.getElementById('result-success'),
    resultError: document.getElementById('result-error'),
    successDetails: document.getElementById('success-details'),
    errorDetails: document.getElementById('error-details'),
    clearShortcuts: document.getElementById('btn-clear-shortcuts')
  };

  const SEARCH_ENGINES = {
    default: { name: 'Google', build: q => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    g: { name: 'Google', build: q => `https://www.google.com/search?q=${encodeURIComponent(q)}` },
    b: { name: 'Bing', build: q => `https://www.bing.com/search?q=${encodeURIComponent(q)}` },
    bat: { name: '百度', build: q => `https://www.baidu.com/s?wd=${encodeURIComponent(q)}` },
    zh: { name: '知乎', build: q => `https://www.zhihu.com/search?type=content&q=${encodeURIComponent(q)}` },
    so: { name: 'StackOverflow', build: q => `https://stackoverflow.com/search?q=${encodeURIComponent(q)}` },
    gh: { name: 'GitHub', build: q => `https://github.com/search?q=${encodeURIComponent(q)}` },
    npm: { name: 'npm', build: q => `https://www.npmjs.com/search?q=${encodeURIComponent(q)}` }
  };

  const STORAGE_KEYS = {
    shortcuts: 'jike.shortcuts.v2',
    categories: 'jike.categories.v2',
    settings: 'jike.settings.v2',
    weather: 'jike.weather.v2',
    quote: 'jike.quote.v1'
  };

  const DEFAULT_CATEGORIES = [
    { id: 'work', name: '工作', icon: '💼', color: '#3b82f6', parentId: null, order: 0 },
    { id: 'dev', name: '开发', icon: '💻', color: '#10b981', parentId: null, order: 1 },
    { id: 'tools', name: '工具', icon: '🔧', color: '#f59e0b', parentId: null, order: 2 },
    { id: 'entertainment', name: '娱乐', icon: '🎮', color: '#ef4444', parentId: null, order: 3 }
  ];

  const DEFAULT_SHORTCUTS = [
    { id: 'gh', title: 'GitHub', url: 'https://github.com', icon: '🐙', categoryId: 'dev', tags: ['代码', '开源'], order: 0, pinned: false, visitCount: 0, lastVisited: null },
    { id: 'so', title: 'StackOverflow', url: 'https://stackoverflow.com', icon: '🧠', categoryId: 'dev', tags: ['问答', '编程'], order: 1, pinned: false, visitCount: 0, lastVisited: null },
    { id: 'g', title: 'Google', url: 'https://www.google.com', icon: '🔎', categoryId: 'tools', tags: ['搜索'], order: 0, pinned: true, visitCount: 0, lastVisited: null },
    { id: 'yt', title: 'YouTube', url: 'https://www.youtube.com', icon: '▶️', categoryId: 'entertainment', tags: ['视频', '娱乐'], order: 0, pinned: false, visitCount: 0, lastVisited: null },
    { id: 'npm', title: 'npm', url: 'https://www.npmjs.com', icon: '📦', categoryId: 'dev', tags: ['包管理', 'Node.js'], order: 2, pinned: false, visitCount: 0, lastVisited: null },
    { id: 'mdn', title: 'MDN', url: 'https://developer.mozilla.org', icon: '📚', categoryId: 'dev', tags: ['文档', 'Web'], order: 3, pinned: false, visitCount: 0, lastVisited: null }
  ];

  const state = {
    shortcuts: loadJson(STORAGE_KEYS.shortcuts, DEFAULT_SHORTCUTS),
    categories: loadJson(STORAGE_KEYS.categories, DEFAULT_CATEGORIES),
    settings: loadJson(STORAGE_KEYS.settings, { theme: 'dark', wallpaperUrl: '', blur: 0, mono: false }),
    weather: loadJson(STORAGE_KEYS.weather, { lat: null, lon: null, city: '', lastLocationTime: 0, last: 0, data: null }),
    ui: {
      currentCategory: null,
      viewMode: 'grid',
      sortBy: 'manual',
      searchQuery: '',
      activeFilters: [],
      batchMode: false,
      selectedShortcuts: new Set()
    }
  };

  // Init
  applyTheme(state.settings.theme);
  applyWallpaper(state.settings.wallpaperUrl, state.settings.blur);
  applyMono(state.settings.mono);
  updateEngineIndicator('default');
  renderCategories();
  renderShortcuts();
  tickClock();
  setInterval(tickClock, 1000);
  refreshQuote();
  locateAndLoadWeather();

  // Events
  dom.searchGo.addEventListener('click', handleSearch);
  dom.searchInput.addEventListener('keydown', e => { if(e.key==='Enter'){ handleSearch(); }});
  dom.searchInput.addEventListener('input', updateEngineHint);
  dom.addShortcut.addEventListener('click', onAddShortcut);
  dom.themeBtn.addEventListener('click', toggleTheme);
  dom.settingsBtn.addEventListener('click', () => dom.settings.showModal());
  dom.saveSettings.addEventListener('click', saveSettings);
  dom.clearShortcuts.addEventListener('click', clearAllShortcuts);
  document.addEventListener('keydown', handleHotkeys);
  dom.weatherRefresh.addEventListener('click', () => locateAndLoadWeather(true));
  dom.quoteRefresh.addEventListener('click', refreshQuote);
  
  
  // 分类管理事件
  dom.addCategory.addEventListener('click', () => openCategoryDialog());
  dom.saveCategory.addEventListener('click', saveCategory);
  dom.deleteCategory.addEventListener('click', deleteCategory);
  
  // 视图和排序事件
  dom.gridView.addEventListener('click', () => setViewMode('grid'));
  dom.listView.addEventListener('click', () => setViewMode('list'));
  dom.compactView.addEventListener('click', () => setViewMode('compact'));
  dom.sortSelect.addEventListener('change', (e) => setSortBy(e.target.value));
  
  // 搜索和过滤事件
  dom.shortcutsSearch.addEventListener('input', (e) => setSearchQuery(e.target.value));
  dom.filterRecent.addEventListener('click', () => toggleFilter('recent'));
  dom.filterFrequent.addEventListener('click', () => toggleFilter('frequent'));
  dom.filterPinned.addEventListener('click', () => toggleFilter('pinned'));
  
  // 批量操作事件
  dom.batchMode.addEventListener('click', toggleBatchMode);
  dom.batchMove.addEventListener('click', batchMoveToCategory);
  dom.batchPin.addEventListener('click', batchPin);
  dom.batchUnpin.addEventListener('click', batchUnpin);
  dom.batchDelete.addEventListener('click', batchDelete);
  
  // HTML书签导入事件
  dom.importBookmarks.addEventListener('click', () => dom.bookmarkImportDialog.showModal());
  dom.fileDropZone.addEventListener('click', () => dom.bookmarkFileInput.click());
  dom.bookmarkFileInput.addEventListener('change', handleFileSelect);
  dom.fileDropZone.addEventListener('dragover', handleDragOver);
  dom.fileDropZone.addEventListener('dragleave', handleDragLeave);
  dom.fileDropZone.addEventListener('drop', handleFileDrop);
  dom.parseFile.addEventListener('click', parseBookmarkFile);
  dom.startImport.addEventListener('click', startBookmarkImport);

  // Search
  function parsePrefixQuery(input){
    const m = input.match(/^([a-z]{1,4}):\s*(.*)$/i);
    if(!m){ return { key:'default', q: input.trim() }; }
    const key = m[1].toLowerCase();
    const q = m[2];
    return { key: SEARCH_ENGINES[key] ? key : 'default', q };
  }

  function updateEngineHint(){
    const { key } = parsePrefixQuery(dom.searchInput.value);
    const engine = SEARCH_ENGINES[key] || SEARCH_ENGINES.default;
    dom.engineIndicator.textContent = `默认：${engine.name}`;
  }

  function updateEngineIndicator(engineKey){
    const engine = SEARCH_ENGINES[engineKey] || SEARCH_ENGINES.default;
    dom.engineIndicator.textContent = `默认：${engine.name}`;
  }

  function handleSearch(){
    const value = dom.searchInput.value.trim();
    if(!value){ dom.searchInput.focus(); return; }
    if(value.startsWith('>')){ handleCommand(value.slice(1).trim()); return; }
    const { key, q } = parsePrefixQuery(value);
    const engine = SEARCH_ENGINES[key] || SEARCH_ENGINES.default;
    const url = engine.build(q || '');
    const newTab = lastCtrlEnter ? true : false;
    lastCtrlEnter = false;
    if(newTab){ window.open(url, '_blank', 'noopener'); }
    else { window.location.href = url; }
  }

  // Categories Management
  function renderCategories(){
    dom.categoriesTree.innerHTML = '';
    
    // 添加"所有分类"选项
    const allItem = createCategoryNode({ id: null, name: '所有', icon: '📂', count: state.shortcuts.length });
    allItem.classList.add('active');
    dom.categoriesTree.appendChild(allItem);
    
    // 渲染分类树
    const sortedCategories = [...state.categories].sort((a, b) => a.order - b.order);
    sortedCategories.forEach(category => {
      const count = state.shortcuts.filter(s => s.categoryId === category.id).length;
      const categoryNode = createCategoryNode({ ...category, count });
      dom.categoriesTree.appendChild(categoryNode);
    });
    
    enableCategoryDnD();
  }

  function createCategoryNode(category){
    const div = document.importNode(dom.categoryTpl.content, true).firstElementChild;
    const content = div.querySelector('.category-content');
    const icon = content.querySelector('.category-icon');
    const name = content.querySelector('.category-name');
    const count = content.querySelector('.category-count');
    const menu = div.querySelector('.category-menu');
    
    icon.textContent = category.icon || '📁';
    name.textContent = category.name;
    count.textContent = category.count || 0;
    
    div.dataset.id = category.id;
    
    // 点击选择分类
    div.addEventListener('click', (e) => {
      if (e.target !== menu) {
        selectCategory(category.id);
      }
    });
    
    // 右键菜单
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      openCategoryDialog(category.id);
    });
    
    return div;
  }

  function selectCategory(categoryId){
    // 更新UI状态
    state.ui.currentCategory = categoryId;
    
    // 更新侧边栏选中状态
    dom.categoriesTree.querySelectorAll('.category-item').forEach(item => {
      item.classList.remove('active');
    });
    const selectedItem = dom.categoriesTree.querySelector(`[data-id="${categoryId || ''}"]`);
    if (selectedItem) {
      selectedItem.classList.add('active');
    }
    
    // 更新标题
    const category = categoryId ? state.categories.find(c => c.id === categoryId) : null;
    dom.currentCategoryTitle.textContent = category ? category.name : '所有快捷方式';
    
    // 重新渲染快捷方式
    renderShortcuts();
  }

  function openCategoryDialog(categoryId = null){
    const isEdit = categoryId !== null;
    const category = isEdit ? state.categories.find(c => c.id === categoryId) : null;
    
    dom.categoryDialogTitle.textContent = isEdit ? '编辑分类' : '新建分类';
    dom.categoryNameInput.value = category ? category.name : '';
    dom.categoryIconInput.value = category ? category.icon : '📁';
    
    // 更新父分类选择
    updateParentCategorySelect(categoryId);
    
    // 显示/隐藏删除按钮
    dom.deleteCategory.style.display = isEdit ? 'block' : 'none';
    
    // 存储当前编辑的分类ID
    dom.categoryDialog.dataset.editingId = categoryId || '';
    
    dom.categoryDialog.showModal();
  }

  function updateParentCategorySelect(excludeId = null){
    dom.categoryParentSelect.innerHTML = '<option value="">无（顶级分类）</option>';
    
    state.categories
      .filter(c => c.id !== excludeId) // 排除自己
      .sort((a, b) => a.order - b.order)
      .forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        dom.categoryParentSelect.appendChild(option);
      });
  }

  function saveCategory(){
    const name = dom.categoryNameInput.value.trim();
    const icon = dom.categoryIconInput.value.trim() || '📁';
    const parentId = dom.categoryParentSelect.value || null;
    const editingId = dom.categoryDialog.dataset.editingId;
    
    if (!name) {
      notify('请输入分类名称');
      return;
    }
    
    if (editingId) {
      // 编辑现有分类
      const category = state.categories.find(c => c.id === editingId);
      if (category) {
        category.name = name;
        category.icon = icon;
        category.parentId = parentId;
        persist(STORAGE_KEYS.categories, state.categories);
        renderCategories();
        renderShortcuts();
      }
    } else {
      // 创建新分类
      const id = `cat-${Date.now()}`;
      const newCategory = {
        id,
        name,
        icon,
        color: '#6b7280',
        parentId,
        order: state.categories.length
      };
      
      state.categories.push(newCategory);
      persist(STORAGE_KEYS.categories, state.categories);
      renderCategories();
    }
    
    dom.categoryDialog.close();
  }

  function deleteCategory(){
    const editingId = dom.categoryDialog.dataset.editingId;
    if (!editingId) return;
    
    if (!confirm('确定要删除这个分类吗？分类下的快捷方式将移动到"未分类"。')) {
      return;
    }
    
    // 将分类下的快捷方式移动到未分类
    state.shortcuts.forEach(shortcut => {
      if (shortcut.categoryId === editingId) {
        shortcut.categoryId = null;
      }
    });
    
    // 删除分类
    state.categories = state.categories.filter(c => c.id !== editingId);
    
    persist(STORAGE_KEYS.categories, state.categories);
    persist(STORAGE_KEYS.shortcuts, state.shortcuts);
    
    renderCategories();
    renderShortcuts();
    dom.categoryDialog.close();
  }

  function enableCategoryDnD(){
    // 实现分类拖拽排序
    let draggingCategoryId = null;
    
    dom.categoriesTree.querySelectorAll('.category-item').forEach(item => {
      item.addEventListener('dragstart', e => {
        draggingCategoryId = item.dataset.id;
        e.dataTransfer.effectAllowed = 'move';
      });
      
      item.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      
      item.addEventListener('drop', e => {
        e.preventDefault();
        const targetId = item.dataset.id;
        if (!draggingCategoryId || draggingCategoryId === targetId) return;
        
        // 重新排序分类
        const fromIndex = state.categories.findIndex(c => c.id === draggingCategoryId);
        const toIndex = state.categories.findIndex(c => c.id === targetId);
        
        if (fromIndex !== -1 && toIndex !== -1) {
          const [movedCategory] = state.categories.splice(fromIndex, 1);
          state.categories.splice(toIndex, 0, movedCategory);
          
          // 更新order
          state.categories.forEach((category, index) => {
            category.order = index;
          });
          
          persist(STORAGE_KEYS.categories, state.categories);
          renderCategories();
        }
      });
    });
  }

  // Shortcuts
  function renderShortcuts(){
    const filteredShortcuts = getFilteredShortcuts();
    dom.shortcuts.innerHTML = '';
    
    if (filteredShortcuts.length === 0) {
      dom.shortcutsEmpty.style.display = 'block';
      dom.shortcutsCount.textContent = '0 个';
    } else {
      dom.shortcutsEmpty.style.display = 'none';
      dom.shortcutsCount.textContent = `${filteredShortcuts.length} 个`;
      
      filteredShortcuts.forEach(sc => {
        dom.shortcuts.appendChild(createShortcutNode(sc));
      });
    }
    
    enableDnD();
  }

  function createShortcutNode(sc){
    const li = document.importNode(dom.shortcutTpl.content, true).firstElementChild;
    const link = li.querySelector('.shortcut-link');
    const checkbox = li.querySelector('.shortcut-select');
    const pinBtn = li.querySelector('.shortcut-pin');
    const menu = li.querySelector('.shortcut-menu');
    const visitCount = li.querySelector('.visit-count');
    const lastVisited = li.querySelector('.last-visited');

    // 设置链接
    link.href = sc.url;

    // 确保有有效的标题，如果没有则使用URL的域名
    let displayTitle = sc.title;
    if (!displayTitle || displayTitle.trim() === '') {
      try {
        const u = new URL(sc.url);
        displayTitle = u.hostname.replace('www.', '');
      } catch {
        displayTitle = sc.url;
      }
    }

    // 构建内容（favicon + 标题），带错误兜底
    link.textContent = '';
    const iconWrap = document.createElement('span');
    iconWrap.className = 'shortcut-icon';
    const titleSpan = document.createElement('span');
    titleSpan.className = 'shortcut-title';
    titleSpan.textContent = displayTitle;

    let faviconUrl = sc.iconUrl || sc.favicon || '';
    if(!faviconUrl){
      faviconUrl = getFaviconUrl(sc.url);
    }

    const fallbackEmoji = sc.icon || '🔗';
    if(faviconUrl){
      const img = document.createElement('img');
      img.className = 'shortcut-icon-img';
      img.alt = '';
      img.decoding = 'async';
      img.referrerPolicy = 'no-referrer';
      img.src = faviconUrl;
      img.onerror = () => {
        iconWrap.textContent = fallbackEmoji;
        img.remove();
      };
      iconWrap.appendChild(img);
    } else {
      iconWrap.textContent = fallbackEmoji;
    }

    link.appendChild(iconWrap);
    link.appendChild(titleSpan);
    link.title = sc.url;
    
    // 设置统计信息
    visitCount.textContent = sc.visitCount || 0;
    lastVisited.textContent = sc.lastVisited ? formatDate(sc.lastVisited) : '--';
    
    // 设置置顶状态
    if (sc.pinned) {
      pinBtn.classList.add('pinned');
    }
    
    // 设置数据属性
    li.dataset.id = sc.id;
    
    // 事件监听
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        state.ui.selectedShortcuts.add(sc.id);
      } else {
        state.ui.selectedShortcuts.delete(sc.id);
      }
      updateBatchUI();
    });
    
    pinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      togglePin(sc.id);
    });
    
    menu.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      openShortcutMenu(sc.id);
    });
    
    // 点击链接时记录访问
    link.addEventListener('click', () => {
      recordVisit(sc.id);
    });
    
    return li;
  }

  function getFilteredShortcuts(){
    let shortcuts = [...state.shortcuts];
    
    // 按分类过滤
    if (state.ui.currentCategory !== null) {
      shortcuts = shortcuts.filter(s => s.categoryId === state.ui.currentCategory);
    }
    
    // 按搜索查询过滤
    if (state.ui.searchQuery) {
      const query = state.ui.searchQuery.toLowerCase();
      shortcuts = shortcuts.filter(s => 
        s.title.toLowerCase().includes(query) ||
        s.url.toLowerCase().includes(query) ||
        (s.tags && s.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }
    
    // 按过滤器过滤
    state.ui.activeFilters.forEach(filter => {
      switch (filter) {
        case 'recent':
          shortcuts = shortcuts.filter(s => s.lastVisited && isRecent(s.lastVisited));
          break;
        case 'frequent':
          shortcuts = shortcuts.filter(s => s.visitCount > 0);
          break;
        case 'pinned':
          shortcuts = shortcuts.filter(s => s.pinned);
          break;
      }
    });
    
    // 排序
    shortcuts.sort((a, b) => {
      switch (state.ui.sortBy) {
        case 'recent':
          return (b.lastVisited || 0) - (a.lastVisited || 0);
        case 'frequent':
          return (b.visitCount || 0) - (a.visitCount || 0);
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'manual':
        default:
          return (a.order || 0) - (b.order || 0);
      }
    });
    
    return shortcuts;
  }

  function recordVisit(shortcutId){
    const shortcut = state.shortcuts.find(s => s.id === shortcutId);
    if (shortcut) {
      shortcut.visitCount = (shortcut.visitCount || 0) + 1;
      shortcut.lastVisited = new Date().toISOString();
      persist(STORAGE_KEYS.shortcuts, state.shortcuts);
    }
  }

  function togglePin(shortcutId){
    const shortcut = state.shortcuts.find(s => s.id === shortcutId);
    if (shortcut) {
      shortcut.pinned = !shortcut.pinned;
      persist(STORAGE_KEYS.shortcuts, state.shortcuts);
      renderShortcuts();
    }
  }

  function formatDate(dateString){
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return '今天';
    if (diffDays === 1) return '昨天';
    if (diffDays < 7) return `${diffDays}天前`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`;
    return `${Math.floor(diffDays / 30)}月前`;
  }

  function getHostname(input){
    try{ return new URL(input).hostname.replace(/^www\./,''); }catch(_){ return ''; }
  }

  function getFaviconUrl(input){
    const host = getHostname(input);
    if(!host) return '';
    return `https://www.google.com/s2/favicons?sz=64&domain=${host}`;
  }

  function isRecent(dateString){
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  }

  // View and Filter Functions
  function setViewMode(mode){
    state.ui.viewMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${mode}-view`).classList.add('active');
    
    // 更新CSS类
    dom.shortcuts.className = `shortcuts-grid ${mode}-view`;
    
    renderShortcuts();
  }

  function setSortBy(sortBy){
    state.ui.sortBy = sortBy;
    renderShortcuts();
  }

  function setSearchQuery(query){
    state.ui.searchQuery = query;
    renderShortcuts();
  }

  function toggleFilter(filter){
    const index = state.ui.activeFilters.indexOf(filter);
    if (index > -1) {
      state.ui.activeFilters.splice(index, 1);
      document.getElementById(`btn-filter-${filter}`).classList.remove('active');
    } else {
      state.ui.activeFilters.push(filter);
      document.getElementById(`btn-filter-${filter}`).classList.add('active');
    }
    renderShortcuts();
  }

  // Batch Operations
  function toggleBatchMode(){
    state.ui.batchMode = !state.ui.batchMode;
    
    // 更新按钮状态
    dom.batchMode.classList.toggle('active', state.ui.batchMode);
    
    // 显示/隐藏复选框
    const checkboxes = document.querySelectorAll('.shortcut-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.style.display = state.ui.batchMode ? 'block' : 'none';
    });
    
    // 清空选择
    state.ui.selectedShortcuts.clear();
    updateBatchUI();
  }

  function updateBatchUI(){
    const count = state.ui.selectedShortcuts.size;
    dom.batchCount.textContent = `已选择 ${count} 个项目`;
    
    // 启用/禁用批量操作按钮
    const batchButtons = [dom.batchMove, dom.batchPin, dom.batchUnpin, dom.batchDelete];
    batchButtons.forEach(btn => {
      btn.disabled = count === 0;
    });
  }

  function batchMoveToCategory(){
    if (state.ui.selectedShortcuts.size === 0) return;
    
    // 创建分类选择对话框
    const categorySelect = document.createElement('select');
    categorySelect.innerHTML = '<option value="">选择分类</option>';
    state.categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
    
    if (confirm('选择目标分类：\n' + categorySelect.outerHTML)) {
      const targetCategoryId = categorySelect.value;
      state.ui.selectedShortcuts.forEach(shortcutId => {
        const shortcut = state.shortcuts.find(s => s.id === shortcutId);
        if (shortcut) {
          shortcut.categoryId = targetCategoryId || null;
        }
      });
      
      persist(STORAGE_KEYS.shortcuts, state.shortcuts);
      renderShortcuts();
      renderCategories();
    }
  }

  function batchPin(){
    state.ui.selectedShortcuts.forEach(shortcutId => {
      const shortcut = state.shortcuts.find(s => s.id === shortcutId);
      if (shortcut) {
        shortcut.pinned = true;
      }
    });
    persist(STORAGE_KEYS.shortcuts, state.shortcuts);
    renderShortcuts();
  }

  function batchUnpin(){
    state.ui.selectedShortcuts.forEach(shortcutId => {
      const shortcut = state.shortcuts.find(s => s.id === shortcutId);
      if (shortcut) {
        shortcut.pinned = false;
      }
    });
    persist(STORAGE_KEYS.shortcuts, state.shortcuts);
    renderShortcuts();
  }

  function batchDelete(){
    if (state.ui.selectedShortcuts.size === 0) return;
    
    if (confirm(`确定要删除选中的 ${state.ui.selectedShortcuts.size} 个快捷方式吗？`)) {
      state.shortcuts = state.shortcuts.filter(s => !state.ui.selectedShortcuts.has(s.id));
      persist(STORAGE_KEYS.shortcuts, state.shortcuts);
      state.ui.selectedShortcuts.clear();
      renderShortcuts();
      renderCategories();
    }
  }

  function onAddShortcut(){
    const title = prompt('名称'); if(!title) return;
    const url = prompt('链接 (https://...)'); if(!url) return;
    const icon = prompt('图标（Emoji，可留空）') || '🔗';
    const tags = prompt('标签（用逗号分隔，可留空）') || '';
    
    const id = `sc-${Date.now()}`;
    const newShortcut = {
      id,
      title,
      url,
      icon,
      iconUrl: getFaviconUrl(url),
      categoryId: state.ui.currentCategory,
      tags: tags.split(',').map(t => t.trim()).filter(t => t),
      order: state.shortcuts.length,
      pinned: false,
      visitCount: 0,
      lastVisited: null
    };
    
    state.shortcuts.push(newShortcut);
    persist(STORAGE_KEYS.shortcuts, state.shortcuts);
    renderShortcuts();
    renderCategories();
  }

  function openShortcutMenu(id){
    const sc = state.shortcuts.find(s => s.id===id);
    if(!sc) return;
    const action = prompt('输入操作: edit / delete / move', 'edit');
    if(action==='delete'){
      if(confirm('确定要删除这个快捷方式吗？')){
        state.shortcuts = state.shortcuts.filter(s => s.id!==id);
        persist(STORAGE_KEYS.shortcuts, state.shortcuts);
        renderShortcuts();
        renderCategories();
      }
    }else if(action==='edit'){
      const title = prompt('名称', sc.title) || sc.title;
      const url = prompt('链接', sc.url) || sc.url;
      const icon = prompt('图标', sc.icon || '🔗') || sc.icon;
      const tags = prompt('标签（用逗号分隔）', (sc.tags || []).join(', ')) || '';
      Object.assign(sc, { 
        title, 
        url, 
        icon, 
        iconUrl: getFaviconUrl(url),
        tags: tags.split(',').map(t => t.trim()).filter(t => t)
      });
      persist(STORAGE_KEYS.shortcuts, state.shortcuts);
      renderShortcuts();
    }else if(action==='move'){
      // 选择分类
      const categorySelect = document.createElement('select');
      categorySelect.innerHTML = '<option value="">无分类</option>';
      state.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        if (category.id === sc.categoryId) option.selected = true;
        categorySelect.appendChild(option);
      });
      
      if (confirm('选择目标分类：\n' + categorySelect.outerHTML)) {
        sc.categoryId = categorySelect.value || null;
        persist(STORAGE_KEYS.shortcuts, state.shortcuts);
        renderShortcuts();
        renderCategories();
      }
    }
  }

  function enableDnD(){
    let draggingId = null;
    dom.shortcuts.querySelectorAll('.shortcut').forEach(el => {
      el.addEventListener('dragstart', e => {
        draggingId = el.dataset.id;
        e.dataTransfer.effectAllowed = 'move';
      });
      el.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });
      el.addEventListener('drop', () => {
        const targetId = el.dataset.id;
        if(!draggingId || draggingId===targetId) return;
        
        // 更新排序
        const from = state.shortcuts.findIndex(s => s.id===draggingId);
        const to = state.shortcuts.findIndex(s => s.id===targetId);
        
        if (from !== -1 && to !== -1) {
          const [item] = state.shortcuts.splice(from, 1);
          state.shortcuts.splice(to, 0, item);
          
          // 更新order字段
          state.shortcuts.forEach((shortcut, index) => {
            shortcut.order = index;
          });
          
          persist(STORAGE_KEYS.shortcuts, state.shortcuts);
          renderShortcuts();
        }
      });
    });
  }

  // Theme & Settings
  function applyTheme(theme){
    const root = document.documentElement;
    if(theme==='light') root.classList.add('light'); else root.classList.remove('light');
  }
  function applyMono(mono){
    if(mono) dom.body.classList.add('mono'); else dom.body.classList.remove('mono');
  }
  function toggleTheme(){
    state.settings.theme = state.settings.theme==='light' ? 'dark' : 'light';
    applyTheme(state.settings.theme);
    persist(STORAGE_KEYS.settings, state.settings);
  }
  function applyWallpaper(url, blur){
    dom.wallpaper.style.backgroundImage = url ? `url("${url}")` : 'none';
    dom.wallpaper.style.setProperty('--wp-blur', `blur(${Number(blur||0)}px)`);
  }
  function saveSettings(){
    const url = dom.wallpaperUrl.value.trim();
    const blur = Number(dom.blurAmount.value || 0);
    const mono = document.getElementById('monospace-toggle').checked;
    state.settings.wallpaperUrl = url;
    state.settings.blur = blur;
    state.settings.mono = mono;
    applyWallpaper(url, blur);
    applyMono(mono);
    persist(STORAGE_KEYS.settings, state.settings);
  }

  function clearAllShortcuts(){
    if (state.shortcuts.length === 0) {
      alert('没有快捷方式需要清空');
      return;
    }
    
    const count = state.shortcuts.length;
    const confirmMessage = `确定要清空所有 ${count} 个快捷方式吗？\n\n此操作不可撤销！`;
    
    if (confirm(confirmMessage)) {
      // 清空快捷方式数组
      state.shortcuts = [];
      
      // 保存到本地存储
      persist(STORAGE_KEYS.shortcuts, state.shortcuts);
      
      // 清空选中的快捷方式
      state.ui.selectedShortcuts.clear();
      
      // 重新渲染界面
      renderShortcuts();
      renderCategories();
      
      // 关闭设置面板
      dom.settings.close();
      
      // 显示成功消息
      notify(`已清空 ${count} 个快捷方式`);
    }
  }

  // Weather
  async function locateAndLoadWeather(forceRefresh = false){
    const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30天缓存
    const now = Date.now();
    
    // 如果不是手动刷新，且有缓存且未过期，使用缓存
    if(!forceRefresh && state.weather.lat && state.weather.lon && state.weather.lastLocationTime){
      const cacheAge = now - state.weather.lastLocationTime;
      if(cacheAge < CACHE_DURATION){
        await loadWeather(state.weather.lat, state.weather.lon, state.weather.city || '定位');
        return;
      }
    }
    
    // 需要重新获取位置（手动刷新或缓存过期）
    dom.weatherRefresh.classList.add('refreshing');
    try{
      const ipRes = await fetch('http://ip-api.com/json').then(r => r.json());
      if(ipRes.status === 'success' && ipRes.lat && ipRes.lon){
        const latitude = ipRes.lat;
        const longitude = ipRes.lon;
        const city = ipRes.city || '';
        state.weather.lat = latitude;
        state.weather.lon = longitude;
        state.weather.city = city;
        state.weather.lastLocationTime = now;
        persist(STORAGE_KEYS.weather, state.weather);
        await loadWeather(latitude, longitude, city || '定位');
      } else {
        dom.weatherLoc.textContent = '定位失败';
        dom.weatherSummary.textContent = '无法获取位置信息';
        dom.weatherRefresh.classList.remove('refreshing');
      }
    }catch(e){
      dom.weatherLoc.textContent = '定位失败';
      dom.weatherSummary.textContent = '网络错误';
      dom.weatherRefresh.classList.remove('refreshing');
    }
  }

  async function loadWeather(lat, lon, label){
    try{
      dom.weatherLoc.textContent = label || '—';
      const location = `${lon},${lat}`;
      const url = `https://mu65nn6vej.re.qweatherapi.com/v7/weather/now?location=${location}&key=483711463e24402bb13a5590e4f38fd9`;
      const data = await fetch(url).then(r=>r.json());
      if(data?.code === '200' && data?.now){
        const temp = data.now.temp;
        const text = data.now.text;
        dom.weatherTemp.textContent = temp ? `${temp}°` : '--°';
        dom.weatherSummary.textContent = text || '—';
      } else {
        dom.weatherSummary.textContent = '加载失败';
      }
    }catch(e){
      dom.weatherSummary.textContent = '加载失败';
    }finally{
      dom.weatherRefresh.classList.remove('refreshing');
    }
  }

  // Quote
  async function fetchWithTimeout(url, ms){
    const ctrl = new AbortController();
    const id = setTimeout(() => ctrl.abort(), ms);
    try{
      const res = await fetch(url, { signal: ctrl.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  }

  async function refreshQuote(){
    dom.quoteRefresh.classList.add('refreshing');
    // 显示加载状态
    dom.quote.textContent = '加载中…';
    dom.quoteFrom.textContent = '';

    // 读取本地缓存作为兜底
    const cached = loadJson(STORAGE_KEYS.quote, null);

    // 1) 首选 Quotable（英文）
    try{
      const res = await fetchWithTimeout('https://api.quotable.io/random?maxLength=120', 5000);
      if(res.ok){
        const r = await res.json();
        const content = r.content || '—';
        const author = r.author || '';
        dom.quote.textContent = content;
        dom.quoteFrom.textContent = author ? `— ${author}` : '';
        persist(STORAGE_KEYS.quote, { content, author, ts: Date.now() });
        dom.quoteRefresh.classList.remove('refreshing');
        return;
      }
    }catch(_){ /* ignore and fallback */ }

    // 2) 其次 一言（中文）
    try{
      /**
        c 的取值:
          a 动画
          b 漫画
          c 游戏
          d 文学
          e 原创
          f 来自网络
          g 其他
          h 影视
          i 诗词
          j 网易云
          k 哲学
          l 抖机灵
          其他 作为 动画 类型处理

          可选择多个分类，例如： ?c=a&c=c
       */
      // const res2 = await fetchWithTimeout('https://v1.hitokoto.cn/?c=i&encode=json', 5000);
      const res2 = await fetchWithTimeout('https://v1.hitokoto.cn/?encode=json', 5000);
      if(res2.ok){
        const r2 = await res2.json();
        const content = r2.hitokoto || '—';
        const author = r2.from || '';
        dom.quote.textContent = content;
        dom.quoteFrom.textContent = author ? `— ${author}` : '';
        persist(STORAGE_KEYS.quote, { content, author, ts: Date.now() });
        dom.quoteRefresh.classList.remove('refreshing');
        return;
      }
    }catch(_){ /* ignore and fallback */ }

    // 3) 再次兜底：使用本地缓存或内置列表
    if(cached && cached.content){
      dom.quote.textContent = cached.content;
      dom.quoteFrom.textContent = cached.author ? `— ${cached.author}` : '';
      dom.quoteRefresh.classList.remove('refreshing');
      return;
    }

    const localQuotes = [
      { content: 'Stay hungry, stay foolish.', author: 'Steve Jobs' },
      { content: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
      { content: '不积跬步，无以至千里。', author: '荀子' },
      { content: '千里之行，始于足下。', author: '老子' },
      { content: '知之者不如好之者，好之者不如乐之者。', author: '孔子' }
    ];
    const any = localQuotes[Math.floor(Math.random()*localQuotes.length)];
    dom.quote.textContent = any.content;
    dom.quoteFrom.textContent = any.author ? `— ${any.author}` : '';
    dom.quoteRefresh.classList.remove('refreshing');
  }

  

  // Clock
  function tickClock(){
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    dom.clock.textContent = `${hh}:${mm}`;
  }

  // Hotkeys & command mode
  let lastCtrlEnter = false;
  function handleHotkeys(e){
    if(e.key==='/'){ e.preventDefault(); dom.searchInput.focus(); return; }
    if(e.key==='?' && !e.ctrlKey && !e.metaKey){ e.preventDefault(); dom.help.showModal(); return; }
    if(e.key==='Enter' && (e.ctrlKey || e.metaKey)){ lastCtrlEnter = true; handleSearch(); return; }
  }

  async function handleCommand(input){
    const [cmd, ...rest] = tokenize(input);
    switch((cmd||'').toLowerCase()){
      case 'theme': {
        const v = (rest[0]||'').toLowerCase();
        if(v==='toggle' || v===''){ toggleTheme(); }
        else if(v==='light' || v==='dark'){ state.settings.theme=v; applyTheme(v); persist(STORAGE_KEYS.settings, state.settings); }
        break;
      }
      case 'wallpaper': {
        const v = rest.join(' ');
        state.settings.wallpaperUrl = (v==='none' ? '' : v);
        applyWallpaper(state.settings.wallpaperUrl, state.settings.blur);
        persist(STORAGE_KEYS.settings, state.settings);
        break;
      }
      case 'blur': {
        const n = Number(rest[0]||0); state.settings.blur = isFinite(n)? n: 0;
        applyWallpaper(state.settings.wallpaperUrl, state.settings.blur);
        persist(STORAGE_KEYS.settings, state.settings);
        break;
      }
      case 'add': {
        const [title, url, icon='🔗'] = rest;
        if(!title || !url){ notify('用法: > add <title> <url> [icon]'); break; }
        const id = `sc-${Date.now()}`;
        const newShortcut = {
          id,
          title,
          url,
          icon,
          categoryId: state.ui.currentCategory,
          tags: [],
          order: state.shortcuts.length,
          pinned: false,
          visitCount: 0,
          lastVisited: null
        };
        state.shortcuts.push(newShortcut);
        persist(STORAGE_KEYS.shortcuts, state.shortcuts);
        renderShortcuts();
        renderCategories();
        break;
      }
      case 'export': {
        const blob = new Blob([JSON.stringify({ 
          settings: state.settings, 
          shortcuts: state.shortcuts,
          categories: state.categories 
        }, null, 2)], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = 'jike-export.json'; a.click();
        setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
        break;
      }
      case 'import': {
        const fileInput = document.getElementById('import-file');
        fileInput.onchange = async () => {
          const f = fileInput.files && fileInput.files[0]; if(!f) return;
          try{
            const text = await f.text();
            const data = JSON.parse(text);
            if(data.settings){ 
              Object.assign(state.settings, data.settings); 
              applyTheme(state.settings.theme); 
              applyWallpaper(state.settings.wallpaperUrl, state.settings.blur); 
              applyMono(!!state.settings.mono); 
              persist(STORAGE_KEYS.settings, state.settings); 
            }
            if(Array.isArray(data.shortcuts)){ 
              state.shortcuts = data.shortcuts; 
              persist(STORAGE_KEYS.shortcuts, state.shortcuts); 
              renderShortcuts(); 
            }
            if(Array.isArray(data.categories)){ 
              state.categories = data.categories; 
              persist(STORAGE_KEYS.categories, state.categories); 
              renderCategories(); 
            }
          }catch(_){ notify('导入失败'); }
          fileInput.value = '';
        };
        fileInput.click();
        break;
      }
      case 'settings': {
        dom.settings.showModal(); break;
      }
      default: notify('未知命令');
    }
  }

  function tokenize(s){
    const out=[]; let cur=''; let quote=null;
    for(let i=0;i<s.length;i++){
      const ch = s[i];
      if(quote){ if(ch===quote){ quote=null; } else { cur+=ch; } }
      else if(ch==='"' || ch==="'"){ quote=ch; }
      else if(/\s/.test(ch)){ if(cur){ out.push(cur); cur=''; } }
      else { cur+=ch; }
    }
    if(cur) out.push(cur);
    return out;
  }

  function notify(msg){
    dom.engineIndicator.textContent = msg;
    setTimeout(updateEngineHint, 2000);
  }

  // Persistence
  function persist(key, value){
    try{ localStorage.setItem(key, JSON.stringify(value)); }catch(_){ }
  }
  function loadJson(key, fallback){
    try{ const s = localStorage.getItem(key); return s? JSON.parse(s): fallback; }catch(_){ return fallback; }
  }

  // HTML书签导入功能
  let bookmarkFile = null;
  let parsedBookmarks = null;

  function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      processFile(file);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    dom.fileDropZone.classList.add('dragover');
  }

  function handleDragLeave(e) {
    e.preventDefault();
    dom.fileDropZone.classList.remove('dragover');
  }

  function handleFileDrop(e) {
    e.preventDefault();
    dom.fileDropZone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.name.toLowerCase().endsWith('.html')) {
      processFile(file);
    } else {
      notify('请选择HTML格式的书签文件');
    }
  }

  function processFile(file) {
    bookmarkFile = file;
    dom.fileName.textContent = file.name;
    dom.fileSize.textContent = formatFileSize(file.size);
    dom.fileInfo.style.display = 'block';
    dom.parseFile.disabled = false;
    
    // 隐藏之前的结果
    dom.importPreview.style.display = 'none';
    dom.importProgress.style.display = 'none';
    dom.importResult.style.display = 'none';
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function parseBookmarkFile() {
    if (!bookmarkFile) return;
    
    dom.parseFile.disabled = true;
    dom.parseFile.textContent = '解析中...';
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const htmlContent = e.target.result;
        parsedBookmarks = parseBookmarkHTML(htmlContent);
        showImportPreview(parsedBookmarks);
        dom.parseFile.textContent = '重新解析';
        dom.parseFile.disabled = false;
        dom.startImport.disabled = false;
      } catch (error) {
        notify('解析文件失败：' + error.message);
        dom.parseFile.textContent = '解析文件';
        dom.parseFile.disabled = false;
      }
    };
    reader.readAsText(bookmarkFile);
  }

  function parseBookmarkHTML(htmlContent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    
    const bookmarks = [];
    const folders = new Map();
    
    // 解析书签和文件夹
    function parseNode(node, parentPath = '') {
      if (node.tagName === 'A') {
        const href = node.getAttribute('HREF');
        const title = node.textContent.trim();
        const addDate = node.getAttribute('ADD_DATE');
        
        if (href && title) {
          bookmarks.push({
            title,
            url: href,
            folder: parentPath,
            addDate: addDate ? new Date(parseInt(addDate) * 1000) : new Date(),
            icon: node.getAttribute('ICON') || null
          });
        }
      } else if (node.tagName === 'H3') {
        const folderName = node.textContent.trim();
        const folderPath = parentPath ? `${parentPath}/${folderName}` : folderName;
        folders.set(folderPath, {
          name: folderName,
          path: folderPath,
          parentPath: parentPath
        });
        
        // 查找下一个DL元素（包含子项）
        let nextSibling = node.nextElementSibling;
        while (nextSibling) {
          if (nextSibling.tagName === 'DL') {
            // 解析DL中的所有子项
            Array.from(nextSibling.children).forEach(child => {
              if (child.tagName === 'DT') {
                const firstChild = child.firstElementChild;
                if (firstChild) {
                  parseNode(firstChild, folderPath);
                }
              }
            });
            break;
          }
          nextSibling = nextSibling.nextElementSibling;
        }
      } else if (node.tagName === 'DL') {
        // 解析DL中的所有DT元素
        Array.from(node.children).forEach(child => {
          if (child.tagName === 'DT') {
            const firstChild = child.firstElementChild;
            if (firstChild) {
              parseNode(firstChild, parentPath);
            }
          }
        });
      }
    }
    
    // 开始解析 - 查找根DL元素
    const rootDL = doc.querySelector('DL');
    if (rootDL) {
      Array.from(rootDL.children).forEach(child => {
        if (child.tagName === 'DT') {
          const firstChild = child.firstElementChild;
          if (firstChild) {
            parseNode(firstChild);
          }
        }
      });
    }
    
    return {
      bookmarks,
      folders: Array.from(folders.values()),
      totalCount: bookmarks.length,
      folderCount: folders.size
    };
  }

  function showImportPreview(data) {
    // 检测重复书签
    const duplicates = detectDuplicates(data.bookmarks);
    
    // 更新统计信息
    dom.bookmarkCount.textContent = data.totalCount;
    dom.categoryCount.textContent = data.folderCount;
    dom.duplicateCount.textContent = duplicates.length;
    
    // 生成分类映射
    generateCategoryMapping(data.folders);
    
    // 显示预览
    dom.importPreview.style.display = 'block';
  }

  function detectDuplicates(bookmarks) {
    const duplicates = [];
    const urlMap = new Map();
    
    bookmarks.forEach(bookmark => {
      const url = bookmark.url.toLowerCase();
      if (urlMap.has(url)) {
        duplicates.push({
          bookmark,
          existing: urlMap.get(url)
        });
      } else {
        urlMap.set(url, bookmark);
      }
    });
    
    return duplicates;
  }

  function generateCategoryMapping(folders) {
    dom.mappingList.innerHTML = '';
    
    folders.forEach(folder => {
      const mappingItem = document.createElement('div');
      mappingItem.className = 'mapping-item';
      mappingItem.dataset.folder = folder.path;
      
      const source = document.createElement('div');
      source.className = 'mapping-source';
      source.textContent = folder.path;
      
      const arrow = document.createElement('div');
      arrow.className = 'mapping-arrow';
      arrow.textContent = '→';
      
      const target = document.createElement('div');
      target.className = 'mapping-target';
      
      const select = document.createElement('select');
      select.innerHTML = '<option value="">创建新分类</option>';
      
      // 添加现有分类选项
      state.categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
      
      // 智能建议分类
      const suggestedCategory = suggestCategory(folder.name);
      if (suggestedCategory) {
        const option = document.createElement('option');
        option.value = suggestedCategory.id;
        option.textContent = suggestedCategory.name;
        option.selected = true;
        select.insertBefore(option, select.firstChild);
      }
      
      target.appendChild(select);
      
      mappingItem.appendChild(source);
      mappingItem.appendChild(arrow);
      mappingItem.appendChild(target);
      
      dom.mappingList.appendChild(mappingItem);
    });
  }

  function suggestCategory(folderName) {
    const name = folderName.toLowerCase();
    
    // 基于文件夹名称建议分类
    if (name.includes('开发') || name.includes('dev') || name.includes('code')) {
      return state.categories.find(c => c.name.includes('开发'));
    }
    if (name.includes('工作') || name.includes('work')) {
      return state.categories.find(c => c.name.includes('工作'));
    }
    if (name.includes('工具') || name.includes('tool')) {
      return state.categories.find(c => c.name.includes('工具'));
    }
    if (name.includes('娱乐') || name.includes('entertainment')) {
      return state.categories.find(c => c.name.includes('娱乐'));
    }
    
    return null;
  }

  function startBookmarkImport() {
    if (!parsedBookmarks) return;
    
    dom.startImport.disabled = true;
    dom.importProgress.style.display = 'block';
    dom.importPreview.style.display = 'none';
    
    const strategy = dom.duplicateStrategy.value;
    const autoCreate = dom.autoCreateCategories.checked;
    const fetchFavicons = dom.fetchFavicons.checked;
    const generateTags = dom.generateTags.checked;
    
    let importedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    const totalCount = parsedBookmarks.bookmarks.length;
    
    // 如果启用自动创建分类，先创建所有需要的分类
    if (autoCreate) {
      parsedBookmarks.folders.forEach(folder => {
        // 检查是否已存在同名分类
        const existingCategory = state.categories.find(c => c.name === folder.name);
        if (!existingCategory) {
          const newCategory = {
            id: `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: folder.name,
            icon: '📁',
            color: '#6b7280',
            parentId: null,
            order: state.categories.length
          };
          state.categories.push(newCategory);
        }
      });
      
      // 保存新创建的分类
      persist(STORAGE_KEYS.categories, state.categories);
    }
    
    // 批量导入书签
    parsedBookmarks.bookmarks.forEach((bookmark, index) => {
      try {
        // 检查重复
        const existing = state.shortcuts.find(s => s.url.toLowerCase() === bookmark.url.toLowerCase());
        if (existing) {
          if (strategy === 'skip') {
            skippedCount++;
            return;
          } else if (strategy === 'overwrite') {
            // 更新现有书签
            Object.assign(existing, {
              title: bookmark.title,
              folder: bookmark.folder
            });
            importedCount++;
          } else if (strategy === 'rename') {
            // 重命名导入
            bookmark.title = `${bookmark.title} (导入)`;
          }
        }
        
        if (!existing || strategy !== 'skip') {
          // 获取分类ID
          let categoryId = null;
          if (bookmark.folder) {
            if (autoCreate) {
              // 自动创建模式下，直接根据文件夹名称查找分类
              const category = state.categories.find(c => c.name === bookmark.folder.split('/').pop());
              categoryId = category ? category.id : null;
            } else {
              // 手动映射模式下，从映射列表获取
              const mappingItem = dom.mappingList.querySelector(`[data-folder="${bookmark.folder}"]`);
              if (mappingItem) {
                const select = mappingItem.querySelector('select');
                categoryId = select.value;
              }
            }
          }
          
          // 处理图标与站点favicon
          let icon = '🔗';
          if (bookmark.icon) {
            if (!bookmark.icon.startsWith('data:')) {
              icon = bookmark.icon;
            }
          }
          const iconUrl = getFaviconUrl(bookmark.url);
          
          // 处理标题
          let title = bookmark.title;
          if (!title || title.trim() === '') {
            try {
              const url = new URL(bookmark.url);
              title = url.hostname.replace('www.', '');
            } catch {
              title = bookmark.url;
            }
          }
          
          // 创建新书签
          const newShortcut = {
            id: `sc-${Date.now()}-${index}`,
            title: title,
            url: bookmark.url,
            icon: icon,
            iconUrl,
            categoryId: categoryId,
            tags: generateTags ? generateTagsFromUrl(bookmark.url) : [],
            order: state.shortcuts.length,
            pinned: false,
            visitCount: 0,
            lastVisited: null
          };
          
          state.shortcuts.push(newShortcut);
          importedCount++;
        }
        
        // 更新进度
        const progress = ((index + 1) / totalCount) * 100;
        dom.progressFill.style.width = `${progress}%`;
        dom.progressText.textContent = `导入中... ${index + 1}/${totalCount}`;
        
      } catch (error) {
        errorCount++;
        console.error('导入书签失败:', error);
      }
    });
    
    // 保存数据
    persist(STORAGE_KEYS.shortcuts, state.shortcuts);
    
    // 显示结果
    setTimeout(() => {
      showImportResult(importedCount, skippedCount, errorCount, autoCreate ? parsedBookmarks.folders.length : 0);
    }, 500);
  }

  function generateTagsFromUrl(url) {
    try {
      const domain = new URL(url).hostname.toLowerCase();
      const tags = [];
      
      if (domain.includes('github.com')) tags.push('GitHub', '代码');
      if (domain.includes('stackoverflow.com')) tags.push('StackOverflow', '问答');
      if (domain.includes('google.com')) tags.push('Google', '搜索');
      if (domain.includes('youtube.com')) tags.push('YouTube', '视频');
      if (domain.includes('npmjs.com')) tags.push('npm', '包管理');
      
      return tags;
    } catch {
      return [];
    }
  }

  function showImportResult(imported, skipped, errors, categoriesCreated = 0) {
    dom.importProgress.style.display = 'none';
    dom.importResult.style.display = 'block';
    
    if (errors === 0) {
      dom.resultSuccess.style.display = 'block';
      dom.resultError.style.display = 'none';
      
      let message = `成功导入 ${imported} 个书签`;
      if (skipped > 0) {
        message += `，跳过 ${skipped} 个重复书签`;
      }
      if (categoriesCreated > 0) {
        message += `，自动创建 ${categoriesCreated} 个分类`;
      }
      
      dom.successDetails.textContent = message;
    } else {
      dom.resultSuccess.style.display = 'none';
      dom.resultError.style.display = 'block';
      dom.errorDetails.textContent = `导入 ${imported} 个书签，跳过 ${skipped} 个，失败 ${errors} 个`;
    }
    
    // 重新渲染界面
    renderShortcuts();
    renderCategories();
    
    // 重置按钮
    dom.startImport.disabled = true;
    dom.startImport.textContent = '开始导入';
  }

  // Prefill settings UI
  dom.wallpaperUrl.value = state.settings.wallpaperUrl || '';
  dom.blurAmount.value = String(state.settings.blur || 0);
  const monoToggle = document.getElementById('monospace-toggle');
  if(monoToggle) monoToggle.checked = !!state.settings.mono;
})();

