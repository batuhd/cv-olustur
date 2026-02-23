import { animate, stagger } from 'animejs';

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

let currentZoom = 100;

document.addEventListener('DOMContentLoaded', () => {
  loadDefaults();
  setupListeners();
  setupZoom();
  updatePreview();
  playEntryAnimations();
});

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
  el.innerHTML = `<div class="item-header"><button type="button" class="btn-remove">X Sil</button></div>`;
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
  inputs.forEach(inp => inp.addEventListener('input', updatePreview));
  div.querySelector('.btn-remove-bullet').addEventListener('click', () => { div.remove(); updatePreview(); });
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
  
  let btnLabel = '';
  let addAction = '';
  let contentHtml = '';

  if (type === 'custom') {
    btnLabel = 'Eleman Ekle';
    addAction = 'addCustomItem';
    contentHtml = `<div id="${sectionId}" class="items-list"></div><button type="button" class="btn btn-add-item" data-action="${addAction}">${btnLabel}</button>`;
  } else if (type === 'skill') {
    btnLabel = 'Beceri Ekle';
    addAction = 'addSkill';
    contentHtml = `<div id="${sectionId}" class="items-list"></div><button type="button" class="btn btn-add-item" data-action="${addAction}">${btnLabel}</button>`;
  } else if (type === 'language') {
    btnLabel = 'Dil Ekle';
    addAction = 'addLanguage';
    contentHtml = `<div id="${sectionId}" class="items-list"></div><button type="button" class="btn btn-add-item" data-action="${addAction}">${btnLabel}</button>`;
  } else if (type === 'text') {
    contentHtml = `<div class="field-row"><div class="field-col full"><textarea class="input-field dyn-textarea" rows="3" placeholder="Açıklamanızı buraya yazın..."></textarea></div></div>`;
  }

  el.innerHTML = `
    <div class="section-header">
        <input type="text" class="section-title-input" value="Yeni Kategori" />
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
  
  animate(el, { translateY: [15, 0], opacity: [0, 1], duration: 400, ease: 'outCubic' });
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
  inp.addEventListener('input', updatePreview);
  div.querySelector('.btn-remove-bullet').addEventListener('click', () => { div.remove(); updatePreview(); });
  if (!value) inp.focus();
}

function bindItem(el) {
  el.querySelectorAll('input, textarea').forEach(inp => inp.addEventListener('input', updatePreview));
  const removeBtn = el.querySelector('.btn-remove');
  if (removeBtn) {
    removeBtn.addEventListener('click', async () => { await animateRemoveItem(el); updatePreview(); });
  }
}

function setupListeners() {
  ['fullName', 'phone', 'email', 'references'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.addEventListener('input', updatePreview);
  });

  document.getElementById('addSocialLink').addEventListener('click', () => { addSocialLinkItem(); updatePreview(); });

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
    }
  });

  // Section controls listener
  document.getElementById('sectionsContainer').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-up')) {
      const section = e.target.closest('.section-block');
      if (section.previousElementSibling) {
        section.parentNode.insertBefore(section, section.previousElementSibling);
        updatePreview();
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.target.classList.contains('btn-down')) {
      const section = e.target.closest('.section-block');
      if (section.nextElementSibling) {
        section.parentNode.insertBefore(section.nextElementSibling, section);
        updatePreview();
        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.target.classList.contains('btn-delete')) {
      if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
        e.target.closest('.section-block').remove();
        updatePreview();
      }
    }
  });

  document.getElementById('sectionsContainer').addEventListener('input', (e) => {
    if (e.target.classList.contains('section-title-input')) {
      updatePreview();
    }
  });

  document.getElementById('addCustomSection').addEventListener('click', () => { 
    document.getElementById('newCategoryModal').showModal();
  });

  document.getElementById('closeCategoryModal').addEventListener('click', () => {
    document.getElementById('newCategoryModal').close();
  });

  document.getElementById('confirmAddCategory').addEventListener('click', () => {
    const type = document.getElementById('newCategoryType').value;
    addNewSectionOfType(type);
    document.getElementById('newCategoryModal').close();
    updatePreview();
  });

  document.getElementById('downloadPdf').addEventListener('click', downloadPdf);
  document.getElementById('clearForm').addEventListener('click', clearForm);
}

function clearForm() {
  if (!confirm('Tüm bilgileri silmek istediğinize emin misiniz?')) return;
  ['fullName', 'phone', 'email', 'references'].forEach(id => { 
      const el = document.getElementById(id);
      if(el) el.value = ''; 
  });
  document.getElementById('socialLinksList').innerHTML = '';
  document.querySelectorAll('.items-list').forEach(list => { list.innerHTML = ''; });
  document.querySelectorAll('.dyn-textarea').forEach(ta => { ta.value = ''; });
  updatePreview();
}

function setupZoom() {
  document.getElementById('zoomIn').addEventListener('click', () => { currentZoom = Math.min(currentZoom + 10, 150); applyZoom(); });
  document.getElementById('zoomOut').addEventListener('click', () => { currentZoom = Math.max(currentZoom - 10, 50); applyZoom(); });
}

function applyZoom() {
  document.getElementById('zoomLevel').textContent = currentZoom + '%';
  document.getElementById('cvPage').style.transform = `scale(${currentZoom / 100})`;
}

function updatePreview() {
  document.getElementById('cvName').textContent = document.getElementById('fullName').value || 'Ad Soyad';
  
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
      const ref = block.querySelector('#references')?.value || '';
      if (ref) {
          itemsHtml = `<p class="cv-ref">${esc(ref)}</p>`;
      }
    } else if (type === 'text') {
      const txt = block.querySelector('textarea')?.value || '';
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

}

function downloadPdf() {
  const cvContent = document.getElementById('cvPage').innerHTML;
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'position:fixed;left:-9999px;top:-9999px;width:0;height:0;border:none;';
  document.body.appendChild(iframe);

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<title> </title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Times New Roman', serif; color: #1a1a2e; font-size: 10.5pt; line-height: 1.45; background: white; word-break: break-word; overflow-wrap: break-word; padding: 15mm 18mm; }
  .cv-name { font-family: 'Times New Roman', serif; font-size: 20pt; font-weight: 700; letter-spacing: 0.02em; color: #1a1a2e; }
  .cv-contact-row { display: flex; justify-content: center; align-items: center; gap: 8pt; flex-wrap: wrap; font-size: 9.5pt; color: #4a4a6a; }
  .cv-sep { color: #999; }
  .cv-header-block { text-align: center; margin-bottom: 14pt; padding-bottom: 10pt; border-bottom: 1.5pt solid #1a1a2e; }
  .cv-section { margin-bottom: 10pt; }
  .cv-section-title { font-family: 'Times New Roman', serif; font-size: 11.5pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding-bottom: 2pt; margin-bottom: 6pt; border-bottom: 1pt solid #1a1a2e; color: #1a1a2e; }
  .cv-entry { margin-bottom: 7pt; }
  .cv-entry-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1pt; }
  .cv-entry-title { font-weight: 600; font-size: 10.5pt; }
  .cv-entry-date { font-size: 9.5pt; color: #4a4a6a; white-space: nowrap; }
  .cv-entry-subtitle { font-size: 9.5pt; color: #4a4a6a; font-style: italic; margin-bottom: 2pt; }
  .cv-entry-bullets { list-style: disc; padding-left: 16pt; margin-top: 2pt; }
  .cv-entry-bullets li { font-size: 10pt; margin-bottom: 1.5pt; line-height: 1.35; }
  .cv-activity { margin-bottom: 5pt; }
  .cv-activity-row { display: flex; justify-content: space-between; align-items: baseline; }
  .cv-activity-name { font-weight: 600; font-size: 10.5pt; }
  .cv-activity-role { font-size: 9.5pt; color: #4a4a6a; font-style: italic; }
  .cv-activity-org { font-size: 9.5pt; color: #4a4a6a; }
  .cv-activity-bullets { list-style: disc; padding-left: 16pt; margin-top: 2pt; }
  .cv-activity-bullets li { font-size: 10pt; margin-bottom: 1.5pt; line-height: 1.35; }
  .cv-skill-row { margin-bottom: 3pt; font-size: 10.5pt; line-height: 1.4; }
  .cv-language-row { margin-bottom: 2pt; font-size: 10.5pt; }
  .cv-paragraph { margin-bottom: 4pt; font-size: 10.5pt; line-height: 1.4; color: #1a1a2e; }
  .cv-ref { font-size: 10pt; font-style: italic; color: #4a4a6a; }
</style>
</head>
<body>${cvContent}</body>
</html>`);
  doc.close();

  iframe.contentWindow.addEventListener('afterprint', () => { setTimeout(() => iframe.remove(), 500); });
  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => { if (iframe.parentNode) iframe.remove(); }, 5000);
  }, 500);
}

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
