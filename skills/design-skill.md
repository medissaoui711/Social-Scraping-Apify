# OSIRIS-X — Design & Implementation Contract (design-skill.md)

هذا الملف هو العقد الرئيسي للتصميم والتنفيذ لأي عمل على واجهة OSIRIS-X.
يجب على أي وكيل ذكي أو مطور قراءة هذا الملف واتباعه قبل تعديل الواجهة أو إضافة ميزات جديدة.

الهدف: ضمان هوية بصرية متسقة، تجربة مستخدم واضحة، وكود نظيف وقابل للصيانة عبر كل الشاشات والمكونات.

---

## 1) نظرة عامة على المنتج

**الاسم:** OSIRIS-X  
**النوع:** SPA (React + TypeScript + Vite + Tailwind)  
**الوظيفة الأساسية:**  
منصة موحّدة لاكتشاف وتشغيل وأتمتة أدوات استخراج البيانات من السوشيال ميديا والويب العام، مع:
- دليل أدوات (Directory / Explorer)
- استوديو تشغيل مباشر (Playground Studio)
- منشئ خطوط عمل مؤتمتة (Pipeline Builder)
- استوديو أكواد وتكاملات (Code Studio)
- لوحة مؤشرات تيليمتري (Telemetry Dashboard)

**المستخدمون الأساسيون:**
- وكالات التسويق والإعلان
- فرق المبيعات وتوليد العملاء (B2B)
- المطورون ومهندسو البيانات
- متاجر التجارة الإلكترونية
- مديرو السوشيال ميديا وصناع المحتوى
- الباحثون ومحللو البيانات

**اللغات:** عربي / إنجليزي مع دعم كامل لـ RTL/LTR.

---

## 2) الهوية البصرية (Visual Direction)

### 2.1 الطابع العام

- نمط: **Terminal / Elegant Dark**
- إحساس: تقني، احترافي، مركز على البيانات، بدون زخرفة زائدة.
- أولوية: وضوح المعلومات، سهولة المسح البصري (Scanning)، وكثافة بيانات عالية حيث يلزم.

### 2.2 الألوان الأساسية

```ts
// Backgrounds
color-bg-base: #050505;
color-bg-surface: #090909;
color-bg-surface-elevated: #111111;
color-bg-panel: #1C1C1C;

// Text
color-text-primary: #EAEAEA;
color-text-secondary: #B0B0B0;
color-text-tertiary: #808080;

// Borders
color-border: #2A2A2A;
color-border-subtle: #1F1F1F;

// Accent (Emerald)
color-primary: #00FF9C;
color-primary-hover: #00E68D;
color-primary-pressed: #00CC7D;

// Status
color-success: #22C55E;
color-warning: #F59E0B;
color-danger: #EF4444;
color-info: #3B82F6;

// Logs
color-log-info: #3B82F6;
color-log-warn: #F59E0B;
color-log-error: #EF4444;
color-log-debug: #808080;
```

- لا تُستخدم ألوان إضافية بشكل عشوائي.
- اللون الأساسي (`#00FF9C`) يُستخدم للعناصر التفاعلية الأساسية (أزرار أولية، روابط نشطة، حالات تركيز مهمة).

---

## 3) الطباعة (Typography)

### 3.1 الخطوط
- **عربي:** Tajawal
- **إنجليزي (واجهة):** Plus Jakarta Sans
- **كود:** Fira Code
- تجنب خلط خطوط إضافية.

### 3.2 سلّم الطباعة (Desktop Base)
```ts
// English base (px)
font-size-display: 40
font-size-h1: 32
font-size-h2: 24
font-size-h3: 20
font-size-body: 15
font-size-small: 13
font-size-caption: 12
font-size-label: 13

// Arabic base (px)
font-size-display-ar: 38
font-size-h1-ar: 30
font-size-h2-ar: 22
font-size-h3-ar: 19
font-size-body-ar: 15
font-size-small-ar: 13
font-size-caption-ar: 12
font-size-label-ar: 13
```

- **أوزان الخط:**
  - Display / H1: 700
  - H2 / H3: 600
  - Body / Small: 400–500
  - Label / Caption: 500
- **تباعد الأسطر:**
  - Body: 1.5
  - Heading: 1.2–1.3
  - Caption: 1.4

