// db.js
const DB_NAME = "AmmarSystemDB";
const STORE_NAME = "invoices";

const initDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = e => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, {
                    keyPath: "id",
                    autoIncrement: true
                });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("فشل فتح قاعدة البيانات");
    });
};

async function saveInvoiceToDB(data) {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, "readwrite");
    data.id = 1;
    tx.objectStore(STORE_NAME).put(data);
}

async function loadInvoiceFromDB() {
    const db = await initDB();
    return new Promise(resolve => {
        const req = db
            .transaction(STORE_NAME, "readonly")
            .objectStore(STORE_NAME)
            .get(1);
        req.onsuccess = () => resolve(req.result);
    });
}
