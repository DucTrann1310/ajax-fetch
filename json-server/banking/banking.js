const bodyCustomer = document.getElementById("bodyCustomer");
const btnCreate = document.getElementById("btnCreate");
const btnUpdate = document.getElementById("btnUpdate")
const btnDeposit = document.getElementById("btnDeposit")
const btnWithdraw = document.getElementById("btnWithdraw");
const btnBan = document.getElementById("btnBan");
const reciptentSelect = document.getElementById("idRe");

const toastLive = document.getElementById('liveToast')
const toastBody = document.getElementById('toast-body')
const btnCloseToast = document.getElementById('btnCloseToast')

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive)

let customerId = 0;
async function fetchAllPerson() {
  const response = await fetch("http://localhost:3300/customers");
  const customers = await response.json();
  return customers;
}

const getAllCustomers = async () => {

  const customers = await fetchAllPerson();

  console.log(customers);

  customers.forEach((item) => {
    if(item.deleted == 0){
      const str = renderCustomers(item);
      bodyCustomer.innerHTML += str;
    }


    const btnEditElms = document.querySelectorAll(".edit");
    const btnDepositElms = document.querySelectorAll(".deposit");
    const btnWithdrawElms = document.querySelectorAll(".withdraw");
    const btnBanElms = document.querySelectorAll(".ban");
    const btnTransferElm = document.querySelectorAll(".transfer");

    btnEditElms.forEach(item => {

      item.addEventListener("click", async () => {

        customerId = item.getAttribute("data-id");

        const customer = await getCustomer(customerId);

        openModal("modalUpdate");

        document.getElementById("fullNameUp").value = customer.fullName;
        document.getElementById("emailUp").value = customer.email;
        document.getElementById("phoneUp").value = customer.phone;
        document.getElementById("addressUp").value = customer.address;
      })
    })

    btnDepositElms.forEach(item => {

      item.addEventListener("click", async () => {

        customerId = item.getAttribute("data-id")

        const customer = await getCustomer(customerId);

        openModal("modalDeposit");

        document.getElementById("idDepo").value = customer.id;
        document.getElementById("fullNameDepo").value = customer.fullName;
        document.getElementById("balanceDepo").value = customer.balance;
      })
    });

    btnWithdrawElms.forEach(item => {

      item.addEventListener("click", async () => {

        customerId = item.getAttribute("data-id");

        const customer = await getCustomer(customerId);

        openModal("modalWithdraw");

        document.getElementById("idWi").value = customer.id;
        document.getElementById("fullNameWi").value = customer.fullName;
        document.getElementById("balanceWi").value = customer.balance;
      })
    })

    btnBanElms.forEach(item => {

      item.addEventListener("click", async() => {

        customerId = item.getAttribute("data-id");

        const customer = await getCustomer(customerId);
  
        openModal("modalBan");
  
        document.getElementById("fullNameBan").value = customer.fullName;
        document.getElementById("emailBan").value = customer.email;
        document.getElementById("phoneBan").value = customer.phone;
        document.getElementById("addressBan").value = customer.address;
      })

    })

    btnTransferElm.forEach(item => {

      item.addEventListener("click", async() => {

        customerId = item.getAttribute("data-id");

        const sender = await getCustomer(customerId);
        const reciptents = await getReciptent(customerId);

        openModal("modalTransfer");

        document.getElementById("idSen").value = sender.id;
        document.getElementById("fullNameSe").value = sender.fullName;
        document.getElementById("emailSe").value = sender.email;
        document.getElementById("balanceSe").value = sender.balance;
        reciptents.forEach(reciptent => {
          const option = document.createElement("option");
          option.value = reciptent.id;
          option.textContent = reciptent.fullName;
          reciptentSelect.appendChild(option);
        })
      })
    })

  });
};

const getCustomer = async (customerId) => {

  const response = await fetch("http://localhost:3300/customers/" + customerId);
  const customer = await response.json();
  return customer
}

const getReciptent = async (customerId) => {

  const response = await fetch("http://localhost:3300/customers/");
  const customers = await response.json();

  const reciptents = customers.filter((customer) => {
    return customer.deleted == 0 && customer.id != customerId;
  })
  
  return reciptents;

}


const renderCustomers = (obj) => {
  return `
    <tr id="tr_${obj.id}">
        <td>${obj.id}</td>
        <td>${obj.fullName}</td>
        <td>${obj.email}</td>
        <td>${obj.phone}</td>
        <td>${obj.address}</td>
        <td>${obj.balance}</td>
        <td>
          <button class="btn btn-outline-secondary edit" id="dataEdit_${obj.id}" data-id="${obj.id}">
            <i class="far fa-edit"></i>
          </button>
        </td>
        <td>
            <button class="btn btn-outline-success deposit"  id="dataDeposit_${obj.id}" data-id="${obj.id}">
                <i class="fas fa-plus"></i>
            </button>
        </td>
        <td>
            <button class="btn btn-outline-warning withdraw"  id="dataWithdraw_${obj.id}" data-id="${obj.id}">
                <i class="fas fa-minus"></i>
            </button>
        </td>
        <td>
            <button class="btn btn-outline-primary transfer"  id="dataTransfet_${obj.id}" data-id="${obj.id}">
                <i class="fas fa-exchange-alt"></i>
            </button>
        </td>
        <td>
            <button class="btn btn-outline-danger ban"  id="dataBan_${obj.id}" data-id="${obj.id}">
                <i class="fas fa-ban"></i>
            </button>
        </td>
</tr>
`;
};

