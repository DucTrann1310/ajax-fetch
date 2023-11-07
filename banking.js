const bodyCustomer = $("#bodyCustomer");
const btnCreate = $("#btnCreate");
const btnUpdate = $("#btnUpdate")
const btnDeposit = $("#btnDeposit")
const btnWithdraw = $("#btnWithdraw");
const btnBan = $("#btnBan");
const reciptentSelect = $("#idRe");
const loading = $("#loading");

const toastLive = $("#liveToast")
const toastBody = $("#toast-body")
const btnCloseToast = $("#btnCloseToast")

const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLive)

let customerId = 0;
async function fetchAllPerson() {

  return await $.ajax({
    url: "http://localhost:3300/customers"
  })
}

const getAllCustomers = async () => {

  const customers = await fetchAllPerson();

  console.log(customers);

  customers.forEach((item) => {
    if (item.deleted == 0) {
      const str = renderCustomers(item);
      bodyCustomer.prepend(str);
    }
    attachEventHandle()

  });
};

const getCustomer = async (customerId) => {

  const response = await $.ajax({

    url: "http://localhost:3300/customers/" + customerId,
    dataType: "json"
  });

  return response;
};

const getRecipients = async (customerId) => {
  const customers = await fetchAllPerson();

  const reciptents = customers.filter((reciptent) => {
    return reciptent.id !== customerId && reciptent.deleted === 0;
  });
  return reciptents
}

const getReciptent = async (customerId) => {

  const response = await $.ajax({

    url: "http://localhost:3300/customers/",
    dataType: "json"
  });

  const customers = response;

  const reciptents = customers.filter((customer) => {

    return customer.deleted === 0 && customer.id !== customerId;
  });

  return reciptents;
};


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

$("#modalTransfer").on('hidden.bs.modal', () => {
  $("#frmTransfer").trigger("reset")
  $("#frmTransfer input").removeClass("error")
  $("#frmTransfer label.error").remove()
});


$("#modalWithdraw").on('hidden.bs.modal', () => {
  $("#frmWithdraw").trigger("reset")
  $("#frmWithdraw input").removeClass("error")
  $("#frmWithdraw label.error").remove()
});

$("#modalDeposit").on('hidden.bs.modal', () => {
  $("#frmDeposit").trigger("reset")
  $("#frmDeposit input").removeClass("error")
  $("#frmDeposit label.error").remove()
});

$("#modalUpdate").on('hidden.bs.modal', () => {
  $("#frmUpdate").trigger("reset")
  $("#frmUpdate input").removeClass("error")
  $("#frmUpdate label.error").remove()
});

$('#modalCreate').on('hidden.bs.modal', () => {
  $('#frmCreate').trigger('reset')
  $('#frmCreate input').removeClass('error')
  $('#frmCreate label.error').remove()
});



$("#frmTransfer").validate({
  rules: {
    transferAmount: {
      required: true,
      number: true,
      min: 1
    },
    transactionAmount: {
      max: parseFloat($("#balanceSe").val())
    }
  },
  message: {
    transferAmount: {
      required: "Vui lòng nhập tiền chuyển khoản",
      number: "Tiền chuyển khoản phải là số",
      min: "Tiền chuyển khoản tối thiểu là 1"
    },
    transactionAmount: {
      max: "Tổng tiền chuyển khoản không được lớn hơn số tiền hiện có"
    }
  },
  submitHandler: () => {
    transferCustomer()
  }
})

$("#frmWithdraw").validate({
  rules: {
    transactionWi: {
      required: true,
      number: true,
      max: function () {
        return parseFloat($("#balanceWi").val());
      }
    }
  },
  message: {
    transactionWi: {
      required: "Vui lòng nhập tiền rút",
      number: "Tiền rút phải là số",
      max: "Tiền rút không được lớn hơn số tiền hiện có"
    }
  },
  submitHandler: () => {
    withdrawCustomer()
  }
})

$("#frmDeposit").validate({
  rules: {
    transactionDepo: {
      required: true,
      number: true,
      min: 1
    }
  },
  message: {
    transactionDepo: {
      required: "Vui lòng nhập số tiền nộp",
      number: "Tiền nộp vào phải là số",
      min: "Tiền nộp vào phải là số dương và tối thiểu là 1"
    }
  },
  submitHandler: () => {
    depositCustomer()
  }
})

$("#frmUpdate").validate({
  rules: {
    fullNameUp: {
      required: true,
      lettersOnly: true
    },
    emailUp: {
      required: true,
      email: true
    },
    phoneUp: {
      required: true,
      phoneNumber: true

    },
    addressUp: {
      required: true,
      minlength: 5
    }
  },
  message: {
    fullNameUp: {
      required: "Vui lòng nhập tên",
    },
    emailUp: {
      required: "Vui lòng nhập email",
      email: "Vui lòng nhập địa chỉ email hợp lệ"
    },
    phoneUp: {
      required: "Vui lòng nhập số điện thoại"
    },
    addressUp: {
      required: "Vui lòng nhập địa chỉ",
      minlength: "Tối thiểu 5 kí tự"
    }
  },
  submitHandler: () => {
    updateCustomer()
  }
})

