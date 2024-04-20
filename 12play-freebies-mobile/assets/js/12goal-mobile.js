const USER_KEY = "userData";
const KEY_TS = "timestamp";
const API_URL = location.hostname === "localhost" ? "https://localhost:7293" : `${location.origin}`;

var SITE_COUNTRY = "MY";
var SITE_DOMAIN = "";
var listQuestion = [];

loadHowToPlay = (site) => {
  const currencyUnit = SITE_COUNTRY === "MY" ? 'MYR' : 'SGD';
  const currencyUnitCN = SITE_COUNTRY === "MY" ? '马币' : '新币';

  const howToPlayEn = `<strong>How To Play</strong><ol> <li>12Play is proud to present to you its most exciting new feature in recent times - it’s all-new 12Goal event!</li> <li>Playing a 12Goal event by answering 4 questions based on one match, with 3 or more possible answers and you will win a cash prize! </li> <li>All you need to do is submit your answers for all 4 questions according to the result you think will happen for a match. </li> <li>1 correct answer will get 1 points. </li> <li>Wrong answer will not deduct points. </li><li>Accumulate your points and compete on our Leaderboard for the Top 50 to win the Final Grand Prize! </li></ol><strong>Prizes</strong><ol><li>If you answer correctly to all 4 questions you will get a ${currencyUnit} ${site.fourCorrectsPrize}.</li><li>If you answer correctly to 3 questions you will get a ${currencyUnit} ${site.threeCorrectsPrize}.</li><li>Final Grand Prize may refer to our Leaderboard.</li></ol>`;
  const howToPlayZh = `<strong>竞猜玩法：</strong><ol><li>12PLAY 最新游戏功能已上线：12Goal 有奖竞猜！ </li><li>12Goal有奖竞猜会依据每场指定球赛准备四道题目（每道题目至少会有三个选项），参与竞猜即有机会获取现金奖！</li><li>您只需要提交您对这四道题目的猜测结果，每答对一题并可获取一分。答错并不会扣取您的累积分。</li><li>积分榜累积分最高的五十位参赛者就能赢得12Goal有奖竞猜的终极大奖！ </li></ol><strong>竞猜奖金：</strong><ol><li>答对一场球赛的四道题目将可获得现金奖${currencyUnitCN} ${site.fourCorrectsPrize}. </li><li>答对一场球赛的三道题目将可获得现金奖${currencyUnitCN} ${site.threeCorrectsPrize}。 </li><li>12Goal有奖竞猜终极大奖可前往积分榜页面查阅。 </li></ol>`;


  if (localStorage.getItem('preferred_language') === 'en') {
    $('#howToPlay').append(howToPlayEn);
  } else {
    $('#howToPlay').append(howToPlayZh);
  }
}

getSiteDomain = async () => {
  SITE_COUNTRY = location.pathname.startsWith('/my') ? 'MY' : 'SG';
  SITE_DOMAIN = window.location.origin;

  // let country = location.pathname.startsWith('/my') ? 'MY' : 'SG';
  // const response = await fetch(`${API_URL}/12goalapi/user/http-referral?country=${country}&t=${new Date().getTime()}`, getRequestHeaders());
  // const res = await response.json();
  // if (!res || !res.httpReferral) {
  //   if (country === 'MY') {
  //     let previousURL = 'https://www.12play15.com/my';
  //     SITE_DOMAIN = new URL(previousURL).origin;
  //     SITE_COUNTRY = "MY";
  //   } else {
  //     let previousURL = 'https://www.12play14.com/sg';
  //     SITE_DOMAIN = new URL(previousURL).origin;
  //     SITE_COUNTRY = "SG";
  //   }
  // } else {
  //   let previousURL = res.httpReferral;
  //   SITE_DOMAIN = new URL(previousURL).origin;
  //   if (previousURL.includes("/my")) {
  //     SITE_COUNTRY = "MY";
  //   } else {
  //     SITE_COUNTRY = "SG";
  //   }
  // }

  $('.currencyText').text(SITE_COUNTRY === 'MY' ? 'MYR' : 'SGD');
}

