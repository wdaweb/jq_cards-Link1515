let stage = 0;
let cardLength = 0;
let isMatching = false;
let timer = 0;
let totalTime = 0;
let totalTurn = 0;
// prettier-ignore
const countryNameData = [
  [
    '台灣<br>Taiwan', 
    '美國<br>America', 
    '加拿大<br>Canada'
  ],
  [
    '瑞典<br>Sweden', 
    '芬蘭<br>Finland', 
    '挪威<br>Norway', 
    '冰島<br>Iceland', 
    '丹麥<br>Denmark', 
    '瑞士<br>Switzerland'
  ],
  [
    '比利時<br>Belgium',
    '德國<br>Germany',
    '荷蘭<br>Netherlands',
    '法國<br>France',
    '義大利<br>Italy',
    '保加利亞<br>Bulgaria'
  ],
  [
    '馬利<br>Mali',
    '幾內亞<br>Guinea',
    '喀麥隆<br>Cameroon',
    '塞內加爾<br>Senegal',
    '奈及利亞<br>Nigeria',
    '查德<br>Chad'
  ]
];
// audio
// prettier-ignore
const countryNameAudio = [
  [
    new Audio('./audio/Taiwan.mp3'),
    new Audio('./audio/America.mp3'),
    new Audio('./audio/Canada.mp3'),
  ],
  [
    new Audio('./audio/Sweden.mp3'),
    new Audio('./audio/Finland.mp3'),
    new Audio('./audio/Norway.mp3'),
    new Audio('./audio/Iceland.mp3'),
    new Audio('./audio/Denmark.mp3'),
    new Audio('./audio/Switzerland.mp3'),
  ],
  [
    new Audio('./audio/Belgium.mp3'),
    new Audio('./audio/Germany.mp3'),
    new Audio('./audio/Netherlands.mp3'),
    new Audio('./audio/France.mp3'),
    new Audio('./audio/Italy.mp3'),
    new Audio('./audio/Bulgaria.mp3'),
  ],
  [
    new Audio('./audio/Mali.mp3'),
    new Audio('./audio/Guinea.mp3'),
    new Audio('./audio/Cameroon.mp3'),
    new Audio('./audio/Senegal.mp3'),
    new Audio('./audio/Nigeria.mp3'),
    new Audio('./audio/Chad.mp3'),
  ]
];
const wrongAudio = new Audio('./audio/wrong.mp3');
wrongAudio.volume = 0.4;
const correctAudio = new Audio('./audio/correct.mp3');
correctAudio.volume = 0.5;
const clappingAudio = new Audio('./audio/clapping.mp3');
clappingAudio.volume = 0.8;

// 遊戲開始按鈕
$('#startBtn').on('click', function () {
  $('#home').hide();
  $('#game').show();

  gameStart();
});

// 再次挑戰按鈕
$('#replayBtn').on('click', function () {
  $('.finalInfo').hide();
  $('#game').show();
  clappingAudio.load();

  gameStart();
});

// 回首頁按鈕
$('.homeBtn').on('click', function () {
  $('.finalInfo').hide();
  $('#game').hide();
  $('#home').show();
  gameHtmlReset();
  clockTurnOff();
  clappingAudio.load();
});

// 遊戲開始函數(與重新開始共用)
function gameStart() {
  // 重設下一關按鈕
  $('#nextBtn').off();
  nextBtnFun();

  stage = 0;
  totalTime = 0;
  $('#timeUsed').text(totalTime);
  totalTurn = 0;
  $('#turnTimes').text(totalTurn);

  gameHtmlReset();
  cardCreate(stage);
  clockTurnOn();
}

// 遊戲html重設
function gameHtmlReset() {
  $('#solved').html('');
  $('.upper-box').html('');
  $('.lower-box').html('');
}

// 下一關按鈕函數
function nextBtnFun() {
  $('#nextBtn').on('click', function () {
    $('.nextStageInfo').hide();
    $(this).html('進入下一關');
    stage++;

    gameHtmlReset();
    cardCreate(stage);
    clockTurnOn();
  });
}

// 開啟時鐘
function clockTurnOn() {
  timer = setInterval(() => {
    totalTime++;
    $('#timeUsed').text(totalTime);
  }, 1000);
}

