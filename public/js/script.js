// $(document).bind("contextmenu",function(e) {
//     e.preventDefault();
//    });


//    $(document).keydown(function(e){
//        if(e.which === 123){
//           return false;
//        }
//    });
/* SECTION SLIDER OWL START */
let owl = $(".slider .owl-carousel");
owl.owlCarousel({
  items: 1,
  loop: true,
  margin: 10,
  autoplay: true,
  autoplayTimeout: 7000,
  autoplayHoverPause: false,
  nav: true,
  responsiveClass: true,
  responsive: {
    0: {
      nav: false,
      dots: false,
    },
    576: {
      items: 1,
      nav: false,
      dots: false,
    },
    768: {
      dots: false,
    },
  },
});
/* SECTION SLIDER OWL END */

/* SECTION PRODUCTS OWL START */
$(".products .owl-carousel").owlCarousel({
  loop: true,
  margin: 30,
  items: 4,
  autoWidth: true,
  nav: true,
  autoplay: true,
  autoplayTimeout: 20000,
  autoplayHoverPause: true,
  responsiveClass: true,
  responsive: {
    0: {
      items: 1,
      autoWidth: true,
      margin: 15,
      dots: false,
    },
    576: {
      items: 2,
      dots: false,
      margin: 33,
      autoWidth: true,
    },
    768: {
      items: 3,
      margin: 10,
      dots: false,
      autoWidth: true,
    },
    992: {
      items: 4,
      nav: true,
      loop: true,
      dots: false,
      autoWidth: true,
      margin: 40,
    },
    1200: {
      margin: 4,
      dots: false,
    },
  },
});
/* SECTION PRODUCTS OWL END */

/* SECTION PRODUCTS OWL START */
$(".categories .owl-carousel").owlCarousel({
  loop: false,
  items: 7,
  autoWidth: false,
  nav: true,
  autoplay: true,
  autoplayTimeout: 20000,
  autoplayHoverPause: true,
  responsiveClass: true,
  responsive: {
    0: {
      items: 2,
      margin: 10,
      dots: false,
    },
    576: {
      items: 3,
      dots: false,
      margin: 33,
    },
    768: {
      items: 4,
      margin: 10,
    },
    992: {
      items: 5,
      margin: 40,
    },
    1200: {
      margin: 5,
    },
  },
});
/* SECTION PRODUCTS OWL END */