setSiteBarMenu = () => {
  const domain = `${SITE_DOMAIN}/${SITE_COUNTRY.toLowerCase()}/`;
  const textClass = localStorage["preferred_language"] === "en" ? "" : "lang-cn-bold";
  const menu = `
<a href='${domain}fortune-spin.html'" class="">
  <div class="sidebarFunctionIcon">
    <img
      src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/12_slot_menu_icon.png"
      alt="Malaysia Casino Online Slot Menu Icon"
      style="width: 58%"
    />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="12slot">12Lottery</span>
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/new.png" alt="" class="menu-flag" style="height: 15px;">
  </div>
</a>
<a href='${domain}goal12.html'" class="">
  <div class="sidebarFunctionIcon">
    <img
      src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/12_goal_menu_icon.png"
      alt="Malaysia Casino Online Slot Menu Icon"
      style="width: 58%"
    />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="12slot">12Goal</span>
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/new.png" alt="" class="menu-flag" style="height: 15px;">
  </div>
</a>
<a href='${domain}index.html'">
  <div class="sidebarFunctionIcon">
    <img
      class="ls-is-cached lazyloaded"
      data-src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/home_menu_icon.png"
      src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/home_menu_icon.png"
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
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/login_join_menu_icon.png" />
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
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/wallet_menu_button.png" />
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
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/inbox_menu_button.png" />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="sidebar-inbox">${translator.translateForKey("menu.inbox")}</span>
  </div>
</a>

<a href='${domain}promotion.html'">
  <div class="sidebarFunctionIcon">
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/promo.png" />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="sidebar-promo">${translator.translateForKey("menu.promotion")}</span>
  </div>
</a>
<a href='${domain}vip.html'">
  <div class="sidebarFunctionIcon">
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/vip_menu_icon.png" />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="vip">VIP</span>
  </div>
</a>
<a onclick="window.location = 'https://12playlive.com/${SITE_COUNTRY.toLowerCase()}/'">
  <div class="sidebarFunctionIcon">
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/live-icon.png" />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="e-sport-live"
      >${translator.translateForKey("menu.liveTv")}</span
    >
  </div>
</a>
<a href='${domain}download-app.html'">
  <div class="sidebarFunctionIcon">
    <img
      src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/download_menu_icon.png"
      alt="Malaysia Casino Online Slot Menu Icon"
      style="width: 65%"
    />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="sidebar-download"
      >${translator.translateForKey("menu.downloadApp")}</span
    >
  </div>
</a>
<div class="regionChg">
  <div class="sidebarFunctionIcon">
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/language_menu_icon.png" />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="sidebar-regionlang"
      >${translator.translateForKey("menu.language")}</span
    >
  </div>
</div>
<a href='${domain}contact-us.html'">
  <div class="sidebarFunctionIcon">
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/live_chat_menu_icon.png" />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="sidebar-contactus"
      >${translator.translateForKey("menu.contactUs")}</span
    >
  </div>
</a>
<a href='${domain}blog.html'">
  <div class="sidebarFunctionIcon">
    <img src="https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/assets/images/menu-icon/info_menu_icon.png" />
  </div>
  <div class="sidebarFunctionText">
    <span class="lang-bold ${textClass}" key="sidebar-blog">${translator.translateForKey("menu.info")}</span>
  </div>
</a>
`;
  $("#sidebardiv").append(menu);
  $("#regionOverlay").load(`https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18/12play-freebies-mobile/region-language.html`);
  $(".regionChg").click(function () {
    $("#regionChangeModal").show();
  });
};

