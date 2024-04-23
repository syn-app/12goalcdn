var DATE_TIME_LOCALE = "en-US";
var LANGUAGES = {
  EN: "en",
  ZH: "zh",
};

var USER_KEY = "userData";
var KEY_TS = "timestamp";
var API_URL = IS_DEV ? `${location.protocol}//${location.hostname}:5500` : `${location.origin}`;

var SITE_COUNTRY = "MY";
var SITE_DOMAIN = "";

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: "preferred_language",
  filesLocation: IS_DEV ? "/12play-freebies-mobile/assets/i18n" : "https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/i18n",
});

var PREFERED_REGION = 'preferred_region';
const _get_translator_config = translator.config.persistKey || "preferred_language";
var _get_language = localStorage.getItem(_get_translator_config) || LANGUAGES.EN;
var _get_region = localStorage.getItem(PREFERED_REGION) || 'Singapore';

fetchUserGameReport = () => {
  return fetch(`${API_URL}/12goalapi/user/game-report?siteName=${SITE_COUNTRY === "MY" ? '12M' : '12S'}&t=${new Date().getTime()}`, getRequestHeaders())
    .then((response) => response.json())
    .then(res => {
      $(".ranking").append(`${res.rankNo}`);
      $('.total-point').text(res.totalPoints);
      $('.ticket-balance').text(res.balanceTickets);
      $('.predicted-match').text(res.totalMatchPredicted);

      const site = res.site;
      if (site.currency && site.prizePool) {
        const maxPrize = `${site.currency} ${new Intl.NumberFormat("en-US").format(site.prizePool)}`;
        $("#maxPrize").html("").append(maxPrize);
      }
      if (site.fourCorrectsPrize) {
        $('.4correct').text(site.fourCorrectsPrize);
      }
      if (site.threeCorrectsPrize) {
        $('.3correct').text(site.threeCorrectsPrize);
      }
      $('#tcContent').append(getTC(site));

      // Goal rush
      if (site.checkInChallengeEnabled && res.checkInPerMatches > 0) {
        $('.goal-rush-container').show();
      } else {
        $('.goal-rush-container').hide();
      }

      const totalMatches = res.totalRemainingMatches + res.totalMatchPredicted;
      // const windowOffset = res.totalMatchPredicted === 0 ? 0 : Math.floor((res.totalMatchPredicted - 1) / 10);
      const windowOffset = res.checkInRewardClaimed === 0 ? 0 : Math.floor((res.checkInRewardClaimed - 1) / 2);
      const remainingMatches = totalMatches - windowOffset * 10;
      const goalRushItems = Array(remainingMatches > 10 ? 10 : remainingMatches).fill(0).reduce((prev, curr, index) => {
        let str = `${prev}`;
        const matchNo = windowOffset * 10 + index + 1;
        let claimStatus = '';
        if ((index + 1) % res.checkInPerMatches === 0) {
          if (res.canClaimCheckInPrize || res.totalMatchPredicted < matchNo) {
            claimStatus = 'reward';
          } else {
            claimStatus = 'checked';
          }
        } else if (res.totalMatchPredicted >= matchNo) {
          claimStatus = 'checked';
        }
        str += `
          <div class="goal-rush-item ${res.totalMatchPredicted + 1 === matchNo ? 'active' : ''}">
            <div class="goal-rush-claim-status ${claimStatus}"></div>
            ${index + 1} ${translator.translateForKey("home_page.goalRushMatch")}
          </div>
        `;
        return str;
      }, '');

      $('.goal-rush-matches').append(`${goalRushItems}
        <div class="goal-rush-claim-btn btn-danger redAction  ${res.canClaimCheckInPrize ? '' : 'disabled'}"
          onclick="claimCheckInPrize()">${translator.translateForKey("home_page.goalRushClaimNow")}</div>
      `);

      return res;
    })
}

claimedPrize = (freebiesGamePlayId) => {
  const data = {
    freebiesGamePlayId: +freebiesGamePlayId
  };
  fetch(`${API_URL}/12goalapi/claimed-prize/claim-game-prize`, {
    body: JSON.stringify(data),
    method: "POST",
    ...getRequestHeaders()
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.code && res.detail) {
        showErrorModal(res);
      } else {
        location.reload();
      }
    })
    .catch((err) => console.error(err));
}

var goalRushPrizeModalShownCount = 0;
$('#goalRushPrizeModal').on('hidden.bs.modal', function (e) {
  if (goalRushPrizeModalShownCount > 0) {
    setTimeout(() => $('#goalRushPrizeModal').modal('show'), 300);
  } else {
    location.reload();
  }
  goalRushPrizeModalShownCount--;
});