---

## 4) نظام الألوان الدلالي (Semantic Color System)

استخدم دائماً أسماء دلالية في الكود (عبر Tailwind classes أو tokens)، وليس ألواناً عشوائية:
- `bg-base`
- `bg-surface`
- `bg-surface-elevated`
- `bg-panel`
- `text-primary`
- `text-secondary`
- `text-tertiary`
- `border`
- `border-subtle`
- `primary`
- `primary-hover`
- `primary-pressed`
- `success`
- `warning`
- `danger`
- `info`
- `log-info`
- `log-warn`
- `log-error`
- `log-debug`

**القاعدة:** اللون يحمل معنى، وليس زخرفة.

---

## 5) المسافات والشبكة (Spacing & Grid)

### 5.1 سلّم المسافات (px)
```ts
space-0: 0
space-1: 4
space-2: 8
space-3: 12
space-4: 16
space-5: 20
space-6: 24
space-8: 32
space-10: 40
space-12: 48
space-16: 64
```
استخدم هذا السلّم بشكل ثابت في:
- حواف الصفحات (Page padding)
- المسافات بين الأقسام (Section gaps)
- المسافات داخل المكونات (Card padding, Form gaps, etc.)

### 5.2 الشبكة (Grid)
**عرض محتوى رئيسي:**
- **Desktop:** حتى 1200–1280px مركزي.
- **Tablet:** 90–95% من العرض مع هوامش معقولة.
- **Mobile:** 100% مع padding جانبي 16px.

---

## 6) الزوايا، الحدود، والظلال

```ts
radius-sm: 4px
radius-md: 8px
radius-lg: 12px
radius-xl: 16px

border-width: 1px
border-color: color-border
border-color-subtle: color-border-subtle

shadow-sm: 0 1px 2px rgba(0,0,0,0.6)
shadow-md: 0 4px 12px rgba(0,0,0,0.7)
shadow-lg: 0 10px 30px rgba(0,0,0,0.8)
```
- استخدم ظلالاً خفيفة جداً في الثيم الداكن.
- لا تبالغ في الـ border-radius؛ التوازن أهم من المبالغة في “النُعومة”.

---

## 7) مبادئ UX الأساسية

- **وضوح الهدف:** كل شاشة يجب أن تجيب: “ما الشيء الرئيسي الذي يحتاج المستخدم لفعله هنا؟”
- **تسلسل بصري واضح:** معلومات أولية، ثانوية، وداعمة مع تباين في الحجم والوزن واللون.
- **كثافة بيانات مرنة:** جداول وقوائم كثيفة حيث يلزم، وبطاقات حيث يكون السرد أهم.
- **تقليل الضجيج:** لا خطوط زائدة، لا أيقونات بلا معنى، لا حدود وظلال متنافرة.
- **أفعال واضحة:** زر أولي واضح في كل سياق رئيسي، وأزرار ثانوية أقل بروزاً.

---

## 8) نظام المكونات (Component System)

### 8.1 المكونات الأساسية
يجب توحيد الأنماط البصرية لهذه المكونات وإعادة استخدامها:
- Button (primary, secondary, ghost, danger)
- IconButton
- Input, TextArea
- Select, MultiSelect
- Checkbox, Radio
- Badge, Tag, StatusDot
- Card, Panel, Section
- PageHeader, SectionHeader
- Table, TableRow, TableCell, TableHeader
- Tabs, TabList, TabPanel
- Dropdown, Menu
- Modal, Dialog
- Toast, InlineAlert
- Sidebar, Navbar, MobileNav
- EmptyState, LoadingState, ErrorState
- LogViewer
- JSONTree wrapper
- MediaGallery wrapper
- Analytics summary cards
- CodeBlock (مع تمييز صيغة)
- PipelineNode / PipelineCanvas (إن وُجد)

### 8.2 الحالات (States)
كل مكون مهم يجب أن يملك:
- Default
- Hover
- Focus (واضح، مع outline مرئي)
- Active / Pressed
- Disabled
- Loading
- Error
- Empty (إن كان منطقياً)
- Success (إن كان منطقياً)

---

## 9) الجداول والبيانات الكثيفة (Data-Dense Interfaces)

