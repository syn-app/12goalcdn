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
      if (site.checkInChallengeEnabled) {
        $('.goal-rush-container').show();
      } else {
        $('.goal-rush-container').hide();
      }

      const totalMatches = res.totalRemainingMatches + res.totalMatchPredicted;
      const windowOffset = res.totalMatchPredicted === 0 ? 0 : Math.floor((res.totalMatchPredicted - 1) / 10);
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
            ${matchNo} match
          </div>
        `;
        return str;
      }, '');

      $('.goal-rush-matches').append(`${goalRushItems}
        <div class="goal-rush-claim-btn redAction ${res.canClaimCheckInPrize ? '' : 'disabled'}"
          onclick="claimCheckInPrize()">Claim Now</div>
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

showErrorModal = (err) => {
  $('#errorModal').modal('show');
  $('#errorModal .modal-title').text(err.title ? err.title : err.code ? `Error: ${err.code}` : 'Error');
  $('#errorModal .error-text').text(err.detail);
}

$(document).ready(function () {
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    const target = $(e.target).attr("href");
    if ((target === '#livescore')) {
      const iframe = $('#livescore').find('iframe');
      if (iframe.data('src')) {
        iframe.prop('src', iframe.data('src')).data('src', false);
      }
    }
  });

  $('#multiplierBetConfirmModal .confirmBtn').click(function () {
    let multiplier = $('#multiplierBetConfirmModal').data('multiplier');
    let gamePlayId = $('#multiplierBetConfirmModal').data('gameplayid');
    setGameMultiplier({ gamePlayId, multiplier });
  })
});