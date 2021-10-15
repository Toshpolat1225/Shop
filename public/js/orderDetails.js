const submitButton = document.querySelector('#submit')
let userInfo = JSON.parse(localStorage.getItem('userInfo'))
let phoneNumber = document.querySelector('#phoneNumber')
let name = document.querySelector("#name")
let street = document.querySelector('#street')
let homeNumber = document.querySelector('#homeNumber')
if (userInfo !== null && phoneNumber && name && street && homeNumber) {
    phoneNumber.value = userInfo.phoneNumber
    name.value = userInfo.name
    street.value = userInfo.street
    homeNumber.value = userInfo.homeNumber
}
if (submitButton) {
    submitButton.addEventListener('click', (event) => {
        event.preventDefault()

        const timeInterval = document.querySelector('#deliveryTime').value
        const timeId = parseInt(timeInterval.substring(0, 2))
        const deliveryTime = { timeId, timeInterval }
        const cart = getCartFromLocalStorage()
        phoneNumber = document.querySelector('#phoneNumber')
        name = document.querySelector("#name")
        street = document.querySelector('#street')
        homeNumber = document.querySelector('#homeNumber')
        userInfo = {
            phoneNumber: phoneNumber.value,
            name: name.value,
            street: street.value,
            homeNumber: homeNumber.value
        }
        const result = validator(userInfo)
        if (result.isValid) {
            localStorage.setItem('userInfo', JSON.stringify(userInfo))
            axios
                .post('/orders', {
                    ...userInfo,
                    deliveryTime,
                    cart
                })
                .then((response) => {
                    if (response.status == 201) {
                        localStorage.removeItem('cart')
                        showCartInfo()
                        localStorage.setItem('order', JSON.stringify(response.data))
                        alert('Заказ успешно оформлен! Наши операторы скоро свяжутся с вами.')
                        window.location.href = "/orders/order";
                    } else if (response.data.status == 403){
                        alert('Вы не можете оформить заказ так как ваш номер телефона заблокирован администратором!')
                    }
                }).catch((err)=>{
                    console.log(err.message);
                })
        } else {
            alert(result.error)
        }

    })
}

function getCartFromLocalStorage() {
    let cart = localStorage.getItem('cart')
    if (cart !== null) {
        cart = JSON.parse(cart)
    } else {
        cart = {}
    }
    return cart
}
function showCartInfo() {
    return new Promise((resolve, reject) => {
        const cart = getCartFromLocalStorage()
        let $allQuantity = $(".card__span");
        let $allAmount = $(".amount");
        let $cartCountProducts = $(".card__head__count");
        let $payment__total__amount = $(".payment__total__amount");
        var fullCartInfo = {}
        axios.post('/cart/getFullCartInfo', {
            cart
        })
            .then((response) => {
                fullCartInfo = response.data
                $allAmount.html(fullCartInfo.totalCost);
                $payment__total__amount.html(fullCartInfo.totalCost)
                $allQuantity.html(fullCartInfo.quantityProducts);
                $cartCountProducts.html(fullCartInfo.quantityProducts);
                resolve()
            })
            .catch((err) => {
                console.log(err);
                reject()
            })
    })
}
// Функция для валидации текстовых полей
function validator(userInfo) {
    let errors = {
        phoneNumber: 'Введите номер телефона',
        name: 'Введите ваше имя',
        street: 'Введите название улицы',
        homeNumber: 'Введите номер дома'
    }

    for (const item in userInfo) {
        if (userInfo[item] === '') {
            return {
                error: errors[item],
                isValid: false
            }
        }
    }
    return {
        error: '',
        isValid: true
    }
}