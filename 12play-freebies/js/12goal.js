const USER_KEY = "userData";
const KEY_TS = "timestamp";
const API_URL = location.hostname === "127.0.0.1" ? "https://localhost:7293" : `${location.origin}`;

var SITE_COUNTRY = "MY";
var SITE_DOMAIN = "";
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
}

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

fetchSiteInfo = () => {
  fetch(`${API_URL}/12goalapi/site-info/detail-by-name?siteName=${SITE_COUNTRY === "MY" ? '12M' : '12S'}&t=${new Date().getTime()}`, getRequestHeaders())
    .then((response) => response.json())
    .then((res) => {
      if (res.currency && res.prizePool) {
        const maxPrize = `${res.currency} ${new Intl.NumberFormat('en-US').format(res.prizePool)}`;
        $("#maxPrize").html("").append(maxPrize);
      }
      $('#tcContent').append(getTC(new Date(res.startTime), new Date(res.endTime), res.exchange, res.maxTicket))
    })
}

getTC = (startTime, endTime, currencyRate, maxTicket) => {
  const startTimeFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(startTime.setHours(0, 0, 0)));
  const endTimeFormat = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(endTime.setHours(23, 59, 0)));
  const payoffDate = new Date(endTime.setDate(endTime.getDate() + 1));
  const payoffDateFormat = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "numeric"
  }).format(new Date(payoffDate.setHours(18, 0, 0))).replace("at", "");
  const currencyUnit = SITE_COUNTRY === "MY" ? 'MYR' : 'SGD';
  const currencyUnitCN = SITE_COUNTRY === "MY" ? '马币' : '新币';
  const tCEn = `<strong>How To Start</strong> <ol> <li>All members are required to deposit a minimum ${currencyUnit} 30 in order to get a ticket to participate in our 12Goal event. </li> <li>Every ${currencyUnit} 30 gets 1 ticket. Maximum tickets obtained by a member is capped at ${maxTicket}. </li> <li>With the tickets obtained, members will be able to participate in the event by answering the questions based on matches. </li> <li>1 ticket required to participate in 1 Match. </li> <li>Cut off time to answer the questions is 10 min before the match start. </li> <li>If the match gets postponed, abandoned, or not completed then the ticket will be voided. </li> <li>All answers in the event are based on the results 90 minutes plus injury time. </li> <li>Multi accounting is not allowed. If you enter a event with more than one account then all your entries will be disqualified. </li> <li>Entry to the event is limited to one per user, IP address, electronic device, household, residential address, telephone number, email address and any public environments where computers; and IP addresses are shared such as, but not limited to: universities, schools, libraries and workplaces. In conclusion, only one entry is allowed per one individual. </li> <li> All 12Play General Terms &amp; Conditions apply. </li> <li> 12Play reserves the right to amend, change or terminate this event at any time for all players without prior notice. </li> </ol> <strong>Prize Payout:</strong> <ol> <li>If you answer correctly to all 4 questions you will get a ${currencyUnit} 30 after the match is settled. </li> <li>If you answer correctly to 3 questions you will get a ${currencyUnit} 8 after the match is settled.</li> <li>The Top 50 Winners will be selected based on the highest point gained on the leaderboard during the event period. </li> <li>In the event of two or more members having the same point tally, the winner will be selected based on the earliest question submission time and date.</li> <li>The total number of points will be tallied from ${startTimeFormat} - ${endTimeFormat}. </li> <li>Winners will have their prizes credited automatically by the system.</li> <li>The pay-off date for the leaderboard is on the ${payoffDateFormat}.</li> <li>All prizes come with a 1x turnover requirement. </li><li>All prizes will be paid in ${currencyUnit} currency. USD will be converted into ${currencyUnit} based on the exchange rate of ${currencyRate}.</li></ol>`
  const tcZh = `<strong>竞猜详情:</strong><ol><li>每位玩家只需在活动期间最低存款${currencyUnitCN} 30即可获取一场12Goal有奖竞猜的票卷。</li><li>每存款${currencyUnitCN} 30将获取一张票卷，每位玩家最高可获取${maxTicket}张票卷。</li><li>获取票卷后，玩家便能用其票卷来回答每一场球赛所提问的四道问题.</li><li>每一场球赛只需一张票卷来参与竞猜。</li><li>每场球赛的竞猜必须在该球赛开赛前的十分钟进行。</li><li>如该球赛延迟，中途取消或者开赛前取消，该票卷将会作废</li><li>所有赛果将依据90分钟正赛及伤及补时阶段为准。</li><li>每位玩家只限以一个账户参与竞猜，如发现玩家使用超过一个账户参与此活动，所有相关账户的票卷将会作废。</li><li>以上限制包括每个家庭地址、IP地址、电子邮件地址、电话号码、信用卡或借记卡和/或电子支付帐户或共享电脑（例如学校、公共图书馆或工作场所）只允许一个账户参与活动</li><li> 须符合12PLAY的条款与条件。</li><li> 12PLAY将保留随时取消此竞猜活动的权利，适用于所有玩家或个人玩家。</li></ol><strong>奖金支付：</strong><ol><li>答对一场球赛的四道题目将在球赛结束后获得现金奖${currencyUnitCN} 30. </li><li>答对一场球赛的三道题目将在球赛结束后获得现金奖${currencyUnitCN} 8.</li><li>12Goal有奖竞猜终极大奖将由积分榜首五十位玩家赢取！</li><li>如两位或以上的玩家最终累积分相同，越早提交第一张票卷的玩家最终积分榜排名将会越高.</li><li>所有分数将计算于${startTimeFormat}至${endTimeFormat}</li><li>所有活动奖金将由系统自动存入玩家账户。</li><li>12Goal有奖竞猜终极大奖的奖金将于${payoffDateFormat}发放。</li><li>所有奖金只需一倍投注量即可提款。</li><li>所有奖金将以${currencyUnitCN}结算。美金将根据汇率${currencyRate}转换成${currencyUnitCN}。
  </li></ol>`;
  if (siteLang === 'en') {
    return tCEn;
  } else {
    return tcZh;
  }
}

