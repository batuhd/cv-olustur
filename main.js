import { animate, stagger } from 'animejs';
import html2pdf from 'html2pdf.js';

const defaultData = {
  fullName: 'Ahmet Yılmaz',
  phone: '+90 555 123 45 67',
  email: 'ahmet@example.com',
  links: [
    { name: 'LinkedIn', url: 'linkedin.com/in/ahmetyilmaz' },
    { name: 'GitHub', url: 'github.com/ahmetyilmaz' }
  ],
  education: [
    { school: 'Örnek Üniversitesi', degree: 'Lisans, Bilgisayar Mühendisliği', date: 'Eylül 2021 - Haziran 2025' }
  ],
  experience: [
    {
      title: 'Stajyer, Yazılım Geliştirme',
      company: 'ABC Teknoloji A.Ş.',
      location: 'İstanbul, Türkiye',
      date: '2023 – 2024',
      bullets: [
        'Web uygulamalarının geliştirilmesine katkıda bulundu.',
        'Backend API entegrasyonları üzerinde çalıştı.'
      ]
    },
    {
      title: 'Freelance Web Geliştirici',
      company: 'Bireysel / Uzaktan',
      location: '',
      date: '2021 – Günümüz',
      bullets: [
        'Küçük işletmelere özel web siteleri tasarlayıp geliştirdi.',
        'HTML, CSS, JavaScript ve modern framework\'lerle mobil uyumlu arayüzler oluşturdu.',
        'Alan adı, hosting ve SEO süreçlerini yönetti.'
      ]
    }
  ],
  activities: [
    { name: 'Yazılım Kulübü', role: 'Başkan Yardımcısı', org: 'Örnek Üniversitesi', bullets: [] },
    {
      name: 'Açık Kaynak Katkıları',
      role: 'Bağımsız',
      org: '',
      bullets: [
        'Çeşitli açık kaynak projelerine katkıda bulundu.',
        'Yerelleştirme ve çeviri çalışmaları yürüttü.'
      ]
    }
  ],
  skills: [
    { category: 'Programlama Dilleri', value: 'Python, JavaScript, Java, C++' },
    { category: 'Veritabanı', value: 'MySQL, PostgreSQL, MongoDB' },
    { category: 'Araçlar', value: 'Git, VS Code, Docker, Figma' }
  ],
  languages: [
    { name: 'Türkçe', level: 'Anadili' },
    { name: 'İngilizce', level: 'B2' }
  ],
  references: 'Referanslar talep üzerine sağlanacaktır.'
};

const categoryTemplates = {
  education: { title: 'Eğitim', btnText: 'Eğitim Ekle', action: 'addEducation' },
  experience: { title: 'Deneyim', btnText: 'Deneyim Ekle', action: 'addExperience' },
  activity: { title: 'Liderlik / Aktiviteler', btnText: 'Aktivite Ekle', action: 'addActivity' },
  skill: { title: 'Beceriler', btnText: 'Beceri Ekle', action: 'addSkill' },
  language: { title: 'Diller', btnText: 'Dil Ekle', action: 'addLanguage' },
  reference: { title: 'Referanslar', btnText: null, action: null },
  custom: { title: 'Yeni Bölüm', btnText: 'Eleman Ekle', action: 'addCustomItem' },
  text: { title: 'Açıklama', btnText: null, action: null }
};

let currentZoom = 100;
let currentTemplate = 'classic';
let autoSaveTimeout = null;

// Template styles
const templateStyles = {
  classic: {
    fontFamily: "'Times New Roman', 'Noto Serif', serif",
    headerAlign: 'center',
    sectionStyle: 'uppercase-line',
    color: '#1a1a2e',
    fontSize: '10.5pt'
  },
  modern: {
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    headerAlign: 'left',
    sectionStyle: 'bold-color',
    color: '#2563eb',
    fontSize: '10.5pt'
  },
  minimal: {
    fontFamily: "'Inter', Arial, sans-serif",
    headerAlign: 'left',
    sectionStyle: 'simple',
    color: '#333',
    fontSize: '10pt'
  },
  creative: {
    fontFamily: "'Georgia', serif",
    headerAlign: 'center',
    sectionStyle: 'boxed',
    color: '#7c3aed',
    fontSize: '11pt'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  setupListeners();
  setupZoom();
  setupAutoSave();
  updatePreview();
  playEntryAnimations();
});

function loadFromStorage() {
  const saved = localStorage.getItem('cvData');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      loadData(data);
    } catch (e) {
      console.error('Failed to load saved data:', e);
      loadDefaults();
    }
  } else {
    loadDefaults();
  }
  
  // Load template preference
  const savedTemplate = localStorage.getItem('cvTemplate');
  if (savedTemplate) {
    currentTemplate = savedTemplate;
    document.getElementById('templateSelector').value = savedTemplate;
  }
}

