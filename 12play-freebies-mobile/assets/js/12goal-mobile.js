var listQuestion = [];

getSiteDomain = async () => {
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
        country: item.country,
        multiplier: item.multiplier
      }));
      let previous_quiz;
      for (var i = 0; i < prevQuiz.length; i++) {
        previous_quiz = getPreviousQuizHtml(prevQuiz[i]);
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
  fetchUserGameReport().then(res => loadHowToPlay(res));
  fetchLeaderBoardRanking();
});