getAllCustomers();

btnCreate.addEventListener("click", async () => {
  const fullName = document.getElementById("fullNameCre").value;
  const email = document.getElementById("emailCre").value;
  const phone = document.getElementById("phoneCre").value;
  const address = document.getElementById("addressCre").value;
  const balance = 0;
  const deleted = 0;

  const obj = {
    fullName,
    email,
    phone,
    address,
    balance,
    deleted
  }

  const content = await fetchCreateCustomer(obj);

  const str = renderCustomers(content);
  bodyCustomer.innerHTML += str;

  closeModal("modalCreate");

  showSuccessToast("Tạo mới thành công")


});

btnUpdate.addEventListener("click", async () => {
  const fullName = document.getElementById("fullNameUp").value;
  const email = document.getElementById("emailUp").value;
  const phone = document.getElementById("phoneUp").value;
  const address = document.getElementById("addressUp").value;

  const obj = {
    fullName,
    email,
    phone,
    address
  }

  const content = await fetchUpdateCustomer(customerId, obj);
  updateRow(content);
  closeModal("modalUpdate");

  showSuccessToast("Cập nhật thông tin thành công")

});

btnDeposit.addEventListener("click", async () => {
  const idCustomer = document.getElementById("idDepo").value;
  const fullName = document.getElementById("fullNameDepo").value;
  const balance = document.getElementById("balanceDepo").value;
  const transactionAmount = document.getElementById("transactionDepo").value;
  const createAt = new Date();

  const obj = {
    idCustomer,
    fullName,
    balance,
    transactionAmount,
    createAt
  }

  await fetchDepositCustomer(obj);
  const content = await getCustomer(customerId);

  incrementBalance(obj.transactionAmount, content);
  updateRow(content);
  closeModal("modalDeposit");
  showSuccessToast("Nạp tiền thành công")

});

btnWithdraw.addEventListener("click", async() => {
  const idCustomer = document.getElementById("idWi").value;
  const fullName = document.getElementById("fullNameWi").value;
  const balance = document.getElementById("balanceWi").value;
  const transactionAmount = document.getElementById("transactionWi").value;
  const createAt = new Date();

  const obj = {
    idCustomer,
    fullName,
    balance,
    transactionAmount,
    createAt
  }

  await fetchWithdrawCustomer(obj);
  const content = await getCustomer(customerId);

  reduceBalance(obj.transactionAmount,content);
  updateRow(content);
  closeModal("modalWithdraw");
  showSuccessToast("Rút tiền thành công");
});

btnBan.addEventListener("click", async() => {
  const deleted = 1
  const obj = {
    deleted
  }
  const content = await fetchUpdateCustomer(customerId, obj);

  closeModal("modalBan");
  removeRow(content);
  
  showSuccessToast("Xóa thành công");


})

function showSuccessToast(message) {
  toastBody.innerText = message;
  toastBootstrap.show();

  setTimeout(() => {
    btnCloseToast.click()
  }, 1500);
}

const fetchWithdrawCustomer = async(obj) => {

  const response = await fetch("http://localhost:3300/withdraws/", {

  method: "POST",
  headers: {
    "Content-type": "application/json; charset=UTF-8"
  },
  body: JSON.stringify(obj)
});

const withdraw = await response.json();
return withdraw;

}

const fetchDepositCustomer = async (obj) => {

  const response = await fetch("http://localhost:3300/deposits/", {

    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(obj)
  });

  const deposit = await response.json();
  return deposit;
}

const fetchUpdateCustomer = async (customerId, obj) => {
  const response = await fetch("http://localhost:3300/customers/" + customerId, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(obj)
  });
  const customer = await response.json();
  return customer;
}

const fetchCreateCustomer = async (obj) => {

  const response = await fetch("http://localhost:3300/customers", {

    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    },
    body: JSON.stringify(obj)
  });

  const customer = await response.json();
  return customer;
};

function incrementBalance(amount, obj){
  obj.balance = obj.balance + parseFloat(amount)
};

function reduceBalance(amount, obj){
  obj.balance = obj.balance - parseFloat(amount)
};

function updateRow(obj){
  const updateRow = document.getElementById("tr_" + obj.id);
  const str = renderCustomers(obj);
  updateRow.innerHTML = str;
}

function removeRow(obj){
  const removeRow = document.getElementById("tr_" + obj.id);
  removeRow.remove();
}

function openModal(elm) {
  let el = document.getElementById(elm);
  new bootstrap.Modal(el).show();
}

function closeModal(elem) {
  document.getElementById(elem).style.display = "none"
  document.getElementById(elem).classList.remove("show")
  document.querySelector('.modal-backdrop').remove();
  document.querySelector('body').setAttribute('style', 'overflow: none')
}





