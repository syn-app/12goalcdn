let siteLang = '';
let listQuestion = [];

chineseQuestion = [
  {
    content: "本场赛事最终获胜队伍",
    options: [],
  },
  {
    content: "本场赛事第一张罚牌时间",
    options: ["0-25", "26-50", "51-75", "76-90+", "没有罚牌"],
  },
  {
    content: "比赛总进球数",
    options: ["0", "1", "2", "3", "4+"],
  },
  {
    content: "本场赛事总角球数",
    options: ["0-6", "7-8", "9-10", "11-12", "13+"],
  },
];

thaiQuestion = [
  {
    content: "ใครจะชนะการแข่งขัน",
    options: [],
  },
  {
    content: "เวลาที่จองครั้งแรก (การ์ดสีเหลืองหรือแดง)?",
    options: ["0-25", "26-50", "51-75", "76-90+", "ไม่มีการจอง"],
  },
  {
    content: "จำนวนประตูทั้งหมด",
    options: ["0", "1", "2", "3", "4+"],
  },
  {
    content: "ได้กี่มุมในแมตช์นี้",
    options: ["0-6", "7-8", "9-10", "11-12", "13+"],
  },
];

englishQuestion = [
  {
    content: "Who will win the match?",
    options: [],
  },
  {
    content: "Time of 1st Booking (Yellow or Red Card)?",
    options: ["0-25", "26-50", "51-75", "76-90+", "No booking"],
  },
  {
    content: "Total goals?",
    options: ["0", "1", "2", "3", "4+"],
  },
  {
    content: "How many corners in the match?",
    options: ["0-6", "7-8", "9-10", "11-12", "13+"],
  },
];

getRequestHeaders = (additonalHeaders) => {
  return {
    headers: {
      "user-data": localStorage.getItem(USER_KEY) || '',
      "timestamp": localStorage.getItem(KEY_TS) || '',
      "content-type": "application/json; charset=UTF-8",
      ...additonalHeaders
    }
  };
}

var translator;
getSiteLanguage = async () => {
  const href = location.href;
  if (href.includes('chs')) {
    siteLang = 'cn';
  } else if (href.includes('en')) {
    siteLang = 'en';
  } else {
    siteLang = 'th';
  }
  DATE_TIME_LOCALE = siteLang === 'cn' ? 'zh-CN' : siteLang === 'th' ? 'th-TH' : 'en-US';
  const transLang = siteLang === 'cn' ? 'zh' : siteLang === 'th' ? 'th' : "en";
  localStorage.setItem("preferred_language", transLang);
  translator = new Translator({
    defaultLanguage: transLang,
    detectLanguage: true,
    selector: "[data-i18n]",
    debug: false,
    registerGlobally: "__",
    persist: true,
    persistKey: "preferred_language",
    filesLocation: IS_DEV ? "/12play-freebies-mobile/assets/i18n" : "https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.5/12play-freebies-mobile/assets/i18n",
  });
  await translator.fetch([transLang]);
}

