// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
    if (buttonsStatus.length > 0) {
        let url = new URL(window.location.href);

    buttonsStatus.forEach((button) => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status != "") {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
            });
        });
    }
// End Button Status


// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    let url = new URL(window.location.href);
    formSearch.addEventListener("submit", (e) => {
        // dung de khong refresh web
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;
        
        if(keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
    });
};
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if (buttonsPagination.length > 0) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach((button) => {
        button.addEventListener("click", () => {
        const page = button.getAttribute("button-pagination");

        url.searchParams.set("page", page);

        window.location.href = url.href;
        });
    });
}
// End Pagination


// Preview Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");
    const closeButton = document.querySelector("[close-preview-button]");

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file);
            closeButton.style.display = "inline";
        }
    });
    closeButton.addEventListener("click", () => {
        uploadImagePreview.src = ""; 
        uploadImageInput.value ="";
        closeButton.style.display = "none";
    });
}
// End Preview Upload Image

// Sort
const sort = document.querySelector("[sort]");
if(sort) {
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    sortSelect.addEventListener("change", (e) => {
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");

        url.searchParams.set("sortKey",sortKey);
        url.searchParams.set("sortValue",sortValue);

        window.location.href = url.href;
    });
    // Clear Sort
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });
    // End Clear Sort

    // Add selected = true for input form
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");
    
    if(sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;
    }
}
// End Sort