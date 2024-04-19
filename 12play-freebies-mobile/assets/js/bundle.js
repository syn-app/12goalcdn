const LANGUAGES = {
  EN: "en",
  ZH: "zh",
};

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: "preferred_language",
  filesLocation: location.hostname === "localhost" ? "/12play-freebies-mobile/assets/i18n" : "https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/i18n",
});

const PREFERED_REGION = 'preferred_region';
const _get_translator_config = translator.config.persistKey || "preferred_language";
const _get_language = localStorage.getItem(_get_translator_config) || LANGUAGES.EN;
const _get_region = localStorage.getItem(PREFERED_REGION) || 'Singapore';

translator.fetch([LANGUAGES.EN, LANGUAGES.ZH]).then(() => {
  // -> Translations are ready...
  translator.translatePageTo(_get_language);
  changeLanguageColor();
  initialize();
  DATE_TIME_LOCALE = _get_language === 'zh' ? 'zh-CN' : 'en-US';
});

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



/**
 * 
 * INITIAL AFTER HAVE translator
 * 
 */

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
    setSiteBarMenu();
    fetchPrevQuiz();
  })

}