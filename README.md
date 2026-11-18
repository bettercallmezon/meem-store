# متجر ميم للإلكترونيات الذكية | Meem Store (نسخة GitHub Pages السحابية) ⚡

نسخة مجهزة بالكامل ومحسنة للنشر والتشغيل المباشر على **GitHub Pages** كمتجر إلكتروني مستقل فائق السرعة والأمان بدون الحاجة لأي خوادم PHP أو قواعد بيانات MySQL خارجية (Serverless / Static Cloud).

---

## 🌟 مميزات نسخة GitHub Pages
- **استضافة مجانية مدى الحياة:** يعمل المتجر مباشرة على نطاق GitHub المجاني برابط آمن `https://<username>.github.io/<repo>/`.
- **صفر تبعيات خارجية (100% Offline-Ready & Client-Side):** كافة المكتبات والأيقونات متضمنة محلياً داخل مجلد `assets/`.
- **جاهزية النشر بضغطة زر:** يحتوي المجلد على ملف `.nojekyll` لتجاوز معالجة Jekyll وضمان تحميل كافة ملفات JavaScript و CSS والصور فورياً.
- **تشفير الطلبات والباركود محلياً:** توليد باركود 1D ورموز QR مشفرة وموقعة رقمياً ضد التلاعب تعمل بالكامل داخل متصفح العميل دون أي خادم.
- **لوحة إدارة متكاملة (`admin.html`):**
  - تسجيل الدخول بكلمة المرور الافتراضية: `admin123`.
  - ماسح الباركود المباشر عبر كاميرا الجهاز (Webcam Scanner).
  - فك تشفير الطلبات ومطابقة التوقيع الرقمي لمنع التلاعب وطباعة الفواتير.
  - إرسال رسالة تأكيد للعميل عبر واتساب بنقرة واحدة.
  - إدارة المنتجات والسلايدر المتحرك مع رفع الصور المتعددة وخلفيات البانر وحفظها في ذاكرة المتصفح.

---

## 🚀 خطوات النشر على GitHub Pages في دقيقتين

### الطريقة الأولى: عبر واجهة موقع GitHub (الأسهل بدون أوامر)
1. افتح حسابك على [GitHub.com](https://github.com) وأنشئ مستودعاً جديداً (New Repository) بالاسم الذي تريده، مثلاً: `meem-store`.
2. تأكد من تحديد نوع المستودع كـ **Public**.
3. اسحب وأفلت (Drag & Drop) كافة محتويات هذا المجلد (`github-pages-release`) إلى المستودع.
4. اضغط **Commit changes**.
5. من صفحة المستودع، اذهب إلى:
   - **Settings** ⚙️ ⬅️ ثم اضغط من القائمة الجانبية على **Pages** 🌐
   - تحت قسم **Build and deployment**:
     - اختر Source: `Deploy from a branch`
     - اختر Branch: `main` (أو `master`) والمجلد `/ (root)`
     - اضغط **Save**.
6. خلال دقيقة واحدة، سيمنحك GitHub رابط موقعك المباشر:
   `https://<your-username>.github.io/meem-store/`

---

### الطريقة الثانية: عبر Git من موجه الأوامر (Terminal)
إذا كنت تستخدم أداة Git في جهازك:
```bash
git init
git add .
git commit -m "Deploy Meem Store to GitHub Pages"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```
ثم قم بتفعيل Pages من إعدادات المستودع (Settings -> Pages).

---

## 🔑 روابط الوصول بعد النشر:
* **واجهة المتجر:** `https://<your-username>.github.io/<your-repo-name>/`
* **لوحة التحكم:** `https://<your-username>.github.io/<your-repo-name>/admin.html`
* **كلمة مرور المدير الافتراضية:** `admin123`
