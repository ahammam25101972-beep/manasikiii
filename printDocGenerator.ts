import { PREP_SCREEN_IMAGE_BASE64 } from './prepScreenImageBase64';

export interface PrintDocOptions {
  companyName: string;
  licenseNumber: string;
  activeSection?: 'all' | 'steps' | 'contents' | 'screens' | 'pricing';
  selectedScreenTab?: 'home' | 'prep' | 'radar' | 'camp' | 'counter' | 'company';
  appUrl?: string;
}

export function generateBrochureHtml(options: PrintDocOptions, forPdfCapture = false): string {
  const {
    companyName = 'شركة السياحة والحج والعمرة المعتمدة',
    licenseNumber = 'ترخيص وزارة الحج والسياحة المعتمد',
  } = options;

  const printDate = new Date().toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>كتيب تطبيق مناسكي الشامل - PDF</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Tajawal', Arial, sans-serif;
      background-color: ${forPdfCapture ? '#ffffff' : '#f1f5f9'};
      color: #0f172a;
      line-height: 1.55;
      font-size: 13px;
      direction: rtl;
    }

    .toolbar-sticky {
      position: sticky;
      top: 0;
      z-index: 9999;
      background: #064e3b;
      color: #ffffff;
      padding: 12px 24px;
      display: ${forPdfCapture ? 'none' : 'flex'};
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .btn-print {
      background: #f59e0b;
      color: #451a03;
      border: none;
      padding: 8px 18px;
      border-radius: 8px;
      font-family: inherit;
      font-weight: 800;
      font-size: 13px;
      cursor: pointer;
    }

    .pdf-page {
      width: ${forPdfCapture ? '794px' : '100%'};
      max-width: 794px;
      margin: ${forPdfCapture ? '0 auto' : '20px auto'};
      background: #ffffff;
      padding: 28px 32px;
      border-radius: ${forPdfCapture ? '0' : '14px'};
      border: ${forPdfCapture ? 'none' : '1px solid #cbd5e1'};
      box-shadow: ${forPdfCapture ? 'none' : '0 4px 16px rgba(0,0,0,0.06)'};
      page-break-after: always;
      position: relative;
    }

    .pdf-page:last-child {
      page-break-after: auto;
    }

    .page-header-strip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #047857;
      padding-bottom: 10px;
      margin-bottom: 16px;
      font-size: 11.5px;
      color: #065f46;
      font-weight: 700;
    }

    .cover-banner {
      background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
      color: #ffffff;
      padding: 24px;
      border-radius: 14px;
      text-align: center;
      margin-bottom: 18px;
      border: 2px solid #f59e0b;
    }

    .cover-badge {
      display: inline-block;
      background: #fef3c7;
      color: #92400e;
      padding: 4px 14px;
      border-radius: 999px;
      font-weight: 800;
      font-size: 11.5px;
      margin-bottom: 10px;
    }

    .cover-title {
      font-size: 26px;
      font-weight: 900;
      margin-bottom: 6px;
      color: #ffffff;
    }

    .cover-subtitle {
      font-size: 14px;
      color: #fde68a;
      font-weight: 700;
      margin-bottom: 12px;
    }

    .cover-meta {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
      font-size: 11.5px;
      background: rgba(255,255,255,0.12);
      padding: 8px 14px;
      border-radius: 8px;
    }

    .section-heading {
      background: #ecfdf5;
      color: #064e3b;
      border-right: 5px solid #047857;
      padding: 8px 14px;
      font-size: 16px;
      font-weight: 800;
      border-radius: 6px;
      margin: 14px 0 12px 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .grid-3 {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 10px;
    }

    .card-box {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px;
      background: #f8fafc;
    }

    .card-box-emerald {
      border: 1px solid #a7f3d0;
      border-radius: 10px;
      padding: 12px;
      background: #ecfdf5;
    }

    .card-box-amber {
      border: 1px solid #fde68a;
      border-radius: 10px;
      padding: 12px;
      background: #fffbeb;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 8px;
      background: #ffffff;
      padding: 8px 10px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .step-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #047857;
      color: #ffffff;
      font-weight: 800;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .step-num-amber {
      background: #d97706;
    }

    table.clean-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 12px;
    }

    table.clean-table th,
    table.clean-table td {
      border: 1px solid #cbd5e1;
      padding: 8px 10px;
      text-align: right;
      vertical-align: middle;
    }

    table.clean-table th {
      background: #064e3b;
      color: #ffffff;
      font-weight: 800;
    }

    table.clean-table tr:nth-child(even) {
      background: #f8fafc;
    }

    .screen-card {
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      padding: 12px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .screen-badge {
      display: inline-block;
      background: #047857;
      color: #ffffff;
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 6px;
      width: fit-content;
    }

    .screen-title {
      font-size: 14px;
      font-weight: 800;
      color: #064e3b;
    }

    .screen-list {
      padding-right: 16px;
      font-size: 11.5px;
      color: #334155;
    }

    .screen-list li {
      margin-bottom: 3px;
    }

    .page-footer {
      margin-top: 14px;
      padding-top: 8px;
      border-top: 1.5px solid #cbd5e1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #475569;
    }

    .page-footer-left {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .footer-domain strong {
      color: #047857;
      font-weight: 800;
      direction: ltr;
      display: inline-block;
    }

    .footer-phone strong {
      color: #064e3b;
      font-weight: 800;
      direction: ltr;
      display: inline-block;
    }

    .footer-divider {
      color: #94a3b8;
      font-weight: 700;
    }

    .footer-brand {
      color: #047857;
      font-weight: 700;
    }

    .page-footer-right {
      font-weight: 800;
      color: #064e3b;
      background: #f1f5f9;
      padding: 2px 8px;
      border-radius: 6px;
      flex-shrink: 0;
    }

    @media print {
      body {
        background: #ffffff;
      }
      .toolbar-sticky {
        display: none !important;
      }
      .pdf-page {
        margin: 0;
        border: none;
        box-shadow: none;
        width: 100%;
        max-width: 100%;
        padding: 18px;
      }
    }
  </style>
</head>
<body>

  <div class="toolbar-sticky">
    <div>
      <strong>🕋 كتيب تطبيق مَنَاسِكِي (Manasiki) الشامل - جاهز للطباعة والحفظ كـ PDF</strong>
    </div>
    <div>
      <button class="btn-print" onclick="window.print()">🖨️ طباعة أو حفظ كملف PDF الآن</button>
    </div>
  </div>

  <!-- ================= PAGE 1: COVER & OVERVIEW & STEPS ================= -->
  <div class="pdf-page">
    <div class="cover-banner">
      <div class="cover-badge">الدليل التعريفي والتشغيلي الشامل • موسم ١٤٤٦هـ</div>
      <div class="cover-title">تطبيق « مَنَاسِكِي | MANASIKI »</div>
      <div class="cover-subtitle">رفيق الحاج والمعتمر الذكي (يعمل 100% دون إنترنت) لإصدار الشركات وإصدار الأفراد</div>
      <div class="cover-meta">
        <span>🏢 الجهة: ${companyName}</span>
        <span>📜 ${licenseNumber}</span>
        <span>📅 التاريخ: ${printDate}</span>
        <span>🌐 الرابط: manasiki.4digital.net</span>
      </div>
    </div>

    <div class="section-heading">
      <span>أولاً: فهرس ومحتويات الكتيب المختصر</span>
      <span style="font-size: 11px; font-weight: 600;">مُصمم لسهولة القراءة السريعة</span>
    </div>

    <div class="grid-2" style="margin-bottom: 14px;">
      <div class="card-box-emerald">
        <strong style="color: #064e3b; font-size: 13px; display: block; margin-bottom: 4px;">📌 ماذا يقدم تطبيق مناسكي؟</strong>
        <p style="font-size: 11.5px; color: #1e293b;">
          منصة رقمية متكاملة تعمل على جميع الهواتف (بدون الحاجة للإنترنت في المشاعر المقدسة) لتنظيم رحلة الحاج والمعتمر خطوة بخطوة: من تجهيز حقيبة السفر، وتوثيق بيانات السكن والعائلة، وحتى إتمام الطواف والسعي والعودة بسلام.
        </p>
      </div>
      <div class="card-box-amber">
        <strong style="color: #92400e; font-size: 13px; display: block; margin-bottom: 4px;">🎯 إصداران في تطبيق واحد:</strong>
        <p style="font-size: 11.5px; color: #1e293b;">
          <strong>1. إصدار الأفراد والعائلات (B2C):</strong> للمعتمر المستقل ورب الأسرة لربط عائلته.<br/>
          <strong>2. إصدار شركات السياحة (B2B):</strong> لإدارة الأفواج وتسكين الفنادق والمخيمات مركزياً.
        </p>
      </div>
    </div>

    <div class="section-heading">
      <span>ثانياً: خطوات تشغيل التطبيق وإدخال البيانات (خطوة بخطوة)</span>
      <span style="font-size: 11px;">سهلة ومباشرة في أقل من دقيقتين</span>
    </div>

    <div class="grid-2">
      <!-- B2C Steps -->
      <div class="card-box">
        <h3 style="color: #047857; font-size: 13.5px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
          👤 أ) خطوات المعتمر الفرد والعائلة (إصدار الأفراد)
        </h3>
        <div class="step-item">
          <div class="step-num">1</div>
          <div>
            <strong>فتح التطبيق وتثبيته مجاناً:</strong>
            <div style="font-size: 11px; color: #475569;">افتح الرابط واضغط «تثبيت التطبيق» في أعلى الشاشة لينزل على هاتفك فوراً بدون متجر.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">2</div>
          <div>
            <strong>إدخال البيانات الشخصية والفنادق:</strong>
            <div style="font-size: 11px; color: #475569;">اضغط زر «بيانات الحاج» أو بطاقة الحاج في الرئيسية، واكتب اسمك، رقم الجواز، وفندقي مكة والمدينة ورقم الغرفة.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">3</div>
          <div>
            <strong>إضافة وربط أفراد العائلة (الزوجة والأبناء):</strong>
            <div style="font-size: 11px; color: #475569;">أضف أسماء عائلتك في البطاقة، أو افتح «رادار الرفاق» وامسح كود QR بين الهواتف لتتبع المسافة بينهم بالمتر دون إنترنت.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num">4</div>
          <div>
            <strong>بدء المناسك والرحلة بأمان:</strong>
            <div style="font-size: 11px; color: #475569;">راجع «حقيبة الاستعداد» قبل السفر، واستخدم «عداد الطواف والسعي» بالاهتزاز الصوتي داخل الحرم.</div>
          </div>
        </div>
      </div>

      <!-- B2B Steps -->
      <div class="card-box">
        <h3 style="color: #b45309; font-size: 13.5px; margin-bottom: 8px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px;">
          🏢 ب) خطوات شركة السياحة ومشرف الحملة (إصدار الشركات)
        </h3>
        <div class="step-item">
          <div class="step-num step-num-amber">1</div>
          <div>
            <strong>إعداد هوية الشركة والترخيص:</strong>
            <div style="font-size: 11px; color: #475569;">اضغط زر «تعديل الشركة» في أعلى الشاشة، وأدخل اسم الشركة، رقم الترخيص، الخط الساخن، وواتساب المشرف.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num step-num-amber">2</div>
          <div>
            <strong>تسكين فنادق مكة والمدينة والمخيمات:</strong>
            <div style="font-size: 11px; color: #475569;">حدد اسم فندق مكة وفندق المدينة، المسافة للحرم، أرقام الغرف، ورقم مخيم منى وعرفة والسرير.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num step-num-amber">3</div>
          <div>
            <strong>توزيع البطاقات والباركود على الفوج:</strong>
            <div style="font-size: 11px; color: #475569;">اعتمد التعديلات لتظهر بيانات الشركة والفنادق تلقائياً لدى جميع حجاج الحملة مع إمكانية طباعة الكشوف.</div>
          </div>
        </div>
        <div class="step-item">
          <div class="step-num step-num-amber">4</div>
          <div>
            <strong>الإدارة الميدانية والطوارئ (SOS):</strong>
            <div style="font-size: 11px; color: #475569;">حدد نقطة تجمع الفوج على الرادار، انشر جدول وجبات الإعاشة، واستقبل نداءات الاستغاثة الطبية برقم السرير.</div>
          </div>
        </div>
      </div>
    </div>

    <div class="page-footer">
      <div class="page-footer-left">
        <span class="footer-domain">🌐 دومين التطبيق: <strong>https://manasiki.4digital.net</strong></span>
        <span class="footer-divider">|</span>
        <span class="footer-phone">📞 للتواصل والاشتراك (مصر): <strong dir="ltr">+20 1205132328</strong></span>
      </div>
      <div class="page-footer-right">
        <span>صفحة 1 من 3</span>
      </div>
    </div>
  </div>

  <!-- ================= PAGE 2: ALL 6 APPLICATION PAGES / SCREENS ================= -->
  <div class="pdf-page">
    <div class="page-header-strip">
      <span>🕋 دليل تطبيق مَنَاسِكِي - شرح صفحات وشاشات التطبيق ومحتوياتها</span>
      <span>${companyName}</span>
    </div>

    <div class="section-heading" style="margin-top: 0;">
      <span>ثالثاً: صفحات التطبيق الست ومحتويات كل شاشة بالتفصيل</span>
      <span style="font-size: 11px;">تصميم واضح لكبار السن وجميع الأعمار</span>
    </div>

    <div class="grid-2" style="gap: 12px;">
      <!-- Screen 1 -->
      <div class="screen-card">
        <span class="screen-badge">الصفحة 1 • الرئيسية</span>
        <div class="screen-title">🏠 الشاشة الرئيسية وبطاقة الحاج الرقمية</div>
        <ul class="screen-list">
          <li><strong>بطاقة الحاج الذكية:</strong> تعرض اسم الحاج، رقم الشارة، نوع النسك، وعدد المرافقين.</li>
          <li><strong>مواقيت الصلاة بمكة:</strong> عداد تنازلي للصلاة القادمة في الحرم المكي الشريف.</li>
          <li><strong>بطاقات فنادق مكة والمدينة:</strong> عرض اسم الفندق، رقم الغرفة، والمسافة للحرم مع زر اتصال.</li>
          <li><strong>بيانات الحملة والمشرف:</strong> اتصال مباشر أو واتساب بمشرف الرحلة بنقرة واحدة.</li>
        </ul>
      </div>

      <!-- Screen 2 -->
      <div class="screen-card">
        <span class="screen-badge" style="background: #b45309;">الصفحة 2 • إدخال البيانات</span>
        <div class="screen-title">✍️ نافذة إدخال بيانات الحاج والعائلة والشركة</div>
        <ul class="screen-list">
          <li><strong>بيانات الحاج الشخصية:</strong> الاسم الرباعي، رقم الجواز/الهوية، الجنسية، ورقم الجوال.</li>
          <li><strong>تسكين الغرف والمشاعر:</strong> إدخال غرفة فندق مكة، غرفة المدينة، ومخيم منى وعرفة.</li>
          <li><strong>إدارة أفراد العائلة:</strong> إضافة الزوجة، الوالدين، والأبناء مع صلة القرابة وأرقامهم.</li>
          <li><strong>إعدادات شركة السياحة:</strong> تخصيص اسم الشركة والترخيص والخط الساخن.</li>
        </ul>
      </div>

      <!-- Screen 3 -->
      <div class="screen-card">
        <span class="screen-badge">الصفحة 3 • الحقيبة</span>
        <div class="screen-title">🎒 شاشة حقيبة الاستعداد لرحلة العمر</div>
        <ul class="screen-list">
          <li><strong>مؤشر الجاهزية الدائري:</strong> يحسب نسبة إنجاز مهام السفر (من 0% حتى 100%).</li>
          <li><strong>5 قوائم تفقدية شاملة:</strong> التصاريح وجواز السفر، ملابس الإحرام، الأدوية، الإلكترونيات، والنظافة.</li>
          <li><strong>إضافة مهام خاصة:</strong> إمكانية إضافة أي غرض شخصي للقائمة وحفظه.</li>
          <li><strong>مشاركة الحقيبة:</strong> إرسال قائمة الحقيبة عبر واتساب لأفراد الأسرة والفوج.</li>
        </ul>
      </div>

      <!-- Screen 4 -->
      <div class="screen-card">
        <span class="screen-badge">الصفحة 4 • الرادار والزحام</span>
        <div class="screen-title">📡 شاشة رادار الرفاق ومؤشر الزحام اللحظي</div>
        <ul class="screen-list">
          <li><strong>رادار دائري دون إنترنت:</strong> يوضح موقع الزوجة، الوالد، والأبناء بالمسافة المترية والاتجاه.</li>
          <li><strong>اقتران عبر كود QR:</strong> إضافة مرافق جديد بمسح الكاميرا أو الإدخال اليدوي فوراً.</li>
          <li><strong>نداء اهتزازي ونقطة التقاء:</strong> إرسال تنبيه اهتزازي للرفيق وتثبيت بوابة التجمع.</li>
          <li><strong>مؤشر الزحام اللحظي:</strong> قياس كثافة المطاف، المسعى، وجسر الجمرات لتفادي الذروة.</li>
        </ul>
      </div>

      <!-- Screen 5 -->
      <div class="screen-card">
        <span class="screen-badge">الصفحة 5 • المخيم والإعاشة</span>
        <div class="screen-title">⛺ شاشة مخيم المشاعر والإعاشة والطوارئ</div>
        <ul class="screen-list">
          <li><strong>بطاقة تسكين المشاعر:</strong> رقم المربع، رقم الخيمة، ورقم السرير في منى وعرفة.</li>
          <li><strong>جدول بوفيه الإعاشة:</strong> مواعيد وقوائم وجبات الإفطار والغداء والعشاء بالحملة.</li>
          <li><strong>متتبع شرب الماء:</strong> تذكير صحي بشرب الماء للوقاية من الإجهاد الحراري.</li>
          <li><strong>زر الاستغاثة الطبية (SOS):</strong> استدعاء فوري لطبيب الحملة إلى موقع سرير الحاج.</li>
        </ul>
      </div>

      <!-- Screen 6 -->
      <div class="screen-card">
        <span class="screen-badge">الصفحة 6 • عداد المناسك</span>
        <div class="screen-title">🕋 شاشة عداد الطواف والسعي والرمي الذكي</div>
        <ul class="screen-list">
          <li><strong>عداد الأشواط الـ 7:</strong> دائرة رقمية واضحة لحساب أشواط الطواف والسعي بدون خطأ.</li>
          <li><strong>تنبيه بالاهتزاز والصوت:</strong> اهتزاز الهاتف عند اكتمال كل شوط دون الانشغال بالنظر للشاشة.</li>
          <li><strong>عداد رمي الجمرات:</strong> حساب الحصيات السبع لكل جمرة (الصغرى، الوسطى، العقبة).</li>
          <li><strong>الأدعية المأثورة الصحيحة:</strong> أدعية كل شوط مكتوبة بخط كبير مع ميزة القراءة الصوتية.</li>
        </ul>
      </div>
    </div>

    <!-- Real Screenshot Preview Banner -->
    <div class="card-box-emerald" style="margin-top: 12px; display: flex; align-items: center; gap: 14px;">
      <img src="${PREP_SCREEN_IMAGE_BASE64}" alt="معاينة التطبيق" style="width: 75px; height: 115px; object-fit: cover; border-radius: 8px; border: 2px solid #047857; flex-shrink: 0;" />
      <div>
        <strong style="color: #064e3b; font-size: 13px; display: block; margin-bottom: 4px;">✨ واجهات عربية أصيلة فائقة الوضوح (Offline-First PWA)</strong>
        <p style="font-size: 11.5px; color: #1e293b;">
          جميع صفحات التطبيق الـ 6 مصممة بأعلى معايير سهولة الاستخدام (UX) بأزرار كبيرة، تباين لوني مريح للعين تحت شمس المشاعر، وتعمل بالكامل دون الحاجة لاتصال بالإنترنت بعد فتحها لأول مرة.
        </p>
      </div>
    </div>

    <div class="page-footer">
      <div class="page-footer-left">
        <span class="footer-domain">🌐 دومين التطبيق: <strong>https://manasiki.4digital.net</strong></span>
        <span class="footer-divider">|</span>
        <span class="footer-phone">📞 للتواصل والاشتراك (مصر): <strong dir="ltr">+20 1205132328</strong></span>
      </div>
      <div class="page-footer-right">
        <span>صفحة 2 من 3</span>
      </div>
    </div>
  </div>

  <!-- ================= PAGE 3: COMPARISON & PACKAGE PRICES ================= -->
  <div class="pdf-page">
    <div class="page-header-strip">
      <span>🕋 دليل تطبيق مَنَاسِكِي - مقارنة الإصدارين وأسعار الباقات</span>
      <span>${companyName}</span>
    </div>

    <div class="section-heading" style="margin-top: 0;">
      <span>رابعاً: شرح النسخة المجانية والفرق بين إصدار الأفراد وإصدار الشركات</span>
    </div>

    <div class="grid-2" style="margin-bottom: 10px;">
      <div class="card-box-emerald">
        <strong style="color: #064e3b; font-size: 13px; display: block; margin-bottom: 4px;">🎁 النسخة المجانية (الباقة الأساسية الإيمانية - 0 ج.م):</strong>
        <p style="font-size: 11.5px; color: #1e293b; line-height: 1.6;">
          متاحة مجاناً لوجه الله لكل معتمر وحاج مدى الحياة دون أي رسوم. تشمل عداد الطواف والسعي الذكي (7 أشواط) بالاهتزاز والصوت، وعداد رمي الجمرات، والأدعية النبوية المأثورة مقروءة ومسموعة، ومواقيت الصلاة في الحرمين، وحقيبة الاستعداد للسفر، وبطاقة الحاج الأساسية.
        </p>
      </div>
      <div class="card-box-amber">
        <strong style="color: #92400e; font-size: 13px; display: block; margin-bottom: 4px;">🔄 الفرق بين إصدار الأفراد وإصدار الشركات:</strong>
        <p style="font-size: 11.5px; color: #1e293b; line-height: 1.6;">
          <strong>إصدار الأفراد والعائلات (B2C):</strong> يدخل فيه المعتمر بياناته وفندقه ويربط جوالات أسرته على الرادار المتري دون إنترنت.<br/>
          <strong>إصدار شركات السياحة (B2B):</strong> يحمل اسم وترخيص الشركة، ويقوم المشرف بتسكين الفنادق والمخيمات وتحديد نقطة تجمع الفوج وإدارة الإعاشة والطوارئ (SOS).
        </p>
      </div>
    </div>

    <div class="section-heading">
      <span>خامساً: أسعار الباقات والاشتراكات بالتفصيل (في متناول الجميع)</span>
      <span style="font-size: 11px;">بالجنيه المصري (أو ما يعادله)</span>
    </div>

    <h3 style="color: #b45309; font-size: 12.5px; margin: 4px 0;">1. باقات الأفراد والعائلات المستقلين (B2C):</h3>
    <div class="grid-2" style="margin-bottom: 6px;">
      <div class="card-box">
        <strong style="color: #047857; font-size: 12px;">• الباقة الأساسية الإيمانية (مجاناً 0 ج.م):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          مفتوحة دائماً لجميع الحجاج والمعتمرين مجاناً، وتشمل عداد الطواف والسعي والجمرات بالاهتزاز، والأدعية الصوتية، ومواقيت الصلاة، وحقيبة السفر.
        </p>
      </div>
      <div class="card-box">
        <strong style="color: #b45309; font-size: 12px;">• باقة المعتمر الذكي الفردية (59 ج.م فقط للرحلة):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          مخصصة للمعتمر المنفرد طوال رحلة العمرة أو الحج، وتضيف رادار الرفاق دون إنترنت، وحفظ موقع وتفاصيل فندق مكة والمدينة والخيمة، ومؤشر كثافة الزحام اللحظي.
        </p>
      </div>
      <div class="card-box" style="border-color: #d97706; background: #fffbeb;">
        <strong style="color: #92400e; font-size: 12px;">• باقة العائلة والأقارب ⭐ (100 ج.م للأسرة كاملة):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          تغطي حتى 5 أفراد من الأسرة (بتكلفة 20 ج.م فقط للفرد): يسجل رب الأسرة الفندق والمرافقين، ويولّد كود QR من الرادار تمسحه هواتف الأسرة ليقترنوا معاً دون إنترنت مع تتبع المسافة بالمتر ونداء الاهتزاز.
        </p>
      </div>
      <div class="card-box">
        <strong style="color: #064e3b; font-size: 12px;">• باقة مدى الحياة الشاملة LifeTime (150 ج.م مرة واحدة):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          تدفع مرة واحدة فقط وتعمل مدى الحياة في جميع رحلات العمرة والحج القادمة مع إمكانية ربط حتى 8 أفراد من العائلة.
        </p>
      </div>
    </div>

    <h3 style="color: #064e3b; font-size: 12.5px; margin: 6px 0 4px 0;">2. باقات شركات السياحة والحملات (B2B):</h3>
    <div class="grid-2">
      <div class="card-box">
        <strong style="color: #047857; font-size: 12px;">• باقة الانطلاق للأفواج الصغيرة (400 ج.م للرحلة):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          تغطي حتى 50 معتمراً (بتكلفة 8 ج.م فقط للمعتمر الواحد)، وتشمل وضع اسم وترخيص الشركة، وتسكين فنادق مكة والمدينة، وعداد المناسك والرادار.
        </p>
      </div>
      <div class="card-box" style="border-color: #059669; background: #ecfdf5;">
        <strong style="color: #064e3b; font-size: 12px;">• باقة الحملات المتوسطة ⭐ (900 ج.م للرحلة):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          تغطي حتى 200 معتمر (بتكلفة 4.5 ج.م فقط للمعتمر الواحد)، وتشمل توزيع أرقام الغرف، وتحديد نقطة تجمع الفوج على الرادار، والاتصال المباشر بالمشرف.
        </p>
      </div>
      <div class="card-box">
        <strong style="color: #047857; font-size: 12px;">• باقة الشركات الكبرى وموسم الحج (1,800 ج.م للموسم):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          تغطي حتى 500 حاج أو معتمر (بتكلفة 3.6 ج.م فقط للحاج الواحد)، وتشمل إدارة مخيمات منى وعرفة، وجدول بوفيه الإعاشة، وزر استدعاء طبيب الحملة (SOS).
        </p>
      </div>
      <div class="card-box">
        <strong style="color: #92400e; font-size: 12px;">• الباقة السنوية المفتوحة للشركات (3,500 ج.م سنوياً):</strong>
        <p style="font-size: 10.5px; color: #334155; margin-top: 2px;">
          اشتراك سنوي ثابت يغطي عدداً غير محدود من الأفواج والمعتمرين والحجاج طوال العام، مع تخصيص كامل باسم وشعار شركة السياحة.
        </p>
      </div>
    </div>

    <div class="card-box" style="margin-top: 6px; background: #f0fdf4; border-color: #059669;">
      <p style="font-size: 10.5px; color: #064e3b; margin: 0;">
        <strong>✨ تنويه هام لشركات السياحة:</strong> من الممكن تخصيص وحجز <strong>دومين (رابط إلكتروني) خاص ومستقل باسم الشركة</strong> بأسعار خاصة حسب طلب الشركة، ليعمل التطبيق كمنصة رسمية حصرية للشركة أمام حجاجها ومعتمريها.
      </p>
    </div>

    <div class="card-box" style="margin-top: 6px; display: flex; justify-content: space-between; align-items: center;">
      <div>
        <strong style="color: #064e3b;">🌐 رابط التطبيق المباشر:</strong>
        <span style="font-weight: 700; color: #047857; margin-right: 6px;">https://manasiki.4digital.net</span>
      </div>
      <div>
        <strong>اعتماد الجهة / الشركة:</strong> ....................................................
      </div>
    </div>

    <div class="card-box" style="margin-top: 6px; background: #064e3b; color: #ffffff; text-align: center; padding: 7px 10px;">
      <p style="font-size: 10.5px; margin: 0; color: #ffffff;">
        <strong style="color: #fde68a;">تصميم التطبيق بواسطة أحمد همام : <span dir="ltr">+20 1205132328</span></strong>
        <span style="margin: 0 6px; color: #fde68a;">|</span>
        <span>إذا كان لديك فكرة أو تصميم موقع أو متجر تواصل معنا</span>
        <span style="margin: 0 6px; color: #fde68a;">|</span>
        <a href="https://www.facebook.com/profile.php?id=61582844093225" target="_blank" style="color: #fde68a; font-weight: 700; text-decoration: underline;">فكرة للتطبيقات</a>
      </p>
    </div>

    <div class="page-footer">
      <div class="page-footer-left">
        <span class="footer-domain">🌐 دومين التطبيق: <strong>https://manasiki.4digital.net</strong></span>
        <span class="footer-divider">|</span>
        <span class="footer-phone">📞 للتواصل والاشتراك (مصر): <strong dir="ltr">+20 1205132328</strong></span>
        <span class="footer-divider">|</span>
        <span class="footer-brand">فكرة للتطبيقات</span>
      </div>
      <div class="page-footer-right">
        <span>صفحة 3 من 3</span>
      </div>
    </div>
  </div>

</body>
</html>`;
}

// Generate and download a real .pdf file directly using html2canvas + jsPDF
export async function downloadDirectPdfFile(
  options: PrintDocOptions,
  onStatus?: (msg: string) => void
): Promise<boolean> {
  try {
    if (onStatus) {
      onStatus('جاري تجهيز صفحات الكتيب وتحويلها إلى ملف PDF عالي الدقة...');
    }

    const htmlString = generateBrochureHtml(options, true);

    // Create an isolated offscreen iframe so Tailwind v4 oklch styles do not interfere with html2canvas
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.top = '-10000px';
    iframe.style.left = '-10000px';
    iframe.style.width = '820px';
    iframe.style.height = '1200px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      document.body.removeChild(iframe);
      throw new Error('Could not access iframe document');
    }

    iframeDoc.open();
    iframeDoc.write(htmlString);
    iframeDoc.close();

    // Wait for fonts and images inside iframe to settle
    await new Promise((resolve) => setTimeout(resolve, 650));

    const [{ jsPDF }, html2canvasModule] = await Promise.all([
      import('jspdf'),
      import('html2canvas'),
    ]);
    const html2canvas = html2canvasModule.default || html2canvasModule;

    const pages = Array.from(iframeDoc.querySelectorAll('.pdf-page')) as HTMLElement[];
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      const canvas = await html2canvas(pageEl, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 820,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const imgProps = pdf.getImageProperties(imgData);
      const renderedHeight = (imgProps.height * pdfWidth) / imgProps.width;

      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(
        imgData,
        'JPEG',
        0,
        0,
        pdfWidth,
        Math.min(renderedHeight, pdfHeight),
        undefined,
        'FAST'
      );
    }

    document.body.removeChild(iframe);

    const dateStr = new Date().toISOString().slice(0, 10);
    pdf.save(`كتيب_تطبيق_مناسكي_الشامل_${dateStr}.pdf`);

    if (onStatus) {
      onStatus('تم تنزيل ملف الكتيب (PDF) بنجاح على جهازك!');
    }
    return true;
  } catch (err) {
    console.error('Direct PDF generation error, falling back to print window:', err);
    openBrochureInNewTab(options);
    if (onStatus) {
      onStatus('تم فتح نافذة الكتيب المباشرة لحفظها كـ PDF.');
    }
    return false;
  }
}

export function downloadBrochureHtml(options: PrintDocOptions): void {
  const htmlContent = generateBrochureHtml(options, false);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `كتيب_تطبيق_مناسكي_الشامل_${dateStr}.html`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function downloadWordDoc(options: PrintDocOptions): void {
  const htmlContent = generateBrochureHtml(options, true);
  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `كتيب_تطبيق_مناسكي_للتعديل_${dateStr}.doc`;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function openBrochureInNewTab(options: PrintDocOptions): boolean {
  try {
    const htmlContent = generateBrochureHtml(options, false);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const newWin = window.open(blobUrl, '_blank');
    if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
      downloadBrochureHtml(options);
      return false;
    }
    return true;
  } catch {
    downloadBrochureHtml(options);
    return false;
  }
}

export function executePrintOrExport(
  options: PrintDocOptions,
  onNotify?: (msg: string) => void
): void {
  const opened = openBrochureInNewTab(options);
  if (opened) {
    if (onNotify) {
      onNotify('تم فتح الكتيب في نافذة مستقلة جاهزة للطباعة أو الحفظ كـ PDF!');
    }
  } else {
    if (onNotify) {
      onNotify('تم تنزيل ملف الكتيب للطباعة والحفظ كـ PDF!');
    }
  }
}

export function copyBrochureSummaryToClipboard(
  options: PrintDocOptions,
  onNotify?: (msg: string) => void
): void {
  const {
    companyName = 'شركة السياحة والحج المعتمدة',
    licenseNumber = 'ترخيص معتمد',
  } = options;

  const text = `🕋 كتيب تطبيق "مَنَاسِكِي | MANASIKI" الشامل
═════════════════════════════════════
🏢 الجهة: ${companyName} (${licenseNumber})
🌐 الرابط المباشر: https://manasiki.4digital.net

1️⃣ خطوات استخدام التطبيق:
• للأفراد والعائلات: افتح الرابط -> اضغط (بيانات الحاج) -> أدخل اسمك وفندقك وأفراد عائلتك -> اربط جوالات العائلة بكود QR على الرادار دون إنترنت.
• لشركات السياحة: اضغط (تعديل الشركة) -> أدخل اسم الحملة والترخيص وفندقي مكة والمدينة ومخيم منى -> اعتمد البيانات لتظهر لجميع حجاج الفوج.

2️⃣ صفحات ومحتويات التطبيق (6 صفحات متكاملة):
1. الشاشة الرئيسية: بطاقة الحاج الرقمية، مواقيت الصلاة، الفنادق، والتواصل مع المشرف.
2. نافذة بيانات الحاج والعائلة: توثيق بيانات المعتمر، تسكين الغرف، وإضافة المرافقين.
3. حقيبة الاستعداد لرحلة العمر: مؤشر الجاهزية و5 قوائم تفقدية شاملة قبل السفر.
4. رادار الرفاق ومؤشر الزحام: تتبع مواقع العائلة والفوج بالمتر دون إنترنت + قياس كثافة المطاف والجمرات.
5. مخيم المشاعر والإعاشة والطوارئ: رقم الخيمة والسرير بمنى وعرفة، جدول الوجبات، وزر استدعاء الطبيب (SOS).
6. عداد المناسك الذكي: عداد الطواف والسعي والجمرات بالاهتزاز والأدعية الصوتية.

3️⃣ أسعار الباقات (في متناول الجميع):
🏢 باقات شركات السياحة (B2B):
• باقة الانطلاق للأفواج الصغيرة (حتى 50 معتمر): 400 ج.م للرحلة (8 ج.م للمعتمر).
• باقة الحملات المتوسطة (حتى 200 معتمر): 900 ج.م للرحلة (4.5 ج.م للمعتمر).
• باقة الشركات الكبرى وموسم الحج (حتى 500 حاج): 1,800 ج.م للموسم (3.6 ج.م للحاج).
• الباقة السنوية المفتوحة للشركات: 3,500 ج.م سنوياً لعدد غير محدود.
✨ تنويه: من الممكن تخصيص دومين (رابط) خاص باسم الشركة بأسعار خاصة.

👤 باقات الأفراد والعائلات (B2C):
• الباقة الأساسية الإيمانية: مجاناً تماماً (0 ج.م) لوجه الله.
• باقة المعتمر الذكي الفردية: 59 ج.م للرحلة.
• باقة العائلة والأقارب (حتى 5 أفراد): 100 ج.م للأسرة كاملة (20 ج.م للفرد).
• باقة مدى الحياة (LifeTime): 150 ج.م تدفع مرة واحدة.

═════════════════════════════════════
تصميم التطبيق بواسطة أحمد همام : +20 1205132328 | إذا كان لديك فكرة أو تصميم موقع أو متجر تواصل معنا | فكرة للتطبيقات: https://www.facebook.com/profile.php?id=61582844093225`;

  navigator.clipboard
    .writeText(text)
    .then(() => {
      if (onNotify) {
        onNotify('تم نسخ ملخص الكتيب الشامل والأسعار بنجاح! يمكنك لصقه في واتساب الآن.');
      }
    })
    .catch(() => {
      if (onNotify) {
        onNotify('تعذر النسخ التلقائي.');
      }
    });
}