getRequestHeaders = (additonalHeaders) => {
  return {
    headers: {
      "user-data": localStorage.getItem(USER_KEY) || "",
      timestamp: localStorage.getItem(KEY_TS) || "",
      "content-type": "application/json; charset=UTF-8",
      ...additonalHeaders,
    },
  };
};

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
  const currencyUnit = SITE_COUNTRY === "MY" ? 'MYR' : 'SGD';
  const currencyUnitCN = SITE_COUNTRY === "MY" ? '马币' : '新币';
  const tCEn = `<strong>How To Start</strong> <ol> <li>All members are required to deposit a minimum ${currencyUnit} ${site.depositAmountPerTicket} in order to get a ticket to participate in our 12Goal event. </li> <li>Every ${currencyUnit} ${site.depositAmountPerTicket} gets 1 ticket. Maximum tickets obtained by a member is capped at ${maxTicket}. </li> <li>With the tickets obtained, members will be able to participate in the event by answering the questions based on matches. </li> <li>1 ticket required to participate in 1 Match. </li> <li>Cut off time to answer the questions is 10 min before the match start. </li> <li>If the match gets postponed, abandoned, or not completed then the ticket will be voided. </li> <li>All answers in the event are based on the results 90 minutes plus injury time. </li> <li>Multi accounting is not allowed. If you enter a event with more than one account then all your entries will be disqualified. </li> <li>Entry to the event is limited to one per user, IP address, electronic device, household, residential address, telephone number, email address and any public environments where computers; and IP addresses are shared such as, but not limited to: universities, schools, libraries and workplaces. In conclusion, only one entry is allowed per one individual. </li> <li> All 12Play General Terms &amp; Conditions apply. </li> <li> 12Play reserves the right to amend, change or terminate this event at any time for all players without prior notice. </li> </ol> <strong>Prize Payout:</strong> <ol> <li>If you answer correctly to all 4 questions you will get a ${currencyUnit} ${site.fourCorrectsPrize} after the match is settled. </li> <li>If you answer correctly to 3 questions you will get a ${currencyUnit} ${site.threeCorrectsPrize} after the match is settled.</li> <li>The Top 50 Winners will be selected based on the highest point gained on the leaderboard during the event period. </li> <li>In the event of two or more members having the same point tally, the winner will be selected based on the earliest question submission time and date.</li> <li>The total number of points will be tallied from ${startTimeFormat} - ${endTimeFormat}. </li> <li>Winners will have their prizes credited automatically by the system.</li> <li>The pay-off date for the leaderboard is on the ${payoffDateFormat}.</li> <li>All prizes come with a 1x turnover requirement. </li><li>All prizes will be paid in ${currencyUnit} currency. USD will be converted into ${currencyUnit} based on the exchange rate of ${currencyRate}.</li></ol>`
  const tcZh = `<strong>竞猜详情:</strong><ol><li>每位玩家只需在活动期间最低存款${currencyUnitCN} ${site.depositAmountPerTicket}即可获取一场12Goal有奖竞猜的票卷。</li><li>每存款${currencyUnitCN} ${site.depositAmountPerTicket}将获取一张票卷，每位玩家最高可获取${maxTicket}张票卷。</li><li>获取票卷后，玩家便能用其票卷来回答每一场球赛所提问的四道问题.</li><li>每一场球赛只需一张票卷来参与竞猜。</li><li>每场球赛的竞猜必须在该球赛开赛前的十分钟进行。</li><li>如该球赛延迟，中途取消或者开赛前取消，该票卷将会作废</li><li>所有赛果将依据90分钟正赛及伤及补时阶段为准。</li><li>每位玩家只限以一个账户参与竞猜，如发现玩家使用超过一个账户参与此活动，所有相关账户的票卷将会作废。</li><li>以上限制包括每个家庭地址、IP地址、电子邮件地址、电话号码、信用卡或借记卡和/或电子支付帐户或共享电脑（例如学校、公共图书馆或工作场所）只允许一个账户参与活动</li><li> 须符合12PLAY的条款与条件。</li><li> 12PLAY将保留随时取消此竞猜活动的权利，适用于所有玩家或个人玩家。</li></ol><strong>奖金支付：</strong><ol><li>答对一场球赛的四道题目将在球赛结束后获得现金奖${currencyUnitCN} ${site.fourCorrectsPrize}. </li><li>答对一场球赛的三道题目将在球赛结束后获得现金奖${currencyUnitCN} ${site.threeCorrectsPrize}.</li><li>12Goal有奖竞猜终极大奖将由积分榜首五十位玩家赢取！</li><li>如两位或以上的玩家最终累积分相同，越早提交第一张票卷的玩家最终积分榜排名将会越高.</li><li>所有分数将计算于${startTimeFormat}至${endTimeFormat}</li><li>所有活动奖金将由系统自动存入玩家账户。</li><li>12Goal有奖竞猜终极大奖的奖金将于${payoffDateFormat}发放。</li><li>所有奖金只需一倍投注量即可提款。</li><li>所有奖金将以${currencyUnitCN}结算。美金将根据汇率${currencyRate}转换成${currencyUnitCN}。
  </li></ol>`;
  if (localStorage.getItem('preferred_language') === 'en') {
    return tCEn;
  } else {
    return tcZh;
  }
}