getSiteLanguage = () => {
  const href = location.href;
  if (href.includes('chs')) {
    siteLang = 'cn';
  } else {
    siteLang = 'en';
  }
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
  const now = new Date().toISOString();
  const endDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString();
  fetch(`${API_URL}/12goalapi/freebies-game?startTime=${now}&endTime=${endDate}&country=${SITE_COUNTRY}&sortName=MatchDate&ascend=true&t=${new Date().getTime()}`, getRequestHeaders())
    .then((response) => response.json())
    .then((res) => {
      let currentQuiz = [];
      res.items.forEach((item) => {
        let quiz = {
          freebiesGameId: item.id,
          match: `${item.localTeamName} vs ${item.visitorTeamName}`,
          dateTime: item.matchDate,
          status: new Date().getTime() >= new Date(new Date(item.matchDate).getTime() - 10 * 60000) ? 9 : 0,
          option1: item.localTeamName,
          option2: siteLang === 'en' ? 'Draw' : '平手',
          option3: item.visitorTeamName,
          isPlayed: item.isPlayed
        };
        currentQuiz.push(quiz);
      });
      if (currentQuiz.length === 0) {
        if (siteLang === 'en') {
          $(".currentQuizRow").append(`<div>There are no matches currently. Stay tuned for tomorrow!</div>`);
        } else {
          $(".currentQuizRow").append(`<div>目前没有赛事，请明天继续关注！</div>`);
        }
      } else {
        let quiz;
        for (let key in currentQuiz) {
          if (currentQuiz.hasOwnProperty(key)) {
            let predictButtonText = '';
            if (currentQuiz[key].status === 9) {
              predictButtonText = currentQuiz[key].isPlayed ? `${siteLang === 'en' ? 'Predicted' : '已竞猜'}` : `${siteLang === 'en' ? 'Predict' : '竞猜'}`
            } else {
              predictButtonText = currentQuiz[key].isPlayed ? `${siteLang === 'en' ? 'Edit' : '更改答案'}` : `${siteLang === 'en' ? 'Predict' : '竞猜'}`
            }
            quiz =
              `
                <div class="d-flex justify-content-between align-items-center  currentList">
                    <div>
                    <div class="d-flex timeleftRow">
                    <div>${siteLang === 'en' ? 'Time Left' : '剩余时间'}: &nbsp;</div>
                  
                    <div class="clockdiv" data-date="` +
              currentQuiz[key].dateTime +
              `">
                    
                        <span class="days"></span>
                        <div class="smalltext">${siteLang === 'en' ? 'D' : '天'}&nbsp;:&nbsp;</div>
                 
                        <span class="hours"></span>
                        <div class="smalltext">${siteLang === 'en' ? 'H' : '小时'}&nbsp;:&nbsp; </div>
                  
                        <span class="minutes"></span>
                        <div class="smalltext">${siteLang === 'en' ? 'M' : '分钟'}&nbsp;:&nbsp; </div>
               
                        <span class="seconds"></span>
                        <div class="smalltext">${siteLang === 'en' ? 'S' : '秒'}&nbsp; </div>
                   
                </div>
                </div>
                        <div class="quizTitle">` +
              currentQuiz[key].match +
              `</div>
                    </div>
                    <div class="predictBtn status` +
              currentQuiz[key].status +
              `">${predictButtonText}</div>
                </div>
                `;
          }
          $(".currentQuizRow").append(quiz);
        }
        setupClockCountDown();
        var freebiesGameId = ""
        var answerOfQuestion1 = [];
        $(".predictBtn").click(function () {
          var balance = $("#ticketbalance").text();
          let matchTitle = $(this).parent().find(".quizTitle").text();
          let freebiesGame = currentQuiz.find((x) => x.match === matchTitle);
          if (balance == 0 && !freebiesGame.isPlayed) {
            $("#insufficientTicket").modal("show");
            const lang = siteLang === 'en' ? 'english' : 'simplified';
            $("#depositNow").click(function () {
              window.location.href = `${SITE_DOMAIN}/${SITE_COUNTRY.toLowerCase()}/mydeposit.html?lang=${lang}`
            });
            $("#loginRegister, .loginRegister").click(function () {
              window.location.href = `${SITE_DOMAIN}/${SITE_COUNTRY.toLowerCase()}/?lang=${lang}`
            });
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
              if (res.code) {
                alert(`Error: ${res.code}`);
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
    }).catch(() => {
      if (siteLang === 'en') {
        $(".currentQuizRow").append(`<div>There are no matches currently. Stay tuned for tomorrow!</div>`);
      } else {
        $(".currentQuizRow").append(`<div>目前没有赛事，请明天继续关注！</div>`);
      }
    });
};

claimedPrize = (freebiesGamePlayId) => {
  const data = {
    freebiesGamePlayId: +freebiesGamePlayId
  };
  fetch(`${API_URL}/12goalapi/claimed-prize`, {
    body: JSON.stringify(data),
    method: "POST",
    ...getRequestHeaders()
  })
    .then((response) => response.json())
    .then((res) => {
      if (res.code) {
        console.error(res);
      } else {
        location.reload();
      }
    })
    .catch((err) => console.error(err));
}

fetchPrevQuiz = () => {
  fetch(`${API_URL}/12goalapi/freebies-game-play?t=${new Date().getTime()}`, getRequestHeaders())
    .then((response) => response.json())
    .then((res) => {
      let prevQuiz = res.map((item) => ({
        freebiesGamePlayId: item.freebiesGamePlayId,
        quizTitle: `${item.localTeamName} vs ${item.visitorTeamName}`,
        quizTime: new Intl.DateTimeFormat("en-us", {
          dateStyle: "medium",
          timeStyle: "medium",
        }).format(new Date(item.matchTime)),
        quizJoin: "", //TODO: Get Data,
        quizClaimStatus: item.quizClaimStatus,
        quizPrize: item.totalAmount,
        quesOne: listQuestion[0].content,
        ansOne: item.answerOne,
        ansOneContent: item.answerOne === 0 ? item.localTeamName : item.answerOne === 1 ? `${siteLang === 'en' ? 'Draw' : '平手'}` : item.visitorTeamName,
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
          text = siteLang === 'en' ? "Claim Now" : "立即领取";
        } else if (status == "claimed") {
          text = siteLang === 'en' ? "Claimed" : '已领取';
        } else {
          text = "";
        }
        previous_quiz =
          `
                <div class="list-item">
                <div class="d-flex justify-content-between align-items-center prevList">
                    <div>
                        <div class="d-flex align-items-center">
                            <div class="wonAmt ${prevQuiz[i].quizPrize === 0 ? 'amt0' : ''}">${siteLang === 'en' ? "Won" : '赢得'} ${prevQuiz[i].country === 'MY' ? 'MYR' : 'SGD'} ` +
          prevQuiz[i].quizPrize +
          `</div >
                            <div class="prizeTime">` +
          prevQuiz[i].quizTime +
          `</div>
                        </div>
                        <div class="quizTitle">` +
          prevQuiz[i].quizTitle +
          `</div>
                    </div>
                    <button class="` +
          prevQuiz[i].quizClaimStatus +
          ` ${prevQuiz[i].quizPrize === 0 ? 'status9' : ''}" style="${prevQuiz[i].quizPrize === 0 ? 'display: none' : ''}">` +
          text +
          `</button>
                </div>
                <div>
                <div class="d-flex justify-content-center resultContainer"><div class='showAns'> ${siteLang === 'en' ? 'Show Answer' : '显示答案'}</div></div>
                <div class="quizResultRow">
                <div class="quizResult d-flex">
                        <div class="` +
          prevQuiz[i].ansOneStatus +
          `"></div>
                        <div>
                            <div class="prevQ">` +
          prevQuiz[i].quesOne +
          `</div>
                            <div class="prevA">` +
          prevQuiz[i].ansOneContent +
          `</div>
                        </div>
                </div>
                <div class="quizResult d-flex">
                    <div class="` +
          prevQuiz[i].ansTwoStatus +
          `"></div>
                    <div>
                        <div class="prevQ">` +
          prevQuiz[i].quesTwo +
          `</div>
                        <div class="prevA">` +
          prevQuiz[i].ansTwoContent +
          `</div>
                        </div>
            </div>

            <div class="quizResult d-flex">
            <div class="` +
          prevQuiz[i].ansThreeStatus +
          `"></div>
            <div>
                <div class="prevQ">` +
          prevQuiz[i].quesThree +
          `</div>
                <div class="prevA">` +
          prevQuiz[i].ansThreeContent +
          `</div>
                </div>
            </div>

            <div class="quizResult d-flex">
            <div class="` +
          prevQuiz[i].ansFourStatus +
          `"></div>
            <div>
                <div class="prevQ"> ` +
          prevQuiz[i].quesFour +
          `</div>
                <div class="prevA">` +
          prevQuiz[i].ansFourContent +
          `</div>
                </div>
            </div>
                        <div class="d-flex justify-content-center py-2"><div class="hideAns">${siteLang === 'en' ? 'Hide Answer' : '收起'}</div></div>
                        

                        </div>
                    </div>
                        </div>
                    
                    </div>
                        `;

        $(".list-wrapper").append(previous_quiz);
        $(".showAns").click(function () {
          $(".quizResultRow").hide();
          $(".showAns").show();
          $(this).hide();
          $(this).parent(".resultContainer").siblings(".quizResultRow").show();
        });

        $(".hideAns").click(function () {
          $(this)
            .parent()
            .parent()
            .siblings(".resultContainer")
            .find(".showAns")
            .show();
          // $(this).hide()
          $(this).parent().parent().hide();
        });
      }
      $(".unclaimed").click(function () {
        let matchTitle = $(this).parent().find(".quizTitle").text();
        $("#claimPrevPrize").data("matchTitle", matchTitle);
        $("#claimPrevPrize").modal("show");
      });
      $("#claimPrevPrize .confirmClaim").on("click", function (event) {
        let matchTitle = $("#claimPrevPrize").data("matchTitle");
        let game = prevQuiz.find(x => x.quizTitle === matchTitle);
        claimedPrize(game.freebiesGamePlayId);
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

fetchUserRankReport = () => {
  fetch(`${API_URL}/12goalapi/user/ranking-report?t=${new Date().getTime()}`, getRequestHeaders())
    .then((response) => response.json())
    .then(res => {
      if (siteLang === 'en') {
        $(".pointbg").append(`Total Point : ${res.totalPoints}`);
      } else {
        $(".pointbg").append(`总积分: ${res.totalPoints}`);
      }
      $(".ranking").append(`${res.rankNo}`);
    })
}

fetchUserBalanceTickets = () => {
  fetch(`${API_URL}/12goalapi/user/balance-tickets?t=${new Date().getTime()}`, getRequestHeaders())
    .then((response) => response.json())
    .then(res => {
      $("#ticketbalance").html(res.balanceTickets);
    })
}

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

        ranking_leaderboard =
          `
            <div class=" t-body">
            <div>` +
          [i + 1] +
          `</div>
            <div>` +
          name +
          `</div>
            <div>` +
          leaderboard_ranking[i].points +
          `</div>
            <div>` +
          leaderboard_ranking[i].prize +
          `</div>
            </div>
            `;

        $(".tbodyRow").append(ranking_leaderboard);
      }
    });
};

$(document).ready(async function () {
  getSiteLanguage();
  await getSiteDomain();
  const folder = siteLang === 'en' ? 'en' : 'chs';
  const folderPath = location.hostname === "127.0.0.1" ? '' : 'https://cdn.jsdelivr.net/gh/syn-app/12goalcdn@v0.18';
  $("#header").load(`${folderPath}/12play-freebies/${SITE_COUNTRY.toLowerCase()}/${folder}/header.html`, function () {
    $("#4dBtn").addClass("active"); //highlight the nav item
  });
  $("#footer").load(`${folderPath}/12play-freebies/${SITE_COUNTRY.toLowerCase()}/${folder}/footer.html`, function () {
    // $("#4dFooterBtn").addClass("active"); //highlight the nav item
  });
  $("#stickySideBtn").load(`${folderPath}/12play-freebies/${SITE_COUNTRY.toLowerCase()}/${folder}/sticky-side-button.html`);
  if (siteLang === 'en') {
    listQuestion = structuredClone(englishQuestion);
  } else {
    listQuestion = structuredClone(chineseQuestion);
  }
  getUserData();
  fetchLeaderBoardRanking();
  const userData = localStorage.getItem(USER_KEY);
  if (!userData) {
    $('#previous-tab').css('display', 'none');
  }
  fetchUserRankReport();
  fetchUserBalanceTickets();
  fetchCurrentQuiz();
  fetchSiteInfo();
  fetchPrevQuiz();
});