$("#frmCreate").validate({
  rules: {
    fullNameCre: {
      required: true,
      lettersOnly: true
    },
    emailCre: {
      required: true,
      email: true
    },
    phoneCre: {
      required: true,
      phoneNumber: true

    },
    addressCre: {
      required: true,
      minlength: 5
    }
  },
  message: {
    fullNameCre: {
      required: "Vui lòng nhập tên",
    },
    emailCre: {
      required: "Vui lòng nhập email",
      email: "Vui lòng nhập địa chỉ email hợp lệ"
    },
    phoneCre: {
      required: "Vui lòng nhập số điện thoại"
    },
    addressCre: {
      required: "Vui lòng nhập địa chỉ",
      minlength: "Tối thiểu 5 kí tự"
    }
  },
  submitHandler: () => {
    createCustomer()
  }
})



$.validator.addMethod("lettersOnly", function (value, element) {
  return this.optional(element) || /^[a-zA-Z\s]+$/.test(value);
}, "Vui lòng chỉ nhập chữ cái.");

$.validator.addMethod("phoneNumber", function (value, element) {
  return this.optional(element) || /^0\d{9}$/.test(value);
}, "Vui lòng nhập số điện thoại hợp lệ.");



getAllCustomers();




const transferCustomer = async () => {

}

btnBan.on("click", async () => {

  const customer = await getCustomer(customerId);
  customer.deleted = 1;

  const obj = {
    customer
  }

  btnBan.prop("disabled", true);
  loading.removeClass("hide");

  setTimeout(() => {
    $.ajax(
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        url: "http://localhost:3300/customers/" + customerId,
        method: "PATCH",
        data: JSON.stringify(customer)
      }
    )
      .done((data) => {
        const str = renderCustomers(data)
        const updateRow = $("#tr_" + customerId);
        updateRow.remove();

        closeModal("modalBan")
        attachEventHandle();

        toastBody.text('Xóa thành công')
        toastBootstrap.show()

        setTimeout(() => {
          btnCloseToast.click
        }, 1500);
      })
      .always(() => {
        btnUpdate.prop("disable", false)
        loading.addClass("hide")
      })
  }, 1000);
})

const withdrawCustomer = async () => {
  const customer = await getCustomer(customerId);
  const transactionAmount = $("#transactionWi").val();

  const obj = {
    customer,
    transactionAmount
  }

  btnWithdraw.prop("disable", true);
  loading.removeClass("hide");

  setTimeout(() => {
    $.ajax(
      {
        url: "http://localhost:3300/withdraws/",
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        data: JSON.stringify(obj)
      }
    )
      .done(() => {
        customer.balance = customer.balance - parseFloat(obj.transactionAmount);

        $.ajax(
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8"
            },
            url: "http://localhost:3300/customers/" + customerId,
            method: "PATCH",
            data: JSON.stringify(customer)
          }
        )
          .done((data) => {
            const str = renderCustomers(data);
            const updateRow = $("#tr_" + customerId);
            updateRow.replaceWith(str);
            attachEventHandle()
          })

        closeModal("modalWithdraw")

        toastBody.text('Rút tiền thành công')
        toastBootstrap.show()

        setTimeout(() => {
          btnCloseToast.click
        }, 1500);
      })
      .always(() => {
        btnWithdraw.prop("disable", false)
        loading.addClass("hide")

      })
  }, 1000);
}

const depositCustomer = async () => {
  const customer = await getCustomer(customerId);
  const transactionAmount = $("#transactionDepo").val()

  const obj = {
    customer,
    transactionAmount
  }

  btnDeposit.prop("disabled", true);
  loading.removeClass("hide");

  setTimeout(() => {
    $.ajax(
      {
        url: "http://localhost:3300/deposits/",
        method: "POST",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        data: JSON.stringify(obj)
      }
    ).done(() => {
      customer.balance = customer.balance + parseFloat(obj.transactionAmount);

      $.ajax(
        {
          headers: {
            "Content-type": "application/json; charset=UTF-8"
          },
          url: "http://localhost:3300/customers/" + customerId,
          method: "PATCH",
          data: JSON.stringify(customer)
        }
      )
        .done((data) => {
          const str = renderCustomers(data);
          const updateRow = $("#tr_" + customerId);
          updateRow.replaceWith(str);
          attachEventHandle()
        })

      closeModal("modalDeposit");


      toastBody.text('Nạp tiền thành công')
      toastBootstrap.show()

      setTimeout(() => {
        btnCloseToast.click
      }, 1500);



    })
      .always(() => {
        btnDeposit.prop("disable", false)
        loading.addClass("hide")

      })
  }, 1000);
}