getUserData = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  let userData = params.userData;
  if (userData) {
    localStorage.setItem(USER_KEY, userData);
  } else {
    localStorage.removeItem(USER_KEY);
  }
  const timestamp = params.timestamp;
  if (timestamp) {
    localStorage.setItem(KEY_TS, timestamp);
  }
};

fetchCurrentQuiz = () => {
  fetch(
    `${API_URL}/12goalapi/freebies-game?country=${SITE_COUNTRY}&sortName=MatchDate&ascend=true&t=${new Date().getTime()}`,
    getRequestHeaders(),
  )
    .then((response) => response.json())
    .then((res) => {
      let currentQuiz = [];
      res.items.forEach((item) => {
        let quiz = {
          freebiesGameId: item.id,
          match: `${item.localTeamName} vs ${item.visitorTeamName}`,
          dateTime: item.matchDate,
          status: item.predictTimeValid ? 0 : 9,
          option1: item.localTeamName,
          option2: `${translator.translateForKey("predict_page.answer1_2")}`,
          option3: item.visitorTeamName,
          gamePlayId: item.gamePlayId,
          multipliers: item.multipliers,
          predictTimeValid: item.predictTimeValid,
          gamePlayMultiplier: item.gamePlayMultiplier,
        };
        currentQuiz.push(quiz);
      });
      if (currentQuiz.length === 0) {
        $(".match").append(
          `<div>${translator.translateForKey("home_page.No_Match")}</div>`,
        );
      } else {
        for (let key in currentQuiz) {
          if (currentQuiz.hasOwnProperty(key)) {
            let predictButtonText = "";
            if (currentQuiz[key].status === 9) {
              predictButtonText = currentQuiz[key].gamePlayId
                ? `${translator.translateForKey("home_page.Predicted")}`
                : `${translator.translateForKey("home_page.Predict")}`;
            } else {
              predictButtonText = currentQuiz[key].gamePlayId
                ? `${translator.translateForKey("home_page.Edit")}`
                : `${translator.translateForKey("home_page.Predict")}`;
            }
            let quiz =
              `
            <div class="currentList">
              <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex timeleftRow">
                  <div>${translator.translateForKey("home_page.Time_left")}: &nbsp;</div>
                
                  <div class="clockdiv" data-date="` + currentQuiz[key].dateTime + `">
                    <span class="days"></span>
                    <div class="smalltext">${translator.translateForKey("home_page.Day")}&nbsp;:&nbsp;</div>
              
                    <span class="hours"></span>
                    <div class="smalltext">${translator.translateForKey("home_page.Hour")}&nbsp;:&nbsp; </div>
              
                    <span class="minutes"></span>
                    <div class="smalltext">${translator.translateForKey("home_page.Minutes")}&nbsp;:&nbsp; </div>
            
                    <span class="seconds"></span>
                    <div class="smalltext">${translator.translateForKey("home_page.Seconds")}&nbsp; </div>
                  </div>
                </div>
                <div class="icon-info" data-bs-toggle="modal" data-bs-target="#multiplierInfoModal">
                  <i class="fa fa-info-circle"></i>
                  ${translator.translateForKey("home_page.btnInfoLabel")}
                </div>
              </div>
              <div class="quizTitle">` + currentQuiz[key].match + `</div>
              <div class="d-flex justify-content-between align-items-center">
                <div class="multiplier">
                  <div class="title">${translator.translateForKey("home_page.multiplierLabel")}</div>
                  <div class="d-flex">
                    <div class="icon"></div>
                    <div class="d-flex selections ${!currentQuiz[key].predictTimeValid || currentQuiz[key].gamePlayMultiplier ? 'disabled' : ''}">
                      <div class="${currentQuiz[key].multipliers?.includes(2) ? 'selectable' : ''} ${currentQuiz[key].gamePlayMultiplier === 2 ? 'selected' : ''}"
                        data-gameid="${currentQuiz[key].freebiesGameId}" data-gameplayid="${currentQuiz[key].gamePlayId}" data-multiplier="2">x2</div>
                      <div class="${currentQuiz[key].multipliers?.includes(3) ? 'selectable' : ''} ${currentQuiz[key].gamePlayMultiplier === 3 ? 'selected' : ''}"
                        data-gameid="${currentQuiz[key].freebiesGameId}" data-gameplayid="${currentQuiz[key].gamePlayId}" data-multiplier="3">x3</div>
                      <div class="${currentQuiz[key].multipliers?.includes(5) ? 'selectable' : ''} ${currentQuiz[key].gamePlayMultiplier === 5 ? 'selected' : ''}"
                        data-gameid="${currentQuiz[key].freebiesGameId}" data-gameplayid="${currentQuiz[key].gamePlayId}" data-multiplier="5">x5</div>
                    </div>
                  </div>
                </div>
                <div class="btn btn-danger predictBtn ${currentQuiz[key].status === 9 ? 'disable-btn' : ''}" data-gameid=${currentQuiz[key].freebiesGameId}>${predictButtonText}</div>
              </div>
            </div>`;
            $(".match").append(quiz);
          }
        }
        setupClockCountdown();
        var freebiesGameId = "";
        var answerOfQuestion1 = [];
        registerMultiplierClickEvent();
        $(".predictBtn").click(function () {
          var balance = $(".ticket-balance").text();
          let freebiesGame = currentQuiz.find((x) => x.freebiesGameId === $(this).data('gameid'));
          if (balance == 0 && !freebiesGame.gamePlayId) {
            $("#insufficientTicket").modal("show");
          } else {
            window.scrollTo(0, 0);
            $("#predictSubmit").removeClass("active");
            $("#currentQuiz").empty();
            let option1 = freebiesGame.option1;
            let option2 = freebiesGame.option2;
            let option3 = freebiesGame.option3;
            freebiesGameId = freebiesGame.freebiesGameId;
            let current_quiz;
            listQuestion = [
              {
                content: `${translator.translateForKey("predict_page.question1")}`,
                options: [],
              },
              {
                content: `${translator.translateForKey("predict_page.question2")}`,
                options: ["0-25", "26-50", "51-75", "76-90+", `${translator.translateForKey("predict_page.answer2_5")}`],
              },
              {
                content: `${translator.translateForKey("predict_page.question3")}`,
                options: ["0", "1", "2", "3", "4+"],
              },
              {
                content: `${translator.translateForKey("predict_page.question4")}`,
                options: ["0-6", "7-8", "9-10", "11-12", "13+"],
              },
            ];
            fetch(
              `${API_URL}/12goalapi/freebies-game-play/detail?freebiesGameId=${freebiesGameId}&t=${new Date().getTime()}`,
              getRequestHeaders(),
            )
              .then((response) => response.json())
              .then((res) => {
                answerOfQuestion1 = [option1, option2, option3];
                if (res.length > 0) {
                  $("#predictSubmit").addClass("active");
                }
                listQuestion.forEach((question, index) => {
                  const gamePlayDetail = res.find(
                    (x) => x.questionNo === index + 1,
                  );
                  if (index === 0) {
                    current_quiz =
                      `<div class="predict__content__question aos-init aos-animate"" data-aos="fade-in">
                    <div
                      class="predict__content__question__title"
                    >${question.content}</div>
                    <div
                      class="predict__content__question__answers btn-group btn-group-vertical"
                      role="group"
                    >
                    <input class="btn-check" type="radio" id="q1${index}"  ${!gamePlayDetail
                        ? ""
                        : gamePlayDetail.answerNo === 0
                          ? "checked"
                          : ""
                      }  name="q${index + 1}"  value="0">
                    <label class="btn btn-outline-default" for="q1${index}">` +
                      option1 +
                      `</label>
                <input class="btn-check" type="radio" id="q2${index}" ${!gamePlayDetail
                        ? ""
                        : gamePlayDetail.answerNo === 1
                          ? "checked"
                          : ""
                      }  name="q${index + 1}"  value="1">
                <label class="btn btn-outline-default" for="q2${index}">` +
                      option2 +
                      `</label>
                <input class="btn-check" type="radio" id="q3${index}" ${!gamePlayDetail
                        ? ""
                        : gamePlayDetail.answerNo === 2
                          ? "checked"
                          : ""
                      }  name="q${index + 1}"  value="2">
                <label class="btn btn-outline-default" for="q3${index}">` +
                      option3 +
                      ` </label>
                    </div>
                  </a>`;
                    $("#currentQuiz").append(current_quiz);
                  } else {
                    let answer = ``;
                    question.options.forEach((opt, optIndex) => {
                      answer +=
                        `
                        <input class="btn-check" type="radio" id="q${index + 1
                        }${optIndex + 1}" ${!gamePlayDetail
                          ? ""
                          : gamePlayDetail.answerNo === optIndex
                            ? "checked"
                            : ""
                        }  name="q${index + 1}"  value="${optIndex}">
                        <label class="btn btn-outline-default" for="q${index + 1
                        }${optIndex + 1}">` +
                        opt +
                        `</label>`;
                    });
                    current_quiz =
                      ` <div class="predict__content__question aos-init aos-animate"" data-aos="fade-in">
                      <div
                        class="predict__content__question__title"
                      >${question.content}</div>
                      <div
                        class="predict__content__question__answers btn-group btn-group-vertical"
                        role="group"
                      >` +
                      answer +
                      `
                    </div>
                            `;
                    $("#currentQuiz").append(current_quiz);
                  }
                });
                $("input:radio").click(function () {
                  fromCheck = $("input:radio:checked").length;
                  if (fromCheck == 4) {
                    $("#predictSubmit").addClass("active");
                  }
                });

                $("#predictSubmit").click(function (event) {
                  event.preventDefault();
                  $("#predictConfirmModal").modal("show");
                });
              });

            let matchTitle = $(this).closest('.currentList').find(".quizTitle").text();
            $(".title").append(matchTitle);
            $("#mainView").hide();
            $("#predictCurrentContainer").show();
          }
        });
      }
      $("#btn-confirm").click(function () {
        let answerList = $("input:radio:checked");
        const data = {
          freebiesGamePlay: {
            freebiesGameId: +freebiesGameId,
            freebiesGamePlayDetails: [
              {
                questionNo: 1,
                answerNo: +answerList[0].value,
              },
              {
                questionNo: 2,
                answerNo: +answerList[1].value,
              },
              {
                questionNo: 3,
                answerNo: +answerList[2].value,
              },
              {
                questionNo: 4,
                answerNo: +answerList[3].value,
              },
            ],
          },
        };
        $("#predictSubmit").removeClass("active");
        $("#currentPredictConfirm .confirmClaim").addClass('disabled');
        fetch(`${API_URL}/12goalapi/freebies-game-play`, {
          body: JSON.stringify(data),
          method: "POST",
          ...getRequestHeaders(),
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.code && res.detail) {
              showErrorModal(res);
            } else {
              location.reload();
            }
            $("#predictSubmit").addClass("active");
            $("#currentPredictConfirm .confirmClaim").removeClass('disabled');
          })
          .catch((err) => {
            console.error(err);
            $("#predictSubmit").addClass("active");
            $("#currentPredictConfirm .confirmClaim").removeClass('disabled');
          });
      });
      $("#back_url").click(function () {
        location.reload();
      });
    })
    .catch(() => {
      $(".match").append(
        `<div>${translator.translateForKey("home_page.No_Match")}</div>`,
      );
    });
};