$(document).ready(function () {
  $(".owl-carousel").owlCarousel();
  $(".owl-prev").html('<i class="far fa-chevron-left"></i>');
  $(".owl-next").html('<i class="far fa-chevron-right"></i>');

  let $catalog = $(".catalog__menu");
  let $catalogLabel = $(".catalog__span");

  $catalogLabel.on("click", function () {
    $catalog.slideToggle(100);
  });

  let $mobileForm = $(".header__form");
  let $mobileSearch = $(".header__search");

  $mobileForm.on("click", function () {
    if ($(window).width() < 768) {
      $(this).css("max-width", "100%").find($mobileSearch).focus();
      $mobileSearch.css("width", "100%");
    } else {
      $(this).find($mobileSearch).focus();
    }
  });

  $mobileSearch.bind("blur", function (e) {
    e.preventDefault();
    if ($(window).width() < 768) {
      $mobileForm.css("max-width", "40px");
      $(this).css("width", "0%");
    }
  });

  let $mobileBars = $(".mobile__bars");

  $mobileBars.on("click", function () {
    $(".mobile__bars__item").toggleClass("mobile__bars__close");
    $catalog.slideToggle(100);
  });

  $(".products__item__chosen").on("click", function () {
    $(this).find("i").addClass("fas").removeClass("far");
  });

  const user = $(".header__action__item");
  const userLog = $(".user__list");
  user.on("click", () => {
    userLog.slideToggle(100);
  });

  let $addCard = $(".products__item__btn");
  let $quantityCard = $(".quantity");
  let $showCard = $(".quantity__show");

  $addCard.on("click", function () {
    $(this).hide(1);
    $(this).parent().find($quantityCard).css("display", "flex");
    $(this).parent().find($showCard).html(1);
  });

  $(".products__item__link").on("click", function () {
    $(this).parent().find($addCard).hide(1);
    $(this).parent().find($quantityCard).css("display", "flex");
    $(this).parent().find($showCard).html(1);
  });

  let $pilusCard = $(".quantity__pilus");

  $pilusCard.on("click", function () {
    let show = $(this).parent().find($showCard);
    show.html(+show.html() + +1);
  });

  let $minusCard = $(".quantity__minus");
  $minusCard.on("click", function () {
    let show = $(this).parent().find($showCard);
    if (show.html() <= 1) {
      // $(this).parent().hide(1);
      $(this).parent().parent().find($addCard).show(1);
    } else {
      show.html(+show.html() - 1);
    }
  });

  /* MODAL START */
  let $modal = $(".modal");
  let $modalView = $(".modal__view");

  $modal.on("click", function (e) {
    if (e.target === this) {
      $(this).hide(1).css("opacity", "0");
      $modalView.css("transform", "translateY(-1000px)");
    }
  });

  let $closeModal = $(".modal__close__btn");

  $closeModal.on("click", function () {
    $modal.css("opacity", "0").hide(1);
    $modalView.css("transform", "translateY(-1000px)");
  });

  if ($(window).width() < 576) {
    $("#buy").html("Без регистрации");
  }
  /* MODAL END */

  let $addQuantity = $(".quantity__add");
  let $allQuantity = $(".card__span");
  let $allAmount = $(".amount");
  const $fixedCard = $(".fixed__card");
  let $toTop = $(".scrollToTop");
  let $cartCountProducts = $(".card__head__count");

  //Корзина start
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
    const cart = getCartFromLocalStorage()
    var fullCartInfo = {}
    axios.post('/cart/getFullCartInfo', {
      cart
    })
      .then((response) => {
        fullCartInfo = response.data
        $allAmount.html(fullCartInfo.totalCost);
        $allQuantity.html(fullCartInfo.quantityProducts);
        $cartCountProducts.html(fullCartInfo.quantityProducts);
      })
  }

  // Получение информацию о количество товаров в корзине и общую сумму корзины start
  showCartInfo()
  // //Получение информацию о количество товаров в корзине и общую сумму корзины end

  //Добавление товара в корзину start
  $addQuantity.on("click", function () {
    let cart = getCartFromLocalStorage()
    $(this).parent().hide(1);
    $(this).parent().parent().find($addCard).show(1);
    let show = $(this).parent().find($showCard);
    const productId = $(this).attr("data-id")
    const count = show.html()

    if (cart[productId] !== undefined) {
      cart[productId] = parseInt(cart[productId]) + parseInt(count)
    } else {
      cart[productId] = parseInt(count)
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    showCartInfo()
    //Добавление товара в корзину end

    if ($(window).width() < 768) {
      $fixedCard.show(0);
      $toTop.css("bottom", "15%");
    }
  });

  let elementClick = $("#fixed");
  let destination = $(elementClick).offset().top;

  $(window).scroll(function () {
    $scroll = $(this).scrollTop();

    if ($scroll > destination) {
      $toTop.css("display", "flex");
    } else {
      $toTop.hide(1);
    }
  });

  $toTop.on("click", function (e) {
    e.preventDefault();
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      500
    );
  });

  $(".products__item__empty").on("click", function (event) {
    event.preventDefault();
  });

  

  let $btn = $(".menu__btn");
  let $menuDark = $(".menu__dark");

  $menuDark.on("click", function () {
    $(this).toggleClass("menu__dark__active");
    $btn.toggleClass("menu__close");
    $("body").toggleClass("open__menu");
  });

  $btn.on("click", function () {
    $(this).toggleClass("menu__close");
    $menuDark.toggleClass("menu__dark__active");
    $(".menu__btn i").toggleClass("fa-bars");
    $(".menu__btn i").toggleClass("fa-times");
    $("body").toggleClass("open__menu");
  });
});

//My part start

//Обновление пользовательских данных start
const newName = document.querySelector("#newName");
if (newName) {
  newName.addEventListener("click", () => {
    newName.value = "";
  });
}
//Обновление пользовательских данных end

//Вывод контактов - start
const $telephone = document.querySelectorAll(".header__call__link");
const $instagram = document.querySelectorAll(".instagram_link");
const $telegram = document.querySelectorAll(".telegram_link");
const $facebook = document.querySelectorAll(".facebook_link");

if ($telephone) {
  axios
    .get("/info/getContactsAsJSON")
    .then(function (response) {
      const contacts = response.data;
      if (contacts) {
        for (let i = 0; i < $telephone.length; i++) {
          $telephone[i].setAttribute("href", "tel: " + contacts.telephone);
          $telephone[i].innerHTML = contacts.telephone;
        }

        for (let i = 0; i < $instagram.length; i++) {
          $instagram[i].setAttribute("href", contacts.instagram);
        }

        for (let i = 0; i < $telegram.length; i++) {
          $telegram[i].setAttribute("href", contacts.telegram);
        }

        for (let i = 0; i < $facebook.length; i++) {
          $facebook[i].setAttribute("href", contacts.facebook);
        }
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}
//Вывод контактов - end

//My part end