function loadDefaults() {
  document.getElementById('fullName').value = defaultData.fullName;
  document.getElementById('phone').value = defaultData.phone;
  document.getElementById('email').value = defaultData.email;
  
  defaultData.links.forEach(l => addSocialLinkItem(l.name, l.url));

  document.getElementById('references').value = defaultData.references;

  defaultData.education.forEach(ed => addEducationItem(document.getElementById('educationList'), ed));
  defaultData.experience.forEach(exp => addExperienceItem(document.getElementById('experienceList'), exp));
  defaultData.activities.forEach(act => addActivityItem(document.getElementById('activityList'), act));
  defaultData.skills.forEach(sk => addSkillItem(document.getElementById('skillsList'), sk));
  defaultData.languages.forEach(lang => addLanguageItem(document.getElementById('languagesList'), lang));
}

function loadData(data) {
  // Clear existing
  document.getElementById('socialLinksList').innerHTML = '';
  document.querySelectorAll('.items-list').forEach(list => list.innerHTML = '');
  document.getElementById('sectionsContainer').innerHTML = '';
  
  // Load personal info
  document.getElementById('fullName').value = data.fullName || '';
  document.getElementById('phone').value = data.phone || '';
  document.getElementById('email').value = data.email || '';
  
  // Load social links
  (data.links || []).forEach(l => addSocialLinkItem(l.name, l.url));
  
  // Load sections
  (data.sections || []).forEach(section => {
    addSectionFromData(section);
  });
}

function addSectionFromData(sectionData) {
  const type = sectionData.type;
  const title = sectionData.title;
  const items = sectionData.items || [];
  const text = sectionData.text || '';
  
  const container = document.getElementById('sectionsContainer');
  const sectionId = 'dynList_' + Date.now() + Math.random().toString(36).substr(2, 9);
  const el = document.createElement('div');
  el.className = 'group-box section-block';
  el.setAttribute('data-type', type);
  
  const template = categoryTemplates[type] || categoryTemplates.custom;
  let contentHtml = '';
  
  if (type === 'text') {
    contentHtml = `<div class="field-row"><div class="field-col full"><textarea class="input-field dyn-textarea" rows="3" placeholder="Açıklamanızı buraya yazın...">${esc(text)}</textarea></div></div>`;
  } else if (type === 'reference') {
    contentHtml = `
      <div class="field-row">
        <div class="field-col full">
          <textarea class="input-field dyn-textarea" rows="2">${esc(text)}</textarea>
        </div>
      </div>
    `;
  } else {
    contentHtml = `<div id="${sectionId}" class="items-list"></div>`;
    if (template.btnText) {
      contentHtml += `<button type="button" class="btn btn-add-item" data-action="${template.action}">${template.btnText}</button>`;
    }
  }
  
  el.innerHTML = `
    <div class="section-header">
        <input type="text" class="section-title-input" value="${esc(title || template.title)}" />
        <div class="section-controls">
            <button type="button" class="btn-icon btn-up" aria-label="Yukarı taşı">↑</button>
            <button type="button" class="btn-icon btn-down" aria-label="Aşağı taşı">↓</button>
            <button type="button" class="btn-icon btn-delete" aria-label="Kategoriyi sil">✕</button>
        </div>
    </div>
    <div class="section-content">
        ${contentHtml}
    </div>
  `;
  container.appendChild(el);
  
  // Load items
  const listContainer = el.querySelector('.items-list');
  if (listContainer) {
    items.forEach(itemData => {
      if (type === 'education') addEducationItem(listContainer, itemData);
      else if (type === 'experience') addExperienceItem(listContainer, itemData);
      else if (type === 'activity') addActivityItem(listContainer, itemData);
      else if (type === 'skill') addSkillItem(listContainer, itemData);
      else if (type === 'language') addLanguageItem(listContainer, itemData);
      else if (type === 'custom') addCustomItem(listContainer, itemData);
    });
  }
  
  // Bind textarea if exists
  const textarea = el.querySelector('textarea');
  if (textarea) {
    textarea.addEventListener('input', () => {
      updatePreview();
      scheduleAutoSave();
    });
  }
}