getUserData = () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  const userData = params.userData;
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
  fetch(`${API_URL}/12goalapi/freebies-game?country=${SITE_COUNTRY}&sortName=MatchDate&ascend=true&t=${new Date().getTime()}`, getRequestHeaders())
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
          option2: translator.translateForKey("predict_page.answer1_2"),
          option3: item.visitorTeamName,
          gamePlayId: item.gamePlayId,
          multipliers: item.multipliers,
          predictTimeValid: item.predictTimeValid,
          gamePlayMultiplier: item.gamePlayMultiplier,
        };
        currentQuiz.push(quiz);
      });
      if (currentQuiz.length === 0) {
        $(".currentQuizRow").append(`<div>${translator.translateForKey("home_page.No_Match")}</div>`);
      } else {
        let quiz;
        for (let key in currentQuiz) {
          if (currentQuiz.hasOwnProperty(key)) {
            let predictButtonText = '';
            if (currentQuiz[key].status === 9) {
              predictButtonText = currentQuiz[key].gamePlayId ? translator.translateForKey("home_page.Predicted") : translator.translateForKey("home_page.Predict")
            } else {
              predictButtonText = currentQuiz[key].gamePlayId ? translator.translateForKey("home_page.Edit") : translator.translateForKey("home_page.Predict")
            }
            const gpmul = +currentQuiz[key].gamePlayMultiplier;
            quiz =
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
                    <div class="icon-info" data-toggle="modal" data-target="#multiplierInfoModal">
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
                        <div class="d-flex selections ${!currentQuiz[key].predictTimeValid ? 'disabled' : ''}">
                          <div class="${currentQuiz[key].multipliers?.includes(2) && gpmul < 2 ? 'selectable' : ''} ${gpmul === 2 ? 'selected' : ''}"
                            data-gameid="${currentQuiz[key].freebiesGameId}" data-gameplayid="${currentQuiz[key].gamePlayId}" data-multiplier="2" data-currentmultiplier="${gpmul}">x2</div>
                          <div class="${currentQuiz[key].multipliers?.includes(3) && gpmul < 3 ? 'selectable' : ''} ${gpmul === 3 ? 'selected' : ''}"
                            data-gameid="${currentQuiz[key].freebiesGameId}" data-gameplayid="${currentQuiz[key].gamePlayId}" data-multiplier="3" data-currentmultiplier="${gpmul}">x3</div>
                          <div class="${currentQuiz[key].multipliers?.includes(5) && gpmul < 5 ? 'selectable' : ''} ${gpmul === 5 ? 'selected' : ''}"
                            data-gameid="${currentQuiz[key].freebiesGameId}" data-gameplayid="${currentQuiz[key].gamePlayId}" data-multiplier="5" data-currentmultiplier="${gpmul}">x5</div>
                        </div>
                      </div>
                    </div>
                    <div class="predictBtn status` + currentQuiz[key].status + `" data-gameid=${currentQuiz[key].freebiesGameId}>${predictButtonText}</div>
                  </div>
                </div>
                `;
          }
          $(".currentQuizRow").append(quiz);
        }
        setupClockCountDown();
        var freebiesGameId = ""
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
            fetch(`${API_URL}/12goalapi/freebies-game-play/detail?freebiesGameId=${freebiesGameId}&t=${new Date().getTime()}`, getRequestHeaders())
              .then((response) => response.json())
              .then((res) => {
                answerOfQuestion1 = [option1, option2, option3];
                if (res.length > 0) {
                  $("#predictSubmit").addClass("active");
                }
                listQuestion.forEach((question, index) => {
                  const gamePlayDetail = res.find(x => x.questionNo === index + 1);
                  if (index === 0) {
                    current_quiz =
                      ` <div class="quizWrapper">
                <div>` +
                      question.content +
                      ` </div> 
                <div class="boxed">
                  <div> 
                      <input type="radio" id="q1${index}"  ${!gamePlayDetail ? '' : gamePlayDetail.answerNo === 0 ? 'checked' : ''}  name="q${index + 1
                      }"  value="0">
                      <label for="q1${index}">` +
                      option1 +
                      `</label>
                  </div>
                  <div> 
                  <input type="radio" id="q2${index}" ${!gamePlayDetail ? '' : gamePlayDetail.answerNo === 1 ? 'checked' : ''}  name="q${index + 1
                      }"  value="1">
                  <label for="q2${index}">` +
                      option2 +
                      `</label>
                  </div>
                  <div>
                  <input type="radio" id="q3${index}" ${!gamePlayDetail ? '' : gamePlayDetail.answerNo === 2 ? 'checked' : ''}  name="q${index + 1
                      }"  value="2">
                  <label for="q3${index}">` +
                      option3 +
                      ` </label>
                  </div>
                  </div>
                  </div>
                          `;
                    $("#currentQuiz").append(current_quiz);
                  } else {
                    let answer = ``;
                    question.options.forEach((opt, optIndex) => {
                      answer += `<div> 
                      <input type="radio" id="q${index + 1}${optIndex + 1}" ${!gamePlayDetail ? '' : gamePlayDetail.answerNo === optIndex ? 'checked' : ''}  name="q${index + 1
                        }"  value="${optIndex}">
                      <label for="q${index + 1}${optIndex + 1}">` +
                        opt +
                        `</label>
                  </div>`
                    })
                    current_quiz =
                      ` <div class="quizWrapper">
                <div>` +
                      question.content +
                      ` </div> 
                  <div class="boxed">`+ answer + `
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

                $("#predictSubmit").click(function () {
                  $("#currentPredictConfirm").modal("show");
                });
              })

            let matchTitle = $(this).closest('.currentList').find(".quizTitle").text();
            $("#quizTitle").html("").append(matchTitle);
            $(".bg").hide();
            $("#predictCurrentContainer").show();
          }
        });
        $("#currentPredictConfirm .confirmClaim").click(function () {
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
                }
              ]
            }
          };
          $("#predictSubmit").removeClass("active");
          $("#currentPredictConfirm .confirmClaim").addClass('disabled');
          fetch(`${API_URL}/12goalapi/freebies-game-play`, {
            body: JSON.stringify(data),
            method: 'POST',
            ...getRequestHeaders()
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
            }).catch((err) => {
              console.error(err);
              $("#predictSubmit").addClass("active");
              $("#currentPredictConfirm .confirmClaim").removeClass('disabled');
            });
        });
        $(".backModal").click(function () {
          $(".bg").show();
          $("#predictCurrentContainer").hide();
        });
      }
    }).catch((e) => {
      $(".currentQuizRow").append(`<div>${translator.translateForKey("home_page.No_Match")}</div>`);
      console.error(e);
    });
};

