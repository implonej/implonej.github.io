console.log('search.js loaded');
document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('search-icon-btn');
    var modal = document.getElementById('search-modal');
    var input = document.getElementById('search-input');
    var results = document.getElementById('search-results');
    console.log('btn:', btn, 'modal:', modal, 'input:', input, 'results:', results);

    if (btn && modal && input && results) {
        btn.onclick = function() {
            modal.classList.add('show');
            input.value = '';
            results.innerHTML = '';
            input.focus();
            console.log('search modal opened');
        };

        modal.onclick = function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
                console.log('search modal closed');
            }
        };

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                modal.classList.remove('show');
                console.log('search modal closed by ESC');
            }
        });

        if (typeof setupSearch === 'function') {
            setupSearch('search-input', 'search-results');
        }
    } else {
        console.error('search.js: 搜索相关元素未找到', {btn, modal, input, results});
    }
});
function setupSearch(inputId, resultsId) {
    const input = document.getElementById(inputId);
    const results = document.getElementById(resultsId);
    let expanded = false;

    input && input.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        results.innerHTML = '';
        expanded = false;
        if (!query) return;
        const matches = [];
        for (const url in window.searchIndex.documentStore.docs) {
            const doc = window.searchIndex.documentStore.docs[url];
            if (doc.body.toLowerCase().includes(query) || doc.title.toLowerCase().includes(query)) {
                // 高亮标题和内容
                const reg = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                const title = (doc.title || url).replace(reg, '<mark>$1</mark>');
                // 摘要截取并高亮
                let idx = doc.body.toLowerCase().indexOf(query);
                let summary = doc.body;
                if (idx !== -1) {
                    let start = Math.max(0, idx - 20);
                    let end = Math.min(doc.body.length, idx + 80);
                    summary = doc.body.slice(start, end);
                    summary = summary.replace(reg, '<mark>$1</mark>');
                    if (start > 0) summary = '...' + summary;
                    if (end < doc.body.length) summary = summary + '...';
                } else {
                    summary = doc.body.slice(0, 100);
                }
                matches.push({url, title, summary});
            }
        }
        if (matches.length === 0) {
            results.innerHTML = '<li>未找到相关内容</li>';
            return;
        }
        renderResults(matches);
    });

    function renderResults(matches) {
        results.innerHTML = '';
        const showCount = expanded ? matches.length : 5;
        for (let i = 0; i < showCount && i < matches.length; i++) {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${matches[i].url}">${matches[i].title}</a><br><small>${matches[i].summary}</small>`;
            results.appendChild(li);
        }
        if (!expanded && matches.length > 5) {
            const moreLi = document.createElement('li');
            moreLi.innerHTML = `<a href="javascript:void(0);" id="show-more-search">展开更多 (${matches.length - 5})</a>`;
            results.appendChild(moreLi);
            document.getElementById('show-more-search').onclick = function() {
                expanded = true;
                renderResults(matches);
            };
        }
    }
};



// 可放在 base.html 底部或 search.js 末尾
// document.getElementById('search-icon-btn').onclick = function() {
//     var input = document.getElementById('search-input');
//     if (input.style.display === 'none' || input.style.display === '') {
//         input.style.display = 'inline-block';
//         input.focus();
//     } else {
//         input.style.display = 'none';
//     }
// };

// document.addEventListener('DOMContentLoaded', function() {
//     // 搜索弹窗功能
//     document.getElementById('search-icon-btn').onclick = function() {
//         var modal = document.getElementById('search-modal');
//         modal.classList.add('show');
//         var input = document.getElementById('search-input');
//         input.value = '';
//         input.focus();
//         document.getElementById('search-results').innerHTML = '';
//     };

//     // 点击弹窗外关闭
//     document.getElementById('search-modal').onclick = function(e) {
//         if (e.target === this) {
//             this.classList.remove('show');
//         }
//     };
//     // ESC键关闭
//     document.addEventListener('keydown', function(e) {
//         if (e.key === 'Escape') {
//             document.getElementById('search-modal').classList.remove('show');
//         }
//     });

//     // 搜索功能初始化
//     setupSearch('search-input', 'search-results');
// });

document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('theme-toggle-btn');
  const icon = document.getElementById('theme-toggle-icon');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  // 读取本地存储
  let dark = localStorage.getItem('theme') === 'dark' || (localStorage.getItem('theme') === null && prefersDark);

  function setTheme(darkMode) {
    document.body.classList.toggle('dark-mode', darkMode);
    icon.innerHTML = darkMode
      ? `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z"/></svg>`
      : `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffb300" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }

  setTheme(dark);

  btn.onclick = function() {
    dark = !document.body.classList.contains('dark-mode');
    setTheme(dark);
  };
});