import { animate, stagger } from 'animejs';
import { jsPDF } from 'jspdf';
import { timesFonts } from './fonts/timesFonts.js';

const defaultData = {
  fullName: 'Muhammed Batuhan DEDE',
  phone: '',
  email: 'batuhdede@gmail.com',
  links: [
    { name: 'LinkedIn', url: 'linkedin.com/in/batuhdede' },
    { name: 'GitHub', url: 'github.com/batuhd' },
    { name: 'Websitem', url: 'www.batuhdede.me' }
  ],
  education: [
    { school: 'Altınbaş Üniversitesi', degree: 'Lisans - Yönetim Biliişm Sistemleri', date: 'Eylül 2025 - Devam ediyor' },
    { school: 'Alibeyköy Mesleki ve Teknik Anadolu Lisesi', degree: 'Lise - Bilgi Teknolojisi / Yazılım Geliştirme Bölümü', date: '2020 - 2024' }
  ],
  experience: [
    {
      title: 'Kalite Komisyonu Öğrenci Üyesi',
      company: 'Kalite Ve Akreditasyon Ofisi -',
      location: 'Altınbaş Üniversitesi',
      date: 'Nisan 2026 - Devam ediyor',
      bullets: [
        'YÖKAK Ulusal Akreditasyon Denetimleri: Üniversitenin Yükseköğretim Kalite Kurulu (YÖKAK) ulusal akreditasyon ve kurumsal değerlendirme süreçlerinde tüm öğrenci kitlesini resmi dış denetçilere karşı temsil etmek.',
        'Üst Düzey Karar Alma & Temsiliyet: Rektörlük ve akademik yönetimin yer aldığı Kalite Komisyonu toplantılarına katılarak, üniversitenin stratejik kalite güvencesi politikalarında öğrenci perspektifiyle söz sahibi olmak.',
        'Kalite Güvencesi & Süreç Optimizasyonu: Öğrenci geri bildirimlerini sistematik raporlara dönüştürerek eğitim-öğretim ve idari altyapı süreçlerinin iyileştirilmesine yönelik proaktif çözümler geliştirmek.'
      ]
    },
    {
      title: 'Etkinlik Müdürlüğü - Etkinlik Operasyon Asistanı',
      company: 'Altınbaş Üniversiesi',
      location: '',
      date: 'Eyl 2025 - Devam ediyor',
      bullets: [
        'Büyük Çaplı Operasyon Yönetimi: 11 ayda bakanlık düzeyinde protokol ağırlanan açılışlar, kariyer zirveleri ve festivallerden oluşan 60+ dev etkinliğin sahne arkası koordinasyonunda kilit rol oynamak.',
        'Teknik Altyapı & Prodüksiyon: Ses, ışık ve dijital görüntü sistemlerinin kurulumunu üstlenmek; fotoğraf/video dokümantasyonu ile görsel içerik üretmek.',
        'Kriz Çözümü & Takım Çalışması: Canlı etkinliklerdeki olası teknik darboğazlara karşı anlık çözümler üreterek takım halinde operasyonel mükemmelliği sağlamak.'
      ]
    },
    {
      title: 'Freelance Web Geliştirici',
      company: 'Remote / Uzaktan',
      location: '',
      date: '2021 - 2025',
      bullets: [
        'Uçtan Uca (End-to-End) Proje Yönetimi: Bireysel müşteriler ve KOBİ\'ler için ihtiyaç analizinden canlıya alım sürecine kadar modern, kullanıcı dostu ve %100 mobil uyumlu (responsive) web siteleri tasarlayıp geliştirmek.',
        'Teknik SEO & Performans Optimizasyonu: İşletmelerin dijital görünürlüğünü artırmak amacıyla arama motoru optimizasyonlarını (SEO) kurgulamak ve organik trafik artışı sağlayacak teknik iyileştirmeleri gerçekleştirmek.',
        'Dijital Altyapı & Müşteri İlişkileri: 5 yıl boyunca serbest zamanlı (freelance) portföyü yöneterek; alan adı (domain) kaydı, sunucu (hosting) yapılandırması ve periyodik teknik bakım operasyonlarını kesintisiz olarak yürütmek.'
      ]
    },
    {
      title: 'Bilgi İşlem (IT) Stajyeri',
      company: 'Gayrettepe Sosyal Bilimler Yerleşkesi - ',
      location: 'Altınbaş Üniversitesi',
      date: 'Eyl 2023 - Haz 2024',
      bullets: [
        'Sistem Yönetimi & Merkezi Dağıtım (WDS): Active Directory (IAM) üzerinden kimlik/yetki yönetimini ve Office 365 altyapısını koordine etmek; WDS (Windows Deployment Services) ile cihaz imajlarını merkezi olarak dağıtarak donanım kurulum operasyonlarında hız ve standardizasyon sağlamak.',
        'Uçtan Uca BT Desteği & İş Sürekliliği (Help Desk): Kampüs genelindeki akademik ve idari personelin donanım, yazılım ve ağ sorunlarına proaktif çözümler üreterek üniversitenin eğitim-araştırma faaliyetlerinin kesintisiz (zero-downtime) ilerlemesini güvence altına almak.',
        'Otomasyon & Veri Odaklı Süreç İyileştirme: BT destek taleplerini (ticket) analiz ederek hizmet kalitesini artıracak raporlar oluşturmak; operasyonel iş yükünü hafifletmek amacıyla kodlama becerilerini kullanarak rutin IT görevleri için otomasyon çözümleri geliştirmek.'
      ]
    }
  ],
  activities: [
    {
      name: 'Altınbaş Üniversitesi - Kulüpler Birliği',
      role: 'Haziran 2026',
      org: 'Yönetim kurulu Başkanı',
      bullets: []
    },
    {
      name: 'Altınbaş Üniversitesi - Yapay zeka Ve Robotik Kulübü',
      role: 'Aralık 2025 - Devam ediyor',
      org: 'Yönetim kurulu Başkanı',
      bullets: [
        'Stratejik Liderlik & İş Birlikleri: Yönetim kurulu üyeliğinden başkanlığa uzanan süreçte, Riva Labs ve Sui Türkiye gibi sektör paydaşlarıyla iş birlikleri kurarak teknoloji ekosistemini kampüse taşımak.',
        'Teknik Etkinlik Yönetimi: Web3, Move dili, dApp entegrasyonu (Sui & Move Bootcamp) ve veri analizi (Excel Sertifika Programı) gibi yüzlerce öğrenciye hitap eden uygulamalı (hands-on) eğitimler ve atölyeler organize etmek.',
        'Ölçeklenebilir Proje Geliştirme: Kulüp ekosistemi ve "Elmalı Yönetim" projesi kapsamında Next.js kullanarak büyük ölçekli, sürdürülebilir ve modern yazılım mimarisine sahip web projeleri geliştirmek.'
      ]
    },
    {
      name: 'Altınbaş Üniversitesi - Veri Bilimi Kulübü',
      role: 'Eylül 2025 - Aralık 2025',
      org: 'Yönetim Kurulu Başkan Yardımcısı',
      bullets: []
    }
  ],
  skills: [
    { category: 'Tasarım & Modern Web', value: 'TypeScript, React & Next.js, UI/UX Design (Figma), Adobe Creative Suite (Ps Ai Pr Ae), Tailwind CSS' },
    { category: 'Yönetim & Sistem Yönetimi', value: 'Kalite Güvencesi (YÖKAK), Stratejik Raporlama, Teknik Etkinlik Operasyonları, Bilgi İşlem (IT) Teknik Destek' },
    { category: 'Kurumsal Operasyon & Altyapı', value: 'Active Directory, WDS, Office 365 Yönetimi, SQL ve Firebase, Python, REST API\'leri' }
  ],
  languages: [
    { name: 'Türkçe', level: 'Anadili' },
    { name: 'İngilizce', level: 'C1 - İleri' },
    { name: 'Almanca', level: 'A2 - Temel' }
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
  if (savedTemplate && templateStyles[savedTemplate]) {
    currentTemplate = savedTemplate;
    document.getElementById('templateSelector').value = savedTemplate;
  } else {
    currentTemplate = 'classic';
    document.getElementById('templateSelector').value = 'classic';
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
      
      if (data.template && templateStyles[data.template]) {
        currentTemplate = data.template;
        document.getElementById('templateSelector').value = data.template;
      } else if (data.template) {
        currentTemplate = 'classic';
        document.getElementById('templateSelector').value = 'classic';
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
      ${makeField('act-role', 'Tarih', data.role, 1)}
      ${makeField('act-org', 'Görev', data.org || '', 1)}
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
  if (email) contactItems.push(`<a href="mailto:${esc(email)}" class="cv-link">${esc(email)}</a>`);
  links.forEach(l => {
    if (l.url) {
      const href = normalizeUrl(l.url);
      contactItems.push(`<a href="${esc(href)}" target="_blank" class="cv-link">${esc(l.url)}</a>`);
    }
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

function normalizeUrl(url) {
  if (!url) return '';
  url = url.trim();
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(url)) return url;
  if (url.includes('@') && !url.includes('/')) return `mailto:${url}`;
  return `https://${url}`;
}

function downloadPdf() {
  const btn = document.getElementById('downloadPdf');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<span>⏳</span> Hazırlanıyor...';
  btn.disabled = true;

  try {
    const data = collectData();
    const fileName = `${(data.fullName || 'CV').replace(/\s+/g, '_')}_CV.pdf`;
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Register Times New Roman fonts
    pdf.addFileToVFS('TimesNewRoman-Regular.ttf', timesFonts.regular);
    pdf.addFileToVFS('TimesNewRoman-Bold.ttf', timesFonts.bold);
    pdf.addFont('TimesNewRoman-Regular.ttf', 'TimesNewRoman', 'normal');
    pdf.addFont('TimesNewRoman-Bold.ttf', 'TimesNewRoman', 'bold');

    const style = templateStyles[currentTemplate] || templateStyles.classic;
    const accentColor = style.color;
    const textColor = '#000000';
    const subColor = '#333333';

    const pageW = 210;
    const margin = 18;
    const contentW = pageW - margin * 2;
    let y = margin;

    const ptToMm = (pt) => pt * 0.352778;

    const setStyle = (size, weight, color = textColor) => {
      pdf.setFont('TimesNewRoman', weight);
      pdf.setFontSize(size);
      pdf.setTextColor(color);
    };

    const addText = (text, x, yy, options = {}) => {
      if (!text) return yy;
      const maxW = options.maxWidth || contentW;
      const lines = pdf.splitTextToSize(text, maxW);
      pdf.text(lines, x, yy, options);
      return yy + lines.length * ptToMm(pdf.getFontSize()) * (options.lineHeight || 1.25);
    };

    const checkPageBreak = (height) => {
      if (y + height > 297 - margin) {
        pdf.addPage();
        y = margin;
        return true;
      }
      return false;
    };

    // Place a label on the right side of the current line if it fits,
    // otherwise wrap it below the current line, right aligned.
    // Returns the extra vertical space added.
    const placeRightOrWrap = (label, yy, currentSize = 9.5, bold = true) => {
      if (!label) {
        if (bold) setStyle(currentSize, 'bold', textColor);
        return 0;
      }
      const labelW = pdf.getTextWidth(label);
      if (labelW <= contentW) {
        pdf.text(label, pageW - margin - labelW, yy);
        if (bold) setStyle(currentSize, 'bold', textColor);
        return 0;
      }
      // Label too wide: wrap below the current line, right aligned
      setStyle(8.5, 'normal', subColor);
      const wrapped = pdf.splitTextToSize(label, contentW);
      const lineH = ptToMm(8.5) * 1.2;
      const wrappedH = wrapped.length * lineH;
      const firstLineW = pdf.getTextWidth(wrapped[0]);
      pdf.text(wrapped, pageW - margin - firstLineW, yy + 3.4);
      if (bold) setStyle(currentSize, 'bold', textColor);
      return wrappedH + 1.5;
    };

    // Estimate how much vertical space a short section needs, so we can keep it whole.
    const estimateSectionHeight = (section) => {
      let h = 11; // title + underline + spacing
      if (section.type === 'text' || section.type === 'reference') {
        const lines = (section.text || '').split('\n').filter(l => l.trim());
        h += lines.length * 5.5 + 2;
      } else if (section.type === 'skill' || section.type === 'language') {
        const items = (section.items || []).filter(i => i.category || i.value || i.name);
        setStyle(10, 'normal', textColor);
        items.forEach(item => {
          const text = section.type === 'skill'
            ? `${item.category}: ${item.value}`
            : `${item.name}: ${item.level}`;
          const lines = pdf.splitTextToSize(text, contentW);
          h += lines.length * 4.2 + 1;
        });
      } else if (section.type === 'education') {
        const items = (section.items || []).filter(i => i.school || i.degree);
        items.forEach(item => {
          h += 6; // school + date
          if (item.degree) {
            setStyle(9.5, 'normal', subColor);
            const degLines = pdf.splitTextToSize(item.degree, contentW);
            h += degLines.length * 3.8 + 1.5;
          }
          h += 2;
        });
      } else if (section.type === 'experience' || section.type === 'custom' || section.type === 'activity') {
        const items = (section.items || []).filter(i => i.title || i.name);
        items.forEach(item => {
          h += 6; // title/name line
          if (section.type === 'activity') {
            if (item.role) h += 4.2; // date on the right
            if (item.org) {
              setStyle(9.5, 'normal', subColor);
              const orgLines = pdf.splitTextToSize(item.org, contentW);
              h += orgLines.length * 3.8 + 1;
            }
          } else {
            const subtitle = [item.company, item.location, item.subtitle].filter(Boolean).join(' / ');
            if (subtitle) {
              setStyle(9.5, 'normal', subColor);
              const subLines = pdf.splitTextToSize(subtitle, contentW);
              h += subLines.length * 3.8 + 1.5;
            }
          }
          (item.bullets || []).forEach(b => {
            if (!b.trim()) return;
            setStyle(9.5, 'normal', textColor);
            const bulletLines = pdf.splitTextToSize('• ' + b.trim(), contentW - 5);
            h += bulletLines.length * 4.0;
          });
          h += 3;
        });
      }
      return h;
    };

    // Header
    setStyle(18, 'bold', textColor);
    const headerAlign = style.headerAlign || 'center';
    const nameText = data.fullName || 'Ad Soyad';
    const nameW = pdf.getTextWidth(nameText);
    const nameX = headerAlign === 'center' ? (pageW - nameW) / 2 : margin;
    pdf.text(nameText, nameX, y);
    y += 8;

    // Contact row
    const contactParts = [];
    if (data.phone) contactParts.push(data.phone);
    if (data.email) contactParts.push(data.email);
    data.links.forEach(l => { if (l.url) contactParts.push(l.url); });

    if (contactParts.length) {
      setStyle(9, 'normal', subColor);
      const contactText = contactParts.join('  |  ');
      const contactLines = pdf.splitTextToSize(contactText, contentW);
      const firstLineW = pdf.getTextWidth(contactLines[0]);
      const contactX = headerAlign === 'center' ? (pageW - firstLineW) / 2 : margin;
      pdf.text(contactLines, contactX, y);
      const contactH = contactLines.length * ptToMm(9) * 1.25;
      y += contactH + 2;

      // Add clickable links
      let linkX = contactX;
      const lineY = y - contactH - 1.5;
      contactParts.forEach((part, idx) => {
        const partW = pdf.getTextWidth(part);
        if (linkX + partW > contactX + contentW) return;
        const href = idx === 0 && data.phone ? `tel:${data.phone}` :
                     idx === (data.phone ? 1 : 0) && data.email ? `mailto:${data.email}` :
                     normalizeUrl(part);
        pdf.link(linkX, lineY - 2.5, partW, 3.5, { url: href });
        const sep = '  |  ';
        if (idx < contactParts.length - 1) linkX += partW + pdf.getTextWidth(sep);
      });
    }

    // Header line
    pdf.setDrawColor(accentColor);
    pdf.setLineWidth(0.5);
    const lineX = headerAlign === 'center' ? margin + contentW * 0.1 : margin;
    const lineW = headerAlign === 'center' ? contentW * 0.8 : contentW;
    pdf.line(lineX, y, lineX + lineW, y);
    y += 8;

    const sectionStyle = style.sectionStyle || 'uppercase-line';

    const renderSectionTitle = (title) => {
      checkPageBreak(10);
      const titleText = sectionStyle === 'uppercase-line' ? title.toUpperCase() : title;
      setStyle(11, 'bold', sectionStyle === 'boxed' ? '#ffffff' : accentColor);

      if (sectionStyle === 'boxed') {
        const titleW = pdf.getTextWidth(titleText);
        pdf.setFillColor(accentColor);
        pdf.rect(margin, y - 3.4, titleW + 4, 5.4, 'F');
        pdf.text(titleText, margin + 2, y);
        y += 5.5;
      } else if (sectionStyle === 'bold-color') {
        pdf.text(titleText, margin, y);
        y += 1.8;
        pdf.setDrawColor(accentColor);
        pdf.setLineWidth(0.6);
        pdf.line(margin, y, pageW - margin, y);
        y += 4.5;
      } else if (sectionStyle === 'simple') {
        pdf.text(titleText, margin, y);
        y += 1.8;
        pdf.setDrawColor('#999999');
        pdf.setLineWidth(0.3);
        pdf.setLineDashPattern([1, 1], 0);
        pdf.line(margin, y, pageW - margin, y);
        pdf.setLineDashPattern([], 0);
        y += 4.5;
      } else {
        // uppercase-line default
        pdf.text(titleText, margin, y);
        y += 1.8;
        pdf.setDrawColor(accentColor);
        pdf.setLineWidth(0.4);
        pdf.line(margin, y, pageW - margin, y);
        y += 4.5;
      }
    };

    const renderSection = (title, renderContent, estimatedH = 0) => {
      // If the whole section is short, keep it on one page
      if (estimatedH > 0 && estimatedH < 90) {
        checkPageBreak(estimatedH);
      }
      renderSectionTitle(title);
      renderContent();
      y += 4.5;
    };

    data.sections.forEach(section => {
      const estimatedH = estimateSectionHeight(section);

      if (section.type === 'text') {
        if (!section.text) return;
        renderSection(section.title, () => {
          setStyle(10, 'normal', textColor);
          const paragraphs = section.text.split('\n').filter(l => l.trim());
          paragraphs.forEach(p => {
            checkPageBreak(10);
            y = addText(p, margin, y, { maxWidth: contentW, lineHeight: 1.3 });
            y += 2.5;
          });
        }, estimatedH);
      } else if (section.type === 'reference') {
        if (!section.text) return;
        renderSection(section.title, () => {
          setStyle(10, 'normal', subColor);
          y = addText(section.text, margin, y, { maxWidth: contentW, lineHeight: 1.25 });
        }, estimatedH);
      } else if (section.type === 'education') {
        const items = (section.items || []).filter(i => i.school || i.degree);
        if (!items.length) return;
        renderSection(section.title, () => {
          items.forEach(item => {
            checkPageBreak(13);
            setStyle(10.5, 'bold', textColor);
            const school = item.school || '';
            pdf.text(school, margin, y);
            const extra = placeRightOrWrap(item.date, y, 10.5);
            y += 5 + extra;
            if (item.degree) {
              setStyle(9.5, 'normal', subColor);
              y = addText(item.degree, margin, y, { maxWidth: contentW, lineHeight: 1.25 });
              y += 1.5;
            }
            y += 2;
          });
        }, estimatedH);
      } else if (section.type === 'experience' || section.type === 'custom') {
        const items = (section.items || []).filter(i => i.title || i.company || i.name);
        if (!items.length) return;
        renderSection(section.title, () => {
          items.forEach(item => {
            const titleVal = item.title || item.name || '';
            const subtitle = [item.company, item.location, item.subtitle].filter(Boolean).join(' / ');
            const bullets = item.bullets || [];
            checkPageBreak(13);

            setStyle(10.5, 'bold', textColor);
            pdf.text(titleVal, margin, y);
            const extra = placeRightOrWrap(item.date, y, 10.5);
            y += 5 + extra;

            if (subtitle) {
              setStyle(9.5, 'normal', subColor);
              y = addText(subtitle, margin, y, { maxWidth: contentW, lineHeight: 1.25 });
              y += 1.5;
            }

            if (bullets.length) {
              setStyle(9.5, 'normal', textColor);
              bullets.forEach(b => {
                if (!b.trim()) return;
                const bulletText = '• ' + b.trim();
                const lines = pdf.splitTextToSize(bulletText, contentW - 5);
                checkPageBreak(lines.length * 4.0 + 1);
                pdf.text(lines, margin + 2.5, y, { maxWidth: contentW - 5 });
                y += lines.length * 4.0;
              });
            }
            y += 3;
          });
        }, estimatedH);
      } else if (section.type === 'activity') {
        const items = (section.items || []).filter(i => i.name);
        if (!items.length) return;
        renderSection(section.title, () => {
          items.forEach(item => {
            const bullets = item.bullets || [];
            checkPageBreak(13);

            // Name (position) on left, role (date) on right
            setStyle(10.5, 'bold', textColor);
            const name = item.name || '';
            pdf.text(name, margin, y);
            const dateExtra = placeRightOrWrap(item.role, y, 10.5);
            y += 5 + dateExtra;

            // Org below on the left
            if (item.org) {
              setStyle(9.5, 'normal', subColor);
              y = addText(item.org, margin, y, { maxWidth: contentW, lineHeight: 1.25 });
              y += 1;
            }

            if (bullets.length) {
              setStyle(9.5, 'normal', textColor);
              bullets.forEach(b => {
                if (!b.trim()) return;
                const bulletText = '• ' + b.trim();
                const lines = pdf.splitTextToSize(bulletText, contentW - 5);
                checkPageBreak(lines.length * 4.0 + 1);
                pdf.text(lines, margin + 2.5, y, { maxWidth: contentW - 5 });
                y += lines.length * 4.0;
              });
            }
            y += 3;
          });
        }, estimatedH);
      } else if (section.type === 'skill') {
        const items = (section.items || []).filter(i => i.category || i.value);
        if (!items.length) return;
        renderSection(section.title, () => {
          setStyle(10, 'normal', textColor);
          items.forEach(item => {
            const text = `${item.category}: ${item.value}`;
            const lines = pdf.splitTextToSize(text, contentW);
            checkPageBreak(lines.length * 4.2 + 1);
            pdf.text(lines, margin, y);
            y += lines.length * 4.2;
          });
        }, estimatedH);
      } else if (section.type === 'language') {
        const items = (section.items || []).filter(i => i.name);
        if (!items.length) return;
        renderSection(section.title, () => {
          setStyle(10, 'normal', textColor);
          items.forEach(item => {
            const text = `${item.name}: ${item.level}`;
            const lines = pdf.splitTextToSize(text, contentW);
            checkPageBreak(lines.length * 4.2 + 1);
            pdf.text(lines, margin, y);
            y += lines.length * 4.2;
          });
        }, estimatedH);
      }
    });

    pdf.save(fileName);
  } catch (err) {
    console.error('PDF generation error:', err);
    alert('PDF oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

function esc(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