function collectData() {
  const sections = [];
  document.querySelectorAll('.section-block').forEach(block => {
    const type = block.getAttribute('data-type');
    const title = block.querySelector('.section-title-input').value;
    const sectionData = { type, title };
    
    if (type === 'text' || type === 'reference') {
      const textarea = block.querySelector('textarea');
      sectionData.text = textarea ? textarea.value : '';
    } else {
      sectionData.items = [];
      block.querySelectorAll('.items-list > div').forEach(item => {
        const inputs = item.querySelectorAll('input');
        const itemData = {};
        
        if (type === 'education') {
          itemData.school = item.querySelector('.ed-school')?.value || '';
          itemData.degree = item.querySelector('.ed-degree')?.value || '';
          itemData.date = item.querySelector('.ed-date')?.value || '';
        } else if (type === 'experience') {
          itemData.title = item.querySelector('.exp-title')?.value || '';
          itemData.company = item.querySelector('.exp-company')?.value || '';
          itemData.location = item.querySelector('.exp-location')?.value || '';
          itemData.date = item.querySelector('.exp-date')?.value || '';
          itemData.bullets = Array.from(item.querySelectorAll('.bullet-list input')).map(inp => inp.value);
        } else if (type === 'activity') {
          itemData.name = item.querySelector('.act-name')?.value || '';
          itemData.role = item.querySelector('.act-role')?.value || '';
          itemData.org = item.querySelector('.act-org')?.value || '';
          itemData.bullets = Array.from(item.querySelectorAll('.bullet-list input')).map(inp => inp.value);
        } else if (type === 'skill') {
          itemData.category = item.querySelector('.skill-cat')?.value || '';
          itemData.value = item.querySelector('.skill-val')?.value || '';
        } else if (type === 'language') {
          itemData.name = item.querySelector('.lang-name')?.value || '';
          itemData.level = item.querySelector('.lang-level')?.value || '';
        } else if (type === 'custom') {
          itemData.title = item.querySelector('.cust-title')?.value || '';
          itemData.subtitle = item.querySelector('.cust-subtitle')?.value || '';
          itemData.date = item.querySelector('.cust-date')?.value || '';
          itemData.bullets = Array.from(item.querySelectorAll('.bullet-list input')).map(inp => inp.value);
        }
        
        sectionData.items.push(itemData);
      });
    }
    
    sections.push(sectionData);
  });
  
  const links = Array.from(document.querySelectorAll('.dynamic-link-row')).map(row => ({
    name: row.querySelector('.link-name').value.trim(),
    url: row.querySelector('.link-url').value.trim()
  })).filter(l => l.name || l.url);
  
  return {
    fullName: document.getElementById('fullName').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    links,
    sections,
    template: currentTemplate
  };
}

function saveToStorage() {
  const data = collectData();
  localStorage.setItem('cvData', JSON.stringify(data));
  localStorage.setItem('cvTemplate', currentTemplate);
  showSaveStatus();
}

function scheduleAutoSave() {
  if (autoSaveTimeout) {
    clearTimeout(autoSaveTimeout);
  }
  autoSaveTimeout = setTimeout(() => {
    saveToStorage();
  }, 2000);
}

function showSaveStatus() {
  const dot = document.querySelector('.save-dot');
  if (dot) {
    dot.classList.add('saved');
    setTimeout(() => {
      dot.classList.remove('saved');
    }, 1500);
  }
}

function setupAutoSave() {
  // Listen to all input changes
  document.addEventListener('input', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      scheduleAutoSave();
    }
  });
}

