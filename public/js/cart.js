function warningSwitch() {
    let $totalAmount = $(".payment__total__amount");
    let $warningPay = $(".payment__top");
    let $payBtn = $(".payment__btn");
    let $payment__data = $(".payment__data")
    let $setAdressBtn = $(".setAdressBtn")
    if (+$totalAmount.html() < 30000) {
        $warningPay.css("display", "flex");
        $payment__data.css("display", "none")
        $setAdressBtn.css("display", "none")
        $payBtn.hide(1);
    } else {
        $warningPay.hide();
        $payment__data.css("display", "flex")
        $setAdressBtn.css("display", "flex")
        $payBtn.css("display", "block");
    }
}

function cartDetailsSwitch() {
    const cart = getCartFromLocalStorage()
    if (JSON.stringify(cart) !== '{}') {
        // если в корзине есть элементы то показываем детали корзины
        document.querySelector('.payment').classList.remove('hide')
    } else {
        //если корзина пуст то скрываем детали корзины
        document.querySelector('.payment').classList.add('hide')
    }
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
function showCartElements() {
    return new Promise((resolve, reject) => {
        const cart = getCartFromLocalStorage()
        const card__products = document.querySelector('.card__products')
        let arr = []
        var fullCartInfo = {}
        axios.post('/cart/getFullCartInfo', {
            cart
        }).then((response) => {
            fullCartInfo = response.data
            cartDetailsSwitch()
            document.querySelector('.payment__total__amount').innerHTML = fullCartInfo.totalCost
            for (const product of fullCartInfo.list) {
                const productHtml = `
        <div class="card__product">
        <a href="#!" class="card__product__link">
            <img src=${product.imageSrc} alt="jpg" class="card__product__img">
        </a>
        <div class="card__about">
            <a href="#!" class="card__product__link card__about__img">
                <img src=${product.imageSrc} alt="jpg" class="card__product__img">
            </a>
            <p class="card__about__name">${product.name}</p>
            <span class="card__about__amount">${product.cost} Сум</span>
        </div>
        <div class="card__action">
            <div class="card__action__box">
                <span class="card__action__amount" data-price=${product.cost}>${product.sum}</span>
                <span class="card__action__currency">Сум</span>
            </div>
            <div class="card__btns">
                <button class="card__minus"><i class="minus far fa-minus"></i></button>
                <span class="card__show">${product.count}</span>
                <button class="card__pilus"><i class="plus far fa-plus"></i></button>
            </div>
        </div>
        <button data-id=${product._id} class="card__product__remove"><i class="far fa-trash-alt"></i></button>
        <button data-id=${product._id} class="card__product__check"><i class="far fa-check"></i></button>
        </div>`
                arr.push(productHtml)
            }
            card__products.innerHTML = arr.join(' ')
            resolve()
        })
            .catch((err) => {
                console.log(err);
                reject()
            })
    })
}

showCartElements().then(() => {
    warningSwitch()
    /* SHOPPING CARD PAGE START */
    let $pilus = $(".card__pilus");
    let $minus = $(".card__minus");
    let $show = $(".card__show");
    let $delete = $(".card__product__remove");
    let $product = $(".card__product");
    let $actionAmount = $(".card__action__amount");
    let $check = $(".card__product__check");
    $pilus.on("click", function () {
        let show = $(this).parent().find($show);
        show.html(+show.html() + +1);
        let amount = $(this).parent().parent().find($actionAmount);
        amount.html(amount.attr("data-price") * show.html());
        $(this).closest($product).find($check).show(1);
        $(this).closest($product).find($delete).hide(1);
    });

    $minus.on("click", function () {
        let show = $(this).parent().find($show);
        if (show.html() <= 1) {
            show.html(1);
        } else {
            show.html(+show.html() - 1);
            let amount = $(this).parent().parent().find($actionAmount);
            amount.html(amount.attr("data-price") * show.html());
            $(this).closest($product).find($check).show(1);
            $(this).closest($product).find($delete).hide(1);
        }
    });
    //Изменение количество товара в корзине start
    $check.on("click", function () {
        $(this).parent().find($delete).show(1);
        $(this).hide(1);
        const show = $(this).parent().find($show);
        const productId = $(this).attr("data-id")
        const count = parseInt(show.html())
        let cart = getCartFromLocalStorage()
        if (cart[productId] !== undefined) {
            cart[productId] = count
        }
        localStorage.setItem('cart', JSON.stringify(cart))
        showCartInfo().then(() => {
            warningSwitch()
        })
    });
    //Изменение количество товара в корзине end

    //Удаление товара из корзины start
    $delete.on("click", function () {
        const that = $(this);
        const productId = that.attr("data-id");
        let cart = getCartFromLocalStorage()
        delete cart[productId]
        localStorage.setItem('cart', JSON.stringify(cart))
        showCartInfo().then(() => {
            warningSwitch()
            cartDetailsSwitch()
        })
        that.parent().hide(1);
    });
    //Удаление товара из корзины end
    //Корзина end
    /* SHOPPING CARD PAGE END */
})

// TODO  - время доставки, адрес, Оформление заказа
