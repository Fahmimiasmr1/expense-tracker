// ======================================
// MENGAMBIL DATA DARI LOCAL STORAGE
// ======================================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// ======================================
// MENGAMBIL ELEMENT HTML
// ======================================

const transactionForm =
    document.getElementById("transactionForm");

const transactionList =
    document.getElementById("transactionList");

const balanceElement =
    document.getElementById("balance");

const incomeElement =
    document.getElementById("income");

const expenseElement =
    document.getElementById("expense");

const clearAllButton =
    document.getElementById("clearAll");


// ======================================
// FORMAT RUPIAH
// ======================================

function formatRupiah(number) {

    return new Intl.NumberFormat("id-ID", {

        style: "currency",

        currency: "IDR",

        maximumFractionDigits: 0

    }).format(number);

}


// ======================================
// SIMPAN DATA
// ======================================

function saveData() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ======================================
// MENAMPILKAN DATA
// ======================================

function displayTransactions() {

    transactionList.innerHTML = "";


    // Jika belum ada transaksi
    if (transactions.length === 0) {

        transactionList.innerHTML = `

            <div class="empty">

                Belum ada transaksi.

            </div>

        `;

        updateSummary();

        return;
    }


    transactions.forEach(function(transaction, index) {


        const item =
            document.createElement("div");


        item.classList.add("transaction");


        // Menentukan tanda + atau -
        const sign =
            transaction.type === "income"
                ? "+"
                : "-";


        item.innerHTML = `

            <div class="transaction-info">

                <span class="transaction-name">

                    ${transaction.name}

                </span>


                <span class="transaction-category">

                    ${transaction.category}

                </span>


                <span class="transaction-date">

                    ${transaction.date}

                </span>

            </div>


            <div class="transaction-right">

                <span
                    class="transaction-amount
                    ${transaction.type}"
                >

                    ${sign}${formatRupiah(transaction.amount)}

                </span>


                <button
                    class="delete-button"
                    onclick="deleteTransaction(${index})"
                >

                    ×

                </button>

            </div>

        `;


        transactionList.appendChild(item);

    });


    updateSummary();

}


// ======================================
// MENGHITUNG SALDO
// ======================================

function updateSummary() {

    let totalIncome = 0;

    let totalExpense = 0;


    transactions.forEach(function(transaction) {


        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        }


        else {

            totalExpense += transaction.amount;

        }

    });


    // Rumus saldo
    const balance =
        totalIncome - totalExpense;


    // Tampilkan ke HTML
    incomeElement.textContent =
        formatRupiah(totalIncome);


    expenseElement.textContent =
        formatRupiah(totalExpense);


    balanceElement.textContent =
        formatRupiah(balance);

}


// ======================================
// TAMBAH TRANSAKSI
// ======================================

transactionForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();


        // Ambil nilai dari form

        const type =
            document.getElementById("type").value;


        const name =
            document.getElementById("name").value;


        const amount =
            Number(
                document.getElementById("amount").value
            );


        const category =
            document.getElementById("category").value;


        // Membuat tanggal
        const date =
            new Date().toLocaleDateString(
                "id-ID",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                }
            );


        // Membuat object transaksi

        const newTransaction = {

            type: type,

            name: name,

            amount: amount,

            category: category,

            date: date

        };


        // Masukkan ke array

        transactions.unshift(
            newTransaction
        );


        // Simpan

        saveData();


        // Reset form

        transactionForm.reset();


        // Tampilkan

        displayTransactions();

    }
);


// ======================================
// HAPUS TRANSAKSI
// ======================================

function deleteTransaction(index) {

    const confirmation =
        confirm(
            "Hapus transaksi ini?"
        );


    if (!confirmation) {

        return;

    }


    transactions.splice(index, 1);


    saveData();


    displayTransactions();

}


// ======================================
// HAPUS SEMUA
// ======================================

clearAllButton.addEventListener(
    "click",
    function() {


        if (transactions.length === 0) {

            alert(
                "Belum ada transaksi."
            );

            return;

        }


        const confirmation =
            confirm(
                "Yakin ingin menghapus semua transaksi?"
            );


        if (confirmation) {

            transactions = [];


            localStorage.removeItem(
                "transactions"
            );


            displayTransactions();

        }

    }
);


// ======================================
// JALANKAN SAAT WEBSITE DIBUKA
// ======================================

displayTransactions();