function exportToJson() {
  const data = collectData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `cv-${data.fullName.replace(/\s+/g, '-').toLowerCase() || 'data'}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJson(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      loadData(data);
      updatePreview();
      saveToStorage();
      
      if (data.template) {
        currentTemplate = data.template;
        document.getElementById('templateSelector').value = data.template;
      }
      
      animate('.form-panel', { translateX: [-20, 0], opacity: [0.8, 1], duration: 300, ease: 'outCubic' });
    } catch (err) {
      alert('Geçersiz JSON dosyası: ' + err.message);
    }
  };
  reader.readAsText(file);
}

function playEntryAnimations() {
  animate('.form-panel', { translateX: [-60, 0], opacity: [0, 1], duration: 600, ease: 'outQuart' });
  animate('.preview-panel', { translateX: [60, 0], opacity: [0, 1], duration: 600, delay: 150, ease: 'outQuart' });
  animate('.group-box', { translateY: [15, 0], opacity: [0, 1], duration: 400, delay: stagger(60, { start: 300 }), ease: 'outCubic' });
}

function animateNewItem(el) {
  animate(el, { translateY: [-10, 0], opacity: [0, 1], duration: 300, ease: 'outCubic' });
}

function animateRemoveItem(el) {
  return new Promise(resolve => {
    animate(el, {
      translateX: [0, -30],
      opacity: [1, 0],
      duration: 200,
      ease: 'inCubic',
      onComplete: () => { el.remove(); resolve(); }
    });
  });
}

function createDynamicItem() {
  const el = document.createElement('div');
  el.className = 'dynamic-item';
  el.innerHTML = `
    <div class="item-header">
      <div class="item-controls">
        <button type="button" class="btn-icon btn-item-up" title="Yukarı taşı">↑</button>
        <button type="button" class="btn-icon btn-item-down" title="Aşağı taşı">↓</button>
        <button type="button" class="btn-icon btn-item-delete" title="Sil">🗑️</button>
      </div>
    </div>
  `;
  return el;
}

function makeField(id, labelText, value, colspan) {
  const colClass = colspan === 2 ? 'full' : '';
  return `
    <div class="field-col ${colClass}">
      <label>${labelText}</label>
      <input type="text" class="${id} input-field" value="${esc(value)}" />
    </div>
  `;
}

function addSocialLinkItem(name = '', url = '') {
  const container = document.getElementById('socialLinksList');
  const div = document.createElement('div');
  div.className = 'dynamic-link-row';
  div.innerHTML = `
    <input type="text" class="input-field link-name" value="${esc(name)}" placeholder="Örn: LinkedIn" style="width: 30%;" />
    <input type="text" class="input-field link-url" value="${esc(url)}" placeholder="Bağlantı URL'si" style="flex:1;" />
    <button type="button" class="btn-remove-bullet">X</button>
  `;
  container.appendChild(div);
  
  const inputs = div.querySelectorAll('input');
  inputs.forEach(inp => inp.addEventListener('input', () => {
    updatePreview();
    scheduleAutoSave();
  }));
  div.querySelector('.btn-remove-bullet').addEventListener('click', () => { 
    div.remove(); 
    updatePreview();
    scheduleAutoSave();
  });
}

function addEducationItem(container, data = {}) {
  const el = createDynamicItem();
  el.insertAdjacentHTML('beforeend', `
    <div class="field-row">
      ${makeField('ed-school', 'Okul', data.school, 2)}
      ${makeField('ed-degree', 'Bölüm / Derece', data.degree, 2)}
      ${makeField('ed-date', 'Tarih', data.date, 2)}
    </div>
  `);
  container.appendChild(el);
  bindItem(el);
  animateNewItem(el);
}

function addExperienceItem(container, data = {}) {
  const el = createDynamicItem();
  el.insertAdjacentHTML('beforeend', `
    <div class="field-row">
      ${makeField('exp-title', 'Pozisyon', data.title, 2)}
      ${makeField('exp-company', 'Şirket', data.company, 1)}
      ${makeField('exp-location', 'Konum', data.location || '', 1)}
      ${makeField('exp-date', 'Tarih', data.date, 2)}
    </div>
    <div style="margin-top:0.5rem;">
      <label style="display:block;margin-bottom:2px;font-weight:500;">Açıklamalar</label>
      <div class="bullet-list"></div>
      <button type="button" class="btn-add-bullet">+ Madde Ekle</button>
    </div>
  `);
  container.appendChild(el);
  const bulletList = el.querySelector('.bullet-list');
  (data.bullets || []).forEach(b => addBulletInput(bulletList, b));
  el.querySelector('.btn-add-bullet').addEventListener('click', () => addBulletInput(el.querySelector('.bullet-list'), ''));
  bindItem(el);
  animateNewItem(el);
}

function addActivityItem(container, data = {}) {
  const el = createDynamicItem();
  el.insertAdjacentHTML('beforeend', `
    <div class="field-row">
      ${makeField('act-name', 'Aktivite Adı', data.name, 2)}
      ${makeField('act-role', 'Görev', data.role, 1)}
      ${makeField('act-org', 'Kurum', data.org || '', 1)}
    </div>
    <div style="margin-top:0.5rem;">
      <label style="display:block;margin-bottom:2px;font-weight:500;">Açıklamalar</label>
      <div class="bullet-list"></div>
      <button type="button" class="btn-add-bullet">+ Madde Ekle</button>
    </div>
  `);
  container.appendChild(el);
  const bulletList = el.querySelector('.bullet-list');
  (data.bullets || []).forEach(b => addBulletInput(bulletList, b));
  el.querySelector('.btn-add-bullet').addEventListener('click', () => addBulletInput(el.querySelector('.bullet-list'), ''));
  bindItem(el);
  animateNewItem(el);
}

function addSkillItem(container, data = {}) {
  const el = createDynamicItem();
  el.insertAdjacentHTML('beforeend', `
    <div class="field-row">
      ${makeField('skill-cat', 'Kategori', data.category, 1)}
      ${makeField('skill-val', 'Beceriler', data.value, 1)}
    </div>
  `);
  container.appendChild(el);
  bindItem(el);
  animateNewItem(el);
}

function addLanguageItem(container, data = {}) {
  const el = createDynamicItem();
  el.insertAdjacentHTML('beforeend', `
    <div class="field-row">
      ${makeField('lang-name', 'Dil', data.name, 1)}
      ${makeField('lang-level', 'Seviye', data.level, 1)}
    </div>
  `);
  container.appendChild(el);
  bindItem(el);
  animateNewItem(el);
}

function addCustomItem(container, data = {}) {
  const el = createDynamicItem();
  el.insertAdjacentHTML('beforeend', `
    <div class="field-row">
      ${makeField('cust-title', 'Başlık', data.title, 2)}
      ${makeField('cust-subtitle', 'Alt Başlık (Opsiyonel)', data.subtitle, 1)}
      ${makeField('cust-date', 'Tarih (Opsiyonel)', data.date, 1)}
    </div>
    <div style="margin-top:0.5rem;">
      <label style="display:block;margin-bottom:2px;font-weight:500;">Açıklamalar</label>
      <div class="bullet-list"></div>
      <button type="button" class="btn-add-bullet">+ Madde Ekle</button>
    </div>
  `);
  container.appendChild(el);
  const bulletList = el.querySelector('.bullet-list');
  (data.bullets || []).forEach(b => addBulletInput(bulletList, b));
  el.querySelector('.btn-add-bullet').addEventListener('click', () => addBulletInput(el.querySelector('.bullet-list'), ''));
  bindItem(el);
  animateNewItem(el);
}

function addNewSectionOfType(type) {
  const container = document.getElementById('sectionsContainer');
  const sectionId = 'dynList_' + Date.now();
  const el = document.createElement('div');
  el.className = 'group-box section-block';
  el.setAttribute('data-type', type);
  
  const template = categoryTemplates[type] || categoryTemplates.custom;
  let contentHtml = '';

  if (type === 'text') {
    contentHtml = `<div class="field-row"><div class="field-col full"><textarea class="input-field dyn-textarea" rows="3" placeholder="Açıklamanızı buraya yazın..."></textarea></div></div>`;
  } else if (type === 'reference') {
    contentHtml = `
      <div class="field-row">
        <div class="field-col full">
          <textarea class="input-field dyn-textarea" rows="2" placeholder="Referans bilgilerinizi buraya yazın..."></textarea>
        </div>
      </div>
    `;
  } else {
    contentHtml = `<div id="${sectionId}" class="items-list"></div>`;
    if (template.btnText) {
      contentHtml += `<button type="button" class="btn btn-add-item" data-action="${template.action}">${template.btnText}</button>`;
    }
  }

  el.innerHTML = `
    <div class="section-header">
        <input type="text" class="section-title-input" value="${template.title}" />
        <div class="section-controls">
            <button type="button" class="btn-icon btn-up" aria-label="Yukarı taşı">↑</button>
            <button type="button" class="btn-icon btn-down" aria-label="Aşağı taşı">↓</button>
            <button type="button" class="btn-icon btn-delete" aria-label="Kategoriyi sil">✕</button>
        </div>
    </div>
    <div class="section-content">
        ${contentHtml}
    </div>
  `;
  container.appendChild(el);
  
  // Bind textarea events
  const textarea = el.querySelector('textarea');
  if (textarea) {
    textarea.addEventListener('input', () => {
      updatePreview();
      scheduleAutoSave();
    });
  }
  
  animate(el, { translateY: [15, 0], opacity: [0, 1], duration: 400, ease: 'outCubic' });
  scheduleAutoSave();
}

function addBulletInput(bulletList, value = '') {
  const div = document.createElement('div');
  div.className = 'bullet-row';
  div.innerHTML = `
    <div class="field-col full" style="flex:1;">
      <input type="text" class="input-field" value="${esc(value)}" placeholder="Açıklama..." />
    </div>
    <button type="button" class="btn-remove-bullet">X</button>
  `;
  bulletList.appendChild(div);
  const inp = div.querySelector('input');
  inp.addEventListener('input', () => {
    updatePreview();
    scheduleAutoSave();
  });
  div.querySelector('.btn-remove-bullet').addEventListener('click', () => { 
    div.remove(); 
    updatePreview();
    scheduleAutoSave();
  });
  if (!value) inp.focus();
}

function bindItem(el) {
  el.querySelectorAll('input, textarea').forEach(inp => inp.addEventListener('input', () => {
    updatePreview();
    scheduleAutoSave();
  }));
  
  // Item kontrol butonları (yukarı/aşağı/sil)
  const upBtn = el.querySelector('.btn-item-up');
  const downBtn = el.querySelector('.btn-item-down');
  const deleteBtn = el.querySelector('.btn-item-delete');
  
  if (upBtn) {
    upBtn.addEventListener('click', () => {
      const prev = el.previousElementSibling;
      if (prev && prev.classList.contains('dynamic-item')) {
        el.parentNode.insertBefore(el, prev);
        updatePreview();
        scheduleAutoSave();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
  
  if (downBtn) {
    downBtn.addEventListener('click', () => {
      const next = el.nextElementSibling;
      if (next && next.classList.contains('dynamic-item')) {
        el.parentNode.insertBefore(next, el);
        updatePreview();
        scheduleAutoSave();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
  
  if (deleteBtn) {
    deleteBtn.addEventListener('click', async () => { 
      await animateRemoveItem(el); 
      updatePreview();
      scheduleAutoSave();
    });
  }
}

function setupListeners() {
  ['fullName', 'phone', 'email'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', () => {
      updatePreview();
      scheduleAutoSave();
    });
  });

  document.getElementById('addSocialLink').addEventListener('click', () => { 
    addSocialLinkItem(); 
    updatePreview();
    scheduleAutoSave();
  });

  // Event delegation for dynamically added add buttons
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-add-item')) {
      const action = e.target.getAttribute('data-action');
      const listContainer = e.target.previousElementSibling;
      if (action === 'addEducation') addEducationItem(listContainer);
      else if (action === 'addExperience') addExperienceItem(listContainer);
      else if (action === 'addActivity') addActivityItem(listContainer);
      else if (action === 'addSkill') addSkillItem(listContainer);
      else if (action === 'addLanguage') addLanguageItem(listContainer);
      else if (action === 'addCustomItem') addCustomItem(listContainer);
      updatePreview();
      scheduleAutoSave();
    }
  });

  // Section controls listener
  document.getElementById('sectionsContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-up')) {
      const section = e.target.closest('.section-block');
      if (section.previousElementSibling) {
        section.parentNode.insertBefore(section, section.previousElementSibling);
        updatePreview();
        scheduleAutoSave();
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.target.classList.contains('btn-down')) {
      const section = e.target.closest('.section-block');
      if (section.nextElementSibling) {
        section.parentNode.insertBefore(section.nextElementSibling, section);
        updatePreview();
        scheduleAutoSave();
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.target.classList.contains('btn-delete')) {
      if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
        e.target.closest('.section-block').remove();
        updatePreview();
        scheduleAutoSave();
      }
    }
  });

  document.getElementById('sectionsContainer').addEventListener('input', (e) => {
    if (e.target.classList.contains('section-title-input')) {
      updatePreview();
      scheduleAutoSave();
    }
  });

  // New category modal
  document.getElementById('addCustomSection').addEventListener('click', () => { 
    document.getElementById('newCategoryModal').showModal();
  });

  document.getElementById('closeCategoryModal').addEventListener('click', () => {
    document.getElementById('newCategoryModal').close();
  });

  // Category options click
  document.querySelectorAll('.category-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-type');
      addNewSectionOfType(type);
      document.getElementById('newCategoryModal').close();
      updatePreview();
    });
  });

  // Close modal on backdrop click
  document.getElementById('newCategoryModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('newCategoryModal')) {
      document.getElementById('newCategoryModal').close();
    }
  });

  document.getElementById('downloadPdf').addEventListener('click', downloadPdf);
  document.getElementById('clearForm').addEventListener('click', clearForm);
  document.getElementById('loadExample').addEventListener('click', loadExampleCv);
  
  // JSON Export/Import
  document.getElementById('exportJson').addEventListener('click', exportToJson);
  document.getElementById('importJson').addEventListener('click', () => {
    document.getElementById('jsonFileInput').click();
  });
  document.getElementById('jsonFileInput').addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      importFromJson(e.target.files[0]);
      e.target.value = '';
    }
  });
  
  // Template selector
  document.getElementById('templateSelector').addEventListener('change', (e) => {
    currentTemplate = e.target.value;
    localStorage.setItem('cvTemplate', currentTemplate);
    updatePreview();
  });
}

function clearForm() {
  if (!confirm('Tüm bilgileri silmek istediğinize emin misiniz?')) return;
  ['fullName', 'phone', 'email'].forEach(id => { 
      const el = document.getElementById(id);
      if(el) el.value = ''; 
  });
  document.getElementById('socialLinksList').innerHTML = '';
  document.querySelectorAll('.items-list').forEach(list => { list.innerHTML = ''; });
  document.querySelectorAll('.dyn-textarea').forEach(ta => { ta.value = ''; });
  document.getElementById('sectionsContainer').innerHTML = '';
  updatePreview();
  saveToStorage();
}

function loadExampleCv() {
  if (!confirm('Örnek CV verileri yüklenecek. Mevcut verileriniz silinecek. Devam etmek istiyor musunuz?')) return;
  
  // Clear existing
  document.getElementById('socialLinksList').innerHTML = '';
  document.getElementById('sectionsContainer').innerHTML = '';
  
  // Load example data
  document.getElementById('fullName').value = defaultData.fullName;
  document.getElementById('phone').value = defaultData.phone;
  document.getElementById('email').value = defaultData.email;
  
  // Add default sections
  addNewSectionOfType('education');
  addNewSectionOfType('experience');
  addNewSectionOfType('activity');
  addNewSectionOfType('skill');
  addNewSectionOfType('language');
  addNewSectionOfType('reference');
  
  // Add example items to sections
  const educationList = document.querySelector('[data-type="education"] .items-list');
  if (educationList) {
    defaultData.education.forEach(ed => addEducationItem(educationList, ed));
  }
  
  const experienceList = document.querySelector('[data-type="experience"] .items-list');
  if (experienceList) {
    defaultData.experience.forEach(exp => addExperienceItem(experienceList, exp));
  }
  
  const activityList = document.querySelector('[data-type="activity"] .items-list');
  if (activityList) {
    defaultData.activities.forEach(act => addActivityItem(activityList, act));
  }
  
  const skillsList = document.querySelector('[data-type="skill"] .items-list');
  if (skillsList) {
    defaultData.skills.forEach(sk => addSkillItem(skillsList, sk));
  }
  
  const languagesList = document.querySelector('[data-type="language"] .items-list');
  if (languagesList) {
    defaultData.languages.forEach(lang => addLanguageItem(languagesList, lang));
  }
  
  const referenceBlock = document.querySelector('[data-type="reference"]');
  if (referenceBlock) {
    const textarea = referenceBlock.querySelector('textarea');
    if (textarea) textarea.value = defaultData.references;
  }
  
  // Add social links
  defaultData.links.forEach(l => addSocialLinkItem(l.name, l.url));
  
  updatePreview();
  saveToStorage();
  
  // Show success animation
  animate('.form-panel', { translateX: [-10, 0], opacity: [0.9, 1], duration: 300, ease: 'outCubic' });
}

function setupZoom() {
  document.getElementById('zoomIn').addEventListener('click', () => { currentZoom = Math.min(currentZoom + 10, 150); applyZoom(); });
  document.getElementById('zoomOut').addEventListener('click', () => { currentZoom = Math.max(currentZoom - 10, 50); applyZoom(); });
}

function applyZoom() {
  document.getElementById('zoomLevel').textContent = currentZoom + '%';
  document.getElementById('cvPage').style.transform = `scale(${currentZoom / 100})`;
}

function applyTemplateStyles() {
  const cvPage = document.getElementById('cvPage');
  const style = templateStyles[currentTemplate];
  
  // Remove existing template classes
  cvPage.classList.remove('template-classic', 'template-modern', 'template-minimal', 'template-creative');
  cvPage.classList.add(`template-${currentTemplate}`);
  
  // Apply CSS variables for the template
  cvPage.style.setProperty('--cv-font', style.fontFamily);
  cvPage.style.setProperty('--cv-color', style.color);
  cvPage.style.setProperty('--cv-font-size', style.fontSize);
  
  // Apply header alignment
  const headerBlock = cvPage.querySelector('.cv-header-block');
  if (headerBlock) {
    headerBlock.style.textAlign = style.headerAlign;
  }
  
  // Apply section style
  const sections = cvPage.querySelectorAll('.cv-section-title');
  sections.forEach(section => {
    section.classList.remove('style-uppercase-line', 'style-bold-color', 'style-simple', 'style-boxed');
    section.classList.add(`style-${style.sectionStyle}`);
  });
}

function updatePreview() {
  const fullName = document.getElementById('fullName').value;
  document.getElementById('cvName').textContent = fullName || 'Ad Soyad';
  
  // Contact update
  const phone = document.getElementById('phone').value;
  const email = document.getElementById('email').value;
  const links = Array.from(document.querySelectorAll('.dynamic-link-row')).map(row => {
    return {
      name: row.querySelector('.link-name').value.trim(),
      url: row.querySelector('.link-url').value.trim()
    };
  }).filter(l => l.name || l.url);

  const contactItems = [];
  if (phone) contactItems.push(`<span>${esc(phone)}</span>`);
  if (email) contactItems.push(`<span>${esc(email)}</span>`);
  links.forEach(l => {
    if (l.url) contactItems.push(`<span>${esc(l.url)}</span>`);
  });

  document.getElementById('cvContact').innerHTML = contactItems.join('<span class="cv-sep">|</span>');

  // Dynamic Sections Logic
  const sectionsArea = document.getElementById('cvSectionsArea');
  sectionsArea.innerHTML = '';

  const sectionBlocks = document.querySelectorAll('.section-block');
  
  sectionBlocks.forEach(block => {
    const title = block.querySelector('.section-title-input').value.trim();
    if (!title) return;
    const type = block.getAttribute('data-type');
    let itemsHtml = '';
    
    if (type === 'education') {
      itemsHtml = Array.from(block.querySelectorAll('.items-list > div')).map(item => {
        const school = item.querySelector('.ed-school')?.value || '';
        const degree = item.querySelector('.ed-degree')?.value || '';
        const date = item.querySelector('.ed-date')?.value || '';
        if (!school && !degree) return '';
        return `<div class="cv-entry">
          <div class="cv-entry-row"><span class="cv-entry-title">${esc(school)}</span><span class="cv-entry-date">${esc(date)}</span></div>
          ${degree ? `<div class="cv-entry-subtitle">${esc(degree)}</div>` : ''}
        </div>`;
      }).join('');
    } else if (type === 'experience') {
      itemsHtml = Array.from(block.querySelectorAll('.items-list > div')).map(item => {
        const titleVal = item.querySelector('.exp-title')?.value || '';
        const company = item.querySelector('.exp-company')?.value || '';
        const location = item.querySelector('.exp-location')?.value || '';
        const date = item.querySelector('.exp-date')?.value || '';
        const bullets = Array.from(item.querySelectorAll('.bullet-list input')).map(inp => inp.value).filter(v => v.trim());
        if (!titleVal && !company) return '';
        const subtitle = [company, location].filter(Boolean).join('   ');
        return `<div class="cv-entry">
          <div class="cv-entry-row"><span class="cv-entry-title">${esc(titleVal)}</span><span class="cv-entry-date">${esc(date)}</span></div>
          ${subtitle ? `<div class="cv-entry-subtitle">${esc(subtitle)}</div>` : ''}
          ${bullets.length ? `<ul class="cv-entry-bullets">${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        </div>`;
      }).join('');
    } else if (type === 'activity') {
      itemsHtml = Array.from(block.querySelectorAll('.items-list > div')).map(item => {
        const name = item.querySelector('.act-name')?.value || '';
        const role = item.querySelector('.act-role')?.value || '';
        const org = item.querySelector('.act-org')?.value || '';
        const bullets = Array.from(item.querySelectorAll('.bullet-list input')).map(inp => inp.value).filter(v => v.trim());
        if (!name) return '';
        return `<div class="cv-activity">
          <div class="cv-activity-row"><span class="cv-activity-name">${esc(name)}</span><span class="cv-activity-role">${esc(role)}</span></div>
          ${org ? `<div class="cv-activity-org">${esc(org)}</div>` : ''}
          ${bullets.length ? `<ul class="cv-activity-bullets">${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        </div>`;
      }).join('');
    } else if (type === 'skill') {
      itemsHtml = Array.from(block.querySelectorAll('.items-list > div')).map(item => {
        const cat = item.querySelector('.skill-cat')?.value || '';
        const val = item.querySelector('.skill-val')?.value || '';
        if (!cat && !val) return '';
        return `<div class="cv-skill-row"><span class="cv-skill-cat">${esc(cat)}</span> : ${esc(val)}</div>`;
      }).join('');
    } else if (type === 'language') {
      itemsHtml = Array.from(block.querySelectorAll('.items-list > div')).map(item => {
        const name = item.querySelector('.lang-name')?.value || '';
        const level = item.querySelector('.lang-level')?.value || '';
        if (!name) return '';
        return `<div class="cv-language-row"><span class="cv-lang-name">${esc(name)}</span> : ${esc(level)}</div>`;
      }).join('');
    } else if (type === 'reference') {
      const textarea = block.querySelector('textarea');
      const ref = textarea ? textarea.value : '';
      if (ref) {
          itemsHtml = `<p class="cv-ref">${esc(ref)}</p>`;
      }
    } else if (type === 'text') {
      const textarea = block.querySelector('textarea');
      const txt = textarea ? textarea.value : '';
      if (txt) {
          const lines = txt.split('\\n').filter(l => l.trim() !== '');
          itemsHtml = lines.map(line => `<p class="cv-paragraph">${esc(line)}</p>`).join('');
      }
    } else if (type === 'custom') {
      itemsHtml = Array.from(block.querySelectorAll('.items-list > div')).map(item => {
        const titleVal = item.querySelector('.cust-title')?.value || '';
        const subtitle = item.querySelector('.cust-subtitle')?.value || '';
        const date = item.querySelector('.cust-date')?.value || '';
        const bullets = Array.from(item.querySelectorAll('.bullet-list input')).map(inp => inp.value).filter(v => v.trim());
        if (!titleVal) return '';
        return `<div class="cv-entry">
          <div class="cv-entry-row"><span class="cv-entry-title">${esc(titleVal)}</span><span class="cv-entry-date">${esc(date)}</span></div>
          ${subtitle ? `<div class="cv-entry-subtitle">${esc(subtitle)}</div>` : ''}
          ${bullets.length ? `<ul class="cv-entry-bullets">${bullets.map(b => `<li>${esc(b)}</li>`).join('')}</ul>` : ''}
        </div>`;
      }).join('');
    }

    if (itemsHtml) {
      sectionsArea.insertAdjacentHTML('beforeend', `
        <div class="cv-section">
            <h2 class="cv-section-title">${esc(title)}</h2>
            ${itemsHtml}
        </div>
      `);
    }
  });
  
  // Apply template styles
  applyTemplateStyles();
}

function downloadPdf() {
  const element = document.getElementById('cvPage');
  const fullName = document.getElementById('fullName').value || 'CV';
  
  const opt = {
    margin: 0,
    filename: `${fullName.replace(/\s+/g, '_')}_CV.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['css', 'legacy'],
      avoid: '.cv-section'
    }
  };
  
  // Show loading indicator
  const btn = document.getElementById('downloadPdf');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>⏳</span> Hazırlanıyor...';
  btn.disabled = true;
  
  html2pdf().set(opt).from(element).save().then(() => {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }).catch(err => {
    console.error('PDF generation error:', err);
    btn.innerHTML = originalText;
    btn.disabled = false;
    alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
  });
}

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
