var DATE_TIME_LOCALE = "en-US";
var LANGUAGES = {
  EN: "en",
  ZH: "zh",
};

var USER_KEY = "userData";
var KEY_TS = "timestamp";
var API_URL = IS_DEV ? `${location.protocol}//${location.hostname}:5500` : `${location.origin}`;

var SITE_COUNTRY = location.pathname.includes('/my') ? 'MY' : 'SG';
const urlParams = new URLSearchParams(window.location.search);
country = urlParams.get('country');
if (country) {
  SITE_COUNTRY = country.toUpperCase();
}
var SITE_DOMAIN = "";
var currencyEn = {
  MYR: 'MYR',
  SGD: 'SGD',
  USD: 'USD'
}
var currencyCn = {
  MYR: '马币',
  SGD: '新币',
  USD: '美金'
}

var translator = new Translator({
  defaultLanguage: "en",
  detectLanguage: true,
  selector: "[data-i18n]",
  debug: false,
  registerGlobally: "__",
  persist: true,
  persistKey: "preferred_language",
  filesLocation: IS_DEV ? "/12play-freebies-mobile/assets/i18n" : "https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.1/12play-freebies-mobile/assets/i18n",
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
      const windowOffset = res.checkInRewardClaimed === 0 ? 0 : Math.floor(res.checkInRewardClaimed / 2);
      const remainingMatches = totalMatches - windowOffset * 10;
      const goalRushItems = Array(remainingMatches > 10 ? 10 : remainingMatches).fill(0).reduce((prev, curr, index) => {
        let str = `${prev}`;
        const matchNo = windowOffset * 10 + index + 1;
        let claimStatus = '';
        if ((index + 1) % res.checkInPerMatches === 0) {
          if (res.checkInRewardClaimed * res.checkInPerMatches >= matchNo) {
            claimStatus = 'checked';
          } else {
            claimStatus = 'reward';
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

getPreviousQuizHtml = (prevQuiz) => {
  let status = prevQuiz.quizClaimStatus;
  let text;
  if (status == "unclaimed") {
    text = `${translator.translateForKey("home_page.Claim_Now")}`;
  } else if (status == "claimed") {
    text = `${translator.translateForKey("home_page.Claimed")}`;
  } else {
    text = "";
  }
  return `
    <div class="list-item aos-init aos-animate" data-aos="fade-up">
      <div class="prevList">
        <div class="d-flex align-items-center">
          <div class="wonAmt ${prevQuiz.quizPrize === 0 ? 'amt0' : ''}">
            ${translator.translateForKey("home_page.Won")} ${prevQuiz.country === 'MY' ? 'MYR' : 'SGD'} ${prevQuiz.quizPrize}
            <div class="selected-multiplier">${translator.translateForKey("home_page.multiplierLabel")}: ${prevQuiz.multiplier ? ('x' + prevQuiz.multiplier) : '-'}</div>
          </div>
          <div class="prizeTime">` + prevQuiz.quizTime + `</div>
        </div>
        <div class="quizTitle">` + prevQuiz.quizTitle + `</div>
      </div>
      <div>
        <div class="quizResultRow">
          <div class="quizResult d-flex">
            <div class="` + prevQuiz.ansOneStatus + `"></div>
            <div>
              <div class="prevQ">` + prevQuiz.quesOne + `</div>
              <div class="prevA">` + prevQuiz.ansOneContent + `</div>
            </div>
          </div>
          <div class="quizResult d-flex">
            <div class="` + prevQuiz.ansTwoStatus + `"></div>
            <div>
              <div class="prevQ">` + prevQuiz.quesTwo + `</div>
              <div class="prevA">` + prevQuiz.ansTwoContent + `</div>
            </div>
          </div>

          <div class="quizResult d-flex">
            <div class="` + prevQuiz.ansThreeStatus + `"></div>
            <div>
              <div class="prevQ">` + prevQuiz.quesThree + `</div>
              <div class="prevA">` + prevQuiz.ansThreeContent + `</div>
            </div>
          </div>
          <div class="quizResult d-flex">
            <div class="` + prevQuiz.ansFourStatus + `"></div>
            <div>
              <div class="prevQ"> ` + prevQuiz.quesFour + `</div>
              <div class="prevA">` + prevQuiz.ansFourContent + `</div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-around align-items-center resultContainer">
          <div class='showAns'> ${translator.translateForKey("home_page.Show_Answer")} <i class="fa fa-chevron-down"></i></div>
          <div class="hideAns" style="display: none">${translator.translateForKey("home_page.Hide_Answer")} <i class="fa fa-chevron-up"></i></div>
          <button class="btn btn-danger ${status} ${prevQuiz.quizPrize === 0 ? 'status9' : ''}" ${text === translator.translateForKey("home_page.Claimed") ? "disabled" : ""} data-bs-toggle="modal" data-bs-target="#claimConfirmModal"
            style="${prevQuiz.quizPrize === 0 ? 'display: none' : ''}" data-gameplayid=${prevQuiz.freebiesGamePlayId}>` + text + `</button>
        </div>
      </div>
    </div>`;
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
            <div class="prize">${translator.translateForKey('home_page.USD')} ` + leaderboard_ranking[i].prize + `</div>
          </div>`;

        $(".leaderboardList").append(ranking_leaderboard);
      }
    });
};

loadHowToPlay = (gameReport) => {
  const site = gameReport.site;
  const currencyUnit = currencyEn[site.siteCurrency] ?? site.siteCurrency;
  const currencyUnitCN = currencyCn[site.siteCurrency] ?? site.siteCurrency;

  const howToPlayEn = `
    <strong>How To Play</strong>
    <ol>
      <li>Welcome to the Exciting 12Goal Event from 12PLAY!</li>
      <li>Predict every ${gameReport.checkInPerMatches} matches to unlock bonus rewards for free.</li>
      <li>Submit your answers based on your match result predictions.</li>
      <li>Earn 1 point for each correct answer; incorrect answers do not result in point deductions.</li>
      <li>Enjoy extra features that enhance your experience when you predict matches. You can choose to boost your bonus and points by using multipliers, but extra tickets will be deducted when you opt to use these features.</li>
      <li>Accumulate points to climb the Leaderboard and secure your spot among the Top 50 players for a chance to win the Final Grand Prize!</li>
    </ol>
    <strong>Prizes</strong>
    <ol>
      <li>If you answer correctly to all 4 questions you will get a ${currencyUnit} ${site.fourCorrectsPrize}.</li>
      <li>If you answer correctly to 3 questions you will get a ${currencyUnit} ${site.threeCorrectsPrize}.</li>
      <li>Final Grand Prize may refer to our Leaderboard.</li>
    </ol>`;
  const howToPlayZh = `
    <strong>竞猜玩法</strong>
    <ol>
      <li>欢迎参加来自12PLAY的12Goal 有奖竞猜活动！</li>
      <li>预测每${gameReport.checkInPerMatches}场比赛，即可解锁额外免费的奖励。</li>
      <li>根据您对比赛结果的预测提交答案。</li>
      <li>每个正确答案获得1分, 错误答案不会扣除分数。</li>
      <li>在预测比赛时，您可以体验翻倍投注的额外功能。您可以选择使用倍增器来提升奖金和分数，但使用此功能会额外扣除票卷。</li>
      <li>累积积分，登上排行榜，争取进入前50名，赢得最终大奖！</li>
    </ol>
    <strong>竞猜奖金</strong>
    <ol>
      <li>答对一场球赛的四道题目将可获得现金奖${currencyUnitCN} ${site.fourCorrectsPrize}。</li>
      <li>答对一场球赛的三道题目将可获得现金奖${currencyUnitCN} ${site.threeCorrectsPrize}。 </li>
      <li>12Goal有奖竞猜终极大奖可前往积分榜页面查阅。</li>
    </ol>`;
  if (localStorage.getItem('preferred_language') === 'en') {
    $('#howToPlay').append(howToPlayEn);
  } else {
    $('#howToPlay').append(howToPlayZh);
  }
}

getTC = (site) => {
  const currencyRate = site.exchange;
  const maxTicket = site.maxTicket;
  const startTimeFormat = new Intl.DateTimeFormat(DATE_TIME_LOCALE, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(new Date(site.startTime).setHours(0, 0, 0)));
  const endTime = new Date(site.endTime);
  const endTimeFormat = new Intl.DateTimeFormat(DATE_TIME_LOCALE, {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(endTime.setHours(23, 59, 0)));
  const payoffDate = new Date(endTime.setDate(endTime.getDate() + 1));
  const payoffDateFormat = new Intl.DateTimeFormat(DATE_TIME_LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
  }).format(new Date(payoffDate.setHours(18, 0, 0))).replace("at", "");
  const currencyUnit = currencyEn[site.siteCurrency] ?? site.siteCurrency;
  const currencyUnitCN = currencyCn[site.siteCurrency] ?? site.siteCurrency;
  const prizePoolCurrency = currencyEn[site.currency] ?? site.currency;
  const prizePoolCurrencyCN = currencyCn[site.currency] ?? site.currency;
  const tCEn = `
    <strong>How To Start</strong>
    <ol>
      <li>All members must deposit a minimum of ${currencyUnit} ${site.depositAmountPerTicket} to receive a ticket for participation in our 12Goal event.</li>
      <li>Every ${currencyUnit} ${site.depositAmountPerTicket} deposit earns 1 ticket, with a maximum of ${maxTicket} tickets per member.</li>
      <li>With the tickets obtained, members will be able to participate in the event by answering the questions based on matches.</li>
      <li>1 ticket required to participate in 1 Match</li>
      <li>Additional multiplier features are available to boost your points and bonus. For each x1 multiplier used, an extra ticket is deducted.</li>
      <li>When you use a boost with a x2 multiplier, you will be deducted an additional ticket.</li>
      <li>
        Example you used a x2 multiplier in one of the matches and answered 3 questions correctly.
        <p>Calculation:</p>
        <strong>Prediction Bonus</strong>
        <ul>
          <li>Original Prediction Bonus: ${currencyUnit} ${site.threeCorrectsPrize}</li>
          <li>After x2 Multiplier: ${currencyUnit} ${site.threeCorrectsPrize} x 2 = ${currencyUnit} ${site.threeCorrectsPrize * 2}</li>
        </ul>
        <strong>Leaderboard Points</strong>
        <ul>
          <li>Original Points: 3 points</li>
          <li>After x2 Multiplier: 3 points x 2 = 6 Points</li>
          <li>Therefore, by utilizing the x2 multiplier, you will receive a ${currencyUnit} ${site.threeCorrectsPrize * 2} prediction bonus and earned 6 points on the leaderboard.</li>
        </ul>
      </li>
      <li>Once a multiplier bet is confirmed, it cannot be cancelled or reduced.</li>
      <li>Cut off time to answer the questions is 10 min before the match start.</li>
      <li>If the match gets postponed, abandoned, or not completed then the ticket will be voided.</li>
      <li>All answers in the event are based on the results 90 minutes plus injury time.</li>
      <li>Multi accounting is not allowed. If you enter an event with more than one account then all your entries will be disqualified.</li>
      <li>Entry to the event is limited to one per user, IP address, electronic device, household, residential address, telephone number, email address and any public environments where computers; and IP addresses are shared such as, but not limited to: universities, schools, libraries and workplaces. In conclusion, only one entry is allowed per one individual.</li>
      <li>All 12Play General Terms & Conditions apply.</li>
      <li>12Play reserves the right to amend, change or terminate this event at any time for all players without prior notice.</li>
    </ol>

    <strong>Prize Payout:</strong>
    <ol>
      <li>If you answer correctly to all 4 questions you will get a ${currencyUnit} ${site.fourCorrectsPrize} after the match is settled.</li>
      <li>If you answer correctly to 3 questions you will get a ${currencyUnit} ${site.threeCorrectsPrize} after the match is settled.</li>
      <li>The Top 50 Winners will be selected based on the highest point gained on the leaderboard during the event period.</li>
      <li>In the event of two or more members having the same point tally, the winner will be selected based on the earliest question submission time and date.</li>
      <li>The total number of points will be tallied from ${startTimeFormat} - ${endTimeFormat}. </li>
      <li>Winners will have their prizes credited automatically by the system.</li>
      <li>The pay-off date for the leaderboard is on the ${payoffDateFormat}.</li>
      <li>All prizes come with a 1x turnover requirement. </li>
      <li>All prizes will be paid in ${currencyUnit} currency. ${prizePoolCurrency} will be converted into ${currencyUnit} based on the exchange rate of ${currencyRate}.</li>
    </ol>`
  const tcZh = `
    <strong>竞猜详情</strong>
    <ol>
      <li>所有会员必须存入至少${currencyUnitCN} ${site.depositAmountPerTicket}, 才能获得一场12Goal有奖竞猜活动的票卷。</li>
      <li>每存入${currencyUnitCN} ${site.depositAmountPerTicket} 可获得1张票卷，每位会员最多可获得30张票卷。</li>
      <li>获取票卷后，玩家便能用其票卷来回答每一场球赛所提问的四道问题.</li>
      <li>每一场球赛只需一张票卷来参与竞猜。</li>
      <li>你也可以使用额外的倍增功能来增加您的奖金和分数。每使用一次x1倍增器, 将额外扣除一张票卷。</li>
      <li>当您使用x2倍数时，您将额外扣除一张票卷。</li>
      <li>
        例如: 当您在一场比赛中使用了x2倍增并正确回答了 3 个问题。
        <p>计算：</p>
        <strong>预测奖金</strong>
        <ul>
          <li>原始预测奖金：${currencyUnitCN} ${site.threeCorrectsPrize}</li>
          <li>经过x2倍增：${currencyUnitCN} ${site.threeCorrectsPrize} x 2 = ${currencyUnitCN} ${site.threeCorrectsPrize * 2}</li>
        </ul>
        <strong>排行榜积分</strong>
        <ul>
          <li>原始积分：3分</li>
          <li>经过x2倍增 : 3分 x 2 = 6分</li>
          <li>因此，通过利用x2倍增，您将获得${currencyUnitCN} ${site.threeCorrectsPrize * 2}的预测奖金，并在排行榜上获得6分。</li>
        </ul>
      </li>
      <li>一旦确认了倍数投注，就无法取消或减少。</li>
      <li>每场球赛的竞猜必须在该球赛开赛前的十分钟进行。</li>
      <li>如该球赛延迟，中途取消或者开赛前取消，该票卷将会作废。</li>
      <li>所有赛果将依据90分钟正赛及伤及补时阶段为准。</li>
      <li>每位玩家只限以一个账户参与竞猜，如发现玩家使用超过一个账户参与此活动，所有相关账户的票卷将会作废。</li>
      <li>以上限制包括每个家庭地址、IP地址、电子邮件地址、电话号码、信用卡或借记卡和/或电子支付帐户或共享电脑（例如学校、公共图书馆或工作场所）只允许一个账户参与活动。</li>
      <li>须符合12PLAY的条款与条件。</li>
      <li>12PLAY将保留随时取消此竞猜活动的权利，适用于所有玩家或个人玩家。</li>
    </ol>
    <strong>奖金支付</strong>
    <ol>
      <li>答对一场球赛的四道题目将在球赛结束后获得现金奖${currencyUnitCN} ${site.fourCorrectsPrize}. </li>
      <li>答对一场球赛的三道题目将在球赛结束后获得现金奖${currencyUnitCN} ${site.threeCorrectsPrize}.</li>
      <li>12Goal有奖竞猜终极大奖将由积分榜首五十位玩家赢取！</li>
      <li>如两位或以上的玩家最终累积分相同，越早提交第一张票卷的玩家最终积分榜排名将会越高.</li>
      <li>所有分数将计算于${startTimeFormat}至${endTimeFormat}</li>
      <li>所有活动奖金将由系统自动存入玩家账户。</li>
      <li>12Goal有奖竞猜终极大奖的奖金将于${payoffDateFormat}发放。</li>
      <li>所有奖金只需一倍投注量即可提款。</li>
      <li>所有奖金将以${currencyUnitCN}结算。${prizePoolCurrencyCN}将根据汇率${currencyRate}转换成${currencyUnitCN}。</li>
    </ol>`;
  if (localStorage.getItem('preferred_language') === 'en') {
    return tCEn;
  } else {
    return tcZh;
  }
}

function registerMultiplierClickEvent() {
  $('.multiplier .selections:not(.disabled) .selectable').click(function () {
    if (!$(this).data('gameplayid')) {
      showErrorModal({
        title: translator.translateForKey("home_page.reminder"),
        detail: translator.translateForKey("home_page.multiplierPredictFirst")
      });
    } else {
      let multiplier = $(this).data('multiplier');
      let currentMultiplier = $(this).data('currentmultiplier');
      let gamePlayId = $(this).data('gameplayid');
      $('#multiplierBetConfirmModal').data('gameplayid', gamePlayId);
      $('#multiplierBetConfirmModal').data('multiplier', multiplier);
      $('#multiplierBetConfirmModal').data('currentmultiplier', currentMultiplier);
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
  const errorLabel = translator.translateForKey("home_page.Error");
  $('#errorModal .modal-title').text(err.title ? err.title : err.code ? `${errorLabel}: ${err.code}` : errorLabel);
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
    let multiplier = +$('#multiplierBetConfirmModal').data('multiplier');
    const currentMultiplier = +$('#multiplierBetConfirmModal').data('currentmultiplier');
    const balance = +$(".ticket-balance").text();
    const ticketsRequired = multiplier - (currentMultiplier || 1);
    if (balance <= 0) {
      $("#insufficientTicket").modal("show");
    } else if (ticketsRequired > balance) {
      showErrorModal({
        title: translator.translateForKey("home_page.Error"),
        detail: `${translator.translateForKey("home_page.requiredTicketError")}${ticketsRequired}`
      });
    } else {
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