fetchPrevQuiz = () => {
  const listQuestion = [
    {
      content: `${translator.translateForKey("predict_page.question1")}`,
      options: [],
    },
    {
      content: `${translator.translateForKey("predict_page.question2")}`,
      options: ["0-25", "26-50", "51-75", "76-90+", `${translator.translateForKey("predict_page.answer2_5")}`],
    },
    {
      content: `${translator.translateForKey("predict_page.question3")}`,
      options: ["0", "1", "2", "3", "4+"],
    },
    {
      content: `${translator.translateForKey("predict_page.question4")}`,
      options: ["0-6", "7-8", "9-10", "11-12", "13+"],
    },
  ];
  fetch(`${API_URL}/12goalapi/freebies-game-play?t=${new Date().getTime()}`, getRequestHeaders())
    .then((response) => response.json())
    .then((res) => {
      let prevQuiz = res.map((item) => ({
        freebiesGamePlayId: item.freebiesGamePlayId,
        quizTitle: `${item.localTeamName} vs ${item.visitorTeamName}`,
        quizTime: new Intl.DateTimeFormat(DATE_TIME_LOCALE, {
          dateStyle: "long",
          timeStyle: "short",
        }).format(new Date(item.matchTime)),
        quizJoin: "", //TODO: Get Data,
        quizClaimStatus: item.quizClaimStatus,
        quizPrize: item.totalAmount,
        quesOne: listQuestion[0].content,
        ansOne: item.answerOne,
        ansOneContent: item.answerOne === 0 ? item.localTeamName : item.answerOne === 1 ? `${translator.translateForKey("predict_page.answer1_2")}` : item.visitorTeamName,
        ansOneStatus: item.answerOneStatus.toLowerCase(),
        quesTwo: listQuestion[1].content,
        ansTwo: item.answerTwo,
        ansTwoContent: listQuestion[1].options[item.answerTwo],
        ansTwoStatus: item.answerTwoStatus.toLowerCase(),
        quesThree: listQuestion[2].content,
        ansThree: item.answerThree,
        ansThreeContent: listQuestion[2].options[item.answerThree],
        ansThreeStatus: item.answerThreeStatus.toLowerCase(),
        quesFour: listQuestion[3].content,
        ansFour: item.answerFour,
        ansFourContent: listQuestion[3].options[item.answerFour],
        ansFourStatus: item.answerFourStatus.toLowerCase(),
        country: item.country
      }));
      let previous_quiz;
      for (var i = 0; i < prevQuiz.length; i++) {
        let status = prevQuiz[i].quizClaimStatus;
        let text;
        if (status == "unclaimed") {
          text = `${translator.translateForKey("home_page.Claim_Now")}`;
        } else if (status == "claimed") {
          text = `${translator.translateForKey("home_page.Claimed")}`;
        } else {
          text = "";
        }
        previous_quiz = `
          <div class="list-item aos-init aos-animate" data-aos="fade-up">
            <div class="prevList">
              <div class="d-flex align-items-center">
                <div class="wonAmt ${prevQuiz[i].quizPrize === 0 ? 'amt0' : ''}">${translator.translateForKey("home_page.Won")} ${prevQuiz[i].country === 'MY' ? 'MYR' : 'SGD'} ` + prevQuiz[i].quizPrize + `</div >
                  <div class="prizeTime">` + prevQuiz[i].quizTime + `</div>
                </div>
                <div class="quizTitle">` + prevQuiz[i].quizTitle + `</div>
              </div>
              <div>
                <div class="quizResultRow">
                  <div class="quizResult d-flex">
                    <div class="` + prevQuiz[i].ansOneStatus + `"></div>
                    <div>
                      <div class="prevQ">` + prevQuiz[i].quesOne + `</div>
                      <div class="prevA">` + prevQuiz[i].ansOneContent + `</div>
                    </div>
                  </div>
                  <div class="quizResult d-flex">
                    <div class="` + prevQuiz[i].ansTwoStatus + `"></div>
                    <div>
                      <div class="prevQ">` + prevQuiz[i].quesTwo + `</div>
                      <div class="prevA">` + prevQuiz[i].ansTwoContent + `</div>
                    </div>
                  </div>

                  <div class="quizResult d-flex">
                    <div class="` + prevQuiz[i].ansThreeStatus + `"></div>
                    <div>
                      <div class="prevQ">` + prevQuiz[i].quesThree + `</div>
                      <div class="prevA">` + prevQuiz[i].ansThreeContent + `</div>
                    </div>
                  </div>
                  <div class="quizResult d-flex">
                    <div class="` + prevQuiz[i].ansFourStatus + `"></div>
                    <div>
                      <div class="prevQ"> ` + prevQuiz[i].quesFour + `</div>
                      <div class="prevA">` + prevQuiz[i].ansFourContent + `</div>
                    </div>
                  </div>
                </div>
                <div class="d-flex justify-content-around align-items-center resultContainer">
                  <div class='showAns'> ${translator.translateForKey("home_page.Show_Answer")} <i class="fa fa-chevron-down"></i></div>
                  <div class="hideAns" style="display: none">${translator.translateForKey("home_page.Hide_Answer")} <i class="fa fa-chevron-up"></i></div>
                  <button class="btn btn-danger ${status}"" ${text === translator.translateForKey("home_page.Claimed") ? "disabled" : ""} data-bs-toggle="modal" data-bs-target="#claimConfirmModal"
                    style="${prevQuiz[i].quizPrize === 0 ? 'display: none' : ''}" data-gameplayid=${prevQuiz[i].freebiesGamePlayId}>` + text + `</button>
                </div>
              </div>
            </div>        
          </div>`;

        $(".matchs").append(previous_quiz);
        registerPrevQuizToggleEvent();
      }
      $(".unclaimed").click(function () {
        let matchTitle = $(this).parent().find(".matchTitle").text();
        $("#claimConfirmModal").data("matchTitle", matchTitle);
        $("#claimConfirmModal").modal("show");
      });
      $("#confirmClaimBtn").click(function () {
        let matchTitle = $("#claimConfirmModal").data("matchTitle");
        let game = prevQuiz.find((x) => x.quizTitle === matchTitle);
        claimedPrize(game.freebiesGamePlayId);
        $("#claimConfirmModal").modal("hide");
      });
      var items = $(".list-wrapper .list-item");
      var numItems = items.length;
      var perPage = 4;

      items.slice(perPage).hide();

      $("#pagination-container").pagination({
        items: numItems,
        itemsOnPage: perPage,
        prevText: '<i class="fa fa-chevron-left"></i>',
        nextText: '<i class="fa fa-chevron-right"></i>',
        onPageClick: function (pageNumber) {
          var showFrom = perPage * (pageNumber - 1);
          var showTo = showFrom + perPage;
          items.hide().slice(showFrom, showTo).show();
        },
      });
    });
};

