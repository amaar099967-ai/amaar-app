// app.js - نسخة مطورة لعمار المسوري
const SMART_CATALOG = [
    { d: "انارة عادية الكهرباء (نقطة)", s: 1200 },
    { d: "ماخذ كهرباء مع التأريض (نقطتين)", s: 2400 },
    { d: "ماخذ التلفزيون مباشر إلى السطح", s: 5000 },
    { d: "ماخذ التلفون (نقطتين)", s: 2400 },
    { d: "ماخذ سخانة كهرباء (نقطتين)", s: 2400 },
    { d: "قواطع الطبلون (نقطتين)", s: 2400 },
    { d: "خطوط الكهرباء الرئيسية (متر)", s: 1200 },
    { d: "خطوط الطاقة الشمسية (متر)", s: 1200 },
    { d: "قص وتركيب مساطر بروفايل (متر)", s: 2500 },
    { d: "قسامات كهرباء (10×15 / 10×10)", s: 2400 },
    { d: "تركيب سماعة يد انترفون", s: 15000 }
];

// دالة إضافة صف جديد
function addNewRow(d="", p=0, s=0) {
    const tableBody = document.getElementById('tableBody');
    const tr = tableBody.insertRow();
    tr.innerHTML = `
        <td style="text-align:center">${tableBody.rows.length}</td>
        <td><textarea class="row-input d-val" oninput="calculate()">${d}</textarea></td>
        <td><input type="number" class="row-input p-val" value="${p}" oninput="calculate()" style="text-align:center"></td>
        <td><input type="number" class="row-input s-val" value="${s}" oninput="calculate()" style="text-align:center"></td>
        <td style="text-align:center;"><div class="row-total" style="font-weight:900">0</div></td>
        <td class="no-print" style="text-align:center;"><button onclick="this.closest('tr').remove(); calculate();" style="color:red; border:none; background:none;">✕</button></td>
    `;
    calculate();
}

// دالة الحساب
function calculate() {
    let grand = 0;
    document.querySelectorAll('#tableBody tr').forEach(tr => {
        const p = parseFloat(tr.querySelector('.p-val').value) || 0;
        const s = parseFloat(tr.querySelector('.s-val').value) || 0;
        const total = p * s;
        tr.querySelector('.row-total').innerText = total.toLocaleString();
        grand += total;
    });
    document.getElementById('f-grand').innerText = grand.toLocaleString();
    
    const paid = parseFloat(document.getElementById('paidAmt').value) || 0;
    document.getElementById('f-rem').innerText = (grand - paid).toLocaleString();
    autoSave();
}

// دالة تعبئة القائمة المنسدلة
function fillSmartSelector() {
    const group = document.getElementById('dynamicItemsGroup');
    if(!group) return;
    group.innerHTML = "";
    SMART_CATALOG.forEach((item, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = item.d;
        group.appendChild(opt);
    });
}

function handleSmartSelection() {
    const sel = document.getElementById('serviceSelector');
    if (sel.value === "NEW_EMPTY") {
        addNewRow("", 0, 0);
    } else if (sel.value !== "") {
        const item = SMART_CATALOG[sel.value];
        addNewRow(item.d, 0, item.s);
    }
    sel.value = "";
}

// تشغيل النظام عند فتح الصفحة
window.onload = async () => {
    fillSmartSelector();
    const saved = await loadInvoiceFromDB(); // استدعاء من db.js
    
    if (saved && saved.items && saved.items.length > 0) {
        // إذا كان هناك بيانات محفوظة سابقاً
        document.getElementById('clientName').value = saved.client || "";
        document.getElementById('projectName').value = saved.project || "";
        document.getElementById('paidAmt').value = saved.paid || 0;
        saved.items.forEach(i => addNewRow(i.d, i.p, i.s));
    } else {
        // إذا كان التطبيق يفتح لأول مرة، أضف أهم 5 بنود تلقائياً
        for(let i=0; i<5; i++) {
            addNewRow(SMART_CATALOG[i].d, 0, SMART_CATALOG[i].s);
        }
    }
    calculate();
};