- لا تحوّل كل شيء تلقائياً إلى بطاقات.
- استخدم الجداول عندما يكون الهدف:
  - المسح السريع
  - المقارنة
  - الفرز والفلترة
  - الإجراءات السريعة على صفوف متعددة
- وفّر مستويين على الأقل من الكثافة:
  - **Dense** (للمستخدمين المتقدمين)
  - **Comfortable** (للاستخدام العام)
- دعم:
  - Sorting
  - Filtering
  - Search داخل الجداول
  - Pagination أو Virtualization للبيانات الكبيرة

---

## 10) النماذج (Forms)

- تجميع منطقي للحقول (Groups / Sections).
- تسميات واضحة فوق الحقول أو بجانبها حسب السياق.
- نصوص مساعدة قصيرة عند الحاجة.
- تحقق داخلي (Inline validation) مع رسائل خطأ محددة.
- حالات تحميل واضحة على الأزرار عند الإرسال.
- رسائل نجاح/فشل مفهومة بعد الإرسال.

---

## 11) الحالات الفارغة والتحميل والخطأ

### 11.1 Empty States
بدلاً من “لا توجد بيانات”:
- اشرح باختصار ما الذي يُتوقع وجوده.
- لماذا هذا مهم.
- ما الذي يمكن للمستخدم فعله الآن (CTA واضح).

### 11.2 Loading States
- استخدم Skeletons للشاشات التي تستغرق وقتاً ملحوظاً.
- استخدم أزرار/مؤشرات تحميل للعمليات السريعة نسبياً.
- تجنّب الشاشات البيضاء/السوداء الفارغة أثناء التحميل.

### 11.3 Error States
- اشرح ما حدث بلغة بسيطة.
- اقترح حلاً أو خطوة تالية.
- وضّح ما إذا كانت إعادة المحاولة ممكنة.
- لا تعرض تفاصيل تقنية أو Stack traces للمستخدم العادي.

---

## 12) الأيقونات (Iconography)

- استخدم مجموعة أيقونات واحدة (مثل: `lucide-react`).
- نفس السمك (stroke) والحجم النسبي في كل الشاشة.
- الأيقونة يجب أن توحي بوظيفتها بوضوح.
- لا تستخدم أيقونات زخرفية بدون معنى وظيفي.

---

## 13) التفاعلات الدقيقة (Micro-interactions)

- **Hover، Focus، Press:** تغييرات لونية/ظلية خفيفة وسريعة.
- **Loading:** مؤشرات بسيطة وغير مشتتة.
- **Success / Error:** تغييرات لونية واضحة مع رسائل مختصرة.
- **انتقالات بين الصفحات/المودال:** خفيفة وسريعة (200–300ms).
- احترم `prefers-reduced-motion`: قلّل أو عطّل الحركات عند طلب المستخدم.

---

## 14) الوصولية (Accessibility)

- HTML دلالي صحيح (`header`, `nav`, `main`, `section`, `footer`…).
- دعم كامل للتنقل عبر لوحة المفاتيح.
- حالات Focus مرئية وواضحة.
- تسميات (labels) واضحة للحقول والأزرار.
- استخدام ARIA حيث يلزم (`modals`, `tabs`, `menus`…).
- تباين ألوان كافٍ للنصوص والخلفيات (خاصة في الثيم الداكن).
- أهداف لمس لا تقل عن 44×44px تقريباً على الشاشات اللمسية.

---

## 15) التجاوب (Responsive Design)

### 15.1 نقاط التوقف (Breakpoints تقريبية)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### 15.2 المبادئ
- لا Overflow أفقي.
- لا عروض ثابتة تكسر الشاشات الصغيرة.
- إعادة تنظيم المحتوى حسب الأولوية على الموبايل.
- تقليل كثافة العناصر على الشاشات الصغيرة.
- تجنّب النصوص والأزرار الصغيرة جداً على الموبايل.

---

## 16) الموبايل (Mobile Experience)

- لا تعتمد على تصغير Sidebar سطح المكتب فقط.
- استخدم نمط تنقل مخصص للموبايل (Bottom Nav أو Hamburger + Drawer).
- حوّل اللوحات المعقدة إلى أنماط مناسبة (Bottom Sheets، قوائم مبسطة).
- حافظ على أولوية المحتوى والإجراءات الأساسية.

