// Change-status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");

if (buttonsChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.dataset.path; 

  buttonsChangeStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const statusChange = button.dataset.status === "active" ? "inactive" : "active";
      const id = button.dataset.id;

      formChangeStatus.action = `${path}/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.submit();
    });
  });
}
// End Change-status

// Checkbox multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    
    inputCheckAll.addEventListener("click", () => {
      if(inputCheckAll.checked) {
        inputsId.forEach(input => {
          input.checked = true;
        });
      } else {
        inputsId.forEach(input => {
          input.checked = false;
        });
      }
    });  
      inputsId.forEach(input => {
        input.addEventListener("click", () => {
          const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
          
          if(countChecked == inputsId.length) {
            inputCheckAll.checked = true;
          } else {
            inputCheckAll.checked = false;
          }
        });
      });
    
}
// End Checkbox Multi


// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
  formChangeMulti.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");
    const inputsChecked = checkboxMulti.querySelectorAll(
      "input[name='id']:checked"
    );

    const typeChange = e.target.elements.type.value;

    if(typeChange == "delete-all") {
      const isConfirm = confirm("Are you sure to delete that item?");
      
      if(!isConfirm) {
        return;
      } 
    }

    if(inputsChecked.length > 0) {
      let ids = [];
      const inputIds = formChangeMulti.querySelector("input[name='ids']")


      inputsChecked.forEach(input => {
        const id = input.value;

        if (typeChange == "change-position"){
          const position = input.closest("tr").querySelector("input[name='position']").value;
          ids.push(`${id}-${position}`);
        } else {
          ids.push(id);
        }
      });
      inputIds.value = ids.join(", ");

      formChangeMulti.submit();
    } else {
      alert("Please, Choose one item!!!");
    }
  });
}
// End Form Change Multi


// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonsDelete.forEach(button => {
    button.addEventListener("click", () => {
      const isConfirm = confirm("Are you sure to delete that item?");
      
      if(isConfirm) {
        const id = button.getAttribute("data-id");

        const action = `${path}/${id}?_method=DELETE`;

        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}
// End Delete Item

// Show Notification
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time")) || 3000;
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End Show Notification