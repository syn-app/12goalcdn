$(document).ready(function () {
  setTimeout(() => {
    translator.fetch([LANGUAGES.EN, LANGUAGES.ZH, LANGUAGES.TH, LANGUAGES.VN]).then(() => {
      // -> Translations are ready...
      translator.translatePageTo(_get_language);
      changeLanguageColor();
      initialize();
      DATE_TIME_LOCALE = _get_language === 'cn' ? 'zh-CN' : _get_language === 'th' ? 'th-TH' : _get_language === 'vn' ? 'vi-VN' : 'en-US';
    });
  });
})

/**
 * MENU SLIDE
 *
 */

const selectLanguageModalElm = $("#selectLanguage");
if (selectLanguageModalElm.length > 0) {
  var selectLanguageModal = new bootstrap.Modal(selectLanguageModalElm, {});
}
$(".choose-language").on("click", function (e) {
  const select_language = $(this).data("language");
  const select_region = $(this).data("region");
  const accept_languages = ['Malaysia', 'Singapore']

  if (!accept_languages.includes(select_region)) {
    window.location.href = '/access-denied.html';
    return false;
  }


  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    selectLanguageModal.hide();
    $("#mySidenav").removeClass("active");
    localStorage.setItem(PREFERED_REGION, select_region)
    changeLanguageColor()
    window.location.reload();
  } else {
    console.log("No language setup");
  }
});

$(".universal__content__language").on("click", function (e) {
  const select_language = $(this).data("language");
  if (LANGUAGES[select_language]) {
    translator.translatePageTo(LANGUAGES[select_language]);
    window.location.href = "/";
  } else {
    console.log("No language setup");
  }
});

$('.universal .play-now a').on("click", function (e) {
  e.preventDefault();
  const slick_current_select = $('#selectLanguage .slick-list .slick-track .slick-current .title');
  if (slick_current_select.length > 0) {
    const slick_current_select_title = slick_current_select.data('i18n')
    const accept_languages = ['universal_page.Malaysia', 'universal_page.Singapore']
    if (accept_languages.includes(slick_current_select_title)) {
      window.location.href = '/login.html'
    } else {
      window.location.href = '/access-denied.html'
    }
  }
})


$('#mySidenav #collapseCountry .collapse__item').on('click', function () {
  const select_region = $(this).data("region");
  localStorage.setItem(PREFERED_REGION, select_region);
  changeLanguageColor();
  const collapseCountryElm = $("#collapseCountry");
  if (collapseCountryElm.length > 0) {
    const collapseCountry = new bootstrap.Collapse(collapseCountryElm, {});
    collapseCountry.hide()
  }
})

function changeLanguageColor() {
  const _get_region = localStorage.getItem(PREFERED_REGION) || 'Singapore';
  $('.choose-language').each(function () {
    const get_attr_lang = $(this).data('language').toLowerCase();
    const get_attr_region = $(this).data('region');
    if (_get_language == get_attr_lang && _get_region == get_attr_region) {
      $(this).addClass('text-primary');
    }
  })

  const current_country = translator.translateForKey('menu.Uwin33_' + _get_region, _get_language);
  $('#mySidenav .current-country').text(current_country);

  $('#mySidenav #collapseCountry .collapse__item').each(function () {
    const get_attr_region = $(this).data('region');
    if (_get_region == get_attr_region) {
      $(this).addClass('active');
    } else {
      $(this).removeClass('active');
    }
  })
}

/**
 * MENU SLIDE
 *
 */



// $(document).ready(function () {
//   $(".top-slider").slick({
//     dots: true,
//     infinite: true,
//     arrows: false,
//     speed: 500,
//     lazyLoad: 'ondemand',
//     fade: true,
//     // cssEase: "linear",
//   });
// });