fetchPrevQuiz = () => {
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
        ansOneContent: item.answerOne === 0 ? item.localTeamName : item.answerOne === 1 ? translator.translateForKey("predict_page.answer1_2") : item.visitorTeamName,
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
        country: item.country,
        multiplier: item.multiplier
      }));
      let previous_quiz;
      for (var i = 0; i < prevQuiz.length; i++) {
        previous_quiz = getPreviousQuizHtml(prevQuiz[i]);
        $(".list-wrapper").append(previous_quiz);
        registerPrevQuizToggleEvent();
      }
      $(".unclaimed").click(function () {
        $("#claimPrevPrize").data("gameplayid", $(this).data('gameplayid'));
        $("#claimPrevPrize").modal("show");
      });
      $("#claimPrevPrize .confirmClaim").on("click", function (event) {
        claimedPrize($("#claimPrevPrize").data("gameplayid"));
        $("#claimPrevPrize").modal("hide");
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

setupClockCountDown = () => {
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
  countdownFunction();
  setInterval(countdownFunction, 1000);
}

$(document).ready(async function () {
  await getSiteLanguage();
  const folder = siteLang === 'en' ? 'en' : siteLang === 'cn' ? 'chs' : 'th';
  const folderPath = IS_DEV ? '' : 'https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v1.5';
  $("#header").load(`${folderPath}/12play-freebies/${SITE_COUNTRY.toLowerCase()}/${folder}/header.html`, function () {
    $("#4dBtn").addClass("active"); //highlight the nav item
  });
  $("#footer").load(`${folderPath}/12play-freebies/${SITE_COUNTRY.toLowerCase()}/${folder}/footer.html`, function () {
    // $("#4dFooterBtn").addClass("active"); //highlight the nav item
  });
  $("#stickySideBtn").load(`${folderPath}/12play-freebies/${SITE_COUNTRY.toLowerCase()}/${folder}/sticky-side-button.html`);
  if (siteLang === 'en') {
    listQuestion = structuredClone(englishQuestion);
  } else if (siteLang === 'cn') {
    listQuestion = structuredClone(chineseQuestion);
  } else if (siteLang === 'th') {
    listQuestion = structuredClone(thaiQuestion);
  }
  getUserData();
  fetchLeaderBoardRanking();
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) {
    $('#previous-tab').css('display', 'none');
  }
  fetchUserGameReport().then(res => loadHowToPlay(res));
  fetchCurrentQuiz();
  if (localStorage.getItem(USER_KEY)) {
    fetchPrevQuiz();
  }
});
