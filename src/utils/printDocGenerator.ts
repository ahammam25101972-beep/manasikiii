// Utility to generate standalone, pristine print-ready HTML documents, editable Word documents (.doc),
// and manage printing fallbacks for the Manasiki application.
// Designed specifically to bypass iframe restrictions, embed visual screen mockups, and provide highly accessible pricing.

import { PREP_SCREEN_IMAGE_BASE64 } from './prepScreenImageBase64';

export interface PrintDocOptions {
  companyName: string;
  licenseNumber: string;
  activeSection?: 'all' | 'matrix' | 'screens' | 'tech' | 'commercial';
  selectedScreenTab?: 'home' | 'prep' | 'radar' | 'camp' | 'counter' | 'company';
  appUrl?: string;
}

export function generateBrochureHtml(options: PrintDocOptions): string {
  const {
    companyName = 'شركة السياحة والحج المصرية المعتمدة',
    licenseNumber = 'ترخيص سياحي رقم 1842 - فئة (أ)',
  } = options;

  const printDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>دليل وعرض توثيق تطبيق مناسكي - ملف الطباعة والعرض التعريفي</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
  <style>
    :root {
      --primary: #047857;
      --primary-dark: #064e3b;
      --primary-light: #ecfdf5;
      --secondary: #b45309;
      --secondary-light: #fef3c7;
      --text-main: #111827;
      --text-muted: #4b5563;
      --border-color: #cbd5e1;
      --bg-page: #f8fafc;
      --bg-card: #ffffff;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Tajawal', system-ui, -apple-system, sans-serif;
      background-color: var(--bg-page);
      color: var(--text-main);
      line-height: 1.6;
      font-size: 13.5px;
      direction: rtl;
    }

    .toolbar-sticky {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #064e3b;
      color: white;
      padding: 12px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .toolbar-title {
      font-weight: 700;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .toolbar-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .btn-action {
      background: #f59e0b;
      color: #78350f;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-family: inherit;
      font-weight: 700;
      font-size: 12.5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }

    .btn-action:hover {
      background: #d97706;
      color: white;
    }

    .btn-word {
      background: #2563eb;
      color: white;
    }
    .btn-word:hover {
      background: #1d4ed8;
    }

    .btn-secondary {
      background: rgba(255,255,255,0.15);
      color: white;
    }

    .btn-secondary:hover {
      background: rgba(255,255,255,0.25);
    }

    .print-tip {
      font-size: 12px;
      opacity: 0.9;
    }

    .page-container {
      max-width: 980px;
      margin: 30px auto;
      background: var(--bg-card);
      padding: 36px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1px solid var(--border-color);
    }

    .cover-header {
      text-align: center;
      border-bottom: 3px double var(--primary);
      padding-bottom: 22px;
      margin-bottom: 26px;
    }

    .badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--secondary-light);
      color: var(--secondary);
      font-weight: 700;
      font-size: 12px;
      padding: 4px 14px;
      border-radius: 20px;
      border: 1px solid #fde68a;
      margin-bottom: 12px;
    }

    h1.main-title {
      color: var(--primary-dark);
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin-bottom: 6px;
    }

    .sub-title {
      color: var(--secondary);
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 15px;
    }

    .meta-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 12px;
      font-size: 12px;
      color: var(--text-muted);
    }

    .meta-item {
      background: #f1f5f9;
      padding: 5px 12px;
      border-radius: 6px;
      font-weight: 600;
    }

    .section-title {
      color: var(--primary-dark);
      font-size: 19px;
      font-weight: 800;
      border-right: 5px solid var(--primary);
      padding-right: 12px;
      margin: 30px 0 14px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .section-sub {
      color: var(--text-muted);
      font-size: 12.5px;
      font-weight: 400;
      margin-top: 2px;
    }

    /* Comparison Matrix Table */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 12.5px;
    }

    table.data-table th, table.data-table td {
      border: 1px solid var(--border-color);
      padding: 9px 12px;
      text-align: right;
      vertical-align: top;
    }

    table.data-table th {
      background: #f8fafc;
      font-weight: 800;
      color: var(--text-main);
    }

    table.data-table th.col-b2b {
      background: #ecfdf5;
      color: var(--primary-dark);
    }

    table.data-table th.col-b2c {
      background: #fffbeb;
      color: #92400e;
    }

    table.data-table tr:nth-child(even) td {
      background: #fcfcfd;
    }

    .b2b-highlight {
      color: var(--primary-dark);
      font-weight: 600;
    }

    /* Screen Card with Phone Visual Mockup */
    .screen-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 18px;
      margin-bottom: 22px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .screen-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 10px;
      margin-bottom: 14px;
    }

    .screen-num {
      width: 30px;
      height: 30px;
      background: var(--primary);
      color: white;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
    }

    .screen-card-title {
      font-weight: 800;
      font-size: 15px;
      color: var(--primary-dark);
    }

    .screen-grid-3col {
      display: grid;
      grid-template-columns: 210px 1.2fr 1fr;
      gap: 14px;
      align-items: start;
    }

    @media (max-width: 860px) {
      .screen-grid-3col {
        grid-template-columns: 1fr;
      }
    }

    .feature-list {
      list-style-type: disc;
      padding-right: 18px;
      color: var(--text-muted);
      font-size: 12px;
    }

    .feature-list li {
      margin-bottom: 5px;
    }

    .diff-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 11px;
      font-size: 12px;
    }

    /* Visual Phone Mockup Box */
    .phone-mockup {
      background: #0f172a;
      border-radius: 18px;
      padding: 7px;
      border: 2px solid #334155;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 210px;
      margin: 0 auto;
    }

    .phone-screen {
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #cbd5e1;
      font-size: 9.5px;
      line-height: 1.35;
    }

    .phone-top {
      background: #064e3b;
      color: white;
      padding: 4px 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 8px;
      font-weight: bold;
    }

    .phone-body {
      padding: 7px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .phone-widget {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 5px 6px;
    }

    .phone-badge {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 8px;
      font-weight: bold;
    }

    .phone-radar-dial {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: radial-gradient(circle, #065f46 0%, #022c22 100%);
      margin: 4px auto;
      border: 2px solid #10b981;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #34d399;
      font-weight: bold;
    }

    .phone-counter-dial {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      border: 3.5px solid #059669;
      background: #ecfdf5;
      margin: 4px auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
    }

    /* Pricing Section Styles */
    .packages-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 14px;
    }

    @media (max-width: 860px) {
      .packages-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .package-card {
      border: 1px solid var(--border-color);
      border-radius: 10px;
      padding: 14px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .package-card.featured {
      border: 2px solid var(--primary);
      box-shadow: 0 4px 12px rgba(4,120,87,0.12);
      background: #fafffd;
    }

    .package-price {
      font-size: 20px;
      font-weight: 900;
      color: var(--primary-dark);
      margin: 8px 0;
    }

    .tech-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      margin-top: 14px;
    }

    .sign-box {
      margin-top: 30px;
      border-top: 2px dashed #cbd5e1;
      padding-top: 20px;
      display: flex;
      justify-content: space-between;
      text-align: center;
    }

    .sign-stamp {
      width: 130px;
      height: 60px;
      border: 2px dashed #94a3b8;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      font-size: 11px;
      margin: 8px auto 0 auto;
    }

    @media print {
      body {
        background: #ffffff !important;
        font-size: 11.5px;
      }
      .no-print, .toolbar-sticky {
        display: none !important;
      }
      .page-container {
        margin: 0 !important;
        padding: 0 !important;
        box-shadow: none !important;
        border: none !important;
        max-width: 100% !important;
      }
      .page-break {
        break-before: page;
        page-break-before: always;
      }
      .screen-card, .diff-box, .package-card {
        break-inside: avoid;
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>

  <!-- Sticky Top Action Bar for Clean Browser Printing and Word Export -->
  <div class="toolbar-sticky no-print">
    <div class="toolbar-title">
      <span class="material-symbols-outlined" style="vertical-align: middle;">menu_book</span>
      <span>دليل وعرض توثيق تطبيق "مَنَاسِكِي" | ملف الطباعة والتعديل الرسمي</span>
    </div>
    <div class="toolbar-actions">
      <!-- Direct Word Export Button -->
      <button class="btn-action btn-word" onclick="downloadWordFromPage()" title="تنزيل الملف كـ Word للتعديل الحر">
        <span class="material-symbols-outlined" style="font-size: 16px;">article</span>
        <span>تحميل كملف Word للتعديل (.doc)</span>
      </button>

      <!-- Print Button -->
      <button class="btn-action" onclick="window.print()" title="طباعة المستند أو الحفظ كملف PDF">
        <span class="material-symbols-outlined" style="font-size: 16px;">print</span>
        <span>طباعة / حفظ PDF (Ctrl+P)</span>
      </button>

      <button class="btn-action btn-secondary" onclick="window.close()">
        <span>إغلاق النافذة</span>
      </button>
    </div>
  </div>

  <div class="page-container">

    <!-- Header & Cover -->
    <div class="cover-header">
      <div class="badge-pill">
        <span>الوثيقة التشغيلية والعرض التعريفي المعتمد - إصدار 2026/2027</span>
      </div>
      <h1 class="main-title">مَنَاسِكِي | MANASIKI</h1>
      <div class="sub-title">المنصة الرقمية المتكاملة لإدارة وتيسير رحلة الحج والعمرة دون الحاجة لإنترنت</div>
      <div class="meta-bar">
        <div class="meta-item">🏢 مخصص لـ: <strong style="color:var(--primary);">${companyName}</strong></div>
        <div class="meta-item">📜 ترخيص وزارة السياحة: <strong>${licenseNumber}</strong></div>
        <div class="meta-item">📅 تاريخ الإصدار: <strong>${printDate}</strong></div>
        <div class="meta-item">🌐 متوافق مع: كافة الهواتف (PWA بدون متجر)</div>
      </div>
    </div>

    <!-- Quick Highlights -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 22px;">
      <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:10px; padding:12px;">
        <strong style="color:#065f46; display:block; margin-bottom:4px;">⚡ 100% يعمل دون إنترنت</strong>
        <p style="font-size:11.5px; color:#047857;">يعمل بكفاءة في صحن المطاف والمشاعر المقدسة حتى لو انقطعت شبكات الجوال تماماً.</p>
      </div>
      <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:12px;">
        <strong style="color:#92400e; display:block; margin-bottom:4px;">📡 رادار الرفاق ومنع الضياع</strong>
        <p style="font-size:11.5px; color:#b45309;">تحديد مسافات أفراد العائلة أو الفوج مترياً وبوصلة توجيه فورية دون الحاجة لخوادم.</p>
      </div>
      <div style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:10px; padding:12px;">
        <strong style="color:#1e293b; display:block; margin-bottom:4px;">💰 أسعار في متناول الجميع</strong>
        <p style="font-size:11.5px; color:#475569;">باقات فردية وعائلية رمزية، وباقات ميسرة جداً لشركات السياحة والحملات المصرية.</p>
      </div>
    </div>

    <!-- 1. COMPARISON MATRIX -->
    <div class="section-title">
      <div>
        <span>أولاً: مصفوفة الفروق الجوهرية بين نسخة الشركات ونسخة الأفراد</span>
        <div class="section-sub">مقارنة دقيقة توضح القيمة المضافة لشركات السياحة والحملات مقابل المعتمر المستقل</div>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th style="width: 22%;">وجه المقارنة</th>
          <th class="col-b2b" style="width: 42%;">🏢 نسخة شركات السياحة والحملات (B2B)</th>
          <th class="col-b2c" style="width: 36%;">👤 نسخة الأفراد والمستقلين (B2C)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>الهوية والعلامة التجارية</strong></td>
          <td class="b2b-highlight">
            • هوية مخصصة بالكامل (White Label) باسم وشعار وترخيص الشركة على كل هواتف الحجاج.<br>
            • تعزيز ولاء المعتمر وبرستيج الشركة أمام العملاء والمنافسين.
          </td>
          <td>• هوية قياسية عامة تحت اسم تطبيق "مَنَاسِكِي".<br>• إمكانية حفظ بيانات الحاج الشخصية محلياً.</td>
        </tr>
        <tr>
          <td><strong>إدارة الفنادق والتسكين</strong></td>
          <td class="b2b-highlight">
            • توزيع آلي لغرف الفنادق في مكة والمدينة على الحجاج مسبقاً بنقرة زر.<br>
            • كارت فندق مباشر يحوي رقم الغرفة، الدور، المسافة للحرم، ورقم هاتف الفندق.
          </td>
          <td>• إدخال يدوي حر للفندق الذي حجزه المعتمر بنفسه، مع حفظ موقعه على الخريطة للرجوع إليه دون ضياع.</td>
        </tr>
        <tr>
          <td><strong>مخيم المشاعر (منى وعرفة)</strong></td>
          <td class="b2b-highlight">
            • توجيه الحجاج تلقائياً إلى رقم الخيمة، الجناح، ورقم السرير الخاص بهم.<br>
            • إرشادات قطار المشاعر ومواعيد التفويج المحددة من الشركة.
          </td>
          <td>• دليل عام لمخيمات المشاعر وسنن المبيت بمنى والوقوف بعرفة، مع إمكانية تثبيت دبوس GPS لمكان خيمته.</td>
        </tr>
        <tr>
          <td><strong>بوفيه الإعاشة والوجبات</strong></td>
          <td class="b2b-highlight">
            • عرض قائمة وجبات البوفيه اليومية للحملة (فطور، غداء، عشاء).<br>
            • إمكانية طلب وجبات مسبقة التغليف أو تحديد التفضيلات الغذائية لمصابي السكري.
          </td>
          <td>• متتبع شرب المياه والترطيب اليومي للوقاية من الإجهاد الحراري، مع تنبيهات بمواعيد الأكل الصحية.</td>
        </tr>
        <tr>
          <td><strong>المشرفون والتواصل الميداني</strong></td>
          <td class="b2b-highlight">
            • بطاقات اتصال سريعة بمشرف الفوج، المرشد الديني المعتمد، ومسعف الحملة (اتصال مباشر وواتساب).<br>
            • تنبيهات وتوجيهات جماعية عاجلة ترسلها الشركة لكافة معتمريها.
          </td>
          <td>• أرقام الطوارئ العامة الرسمية بالمملكة (الهلال الأحمر 997، أمن الحرم، الدفاع المدني 998).</td>
        </tr>
        <tr>
          <td><strong>نداء الاستغاثة الطبي (SOS)</strong></td>
          <td class="b2b-highlight">
            • استدعاء فوري لطبيب ومسعف الحملة مع إرسال رقم الجناح ورقم السرير تلقائياً للمساعدة خلال دقائق.
          </td>
          <td>• إرسال رسالة نجدة بالـ SMS أو الواتساب لأرقام العائلة المسجلة مع إحداثيات GPS الدقيقة للموقع.</td>
        </tr>
        <tr>
          <td><strong>رادار الرفاق والزحام</strong></td>
          <td class="b2b-highlight">
            • تحديد نقطة تجمع رسمية للفوج (مثل: بوابة الملك عبدالعزيز أو محطة كدي) تظهر لجميع الحجاج.
          </td>
          <td>• شبكة اقتران عائلية بالـ QR Code دون إنترنت لربط الزوجين أو الوالدين والأبناء ومتابعة المسافات.</td>
        </tr>
        <tr>
          <td><strong>حقيبة الاستعداد والسفر</strong></td>
          <td class="b2b-highlight">
            • قائمة مجهزة بالمتطلبات الخاصة بشركة السياحة وتنبيهات أوزان حقائب الطيران المتفق عليها.
          </td>
          <td>• حاسبة وزن تفاعلية وقائمة أمتعة كاملة مقسمة لخمس فئات تتيح إضافة وحذف المهام الشخصية بحرية.</td>
        </tr>
      </tbody>
    </table>

    <!-- 2. SCREEN-BY-SCREEN DETAILS WITH VISUAL MOCKUPS -->
    <div class="page-break"></div>
    <div class="section-title">
      <div>
        <span>ثانياً: التوثيق التفصيلي الشامل لشاشات التطبيق مدعماً بالصور والمعاينة البصرية</span>
        <div class="section-sub">معاينة بصرية لكل شاشة هاتف على حدة مع المكونات والفارق الميداني بين نسختي الشركات والأفراد</div>
      </div>
    </div>

    <!-- Screen 1: Home Dashboard -->
    <div class="screen-card">
      <div class="screen-card-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="screen-num">1</div>
          <div>
            <div class="screen-card-title">الشاشة الرئيسية (لوحة القيادة والمتابعة اللحظية)</div>
            <div style="font-size:11.5px; color:var(--text-muted);">الواجهة المركزية الأولى التي تفتح أمام الحاج فور تشغيل التطبيق</div>
          </div>
        </div>
        <span style="background:#ecfdf5; color:#065f46; font-size:11px; font-weight:700; padding:3px 10px; border-radius:6px;">شاشة أساسية</span>
      </div>

      <div class="screen-grid-3col">
        <!-- Visual Phone Mockup 1 -->
        <div class="phone-mockup">
          <div class="phone-screen">
            <div class="phone-top">
              <span>9:41</span>
              <span>100% Offline ⚡</span>
            </div>
            <div class="phone-body">
              <div style="background:#047857; color:white; border-radius:6px; padding:6px; text-align:center;">
                <div style="font-size:8px; opacity:0.9;">${companyName}</div>
                <div style="font-weight:bold; font-size:10px; margin-top:2px;">الحاج / أحمد محمود</div>
                <span class="phone-badge" style="background:#ecfdf5; color:#065f46;">شارة حاج #8412</span>
              </div>
              <div class="phone-widget" style="border-right:3px solid #b45309;">
                <div style="color:#b45309; font-weight:bold; font-size:8.5px;">منسك اليوم: طواف الإفاضة</div>
                <div style="font-size:8px; color:#64748b;">متبقي للتفويج: 01:45:00</div>
              </div>
              <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
                <div class="phone-widget" style="text-align:center;">
                  <div style="font-size:11px;">🕋</div>
                  <div style="font-weight:bold; font-size:8px;">عداد الطواف</div>
                </div>
                <div class="phone-widget" style="text-align:center;">
                  <div style="font-size:11px;">📡</div>
                  <div style="font-weight:bold; font-size:8px;">رادار الرفاق</div>
                </div>
              </div>
              <div class="phone-widget" style="background:#f1f5f9;">
                <div style="font-weight:bold; font-size:8.5px; color:#1e293b;">فندق برج الصفوة - مكة</div>
                <div style="font-size:8px; color:#475569;">غرفة 1408 | 320م للحرم</div>
              </div>
              <div style="background:#ecfdf5; color:#065f46; border-radius:4px; padding:3px; text-align:center; font-size:8px; font-weight:bold;">
                📞 مشرف الفوج: أ. إبراهيم (متاح)
              </div>
            </div>
          </div>
          <div style="text-align:center; color:#94a3b8; font-size:8.5px; margin-top:4px;">[معاينة الشاشة الرئيسية]</div>
        </div>

        <!-- Components List -->
        <div>
          <strong style="color:var(--secondary); display:block; margin-bottom:6px;">مكونات الشاشة:</strong>
          <ul class="feature-list">
            <li><strong>شارة الحاج الرقمية (Badge ID):</strong> اسم الحاج، الكود الموحد، ورقم جواز السفر.</li>
            <li><strong>منسك اليوم والعد التنازلي:</strong> منبه زمني حي بالدقائق لموعد التفويج أو الصلاة القادمة.</li>
            <li><strong>شريط مواقيت الصلاة بمكة المكرمة:</strong> أوقات الصلوات الخمس مع تنبيهات مخصصة.</li>
            <li><strong>كروت الوصول السريع:</strong> الطواف، الرادار، المخيم، والحقيبة بلمسة واحدة.</li>
            <li><strong>بطاقة الفندق ومسافة الحرم:</strong> إرشاد مباشر للغرفة ومسافة المشي بالأمتار.</li>
            <li><strong>زر اتصال المشرف:</strong> اتصال هاتفي ومحادثة واتساب مباشرة.</li>
          </ul>
        </div>

        <!-- Diff Box -->
        <div class="diff-box">
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">الفارق الميداني بين النسختين:</strong>
          <p style="margin-bottom:6px;"><strong>في نسخة الشركات:</strong> شعار وترخيص شركة السياحة أعلى الشاشة، اسم ورقم المشرف ورقم رحلة الطيران، وبيانات فندقية معتمدة مركزياً.</p>
          <p><strong>في نسخة الأفراد:</strong> مرونة كاملة للمعتمر المستقل لتخصيص فندقه بنفسه وإدخال موقع سكنه بحرية.</p>
        </div>
      </div>
    </div>

    <!-- Screen 2: Preparation & Luggage -->
    <div class="screen-card">
      <div class="screen-card-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="screen-num">2</div>
          <div>
            <div class="screen-card-title">شاشة «حقيبة الاستعداد لرحلة العمر» وتتبع الأمتعة والأوزان (Preparation Checklist)</div>
            <div style="font-size:11.5px; color:var(--text-muted);">من عقد النية إلى صعود الطائرة.. خطوات موثقة للمعتمر والحاج لاستعداد روحي ولوجستي متكامل (جاهزية 82%)</div>
          </div>
        </div>
        <span style="background:#ecfdf5; color:#065f46; font-size:11px; font-weight:700; padding:3px 10px; border-radius:6px; border:1px solid #a7f3d0;">✓ صورة معتمدة من التطبيق</span>
      </div>

      <div class="screen-grid-3col">
        <!-- Visual Phone Mockup 2 & Real Screen Capture -->
        <div>
          <!-- Real App Screenshot Embedded Directly -->
          <div style="background:#0f172a; padding:8px; border-radius:14px; border:2px solid #059669; text-align:center; box-shadow:0 6px 18px rgba(0,0,0,0.15); margin-bottom:12px;">
            <img src="${PREP_SCREEN_IMAGE_BASE64}" alt="لقطة الشاشة الحقيقية لحقيبة الاستعداد لرحلة العمر" style="width:100%; max-width:210px; height:auto; border-radius:8px; display:block; margin:0 auto;" />
            <div style="color:#6ee7b7; font-size:8.5px; font-weight:bold; margin-top:5px;">[ لقطة الشاشة الحقيقية من داخل التطبيق ]</div>
          </div>

          <!-- Phone Mockup -->
          <div class="phone-mockup">
            <div class="phone-screen">
              <div class="phone-top">
                <span>9:41</span>
                <span>حقيبة الاستعداد 🧳</span>
              </div>
              <div class="phone-body" style="background:#0f172a; color:#f1f5f9;">
                <div style="display:flex; justify-content:space-between; font-size:7px; color:#34d399;">
                  <span>موسم 1446هـ</span>
                  <span style="background:#064e3b; padding:1px 4px; border-radius:3px; color:#fde68a;">متبقي 6 أيام</span>
                </div>
                <div style="background:linear-gradient(135deg, #065f46, #022c22); border:1px solid #059669; border-radius:6px; padding:6px; display:flex; align-items:center; gap:6px;">
                  <div style="width:34px; height:34px; border-radius:50%; border:2px solid #34d399; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#064e3b; shrink-0;">
                    <span style="font-weight:900; font-size:9px; color:#fbbf24;">82%</span>
                    <span style="font-size:5px; color:#a7f3d0;">المكتمل</span>
                  </div>
                  <div style="font-size:7.5px; line-height:1.2;">
                    <div style="font-weight:bold; color:#fde68a;">جاهزية استثنائية</div>
                    <div style="font-size:6.5px; color:#a7f3d0;">14 من 17 مهمة أنجزت</div>
                    <div style="background:#022c22; height:3px; border-radius:2px; margin-top:2px; overflow:hidden;">
                      <div style="background:#fbbf24; width:82%; height:100%;"></div>
                    </div>
                  </div>
                </div>
                <div style="background:#451a03; border-right:2px solid #f59e0b; border-radius:4px; padding:4px; font-size:7px; color:#fef3c7; line-height:1.2;">
                  <strong style="color:#fbbf24;">💡 نصيحة اليوم:</strong> أدوية الطوارئ بحقيبة يدك بالطائرة.
                </div>
                <div class="phone-widget" style="background:#1e293b; border-color:#334155; color:#cbd5e1; font-size:7px; padding:4px;">
                  <div style="display:flex; justify-content:space-between; color:#34d399;">
                    <span>✓ الإجراءات والتصاريح</span>
                    <strong>100%</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between; color:#fbbf24; margin-top:2px;">
                    <span>✓ المستلزمات الشرعية</span>
                    <strong>85%</strong>
                  </div>
                </div>
                <div style="background:#059669; color:white; border-radius:4px; padding:3px; text-align:center; font-size:7.5px; font-weight:bold;">
                  مشاركة الحقيبة مع الرفقاء
                </div>
              </div>
            </div>
            <div style="text-align:center; color:#94a3b8; font-size:8px; margin-top:3px;">[محاكاة شاشة الجوال]</div>
          </div>
        </div>

        <!-- Components List -->
        <div>
          <strong style="color:var(--secondary); display:block; margin-bottom:6px;">مكونات شاشة حقيبة الاستعداد:</strong>
          <ul class="feature-list">
            <li><strong>شارة الرحلة والعد التنازلي:</strong> (رحلة الحج المباركة ١٤٤٦هـ - متبقي 6 أيام على الإقلاع).</li>
            <li><strong>مؤشر الجاهزية الدائري الذكي (82%):</strong> حلقة دائرية مضيئة تحسب فورياً نسبة الإنجاز مع تنبيه بـ 3 مهام متبقية.</li>
            <li><strong>بطاقة «نصيحة مناسكي لليوم»:</strong> إرشادات لوجستية وصحية يومية ذكية (مثل: حفظ الأدوية بحقيبة اليد تحسباً لأي تأخير شحن).</li>
            <li><strong>قوائم التجهيز والمهمات الـ 5 الموثقة:</strong>
              <div style="font-size:11px; margin-right:8px; color:var(--primary); line-height:1.4; margin-top:2px;">
                • الإجراءات والتصاريح (جواز السفر، نسك، بطاقة الحاج)<br>
                • ملابس الإحرام والمستلزمات الشرعية غير المخيطة<br>
                • الصيدلية والأدوية الشخصية والضغط والسكري<br>
                • الإلكترونيات والباوربانك والشواحن الثلاثية<br>
                • مستحضرات النظافة غير المعطرة المباحة للمحرم
              </div>
            </li>
            <li><strong>حاسبة الوزن المتبقي:</strong> حساب دقيق للأوزان لتفادي غرامات المطار.</li>
            <li><strong>مشاركة فورية بالواتساب:</strong> إرسال القائمة بضغطة زر للأهل والرفقاء.</li>
          </ul>
        </div>

        <!-- Diff Box -->
        <div class="diff-box">
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">الفارق الميداني بين النسختين:</strong>
          <p style="margin-bottom:6px;"><strong>في نسخة الشركات:</strong> تتضمن ملصقات حقائب الحملة الموحدة، باج التعارف الرسمي للشركة، وإرشادات وزن تذاكر الطيران المتفق عليها مع شركة الطيران.</p>
          <p style="margin-bottom:6px;"><strong>في نسخة الأفراد:</strong> مرونة كاملة للمسافر المستقل لتخصيص القائمة وإضافة أغراض عائلية خاصة بحسب نوع خطوط الطيران الاقتصادية.</p>
          <div style="background:#ecfdf5; border:1px solid #a7f3d0; padding:6px; border-radius:6px; font-size:11px; color:#065f46; margin-top:6px;">
            <strong>🌟 النتيجة:</strong> القضاء على 95% من مشاكل نسيان الأدوية والتصاريح قبل السفر.
          </div>
        </div>
      </div>
    </div>

    <!-- Screen 3: Radar & Crowd -->
    <div class="screen-card">
      <div class="screen-card-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="screen-num">3</div>
          <div>
            <div class="screen-card-title">شاشة رادار المشاعر ومؤشر الزحام اللحظي (Radar & Heatmap)</div>
            <div style="font-size:11.5px; color:var(--text-muted);">الابتكار التكنولوجي الأول لمنع ضياع المعتمرين وتتبع كثافة الحرم دون إنترنت</div>
          </div>
        </div>
        <span style="background:#ecfdf5; color:#065f46; font-size:11px; font-weight:700; padding:3px 10px; border-radius:6px;">براءة اختراع تشغيلية</span>
      </div>

      <div class="screen-grid-3col">
        <!-- Visual Phone Mockup 3 -->
        <div class="phone-mockup">
          <div class="phone-screen">
            <div class="phone-top">
              <span>9:41</span>
              <span>رادار الرفاق 📡</span>
            </div>
            <div class="phone-body">
              <div class="phone-radar-dial">
                <span style="font-size:7px; position:absolute; top:4px;">شمال N</span>
                <span style="font-size:8px; font-weight:bold;">🕋 الكعبة</span>
                <div style="position:absolute; bottom:10px; right:14px; background:#10b981; width:6px; height:6px; border-radius:50%;"></div>
                <div style="position:absolute; top:20px; left:16px; background:#f59e0b; width:6px; height:6px; border-radius:50%;"></div>
              </div>
              <div class="phone-widget" style="padding:4px 6px;">
                <div style="display:flex; justify-content:space-between; font-size:8px; font-weight:bold; color:#065f46;">
                  <span>🟢 فاطمة (الزوجة)</span>
                  <span>18 م شمالاً</span>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:8px; font-weight:bold; color:#b45309; margin-top:2px;">
                  <span>🚩 تجمع الفوج</span>
                  <span>45 م (كدي)</span>
                </div>
              </div>
              <div style="background:#ecfdf5; border-radius:4px; padding:3px; font-size:7.5px; color:#065f46; text-align:center;">
                صحن المطاف: 42% كثافة معتدلة
              </div>
              <div style="background:#047857; color:white; border-radius:4px; padding:3px; text-align:center; font-size:8px; font-weight:bold;">
                مسح كود QR لإضافة رفيق
              </div>
            </div>
          </div>
          <div style="text-align:center; color:#94a3b8; font-size:8.5px; margin-top:4px;">[معاينة رادار الرفاق]</div>
        </div>

        <!-- Components List -->
        <div>
          <strong style="color:var(--secondary); display:block; margin-bottom:6px;">مكونات الشاشة:</strong>
          <ul class="feature-list">
            <li><strong>الرادار البصري الدائري:</strong> عرض نقاط الرفاق حول الكعبة بمؤشرات مسافية وبوصلة توجيه.</li>
            <li><strong>بوصلة التوجيه المتري:</strong> حساب المسافة بالأمتار (مثال: فاطمة تبعد 18 متراً باتجاه باب العمرة).</li>
            <li><strong>مؤشرات كثافة الزحام:</strong> صحن المطاف (42%)، المسعى (24%)، ومنشأة الجمرات (88%).</li>
            <li><strong>اقتران الـ QR دون إنترنت:</strong> ربط الأجهزة في ثانيتين بمسح الكود دون وسيط.</li>
            <li><strong>زر التجمع العاجل وتنبيه الاهتزاز:</strong> إطلاق تنبيه اهتزازي مباشر لهواتف الرفقاء.</li>
          </ul>
        </div>

        <!-- Diff Box -->
        <div class="diff-box">
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">الفارق الميداني بين النسختين:</strong>
          <p style="margin-bottom:6px;"><strong>في نسخة الشركات:</strong> تثبيت نقطة تجمع رسمية للفوج تظهر على رادار جميع الحجاج تلقائياً لمنع التخلف عن حافلات التفويج.</p>
          <p><strong>في نسخة الأفراد:</strong> خصوصية تامة؛ لا يتم رفع إحداثيات الحاج على أي خادم سحابي بل تتصل الأجهزة ببعضها مباشرة.</p>
        </div>
      </div>
    </div>

    <!-- Screen 4: Camp & Accommodation -->
    <div class="screen-card">
      <div class="screen-card-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="screen-num">4</div>
          <div>
            <div class="screen-card-title">شاشة مخيم المشاعر والإعاشة والفنادق (Camp & Accommodation)</div>
            <div style="font-size:11.5px; color:var(--text-muted);">المرجع الشامل لتسكين منى وعرفة وفنادق الحرمين الشريفين وخدمات الإعاشة</div>
          </div>
        </div>
        <span style="background:#fef3c7; color:#92400e; font-size:11px; font-weight:700; padding:3px 10px; border-radius:6px;">الراحة والأمان</span>
      </div>

      <div class="screen-grid-3col">
        <!-- Visual Phone Mockup 4 -->
        <div class="phone-mockup">
          <div class="phone-screen">
            <div class="phone-top">
              <span>9:41</span>
              <span>مخيم المشاعر ⛺</span>
            </div>
            <div class="phone-body">
              <div style="display:flex; gap:2px; background:#e2e8f0; padding:2px; border-radius:4px;">
                <div style="flex:1; background:#047857; color:white; text-align:center; font-size:7.5px; border-radius:3px; padding:2px; font-weight:bold;">منى وعرفة</div>
                <div style="flex:1; text-align:center; font-size:7.5px; color:#64748b; padding:2px;">فندق مكة</div>
              </div>
              <div class="phone-widget" style="border-right:3px solid #059669;">
                <div style="font-weight:bold; font-size:8.5px; color:#065f46;">مخيم منى - مربع 42</div>
                <div style="font-size:8px; color:#334155;">خيمة: ب-14 | سرير رقم: 18</div>
              </div>
              <div class="phone-widget">
                <div style="font-weight:bold; font-size:8px; color:#b45309;">🍽️ بوفيه الإعاشة:</div>
                <div style="font-size:7.5px; color:#475569;">غداء اليوم: كبسة لحم + تمر + فواكه</div>
              </div>
              <div class="phone-widget" style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:8px; font-weight:bold; color:#0369a1;">💧 شرب الماء اليوم:</span>
                <span class="phone-badge" style="background:#e0f2fe; color:#0369a1;">2.8 من 3.5 لتر</span>
              </div>
              <div style="background:#dc2626; color:white; border-radius:4px; padding:3px; text-align:center; font-size:8px; font-weight:bold;">
                🚨 استدعاء طبيب المخيم (SOS)
              </div>
            </div>
          </div>
          <div style="text-align:center; color:#94a3b8; font-size:8.5px; margin-top:4px;">[معاينة شاشة المخيم]</div>
        </div>

        <!-- Components List -->
        <div>
          <strong style="color:var(--secondary); display:block; margin-bottom:6px;">مكونات الشاشة:</strong>
          <ul class="feature-list">
            <li><strong>محدد الإقامة الثلاثي:</strong> تنقل بين مخيم المشاعر / فندق مكة / فندق المدينة.</li>
            <li><strong>تسكين المشاعر:</strong> رقم المربع (مربع 42)، الخيمة (ب-14)، والسرير (18).</li>
            <li><strong>بطاقات فنادق مكة والمدينة:</strong> الاسم، العنوان، رقم الغرفة، ورقم استقبال الفندق.</li>
            <li><strong>جدول بوفيه الإعاشة:</strong> قائمة الوجبات اليومية وطلب الوجبات المغلفة مسبقاً.</li>
            <li><strong>متتبع شرب المياه والترطيب:</strong> هدف يومي 3.5 لتر للوقاية من ضربات الشمس.</li>
            <li><strong>زر الاستغاثة الطبية (SOS):</strong> استدعاء طبيب المخيم إلى رقم السرير فوراً.</li>
          </ul>
        </div>

        <!-- Diff Box -->
        <div class="diff-box">
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">الفارق الميداني بين النسختين:</strong>
          <p style="margin-bottom:6px;"><strong>في نسخة الشركات:</strong> يستلم الحاج تفاصيل سريره فوراً دون كشوفات ورقية في حرارة الصيف، وتستقبل عيادة الحملة نداء الـ SOS متضمناً رقم السرير.</p>
          <p><strong>في نسخة الأفراد:</strong> يركز على فنادق الحرم وحفظ موقع السكن المستقل وأرقام الإسعاف العام 997.</p>
        </div>
      </div>
    </div>

    <!-- Screen 5: Smart Rituals Counter -->
    <div class="screen-card">
      <div class="screen-card-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="screen-num">5</div>
          <div>
            <div class="screen-card-title">شاشة عداد المناسك الذكي (Tawaf & Sa'i Smart Counter)</div>
            <div style="font-size:11.5px; color:var(--text-muted);">العداد الرقمي المتطور للأشواط مع التنبيه بالاهتزاز والأدعية الشرعية المعتمدة</div>
          </div>
        </div>
        <span style="background:#ecfdf5; color:#065f46; font-size:11px; font-weight:700; padding:3px 10px; border-radius:6px;">حماية من السهو والشك</span>
      </div>

      <div class="screen-grid-3col">
        <!-- Visual Phone Mockup 5 -->
        <div class="phone-mockup">
          <div class="phone-screen">
            <div class="phone-top">
              <span>9:41</span>
              <span>طواف الكعبة 🕋</span>
            </div>
            <div class="phone-body">
              <div class="phone-counter-dial">
                <span style="font-size:7px; color:#047857; font-weight:bold;">الشوط</span>
                <span style="font-size:24px; font-weight:900; color:#065f46; line-height:1;">4</span>
                <span style="font-size:7px; color:#64748b;">من 7 أشواط</span>
              </div>
              <div class="phone-widget" style="background:#ecfdf5; text-align:center; padding:4px;">
                <div style="font-size:7.5px; font-weight:bold; color:#065f46;">دعاء الشوط المأثور:</div>
                <div style="font-size:7.5px; color:#047857; font-style:italic; margin-top:2px;">"رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً"</div>
              </div>
              <div style="display:flex; justify-content:space-between; font-size:7.5px; color:#475569;">
                <span>📳 اهتزاز تلقائي مفعل</span>
                <span>🔊 استماع صوتي</span>
              </div>
              <div style="background:#047857; color:white; border-radius:4px; padding:4px; text-align:center; font-size:8.5px; font-weight:bold;">
                + تسجيل اكتمال الشوط
              </div>
            </div>
          </div>
          <div style="text-align:center; color:#94a3b8; font-size:8.5px; margin-top:4px;">[معاينة عداد الطواف]</div>
        </div>

        <!-- Components List -->
        <div>
          <strong style="color:var(--secondary); display:block; margin-bottom:6px;">مكونات الشاشة:</strong>
          <ul class="feature-list">
            <li><strong>مفتاح التبديل الفوري:</strong> بين طواف القدوم/الإفاضة/الوداع (7 أشواط) والسعي بين الصفا والمروة (7 أشواط).</li>
            <li><strong>دائرة العداد العملاقة المضيئة:</strong> رقم الشوط بحجم واضح جداً لكبار السن.</li>
            <li><strong>رد الفعل بالاهتزاز (Haptic):</strong> اهتزاز مميز عند كل شوط لتأكيد العد دون النظر للشاشة.</li>
            <li><strong>الأدعية المأثورة لكل شوط:</strong> نصوص شرعية معتمدة بخط عربي واضح ودعاء الركنين.</li>
            <li><strong>القراءة الصوتية:</strong> تشغيل صوتي للأدعية لمن لا يجيدون القراءة في الزحام.</li>
          </ul>
        </div>

        <!-- Diff Box -->
        <div class="diff-box">
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">الفارق الميداني بين النسختين:</strong>
          <p style="margin-bottom:6px;"><strong>في نسخة الشركات:</strong> إمكانية تضمين تسجيل صوتي لمرشد الحملة الديني وفتاوى معتمدة تجيب على أسئلة الحجاج.</p>
          <p><strong>في نسخة الأفراد:</strong> عداد مستقل بنسبة 100% يعمل بدون إنترنت مع محرك نطق النصوص المدمج في الهاتف.</p>
        </div>
      </div>
    </div>

    <!-- Screen 6: B2B Company Admin Panel -->
    <div class="screen-card">
      <div class="screen-card-header">
        <div style="display:flex; align-items:center; gap:10px;">
          <div class="screen-num">6</div>
          <div>
            <div class="screen-card-title">لوحة تحكم وإعدادات شركة السياحة (Company B2B Admin Panel)</div>
            <div style="font-size:11.5px; color:var(--text-muted);">اللوحة الحصرية لمديري الحملات لتحديث بيانات الحجاج والفنادق والتفويج</div>
          </div>
        </div>
        <span style="background:#fef3c7; color:#92400e; font-size:11px; font-weight:700; padding:3px 10px; border-radius:6px;">خاص بالشركات B2B</span>
      </div>

      <div class="screen-grid-3col">
        <!-- Visual Phone Mockup 6 -->
        <div class="phone-mockup">
          <div class="phone-screen">
            <div class="phone-top" style="background:#b45309;">
              <span>لوحة الإدارة</span>
              <span>B2B Admin ⚙️</span>
            </div>
            <div class="phone-body">
              <div class="phone-widget">
                <div style="font-weight:bold; font-size:8px; color:#b45309;">بيانات الشركة والترخيص:</div>
                <div style="font-size:7.5px; color:#1e293b;">${companyName}</div>
                <div style="font-size:7px; color:#64748b;">${licenseNumber}</div>
              </div>
              <div class="phone-widget">
                <div style="font-weight:bold; font-size:8px; color:#047857;">إدارة الفنادق والأفواج:</div>
                <div style="font-size:7.5px; color:#334155;">سويس أوتيل مكة (غرفة 1201-1250)</div>
              </div>
              <div class="phone-widget" style="background:#fef3c7;">
                <div style="font-weight:bold; font-size:8px; color:#92400e;">📢 بث توجيه فوري للفوج:</div>
                <div style="font-size:7px; color:#78350f;">التجمع بالبهو 4:00 عصراً لركوب باصات عرفة</div>
              </div>
              <div style="background:#047857; color:white; border-radius:4px; padding:3px; text-align:center; font-size:8px; font-weight:bold;">
                حفظ ونشر التعديلات فوراً
              </div>
            </div>
          </div>
          <div style="text-align:center; color:#94a3b8; font-size:8.5px; margin-top:4px;">[معاينة لوحة تحكم الإدارة]</div>
        </div>

        <!-- Components List -->
        <div>
          <strong style="color:var(--secondary); display:block; margin-bottom:6px;">مكونات لوحة الإدارة:</strong>
          <ul class="feature-list">
            <li><strong>تعديل بيانات وترخيص الشركة:</strong> ينعكس التعديل فوراً على هواتف جميع الحجاج.</li>
            <li><strong>إدارة فنادق مكة والمدينة:</strong> تحديد أسماء الفنادق والمسافات وأرقام الغرف.</li>
            <li><strong>إدارة المشرفين والخط الساخن:</strong> تسجيل أرقام المشرفين ومرشدي الحافلات.</li>
            <li><strong>بث التوجيهات والتفويج:</strong> إرسال تعليمات التحرك الميداني للحجاج بنقرة زر.</li>
          </ul>
        </div>

        <!-- Diff Box -->
        <div class="diff-box">
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">القيمة الاستثمارية للشركة:</strong>
          <p>تمنح شركة السياحة التحكم الكامل والاستقلالية البرمجية؛ فلا تحتاج لتوظيف مبرمجين أو دفع تكاليف خوادم باهظة. كل شيء يتم من خلال واجهة سريعة وعصرية يمكن تشغيلها من هاتف أو حاسوب مدير الرحلة.</p>
        </div>
      </div>
    </div>

    <!-- 3. COMMERCIAL PACKAGES & PRICING -->
    <div class="page-break"></div>
    <div class="section-title">
      <div>
        <span>ثالثاً: باقات الاشتراك ونموذج التسعير في متناول الجميع (بالجنيه المصري)</span>
        <div class="section-sub">أسعار رمزية وميسرة لتناسب كل مواطن معتمر وكل شركة سياحة مصرية</div>
      </div>
    </div>

    <!-- Part A: Tourism Companies (B2B) -->
    <div style="margin-bottom: 25px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="background:#047857; color:white; padding:3px 10px; border-radius:6px; font-size:11px; font-weight:bold;">القسم الأول</span>
        <strong style="color:var(--primary-dark); font-size:15px;">باقات شركات السياحة والحملات المنظمة (B2B)</strong>
      </div>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">تكلفة ميسرة جداً لا تتعدى بضعة جنيهات للحاج الواحد، وتوفر آلاف الجنيهات في الكشوفات ومخاطر ضياع الحجاج:</p>

      <div class="packages-grid">
        <!-- B2B Pack 1 -->
        <div class="package-card">
          <div>
            <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">باقة الانطلاق (الأفواج الصغيرة)</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">الفوج الاقتصادي (حتى 50 معتمر)</h3>
            <div class="package-price">390 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م / للرحلة بالكامل</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>هوية وترخيص الشركة على هواتف الفوج.</li>
              <li>إعداد فنادق مكة والمدينة والمشرفين.</li>
              <li>عداد المناسك ورادار الزحام دون إنترنت.</li>
            </ul>
          </div>
          <div style="background:#ecfdf5; color:#065f46; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            فقط <strong>7.8 جنيه</strong> لكل معتمر!
          </div>
        </div>

        <!-- B2B Pack 2 -->
        <div class="package-card featured">
          <div>
            <span style="background:#ecfdf5; color:#065f46; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">الأكثر طلباً للرحلات</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">الحملة المتوسطة (حتى 200 معتمر)</h3>
            <div class="package-price">890 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م / للرحلة كاملة</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>كل مميزات باقة الانطلاق لكافة الأفواج.</li>
              <li>توزيع غرف مكة والمدينة تلقائياً.</li>
              <li>تحديد نقطة تجمع الفوج على الرادار.</li>
              <li>زر نداء الاستغاثة المباشر لمشرف الحملة.</li>
            </ul>
          </div>
          <div style="background:#ecfdf5; color:#065f46; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            فقط <strong>4.45 جنيه</strong> لكل معتمر!
          </div>
        </div>

        <!-- B2B Pack 3 -->
        <div class="package-card">
          <div>
            <span style="background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">موسم الحج والعمرة</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">الشركات الكبرى (حتى 500 معتمر/حاج)</h3>
            <div class="package-price">1,650 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م / للموسم كاملاً</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>إدارة مخيمات منى وعرفة وأرقام الأسرة.</li>
              <li>بوفيه الإعاشة وحصر الوجبات.</li>
              <li>نظام الاستغاثة الطبية (SOS) للطبيب.</li>
              <li>دعم فني وتدريب للمشرفين.</li>
            </ul>
          </div>
          <div style="background:#fef3c7; color:#92400e; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            فقط <strong>3.3 جنيه</strong> لكل حاج!
          </div>
        </div>

        <!-- B2B Pack 4 -->
        <div class="package-card">
          <div>
            <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">الترخيص السنوي الشامل</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">الباقة المفتوحة طوال العام</h3>
            <div class="package-price">3,400 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م / سنوياً</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>عدد معتمرين وأفواج غير محدود طوال السنة.</li>
              <li>دومين فرعي خاص بالشركة (hajj.company.com).</li>
              <li>شهادات إتمام الحج والعمرة بهوية الشركة.</li>
              <li>أولوية الدعم التقني والتحديثات.</li>
            </ul>
          </div>
          <div style="background:#f1f5f9; color:#1e293b; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            سعر استثنائي لجميع رحلات العام
          </div>
        </div>
      </div>
    </div>

    <!-- Part B: Individuals & Families (B2C) -->
    <div>
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="background:#b45309; color:white; padding:3px 10px; border-radius:6px; font-size:11px; font-weight:bold;">القسم الثاني</span>
        <strong style="color:var(--primary-dark); font-size:15px;">باقات الأفراد والمعتمرين المستقلين والعائلات (B2C)</strong>
      </div>
      <p style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">أسعار ميسرة ومجانية تخدم ضيوف الرحمن وتضمن ألا يُحرم أي حاج أو معتمر من التيسير والأمان:</p>

      <div class="packages-grid">
        <!-- B2C Pack 1 -->
        <div class="package-card">
          <div>
            <span style="background:#ecfdf5; color:#065f46; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">مجاناً لوجه الله</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">الباقة الأساسية الإيمانية</h3>
            <div class="package-price">0 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م (مجاناً تماماً)</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>عداد الطواف والسعي بالأشواط مع الاهتزاز.</li>
              <li>الأدعية المأثورة الصحيحة والقراءة الصوتية.</li>
              <li>مواقيت الصلاة بمكة والمدينة وبوصلة القبلة.</li>
              <li>100% بدون إنترنت لجميع المسلمين.</li>
            </ul>
          </div>
          <div style="background:#ecfdf5; color:#065f46; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            مجاني للأبد لكل معتمر
          </div>
        </div>

        <!-- B2C Pack 2 -->
        <div class="package-card">
          <div>
            <span style="background:#f1f5f9; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">للمعتمر الفردي</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">باقة المعتمر الذكي</h3>
            <div class="package-price">35 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م فقط (رمزية جداً)</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>كل مميزات الباقة المجانية.</li>
              <li>رادار الرفاق ومنع الضياع دون إنترنت.</li>
              <li>حاسبة وزن الحقائب وقوائم التجهيز الذكية.</li>
              <li>حفظ موقع الفندق الدقيق للرجوع إليه دون نت.</li>
            </ul>
          </div>
          <div style="background:#f1f5f9; color:#1e293b; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            أقل من ثمن فنجان قهوة!
          </div>
        </div>

        <!-- B2C Pack 3 -->
        <div class="package-card featured">
          <div>
            <span style="background:#fef3c7; color:#92400e; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">الأفضل للعائلات</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">باقة العائلة (حتى 5 أفراد)</h3>
            <div class="package-price">85 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م للأسرة كاملة</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>ربط 5 أجهزة معاً (الزوجين والأبناء والوالدين).</li>
              <li>رادار متري عائلي متزامن وتنبيه الاهتزاز العاجل.</li>
              <li>مشاركة وتوزيع مهام حقائب السفر بين العائلة.</li>
              <li>تنبيهات الطوارئ العائلية السريعة.</li>
            </ul>
          </div>
          <div style="background:#fef3c7; color:#92400e; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            فقط <strong>17 جنيه</strong> للفرد الواحد!
          </div>
        </div>

        <!-- B2C Pack 4 -->
        <div class="package-card">
          <div>
            <span style="background:#ecfdf5; color:#065f46; padding:2px 8px; border-radius:4px; font-size:10px; font-weight:700;">مدى الحياة (LifeTime)</span>
            <h3 style="font-size:13.5px; font-weight:800; color:var(--primary-dark); margin-top:6px;">باقة المعتمر الدائم</h3>
            <div class="package-price">150 <span style="font-size:11px; font-weight:normal; color:var(--text-muted);">ج.م تدفع مرة واحدة</span></div>
            <ul class="feature-list" style="font-size:11px;">
              <li>ترخيص مدى الحياة لجميع العمرات والحجات.</li>
              <li>ربط حتى 8 أجهزة عائلية في كل رحلة.</li>
              <li>كافة المزايا الحالية والتحديثات المستقبلية مجاناً.</li>
              <li>سجل رقمي لكافة مناسكك ورحلاتك السابقة.</li>
            </ul>
          </div>
          <div style="background:#ecfdf5; color:#065f46; padding:6px; border-radius:6px; font-size:10.5px; text-align:center; font-weight:bold; margin-top:8px;">
            استثمار إيماني دائم لك ولأسرتك
          </div>
        </div>
      </div>
    </div>

    <!-- 4. TECHNICAL SPECS -->
    <div class="section-title">
      <div>
        <span>رابعاً: المواصفات الهندسية والتقنية (لماذا ينجح التطبيق ميدانياً؟)</span>
        <div class="section-sub">بنية تحتية هندسية مصممة خصيصاً لظروف الازدحام وانقطاع الشبكات في الحرمين الشريفين</div>
      </div>
    </div>

    <div class="tech-box">
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:16px;">
        <div>
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">1. تطبيق ويب تقدمي متطور (PWA):</strong>
          <p style="font-size:12px; color:var(--text-muted);">لا يحتاج الحاج للبحث في المتاجر أو تنزيل ملفات ضخمة؛ تثبيت بنقرة واحدة عبر الرابط أو كود QR بحجم أقل من 3 ميجابايت.</p>
        </div>
        <div>
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">2. العمل بنسبة 100% دون إنترنت (Offline-First):</strong>
          <p style="font-size:12px; color:var(--text-muted);">تخزين كافة الأدعية، بيانات الفنادق، أرقام الخيام، والعدادات داخل ذاكرة المتصفح المحلية لضمان العمل تحت أي ضغط شبكات.</p>
        </div>
        <div>
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">3. اقتران رادار الرفاق دون خوادم سحابية:</strong>
          <p style="font-size:12px; color:var(--text-muted);">توليد كود QR مشفر يتبادله الحجاج لمتابعة المسافات والاتجاهات مترياً بنظام البوصلة الجغرافية.</p>
        </div>
        <div>
          <strong style="color:var(--primary-dark); display:block; margin-bottom:4px;">4. توفير فائق لبطارية الهاتف:</strong>
          <p style="font-size:12px; color:var(--text-muted);">تصميم مريح للعين بنظام موفر للطاقة يضمن استمرار الهاتف طوال ساعات الوقوف بعرفة وطواف الإفاضة دون انقطاع.</p>
        </div>
      </div>
    </div>

    <!-- Sign-off and Stamp Area -->
    <div class="sign-box">
      <div>
        <strong>إعداد وتنسيق:</strong>
        <p style="color:var(--text-muted); font-size:12px; margin-top:4px;">الإدارة الهندسية وتطوير الأعمال - منصة مَنَاسِكِي</p>
        <div class="sign-stamp">ختم المنصة الرقمية</div>
      </div>
      <div>
        <strong>اعتماد شركة السياحة الشريكة:</strong>
        <p style="color:var(--text-muted); font-size:12px; margin-top:4px;">${companyName} (${licenseNumber})</p>
        <div class="sign-stamp">ختم وتوقيع المفوض</div>
      </div>
    </div>

  </div>

  <script>
    // Helper to download current page content as an editable Word document (.doc)
    function downloadWordFromPage() {
      var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
                   "xmlns:w='urn:schemas-microsoft-com:office:word' " +
                   "xmlns='http://www.w3.org/TR/REC-html40' lang='ar' dir='rtl'>\\n" +
                   "<head><meta charset='utf-8'><title>دليل تطبيق مناسكي للتعديل</title>\\n" +
                   "<style>body { font-family: 'Arial', sans-serif; direction: rtl; text-align: right; } table { border-collapse: collapse; width: 100%; } td, th { border: 1px solid #999; padding: 6px; } .no-print { display: none !important; }</style>\\n" +
                   "</head><body dir='rtl'>";
      var footer = "</body></html>";
      
      // Clone container to avoid modifying DOM
      var container = document.querySelector('.page-container');
      if (!container) return;
      var sourceHtml = header + container.innerHTML + footer;

      var blob = new Blob(['\\ufeff' + sourceHtml], {
        type: 'application/msword;charset=utf-8'
      });
      var url = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = url;
      link.download = 'دليل_تطبيق_مناسكي_للتعديل_' + new Date().toISOString().slice(0, 10) + '.doc';
      document.body.appendChild(link);
      link.click();
      setTimeout(function() {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);
    }

    // Auto-trigger print on standalone window load
    window.addEventListener('load', function() {
      setTimeout(function() {
        try {
          // If launched via direct print trigger, prompt
        } catch(e) {}
      }, 700);
    });
  </script>
</body>
</html>`;
}

// Generate rich, structured Word document HTML string with Word Office XML headers
export function generateWordDocumentContent(options: PrintDocOptions): string {
  const {
    companyName = 'شركة السياحة والحج المصرية المعتمدة',
    licenseNumber = 'ترخيص سياحي رقم 1842 - فئة (أ)',
  } = options;

  const printDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<html xmlns:o='urn:schemas-microsoft-com:office:office' 
        xmlns:w='urn:schemas-microsoft-com:office:word' 
        xmlns='http://www.w3.org/TR/REC-html40' lang='ar' dir='rtl'>
<head>
  <meta charset='utf-8'>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <title>دليل وعرض توثيق تطبيق مناسكي - ملف وورد قابل للتعديل</title>
  <style>
    @page Section1 {
      size: 595.3pt 841.9pt; /* A4 */
      margin: 1.0in 1.0in 1.0in 1.0in;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Arial', 'Simplified Arabic', Tahoma, sans-serif;
      direction: rtl;
      text-align: right;
      color: #111827;
      line-height: 1.6;
      font-size: 11pt;
    }
    h1 {
      color: #064e3b;
      font-size: 22pt;
      text-align: center;
      margin-bottom: 4pt;
    }
    h2 {
      color: #047857;
      font-size: 15pt;
      border-bottom: 2pt solid #047857;
      padding-bottom: 4pt;
      margin-top: 18pt;
      margin-bottom: 8pt;
    }
    h3 {
      color: #b45309;
      font-size: 12pt;
      margin-top: 10pt;
      margin-bottom: 4pt;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 10pt 0;
    }
    table, th, td {
      border: 1pt solid #cbd5e1;
    }
    th {
      background-color: #ecfdf5;
      color: #064e3b;
      font-weight: bold;
      padding: 6pt;
      text-align: right;
    }
    td {
      padding: 6pt;
      vertical-align: top;
      text-align: right;
    }
    .highlight-b2b {
      color: #065f46;
      font-weight: bold;
    }
    .note-box {
      background-color: #f8fafc;
      border-right: 4pt solid #047857;
      padding: 8pt;
      margin: 8pt 0;
    }
    .price-table th {
      background-color: #fef3c7;
      color: #92400e;
    }
  </style>
</head>
<body dir='rtl'>
<div class='Section1'>

  <!-- Document Title & Header -->
  <p style='text-align: center; color: #b45309; font-weight: bold; font-size: 11pt;'>
    [ وثيقة تشغيلية وعرض تسعيري رسمي قابل للتعديل والطباعة - إصدار 2026/2027 ]
  </p>
  <h1>مَنَاسِكِي | MANASIKI</h1>
  <p style='text-align: center; color: #047857; font-size: 13pt; font-weight: bold; margin-top: 0;'>
    المنصة الرقمية المتكاملة لإدارة وتيسير رحلات الحج والعمرة 100% دون إنترنت
  </p>
  
  <table style='background-color: #f1f5f9; border: 1pt solid #cbd5e1; margin-bottom: 16pt;'>
    <tr>
      <td><strong>🏢 شركة السياحة المستفيدة:</strong> ${companyName}</td>
      <td><strong>📜 ترخيص وزارة السياحة:</strong> ${licenseNumber}</td>
    </tr>
    <tr>
      <td><strong>📅 تاريخ التحرير:</strong> ${printDate}</td>
      <td><strong>🌐 التوافق التقني:</strong> Android / iOS / Laptop (بدون تحميل متجر)</td>
    </tr>
  </table>

  <div class='note-box'>
    <strong>💡 ملاحظة للمستخدم / شركة السياحة:</strong> هذا المستند متاح بصيغة Microsoft Word (.doc) ليتيح لكم التعديل المباشر على النصوص، وتغيير الأسعار أو نسب الخصومات، وإضافة شعار وبيانات شركتكم بحرية كاملة قبل الطباعة أو التقديم للعملاء.
  </div>

  <!-- Section 1: Comparison Matrix -->
  <h2>أولاً: مصفوفة المقارنة بين نسخة شركات السياحة (B2B) ونسخة الأفراد (B2C)</h2>
  <table>
    <tr>
      <th style='width: 25%;'>وجه المقارنة</th>
      <th style='width: 40%; background-color: #ecfdf5;'>🏢 نسخة شركات السياحة والحملات (B2B)</th>
      <th style='width: 35%; background-color: #fffbeb;'>👤 نسخة الأفراد والمستقلين (B2C)</th>
    </tr>
    <tr>
      <td><strong>الهوية التجارية</strong></td>
      <td class='highlight-b2b'>هوية كاملة باسم وشعار وترخيص الشركة على هواتف الحجاج لإبراز اسم وبرستيج الشركة.</td>
      <td>هوية قياسية عامة باسم تطبيق "مناسكي" مع حفظ بيانات الحاج محلياً.</td>
    </tr>
    <tr>
      <td><strong>تسكين الفنادق</strong></td>
      <td class='highlight-b2b'>توزيع آلي لغرف مكة والمدينة على الحجاج مسبقاً، وإرشاد مباشر للغرفة والدور وهاتف الفندق.</td>
      <td>إدخال حر للفندق الذي حجزه المعتمر بنفسه وحفظ موقعه بالـ GPS.</td>
    </tr>
    <tr>
      <td><strong>مخيم المشاعر (منى وعرفة)</strong></td>
      <td class='highlight-b2b'>توجيه آلي لرقم المربع والخيمة والسرير، وإرشادات قطار المشاعر ومواعيد التفويج.</td>
      <td>دليل عام لمخيمات المشاعر وسنن المبيت بمنى مع إمكانية تثبيت دبوس GPS.</td>
    </tr>
    <tr>
      <td><strong>بوفيه الإعاشة والوجبات</strong></td>
      <td class='highlight-b2b'>عرض جدول وجبات الحملة اليومية وخيارات مرضى السكري وطلب وجبات سابقة التغليف.</td>
      <td>متتبع شرب المياه والترطيب اليومي للوقاية من الإجهاد الحراري.</td>
    </tr>
    <tr>
      <td><strong>التواصل والطوارئ</strong></td>
      <td class='highlight-b2b'>أزرار اتصال مباشرة بمشرف الفوج والمرشد الديني وطبيب الحملة وبث تنبيهات جماعية.</td>
      <td>أرقام الطوارئ الرسمية بالمملكة (الهلال الأحمر 997، أمن الحرم).</td>
    </tr>
    <tr>
      <td><strong>الاستغاثة الطبية (SOS)</strong></td>
      <td class='highlight-b2b'>استدعاء فوري لطبيب ومسعف الحملة مع إرسال رقم السرير والخيمة آلياً لنقل المصاب في دقائق.</td>
      <td>رسائل SMS للعائلة مع إحداثيات GPS الدقيقة للموقع.</td>
    </tr>
    <tr>
      <td><strong>رادار الرفاق والزحام</strong></td>
      <td class='highlight-b2b'>تحديد نقطة تجمع رسمية للفوج (Meeting Point) تظهر لجميع الحجاج لحمايتهم من التخلف عن الحافلات.</td>
      <td>اقتران عائلي بالـ QR دون إنترنت لحماية الأسرة والزوجين والأبناء.</td>
    </tr>
    <tr>
      <td><strong>حقيبة الاستعداد والسفر</strong></td>
      <td class='highlight-b2b'>قوائم مجهزة بملصقات وأوزان حقائب الطيران المتفق عليها مع شركة الطيران.</td>
      <td>حاسبة أوزان وقوائم أمتعة مخصصة للمسافر المستقل.</td>
    </tr>
  </table>

  <!-- Section 2: Screen Details -->
  <h2>ثانياً: شاشات التطبيق الست التفصيلية وسيناريوهات الاستخدام الميداني</h2>
  
  <h3>1. الشاشة الرئيسية (لوحة القيادة والمتابعة اللحظية)</h3>
  <p><strong>الوظيفة الميدانية:</strong> الواجهة الأولى عند فتح التطبيق، تشمل شارة الحاج الرقمية (Badge ID)، منسك اليوم مع عداد تنازلي لموعد التحرك، شريط مواقيت الصلاة بمكة، بطاقة فندق مكة ومسافة المشي للحرم بالأمتار، وأزرار الاتصال بالمشرف.</p>
  <p><strong>فارق النسختين:</strong> في نسخة الشركات يظهر شعار وترخيص الشركة ورقم رحلة الطيران واسم المشرف، بينما في نسخة الأفراد يتمتع الحاج بمرونة إدخال فندقه بحرية.</p>

  <h3>2. شاشة «حقيبة الاستعداد لرحلة العمر» وتتبع الأمتعة والأوزان (Preparation Checklist)</h3>
  <p><strong>الوظيفة الميدانية:</strong> من عقد النية إلى صعود الطائرة.. خطوات موثقة للمعتمر والحاج لاستعداد روحي ولوجستي متكامل في رعاية الله (كما تظهر بالصورة الحقيقية المرفقة أدناه):</p>
  
  <div style='text-align: center; margin: 12pt 0;'>
    <img src='${PREP_SCREEN_IMAGE_BASE64}' width='280' alt='لقطة الشاشة الحقيقية لحقيبة الاستعداد لرحلة العمر' style='border: 2pt solid #047857; border-radius: 8pt;' />
    <p style='color: #047857; font-size: 9.5pt; font-weight: bold; margin-top: 4pt;'>[ لقطة الشاشة الحقيقية المعتمدة من داخل تطبيق مَنَاسِكِي: حقيبة الاستعداد لرحلة العمر ]</p>
  </div>

  <table style='background-color: #f8fafc; border: 1pt solid #cbd5e1; margin-bottom: 8pt;'>
    <tr>
      <td style='width: 30%; font-weight: bold; background-color: #ecfdf5; color: #064e3b;'>شارة الرحلة والعد التنازلي</td>
      <td>موسم الحج المبارك ١٤٤٦هـ ومؤشر زمني بالأيام المتبقية على موعد الرحلة (متبقي 6 أيام على الإقلاع).</td>
    </tr>
    <tr>
      <td style='font-weight: bold; background-color: #ecfdf5; color: #064e3b;'>مؤشر الجاهزية الدائري (82%)</td>
      <td>حلقة دائرية بارزة تحسب فورياً نسبة الإنجاز: <strong>(جاهزية استثنائية - أنجزت 14 من 17 مهمة تحضيرية)</strong> وشريط مستوى الاستعداد العام.</td>
    </tr>
    <tr>
      <td style='font-weight: bold; background-color: #ecfdf5; color: #064e3b;'>بطاقة نصيحة مناسكي لليوم</td>
      <td>إرشاد لوجستي وطبي ذكي: <em>"احرص على وضع حقيبة أدوية الطوارئ والتقارير الطبية في حقيبة يدك المرافقة على متن الطائرة وليس في حقائب الشحن"</em>.</td>
    </tr>
    <tr>
      <td style='font-weight: bold; background-color: #ecfdf5; color: #064e3b;'>أقسام التجهيز والمهمات (5 فئات)</td>
      <td>1. الإجراءات والتصاريح (جواز السفر، نسك، بطاقة الحاج)<br>2. المستلزمات الشرعية وملابس الإحرام<br>3. صيدلية الأدوية الشخصية والضغط<br>4. الإلكترونيات والباوربانك<br>5. مستحضرات النظافة غير المعطرة.</td>
    </tr>
    <tr>
      <td style='font-weight: bold; background-color: #ecfdf5; color: #064e3b;'>مشاركة الحقيبة وحاسبة الوزن</td>
      <td>حاسبة ذكية لأوزان الحقائب لتجنب غرامات المطار، مع إمكانية مشاركة القائمة فوراً عبر الواتساب للأهل والرفقاء.</td>
    </tr>
  </table>

  <p><strong>فارق النسختين:</strong> في نسخة شركات السياحة تشمل مستندات وعلامات الشركة الموحدة (باج التعارف، ملصقات الحقائب برقم الحافلة، وإرشادات مطار القاهرة أو جدة)، بينما في نسخة الأفراد تمنح المعتمر مرونة كاملة لتخصيص مهامه الشخصية بحسب خطوط الطيران الاقتصادية.</p>

  <h3>3. شاشة رادار المشاعر ومؤشر الزحام دون إنترنت (Radar & Heatmap)</h3>
  <p><strong>الوظيفة الميدانية:</strong> الابتكار التكنولوجي الأول لمنع ضياع المعتمرين؛ دائرة رادار جغرافية توضح مواقع الرفاق مترياً وبوصلة توجيه (مثلاً: فاطمة تبعد 18 متراً باتجاه باب العمرة)، مع مؤشر كثافة صحن المطاف والمسعى والجمرات، واقتران بالـ QR دون إنترنت.</p>

  <h3>4. شاشة مخيم المشاعر والإعاشة والفنادق (Camp & Accommodation)</h3>
  <p><strong>الوظيفة الميدانية:</strong> المرجع الشامل لتسكين منى وعرفة وفنادق الحرمين، يعرض رقم المربع، الخيمة، ورقم السرير، وقائمة طعام البوفيه اليومية، مع زر أحمر استغاثة طارئ (SOS) يستدعي طبيب الحملة إلى رقم السرير فوراً.</p>

  <h3>5. شاشة عداد المناسك الذكي (Tawaf & Sa'i Smart Counter)</h3>
  <p><strong>الوظيفة الميدانية:</strong> عداد رقمي للأشواط السبعة لطواف الكعبة والسعي بين الصفا والمروة؛ دائرة مضيئة عملاقة واضحة لكبار السن، تنبيه اهتزازي عند كل شوط دون النظر للشاشة، الأدعية المأثورة الصحيحة، وخيار القراءة الصوتية.</p>

  <h3>6. لوحة إدارة وتحكم شركة السياحة (Company B2B Admin Panel)</h3>
  <p><strong>الوظيفة الميدانية:</strong> لوحة خاصة لمديري الحملات لتحديث بيانات الفنادق، أرقام المشرفين، وبث التوجيهات الفورية (مثل: التجمع بالبهو الساعة 4:00 عصراً لركوب باصات عرفة) لتظهر على هواتف جميع الحجاج فوراً.</p>

  <!-- Section 3: Accessible Pricing Models -->
  <h2>ثالثاً: باقات الاشتراك والأسعار في متناول الجميع (بالجنيه المصري)</h2>
  
  <h3>القسم الأول: أسعار باقات شركات السياحة والحملات (B2B) - رمزية جداً وميسرة:</h3>
  <table class='price-table'>
    <tr>
      <th>الباقة</th>
      <th>السعة المستهدفة</th>
      <th>السعر الإجمالي للرحلة</th>
      <th>التكلفة التقريبية للحاج الواحد</th>
      <th>أهم المزايا المشمولة</th>
    </tr>
    <tr>
      <td><strong>باقة الانطلاق (الأفواج الصغيرة)</strong></td>
      <td>حتى 50 معتمر</td>
      <td><strong>390 ج.م</strong></td>
      <td><strong>7.8 جنيه فقط</strong></td>
      <td>هوية وترخيص الشركة، إعداد فنادق مكة والمدينة، عداد المناسك ورادار الزحام دون نت.</td>
    </tr>
    <tr>
      <td><strong>باقة الحملات المتوسطة (الأكثر طلباً)</strong></td>
      <td>حتى 200 معتمر</td>
      <td><strong>890 ج.م</strong></td>
      <td><strong>4.45 جنيه فقط</strong></td>
      <td>توزيع غرف مكة والمدينة، تثبيت نقطة تجمع الفوج على الرادار، زر نداء المشرف.</td>
    </tr>
    <tr>
      <td><strong>باقة الشركات الكبرى (موسم الحج)</strong></td>
      <td>حتى 500 معتمر/حاج</td>
      <td><strong>1,650 ج.م</strong></td>
      <td><strong>3.3 جنيه فقط</strong></td>
      <td>إدارة مخيم منى وعرفة وأرقام الأسرة والخيمة، بوفيه الإعاشة، استدعاء طبيب الحملة (SOS).</td>
    </tr>
    <tr>
      <td><strong>الباقة الموسمية الشاملة المفتوحة</strong></td>
      <td>غير محدود طوال العام</td>
      <td><strong>3,400 ج.م / سنوياً</strong></td>
      <td><strong>سعر اقتصادي ثابت</strong></td>
      <td>أفواج غير محدودة طوال السنة (عمرة + حج)، دومين فرعي خاص (hajj.company.com)، شهادات بهوية الشركة.</td>
    </tr>
  </table>

  <h3>القسم الثاني: أسعار باقات الأفراد والمعتمرين المستقلين والعائلات (B2C):</h3>
  <table class='price-table'>
    <tr>
      <th>الباقة</th>
      <th>السعر للمستخدم</th>
      <th>نوع الاستخدام</th>
      <th>أهم المزايا المشمولة</th>
    </tr>
    <tr>
      <td><strong>الباقة الأساسية الإيمانية</strong></td>
      <td><strong>0 ج.م (مجاناً تماماً لوجه الله)</strong></td>
      <td>فردي دائم</td>
      <td>عداد الطواف والسعي بالأشواط مع الاهتزاز، الأدعية المأثورة الصحيحة، مواقيت الصلاة والقبلة دون إنترنت.</td>
    </tr>
    <tr>
      <td><strong>باقة المعتمر الذكي المميزة</strong></td>
      <td><strong>35 ج.م فقط (سعر رمزي)</strong></td>
      <td>فردي للرحلة</td>
      <td>رادار الرفاق ومنع الضياع دون نت، حاسبة أوزان الحقائب، حفظ موقع الفندق والخيمة بالـ GPS.</td>
    </tr>
    <tr>
      <td><strong>باقة العائلة والأقارب (حتى 5 أفراد)</strong></td>
      <td><strong>85 ج.م فقط للأسرة كاملة</strong></td>
      <td>عائلي مجمع (17 ج.م للفرد)</td>
      <td>ربط 5 أجهزة معاً (الزوجين والأبناء والوالدين)، رادار متري متزامن، تنبيه الاهتزاز العاجل، مشاركة الحقائب.</td>
    </tr>
    <tr>
      <td><strong>باقة مدى الحياة (LifeTime)</strong></td>
      <td><strong>150 ج.م تدفع مرة واحدة</strong></td>
      <td>مدى الحياة لجميع الرحلات</td>
      <td>ترخيص مدى الحياة لجميع رحلات العمرة والحج، ربط حتى 8 أجهزة عائلية في كل رحلة، كافة التحديثات المستقبلية.</td>
    </tr>
  </table>

  <!-- Section 4: Technical Architecture -->
  <h2>رابعاً: المواصفات الهندسية والتقنية</h2>
  <ul>
    <li><strong>تقنية تطبيق الويب التقدمي (PWA):</strong> يثبت بنقرة واحدة بحجم أقل من 3 ميجابايت دون الحاجة لتحميل من متجر Google Play أو App Store.</li>
    <li><strong>العمل بنسبة 100% دون إنترنت (Offline-First):</strong> تخزين كامل للبيانات والأدعية والخرائط محلياً للعمل بكفاءة حتى عند انقطاع شبكات الهاتف أثناء الزحام.</li>
    <li><strong>اقتران الـ QR المباشر دون خوادم:</strong> تبادل بيانات الرفاق في ثانيتين بأعلى درجات الخصوصية ودون سحب بطارية الهاتف.</li>
  </ul>

  <!-- Sign off section -->
  <br><br>
  <table style='border: none; margin-top: 25pt;'>
    <tr style='border: none;'>
      <td style='border: none; width: 50%; text-align: center;'>
        <strong>إعداد وتنسيق:</strong><br>
        الإدارة الهندسية وتطوير الأعمال - منصة مَنَاسِكِي الرقمية<br><br>
        [ خاتم المنصة الرقمية ]
      </td>
      <td style='border: none; width: 50%; text-align: center;'>
        <strong>اعتماد شركة السياحة الشريكة:</strong><br>
        ${companyName} (${licenseNumber})<br><br>
        توقيع وخاتم المفوض: .......................................
      </td>
    </tr>
  </table>

</div>
</body>
</html>`;
}

// Download the standalone HTML file directly to the user's computer/phone
export function downloadBrochureHtml(options: PrintDocOptions): void {
  const htmlContent = generateBrochureHtml(options);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `دليل_تطبيق_مناسكي_الشامل_للطباعة_${dateStr}.html`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

// Download as an editable Microsoft Word document (.doc)
export function downloadWordDoc(options: PrintDocOptions): void {
  const wordHtml = generateWordDocumentContent(options);
  // Using BOM and application/msword MIME type ensures MS Word and Google Docs open it with full RTL and formatting
  const blob = new Blob(['\ufeff' + wordHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `دليل_تطبيق_مناسكي_للتعديل_${dateStr}.doc`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

// Open the standalone brochure in a new tab/window for unconstrained printing
export function openBrochureInNewTab(options: PrintDocOptions): boolean {
  try {
    const htmlContent = generateBrochureHtml(options);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const newWin = window.open(blobUrl, '_blank');
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      downloadBrochureHtml(options);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Could not open in new window, downloading directly', err);
    downloadBrochureHtml(options);
    return false;
  }
}

// Master print function that tries direct print, then opens new window or downloads
export function executePrintOrExport(
  options: PrintDocOptions,
  onNotify?: (msg: string) => void
): void {
  let directPrintWorked = false;
  try {
    window.print();
    directPrintWorked = true;
  } catch (err) {
    console.warn('Direct window.print() blocked by iframe sandbox', err);
    directPrintWorked = false;
  }

  const inIframe = window.self !== window.top;

  if (inIframe || !directPrintWorked) {
    const openedTab = openBrochureInNewTab(options);
    if (openedTab) {
      if (onNotify) {
        onNotify('تم فتح نافذة الطباعة المستقلة! يمكنك الآن حفظ الكتيب كـ PDF أو طباعته فوراً.');
      }
    } else {
      if (onNotify) {
        onNotify('تم تنزيل ملف الكتيب للطباعة! افتح الملف للطباعة المباشرة أو الحفظ كـ PDF.');
      }
    }
  } else {
    if (onNotify) {
      onNotify('جاري فتح نافذة الطباعة...');
    }
  }
}

// Copy full formatted text summary for WhatsApp / Email with updated affordable prices
export function copyBrochureSummaryToClipboard(
  options: PrintDocOptions,
  onNotify?: (msg: string) => void
): void {
  const {
    companyName = 'شركة السياحة والحج المعتمدة',
    licenseNumber = 'ترخيص سياحي رقم 1842 - فئة (أ)',
  } = options;

  const text = `🕋 ملف التوثيق والعرض التعريفي لتطبيق "مَنَاسِكِي | MANASIKI"
═════════════════════════════════════
🏢 مخصص لـ: ${companyName} (${licenseNumber})
🌐 المنصة الرقمية المتكاملة لإدارة وتيسير رحلات الحج والعمرة 100% دون إنترنت

📌 أولاً: الفروق الجوهرية بين نسخة شركات السياحة (B2B) ونسخة الأفراد (B2C):
1. الهوية التجارية: هوية كاملة باسم وشعار الشركة على هواتف الحجاج vs هوية قياسية للأفراد.
2. التسكين والفنادق: توزيع آلي لغرف مكة والمدينة على الحجاج vs إدخال يدوي حر للمعتمر.
3. مخيم المشاعر: أرقام الخيام والأسرة بمنى وعرفة vs دليل وإرشادات عامة.
4. الإعاشة والبوفيه: استعراض وجبات الحملة اليومية وحصر تفضيلات الطعام vs متتبع الترطيب.
5. التواصل والطوارئ: أزرار اتصال مباشرة بمشرف الفوج وطبيب الحملة vs أرقام الطوارئ العامة.
6. الاستغاثة الطبية (SOS): استدعاء فوري لطبيب الحملة إلى رقم السرير vs رسائل SMS للعائلة.
7. رادار الرفاق والزحام: نقطة تجمع رسمية للفوج على الرادار vs شبكة اقتران عائلية بالـ QR.

📱 ثانياً: شاشات التطبيق الست التفصيلية:
1. الشاشة الرئيسية: لوحة القيادة والمتابعة اللحظية ومواقيت الصلاة ومسافة الحرم.
2. حقيبة الاستعداد والسفر: حاسبة الوزن وتتبع الأمتعة عبر 5 فئات رئيسية.
3. رادار المشاعر وخريطة الزحام: بوصلة المسافات المترية واقتران الـ QR دون إنترنت.
4. مخيم المشاعر والفنادق: كروت التسكين، بوفيه الإعاشة، وزر الاستدعاء الطبي الفوري.
5. عداد المناسك الذكي: عداد الطواف والسعي بالأشواط مع التنبيه بالاهتزاز والأدعية المأثورة.
6. لوحة إدارة شركة السياحة: لوحة تحكم لتحديث بيانات الفنادق والأفواج وإرسال التوجيهات.

💰 ثالثاً: باقات الاشتراك المخفضة وفي متناول الجميع (بالجنيه المصري):
🏢 باقات شركات السياحة والحملات (B2B):
• باقة الفوج الاقتصادي (حتى 50 معتمر): 390 ج.م فقط للرحلة (7.8 ج.م / للمعتمر).
• باقة الحملة المتوسطة (حتى 200 معتمر): 890 ج.م فقط للرحلة (4.45 ج.م / للمعتمر).
• باقة الشركات الكبرى (حتى 500 معتمر/حاج): 1,650 ج.م للموسم (3.3 ج.م / للحاج).
• الباقة السنوية المفتوحة (غير محدود معتمرين طوال العام): 3,400 ج.م فقط سنوياً.

👤 باقات الأفراد والعائلات (B2C):
• الباقة الأساسية الإيمانية: مجاناً تماماً (0 ج.م) لوجه الله تعالى.
• باقة المعتمر الذكي الفردية: 35 ج.م فقط (سعر رمزي).
• باقة العائلة المتكاملة (حتى 5 أفراد): 85 ج.م فقط للأسرة كاملة (17 ج.م للفرد).
• باقة مدى الحياة (LifeTime): 150 ج.م فقط لجميع العمرات والحجات طوال العمر.

📞 للتواصل والاعتماد:
منصة مَنَاسِكِي الرقمية - خدمة قطاع السياحة الدينية`;

  navigator.clipboard.writeText(text).then(() => {
    if (onNotify) {
      onNotify('تم نسخ ملخص التوثيق والأسعار بنجاح! يمكنك الآن لصقه ومشاركته عبر الواتساب أو البريد.');
    }
  }).catch(() => {
    if (onNotify) {
      onNotify('تعذر النسخ التلقائي، يرجى التحديد والنسخ يدوياً.');
    }
  });
}
