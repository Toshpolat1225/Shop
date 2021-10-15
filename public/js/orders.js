const ordersContainer = document.querySelector("#ordersContainer");
if (ordersContainer) {
    // Изменение состояний заказов (упаковано, доставлено) start
    ordersContainer.addEventListener("click", function (event) {
        if (event.target.name === "isWrapped") {
            axios
                .patch("/orders?fromAxios=true", {
                    order: event.target.dataset.order,
                    isWrapped: event.target.checked,
                })
                .then(function (response) {
                    if (response.data.message === "success") {
                        alert("Состояние заказа изменен");
                    } else {
                        alert("Произошла ошибка при изменении состояния заказа");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }

        if (event.target.name === "isDelivered") {
            axios
                .patch("/orders?fromAxios=true", {
                    order: event.target.dataset.order,
                    isDelivered: event.target.checked,
                })
                .then(function (response) {
                    if (response.data.message === "success") {
                        alert("Состояние заказа изменен");
                    } else {
                        alert("Произошла ошибка при изменении состояния заказа");
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
        // Изменение состояний заказов (упаковано, доставлено) end

        if (event.target.classList.contains('sendLocation')) {
            const order = event.target.dataset.order
            axios.get(`/orders/sendLocation/${order}?fromAxios=true`)
                .then((response) => {
                    if (response.data.message === 'sent') {
                        alert('Геолокация отправлена водителям')
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('Произошла ошибка при отправке геолокации')
                })
        }

        if (event.target.classList.contains('delete__button')) {
            const order = event.target.dataset.order
            axios.get(`/orders/delete/${order}?fromAxios=true`)
                .then((response) => {
                    let message = response.data.message
                    if (message === 'deleted') {
                        let id = `#order-${order}`
                        document.querySelector(id).classList.add('hide')
                        alert(`Заказ №${order} удалён `)
                    }
                }).catch((error) => {
                    console.log(error);
                    alert('Произошла ошибка при удалении заказа')
                })
        }
    });
}
//Изменение формата времени заказов start
const orderDate = document.querySelectorAll(".goods__action__time__now");
orderDate.forEach((item) => {
    item.innerHTML = toDate(item.textContent);
});
//Изменение формата времени заказов end

function toDate(date) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}