claimCheckInPrize = () => {
  $('.goal-rush-claim-btn').addClass('disabled');
  fetch(`${API_URL}/12goalapi/claimed-prize/claim-check-in-prize`, {
    body: JSON.stringify({}),
    method: "POST",
    ...getRequestHeaders()
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.code && res.detail) {
        $('.goal-rush-claim-btn').removeClass('disabled');
        showErrorModal(res);
      } else {
        $('.goal-rush-claim-btn').addClass('disabled');
        $('#goalRushPrizeModal').modal('show');
        goalRushPrizeModalShownCount = +res - 1;
      }
    })
    .catch((err) => console.error(err));
}

setGameMultiplier = (req) => {
  fetch(`${API_URL}/12goalapi/freebies-game-play/set-game-multiplier`, {
    body: JSON.stringify(req),
    method: "POST",
    ...getRequestHeaders()
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.code && res.detail) {
        showErrorModal(res);
      } else {
        location.reload();
      }
    })
}

fetchLeaderBoardRanking = () => {
  fetch(
    `${API_URL}/12goalapi/user/top-50-ranking-report?country=${SITE_COUNTRY}&t=${new Date().getTime()}`, getRequestHeaders()
  )
    .then((response) => response.json())
    .then((res) => {
      let leaderboard_ranking = res.map((item) => ({
        name: item.accountCode,
        points: item.totalPoints,
        prize: item.prize,
      }));
      let ranking_leaderboard;
      for (var i = 0; i < leaderboard_ranking.length; i++) {
        let name = leaderboard_ranking[i].name;
        ranking_leaderboard = `
          <div class="d-flex rank-item">
            <div class="rank">` + [i + 1] + `</div>
            <div>
              <div class="name">${name}</div>
              <div class="points">${translator.translateForKey('home_page.Total_Points')}: ${leaderboard_ranking[i].points}</div>
            </div>
            <div class="prize">USD ` + leaderboard_ranking[i].prize + `</div>
          </div>`;

        $(".leaderboardList").append(ranking_leaderboard);
      }
    });
};

function registerMultiplierClickEvent() {
  $('.multiplier .selections:not(.disabled) .selectable').click(function () {
    if (!$(this).data('gameplayid')) {
      showErrorModal({
        title: translator.translateForKey("home_page.reminder"),
        detail: translator.translateForKey("home_page.multiplierPredictFirst")
      });
    } else {
      let multiplier = $(this).data('multiplier');
      let gamePlayId = $(this).data('gameplayid');
      $('#multiplierBetConfirmModal').data('gameplayid', gamePlayId);
      $('#multiplierBetConfirmModal').data('multiplier', multiplier);
      $('#multiplierBetConfirmModal').modal('show');
      $('#multiplierBetConfirmModal .multiplier-val').text(multiplier);
    }
  });
}

function registerPrevQuizToggleEvent() {
  $(".showAns").click(function () {
    $(this).hide();
    $(this).siblings(".hideAns").show();
    $(this).parent(".resultContainer").siblings(".quizResultRow").slideDown();
  });

  $(".hideAns").click(function () {
    $(this).hide();
    $(this).siblings(".showAns").show();
    $(this).parent(".resultContainer").siblings(".quizResultRow").slideUp();
  });
}

showErrorModal = (err) => {
  $('#errorModal').modal('show');
  $('#errorModal .modal-title').text(err.title ? err.title : err.code ? `Error: ${err.code}` : 'Error');
  $('#errorModal .error-text').text(err.detail);
}

$(document).ready(function () {
  $('a[data-toggle="tab"], button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
    const target = $(e.target).attr("href") || $(e.target).attr("data-bs-target");
    if ((target === '#livescore')) {
      const iframe = $('#livescore').find('iframe');
      if (iframe.data('src')) {
        iframe.prop('src', iframe.data('src')).data('src', false);
      }
    }
  });

  $('#multiplierBetConfirmModal .confirmBtn').click(function () {
    if ($(".ticket-balance").text() == 0) {
      $("#insufficientTicket").modal("show");
    } else {
      let multiplier = $('#multiplierBetConfirmModal').data('multiplier');
      let gamePlayId = $('#multiplierBetConfirmModal').data('gameplayid');
      setGameMultiplier({ gamePlayId, multiplier });
    }
  })

  const lang = localStorage.getItem('preferred_language') === 'en' ? 'english' : 'simplified';
  $("#depositNow").click(function () {
    window.location.href = `${SITE_DOMAIN}/${SITE_COUNTRY.toLowerCase()}/mydeposit.html?lang=${lang}`
  });
  $("#loginRegister").click(function () {
    window.location.href = `${SITE_DOMAIN}/${SITE_COUNTRY.toLowerCase()}/?lang=${lang}`
  });
});