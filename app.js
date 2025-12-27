// app.js
function fillSmartSelector() {
    const group = document.getElementById('dynamicItemsGroup');
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
    autoSave();
}

function autoSave() {
    const data = {
        client: document.getElementById('clientName').value,
        items: Array.from(document.querySelectorAll('#tableBody tr')).map(tr => ({
            d: tr.querySelector('.d-val').value,
            p: tr.querySelector('.p-val').value,
            s: tr.querySelector('.s-val').value
        }))
    };
    saveInvoiceToDB(data);
}

window.onload = async () => {
    fillSmartSelector();
    const data = await loadInvoiceFromDB();
    if (data && data.items) {
        data.items.forEach(i => addNewRow(i.d, i.p, i.s));
    }
    calculate();
};
