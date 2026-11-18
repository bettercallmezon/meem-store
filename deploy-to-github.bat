@echo off
chcp 65001 > nul
cls
echo =====================================================================
echo    🚀 نشر متجر ميم للإلكترونيات تلقائياً إلى GitHub Pages
echo =====================================================================
echo.
echo يرجى التأكد من إنشاء مستودع جديد (Public) على حسابك في GitHub أولاً.
echo مثال لرابط المستودع: https://github.com/username/meem-store.git
echo.
set /p REPO_URL="أدخل رابط مستودع GitHub الخاص بك: "

if "%REPO_URL%"=="" (
    echo.
    echo [خطأ] لم يتم إدخال رابط المستودع. تم إلغاء العملية.
    pause
    exit /b
)

echo.
echo [1/4] جاري تهيئة مستودع Git المحلي...
if not exist ".git" (
    git init
    git branch -M main
)

echo.
echo [2/4] جاري تجهيز الملفات وحفظها...
git add .
git commit -m "Deploy Meem Store to GitHub Pages"

echo.
echo [3/4] جاري ربط المستودع البعيد: %REPO_URL%
git remote remove origin > nul 2>&1
git remote add origin %REPO_URL%

echo.
echo [4/4] جاري رفع الموقع إلى GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =====================================================================
    echo ✅ تم رفع الموقع بنجاح إلى GitHub!
    echo.
    echo الآن اتبع الخطوة الأخيرة لتشغيل الموقع مباشرة:
    echo 1. افتح صفحة المستودع على GitHub.
    echo 2. اضغط على Settings ثم Pages.
    echo 3. اختر Branch: main واضغط Save.
    echo 4. سيظهر رابط موقعك المباشر خلال 60 ثانية!
    echo =====================================================================
) else (
    echo.
    echo ⚠️ حدث خطأ أثناء الرفع. تأكد من صحة الرابط وصلاحيات الحساب.
)

pause
