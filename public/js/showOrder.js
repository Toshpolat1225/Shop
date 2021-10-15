const order = JSON.parse(localStorage.getItem('order'))
showOrder(order)
function showOrder(order) {
    const orderContainer = document.querySelector('#orderContainer')
    if (order !== null) {
        let productNames = [], productCosts = [], productCounts = [], productSums = []
        const list = order.list.concat()
        for (let i = 0; i < list.length; i++) {
            productNames.push(`<li class="namebox__item"> ${list[i].name}</li >`)
            productCosts.push(`<li class="goods__price__item">${list[i].cost}</li>`)
            productCounts.push(`<li class="goods__count__item">${list[i].count}</li>`)
            productSums.push(`<li class="goods__total__item">${list[i].sum}</li>`)
        }

        const orderHTML = `
    <section class="goods">
        <h2 class="goods__head">Информация о заказе<span class="goods__head__number"></span></h2>
    </section>
    <section class="goods">
        <div class="goods__box">
            <ul class="goods__list">
                <li class="goods__list__item">
                    <ul class="goods__name namebox">
                        <li class="goods__menu__item">Название</li>
                        ${productNames.join('\n')}
                    </ul>
                </li>
                <li class="goods__list__item">
                    <ul class="goods__price">
                        <li class="goods__menu__item">Цена</li>
                        ${productCosts.join('\n')}
                    </ul>
                </li>
                <li class="goods__list__item">
                    <ul class="goods__count">
                        <li class="goods__menu__item">Количество</li>
                        ${productCounts.join('\n')}
                    </ul>
                </li>
                <li class="goods__list__item">
                    <ul class="goods__total">
                        <li class="goods__menu__item">Сумма</li>
                        ${productSums.join('\n')}
                    </ul>
                </li>
            </ul>
            <div class="goods__action">
                <div class="goods__action__text">
                    <span class="goods__action__item">Всего: </span>
                    <span class="goods__action__item">Стоимость доставки: </span>
                    <span class="goods__action__item">Дата заказа: </span>
                    <span class="goods__action__item">Время доставки: </span>
                    <span class="goods__action__item">Номер заказа:</span>
                    <span class="goods__action__number">Номер телефона:</span>
                </div>
                <div class="goods__action__price">
                    <span class="goods__action__all">${order.cartTotalCost} Сум</span>
                    <span class="goods__action__delivery">${order.deliveryCost} Сум</span>
                    <span class="goods__action__time__now">${toDate(order.date)}</span>
                    <span class="goods__action__time">${order.deliveryTimeInterval}</span>
                    <span class="goods__action__number">${order.order}</span>
                    <span class="goods__action__number">${order.user.phoneNumber}</span>
                </div>
            </div>
            <div class="goods__amount">
                <span class="goods__amount__text">Итого:</span>
                <span class="goods__amount__count">${order.orderTotalCost} Cум</span>
            </div>
        </div>
    </section>
    `
        orderContainer.insertAdjacentHTML('afterend', orderHTML)
    } else {
        orderContainer.innerHTML =`
    <section class="goods">
            <h2 class="goods__head">Вы ещё ничего не заказали<span class="goods__head__number"></span></h2>
    </section>
    `
    }
}
function toDate(date) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}