setSiteBarMenu = () => {
  const domain = `${SITE_DOMAIN}/${SITE_COUNTRY.toLowerCase()}/`;
  const textClass = localStorage["preferred_language"] === "en" ? "" : "lang-cn-bold";
  const lotteryMenu = SITE_COUNTRY === 'TH' ? '' :
    `<a href='${domain}fortune-spin.html'" class="">
    <div class="sidebarFunctionIcon">
      <img
        src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/12_slot_menu_icon.png"
        alt="Malaysia Casino Online Slot Menu Icon"
        style="width: 58%"
      />
    </div>
    <div class="sidebarFunctionText">
      <span class="lang-bold ${textClass}" key="12slot">12Lottery</span>
      <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/new.png" alt="" class="menu-flag" style="height: 15px;">
    </div>
  </a>`;
  const downloadAppMenu = SITE_COUNTRY === 'TH' ? '' :
    `<a href='${domain}download-app.html'">
    <div class="sidebarFunctionIcon">
      <img
        src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/download_menu_icon.png"
        alt="Malaysia Casino Online Slot Menu Icon"
        style="width: 65%"
      />
    </div>
    <div class="sidebarFunctionText">
      <span class="lang-bold ${textClass}" key="sidebar-download"
        >${translator.translateForKey("menu.downloadApp")}</span
      >
    </div>
  </a>`;
  const menu = `
    ${lotteryMenu}
    <a href='${domain}goal12.html'" class="">
      <div class="sidebarFunctionIcon">
        <img
          src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/12_goal_menu_icon.png"
          alt="Malaysia Casino Online Slot Menu Icon"
          style="width: 58%"
        />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="12slot">12Goal</span>
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/new.png" alt="" class="menu-flag" style="height: 15px;">
      </div>
    </a>
    <a href='${domain}index.html'">
      <div class="sidebarFunctionIcon">
        <img
          class="ls-is-cached lazyloaded"
          data-src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/home_menu_icon.png"
          src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/home_menu_icon.png"
        />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-home">${translator.translateForKey("menu.home")}</span>
      </div>
    </a>
    <a
      class="sidebar-Login"
      href='${domain}myprofile.html'"
      style="display: none"
    >
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/login_join_menu_icon.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-account">${translator.translateForKey("menu.account")}</span>
      </div>
    </a>
    <a
      class="sidebar-Login"
      href='${domain}mydeposit.html'"
      style="display: none"
    >
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/wallet_menu_button.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-wallet">${translator.translateForKey("menu.wallet")}</span>
      </div>
    </a>
    <a
      class="sidebar-Login"
      href='${domain}myinbox.html'"
      style="display: none"
    >
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/inbox_menu_button.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-inbox">${translator.translateForKey("menu.inbox")}</span>
      </div>
    </a>

    <a href='${domain}promotion.html'">
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/promo.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-promo">${translator.translateForKey("menu.promotion")}</span>
      </div>
    </a>
    <a href='${domain}vip.html'">
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/vip_menu_icon.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="vip">${translator.translateForKey("menu.VIP")}</span>
      </div>
    </a>
    <a onclick="window.location = 'https://12playlive.com/${SITE_COUNTRY.toLowerCase()}/'">
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/live-icon.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="e-sport-live"
          >${translator.translateForKey("menu.liveTv")}</span
        >
      </div>
    </a>
    ${downloadAppMenu}
    <div class="regionChg">
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/language_menu_icon.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-regionlang"
          >${translator.translateForKey("menu.language")}</span
        >
      </div>
    </div>
    <a href='${domain}contact-us.html'">
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/live_chat_menu_icon.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-contactus"
          >${translator.translateForKey("menu.contactUs")}</span
        >
      </div>
    </a>
    <a href='${domain}blog.html'">
      <div class="sidebarFunctionIcon">
        <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/assets/images/menu-icon/info_menu_icon.png" />
      </div>
      <div class="sidebarFunctionText">
        <span class="lang-bold ${textClass}" key="sidebar-blog">${translator.translateForKey("menu.info")}</span>
      </div>
    </a>
    `;
  $("#sidebardiv").append(menu);
  $("#regionOverlay").load(IS_DEV ?
    '/12play-freebies-mobile/region-language.html' :
    `https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.8/12play-freebies-mobile/region-language.html`);
  $(".regionChg").click(function () {
    $("#regionChangeModal").show();
  });
};

function initialize() {

  const predictConfirmModalElm = $("#predictConfirmModal");
  if (predictConfirmModalElm.length > 0) {
    var predictConfirmModal = new bootstrap.Modal(predictConfirmModalElm, {});
  }

  const outOfTicketsModalElm = $("#outOfTicketsModal");
  if (outOfTicketsModalElm.length > 0) {
    var outOfTicketsModal = new bootstrap.Modal(outOfTicketsModalElm, {});
  }

  if (typeof $("#predictForm").validate === 'function') {
    $("#predictForm").validate({
      rules: {
        // answer1: "required",
        // answer2: "required",
        // answer3: "required",
        // answer4: "required",
      },
      messages: {
        //   amount_SGD: {
        //     required: translator.translateForKey('deposit_page.Amount_SGD_required', _get_language),
        //     min: translator.translateForKey('deposit_page.Amount_SGD_required_min', _get_language)
        //   },
        //   select_bank: translator.translateForKey('deposit_page.Please_select_one', _get_language),
      },
      submitHandler: function (form) {
        console.log('==-=-', form)
        predictConfirmModal.show()
        // window.location.href = '/thank-you.html'

        // depositSuccessModal.show()
      }
    });
  }

  $('#predictForm input').on('change', function () {
    const predictForm = $("#predictForm").serializeArray();
    if (predictForm.length === 4) {
      $('#predictForm .btn-submit').prop('disabled', false);
    } else {
      $('#predictForm .btn-submit').prop('disabled', 'disabled');
    }
  });


  $('#goal-home-ticket-balance-tab').on('click', function (e) {
    e.preventDefault();
    e.stopPropagation();
    outOfTicketsModal.show();
  })

  setTimeout(() => {
    const currency = SITE_COUNTRY === 'MY' ? 'MYR' :
      SITE_COUNTRY === 'SG' ? 'SGD' :
        SITE_COUNTRY === 'VN' ? translator.translateForKey("home_page.VND") :
          translator.translateForKey("home_page.THB");
    if ((SITE_COUNTRY === 'TH' && localStorage["preferred_language"] === 'th') ||
      (SITE_COUNTRY === 'VN' && localStorage["preferred_language"] === 'vn')) {
      $('.currencyTextAfter').text(currency);
    } else {
      $('.currencyText').text(currency);
    }

    setSiteBarMenu();
    if (localStorage.getItem(USER_KEY)) {
      fetchPrevQuiz();
    }
  })
}