setupClockCountdown = () => {
  var clockdiv = document.getElementsByClassName("clockdiv");
  var countDownDate = new Array();
  for (var i = 0; i < clockdiv.length; i++) {
    countDownDate[i] = new Array();
    countDownDate[i]["el"] = clockdiv[i];
    countDownDate[i]["time"] = new Date(
      clockdiv[i].getAttribute("data-date"),
    ).getTime();
    countDownDate[i]["days"] = 0;
    countDownDate[i]["hours"] = 0;
    countDownDate[i]["seconds"] = 0;
    countDownDate[i]["minutes"] = 0;
  }
  var countdownFunction = () => {
    for (var i = 0; i < countDownDate.length; i++) {
      var now = new Date().getTime();
      var distance = countDownDate[i]["time"] - now;
      countDownDate[i]["days"] = Math.floor(
        distance / (1000 * 60 * 60 * 24),
      );
      countDownDate[i]["hours"] = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      countDownDate[i]["minutes"] = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60),
      );
      countDownDate[i]["seconds"] = Math.floor(
        (distance % (1000 * 60)) / 1000,
      );

      if (distance < 0) {
        countDownDate[i]["el"].querySelector(".days").innerHTML = 0;
        countDownDate[i]["el"].querySelector(".hours").innerHTML = 0;
        countDownDate[i]["el"].querySelector(".minutes").innerHTML = 0;
        countDownDate[i]["el"].querySelector(".seconds").innerHTML = 0;
      } else {
        countDownDate[i]["el"].querySelector(".days").innerHTML =
          countDownDate[i]["days"];
        countDownDate[i]["el"].querySelector(".hours").innerHTML =
          countDownDate[i]["hours"];
        countDownDate[i]["el"].querySelector(".minutes").innerHTML =
          countDownDate[i]["minutes"];
        countDownDate[i]["el"].querySelector(".seconds").innerHTML =
          countDownDate[i]["seconds"];
      }
    }
  }
  countdownFunction()
  setInterval(countdownFunction, 1000);
}

$(document).ready(async function () {
  $("#openbtn").click(function () {
    $("#mySideBar").css("transform", "translate(0px, 0px)");
    $("#overlay").css("display", "block");
    setTimeout(() => {
      $("#mySideBar").addClass("ssm-nav-visible");
      $("#overlay").addClass("ssm-nav-visible");
    }, 30);
  });
  $("#overlay").click(function () {
    $("#mySideBar").css("transform", "translate(-1000px, 0px)");
    $("#mySideBar").removeClass("ssm-nav-visible");
    $("#overlay").removeClass("ssm-nav-visible");
    $("#overlay").css("display", "none");
  });
  if (localStorage["preferred_language"] == LANGUAGES.ZH) {
    $("#officialPartner").css("margin-right", "0px");
  }
  getUserData();
  await getSiteDomain();
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) {
    $("#previous-tab").css("display", "none");
  }

  fetchCurrentQuiz();
  fetchUserGameReport().then(res => loadHowToPlay(res.site));
  fetchLeaderBoardRanking();
});