---

## 17) القيود التقنية (Technical Constraints)

- **الإطار:** React 18+ مع TypeScript.
- **الباندلر:** Vite.
- **التنسيق:** Tailwind CSS.
- **الأيقونات:** `lucide-react`.
- **الخطوط:** Tajawal, Plus Jakarta Sans, Fira Code.
- لا تُستبدل هذه التقنيات إلا إذا كان هناك سبب حاسم وموثّق.
- لا تُضاف مكتبات UI ضخمة (مثل MUI, AntD) ما لم تُبرّر الحاجة بشكل واضح.

---

## 18) الأداء (Performance)

- تجنّب مكتبات حركات ثقيلة.
- قلّل تعقيد DOM غير الضروري.
- استخدم Virtualization أو Pagination للقوائم الطويلة جداً.
- لا تحمل بيانات ضخمة دفعة واحدة إن أمكن؛ قسّم الكتل الكبيرة.
- افصل بين المنطق البصري ومنطق الأعمال قدر الإمكان.

---

## 19) البنية والمجلدات (Architecture & Folders)

احفظ الهيكل الحالي قدر الإمكان، مع الالتزام بـ:
```text
/src
  /components   ← مكونات الواجهة
  /context      ← إدارة الحالة العامة
  /data         ← بيانات ثابتة (كتالوج، تصنيفات، وصفات)
  /types        ← تعريفات TypeScript
  /utils        ← أدوات مساعدة وفهارس البحث
  main.tsx
  App.tsx
  index.css
```
- أي مكون جديد يذهب إلى `/src/components`.
- أي بيانات ثابتة جديدة تذهب إلى `/src/data`.
- أي تعريفات أنواع جديدة تذهب إلى `/src/types`.

---

## 20) الأمان والامتثال (Security & Compliance)

- لا تعرض مفاتيح سرية أو بيانات حساسة في الواجهة أو السجلات.
- نظّف أي محتوى قادم من مصادر خارجية قبل عرضه (تجنّب XSS).
- أضف رسائل توضيحية للمستخدم حول:
  - الاستخدام المقبول
  - احترام شروط المنصات
  - قوانين حماية البيانات
- وفّر آلية للإبلاغ عن إساءة الاستخدام أو طلب إزالة بيانات.

---

## 21) التوثيق (Documentation)

كل مكون رئيسي يجب أن يكون له:
- اسم واضح
- وصف مختصر
- Props محددة في `/src/types`
- أي تغيير كبير في التصميم أو السلوك يجب توثيقه هنا أو في ملف changelog قريب.

---

## 22) عملية إعادة التصميم (Redesign Process)

عند إجراء إعادة تصميم كبيرة:
1. اقرأ هذا الملف بالكامل.
2. قم بتدقيق تصميمي سريع للواجهة الحالية.
3. حدّث نظام التصميم (ألوان، طباعة، مكونات) هنا إن لزم.
4. نفّذ التغييرات على مراحل:
   - Shell / Navigation
   - Directory
   - Playground
   - Pipelines
   - Code Studio
   - Telemetry
5. بعد كل مرحلة:
   - تحقّق من البناء (build)
   - تحقّق من TypeScript
   - تحقّق من Lint
   - اختبر التدفقات الأساسية يدوياً
6. قدّم ملخصاً للتغييرات:
   - مشاكل التصميم التي تم حلها
   - مكونات جديدة/معدّلة
   - صفحات معدّلة
   - تحسينات الموبايل والوصولية
   - ملفات متغيرة
   - وظائف تم الحفاظ عليها عمداً

---

## 23) ملاحظات خاصة بـ OSIRIS-X

- المنصة تتعامل مع بيانات كثيفة وسيناريوهات متقدمة؛ لا تضحِ بالوظيفة لصالح الشكل.
- أي تغيير بصري يجب أن يسهّل:
  - فهم البيانات
  - اتخاذ القرار
  - تنفيذ الإجراءات (تشغيل أداة، بناء Pipeline، تصدير بيانات)
- لا تضيف وعوداً تسويقية داخل الواجهة (مثل “Zero-Ban”)؛ استخدم لغة مسؤولة وواقعية.