// 關閉時鐘
function clockTurnOff() {
  clearInterval(timer);
}

// 產生卡片 & 綁定事件
function cardCreate(stage) {
  // 等級難度
  if (stage < 1) {
    cardLength = 3;
  } else {
    cardLength = 6;
  }

  for (let i = 0; i < cardLength; i++) {
    // 上方旗幟卡片生成
    $('.upper-box').append(`
      <div class="flag" data-cardID="${i}">
        <div class="back">?</div>
        <div class="front"></div>
      </div>
    `);
    $('.flag .front').eq(i).css('background-image', `url(./images/${stage}_${i}.gif)`);

    // 下方國名卡片生成
    $('.lower-box').append(`
      <div class="countryName" data-cardID="${i}">
        <div class="back">!</div>
        <div class="front">${countryNameData[stage][i]}</div>
      </div>
    `);
  }

  // 洗牌
  for (let i = 0; i < cardLength; i++) {
    const randNum = Math.round(Math.random() * 2);
    $('.flag').eq(i).insertAfter($('.flag').eq(randNum));
    $('.countryName').eq(randNum).insertAfter($('.countryName').eq(i));
  }

  // 卡片點擊事件
  $('.flag').on('click', function () {
    if (!$('.flag').hasClass('open-flag')) {
      $(this).addClass('open-flag');
    }

    if (!isMatching) {
      cardMatch();
    }
  });

  $('.countryName').on('click', function () {
    if (!$('.countryName').hasClass('open-countryName')) {
      $(this).addClass('open-countryName');
    }

    if (!isMatching) {
      cardMatch();
    }
  });
}

// 卡片配對判斷
function cardMatch() {
  if ($('.open-flag').length && $('.open-countryName').length) {
    // 正在配對
    isMatching = true;
    totalTurn++;
    $('#turnTimes').text(totalTurn);

    if ($('.open-flag').attr('data-cardID') === $('.open-countryName').attr('data-cardID')) {
      $('.open-flag').addClass('OK').off();
      $('.open-countryName').addClass('OK').off();
      $('.open-flag div').fadeTo(800, 0);
      $('.open-countryName div').fadeTo(1000, 0);

      // 插入解決的卡片
      $('#solved').append(`
      <div class="solved-card">
        <div class="front">
          <div style="background-image: url(./images/${stage}_${$('.open-flag').attr('data-cardID')}.gif)"></div>
          <p>${$('.open-countryName .front').html()}</p>
        </div>
        <div class="back"></div>
      </div>
      `);

      $('.solved-card .front').fadeTo(1000, 1);
      setTimeout(function () {
        // 避免一創建 solved-card就加入class，會沒有翻轉動畫
        $('.solved-card').addClass('turnFront');
      }, 0);

      // 音效
      countryNameAudio[stage][$('.open-flag').attr('data-cardID')].play();
    } else {
      wrongAudio.play();
    }

    setTimeout(function () {
      $('.flag').removeClass('open-flag');
      $('.countryName').removeClass('open-countryName');
      isMatching = false;

      // 判斷是否過關
      if ($('.turnFront').length === cardLength) {
        clockTurnOff();
        $('.clock').text(totalTime);
        $('.turn').text(totalTurn);
        $('.nextStageInfo').show();
        correctAudio.play();

        // 是否全部過完
        if (stage === countryNameData.length - 1) {
          $('#nextBtn').off();
          $('#nextBtn').html('挑戰成功!');
          $('#nextBtn').on('click', function () {
            $('.nextStageInfo').hide();
            $('#game').hide();
            $('.finalInfo').show();
            $('.finalInfo').addClass('wordAnimate');
            clappingAudio.play();
          });
        }
      }
    }, 1000);
  }
}

// 測試用跳關鈕 t，直接跳到勝利
document.onkeydown = (e) => {
  if (e.key === 't' || e.key === 'T') {
    $('#home').hide();
    $('.nextStageInfo').hide();
    $('#game').hide();
    $('.finalInfo').show();
    $('.finalInfo').addClass('wordAnimate');
    clappingAudio.play();

    clockTurnOff();
  }
};