const updateCustomer = () => {
  const fullName = $('#fullNameUp').val()
  const email = $('#emailUp').val()
  const phone = $('#phoneUp').val()
  const address = $('#addressUp').val()

  const obj = {
    fullName,
    email,
    phone,
    address
  }

  btnUpdate.prop("disabled", true);
  loading.removeClass("hide");

  setTimeout(() => {
    $.ajax(
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        url: "http://localhost:3300/customers/" + customerId,
        method: "PATCH",
        data: JSON.stringify(obj)
      }
    )
      .done((data) => {
        const str = renderCustomers(data);
        const updateRow = $("#tr_" + customerId);
        updateRow.replaceWith(str);


        closeModal("modalUpdate");

        toastBody.text('Sửa thông tin thành công')
        toastBootstrap.show()

        setTimeout(() => {
          btnCloseToast.click
        }, 1500);

        attachEventHandle()

      })
      .always(() => {
        btnUpdate.prop("disable", false)
        loading.addClass("hide")
      })
  }, 1000);
}

const createCustomer = () => {
  const fullName = $('#fullNameCre').val()
  const email = $('#emailCre').val()
  const phone = $('#phoneCre').val()
  const address = $('#addressCre').val()
  const balance = 0
  const deleted = 0

  const obj = {
    fullName,
    email,
    phone,
    address,
    balance,
    deleted
  }

  btnCreate.prop("disabled", true);

  loading.removeClass('hide')

  setTimeout(() => {
    $.ajax(
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        method: 'POST',
        url: "http://localhost:3300/customers",
        data: JSON.stringify(obj)
      }
    )
      .done((data) => {
        const str = renderCustomers(data)
        bodyCustomer.prepend(str);

        closeModal('modalCreate')
        attachEventHandle();

        toastBody.text('Thêm mới thành công')
        toastBootstrap.show()

        setTimeout(() => {
          btnCloseToast.click()
        }, 1500);
      })
      .always(() => {
        btnCreate.prop("disabled", false);
        loading.addClass('hide')
      });
  }, 1000);
}

btnWithdraw.on("click", async () => {
  $("#frmWithdraw").trigger("submit")
})

btnDeposit.on("click", async () => {
  $("#frmDeposit").trigger("submit")
})

btnUpdate.on("click", async () => {
  $("#frmUpdate").trigger("submit")
})

btnCreate.on('click', async () => {
  $('#frmCreate').trigger('submit')
})




function openModal(elm) {
  let el = $("#" + elm);
  el.modal("show");
}

function closeModal(elem) {
  let el = $("#" + elem);
  el.modal("hide");
}

function attachEventHandle() {
  const btnEditElems = $(".edit");
  const btnDepositElems = $(".deposit");
  const btnWithdrawElems = $(".withdraw");
  const btnBanElems = $(".ban");
  const btnTransferElems = $(".transfer");

  btnEditElems.off("click")
  btnDepositElems.off("click")
  btnWithdrawElems.off("click")
  btnBanElems.off("click")
  btnTransferElems.off("click")

  btnEditElems.each((index, item) => {

    $(item).on("click", async () => {

      customerId = $(item).data("id");
      customer = await getCustomer(customerId);
      openModal("modalUpdate");

      $("#fullNameUp").val(customer.fullName);
      $("#emailUp").val(customer.email);
      $("#phoneUp").val(customer.phone);
      $("#addressUp").val(customer.address);
    });
  });

  btnDepositElems.each((index, item) => {

    $(item).on("click", async () => {

      customerId = $(item).data("id");

      customer = await getCustomer(customerId);

      openModal("modalDeposit");

      $("#idDepo").val(customer.id);
      $("#fullNameDepo").val(customer.fullName);
      $("#balanceDepo").val(customer.balance);
    });
  });

  btnWithdrawElems.each((index, item) => {

    $(item).on("click", async () => {

      customerId = $(item).data("id");
      customer = await getCustomer(customerId);
      openModal("modalWithdraw");

      $("#idWi").val(customer.id);
      $("#fullNameWi").val(customer.fullName);
      $("#balanceWi").val(customer.balance);
    });
  });

  btnBanElems.each((index, item) => {

    $(item).on("click", async () => {

      customerId = $(item).data("id");
      customer = await getCustomer(customerId);
      openModal("modalBan");

      $("#fullNameBan").val(customer.fullName);
      $("#emailBan").val(customer.email);
      $("#phoneBan").val(customer.phone);
      $("#addressBan").val(customer.address);
    });
  });

  btnTransferElems.each((index, item) => {

    $(item).on("click", async () => {

      customerId = $(item).data("id");
      const sender = await getCustomer(customerId);
      const recipients = await getRecipients(customerId);
      openModal("modalTransfer");

      $("#idSen").val(sender.id);
      $("#fullNameSe").val(sender.fullName);
      $("#emailSe").val(sender.email);
      $("#balanceSe").val(sender.balance);

      // recipients.each((index, recipient) => {

      //   const option = $("<option></option>");
      //   option.val(recipient.id);
      //   option.text(recipient.fullName);
      //   $("#reciptentSelect").append(option);

      const idRe = $("#idRe");
      idRe.empty();

      recipients.forEach((recipient) => {
        const option = $("<option></option>")
          .attr("value", recipient.id)
          .text(`(${recipient.id}) ` + recipient.fullName);
        idRe.append(option);
      });
    });
  });
}





