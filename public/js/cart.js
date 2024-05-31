// Update quantiy for product in cart order
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
    // để lấy được thuộc tính name trong thẻ input
if(inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", (e) => {
            const productId = input.getAttribute("product-id");
            const quantity = parseInt(input.value);
            if(quantity > 0){
                window.location.href = `/cart/update/${productId}/${quantity}`;
            }
        });
    });
}
// End update quantiy for product in cart order