const BINGO_WORDS = [
    "platform",
    "investigate",
    "explore",
    "inquiry",
    "relationships",
    "data",
    "contemporary",
    "technology",
    "boundary",
    "liminal",
    "challenges",
    "inspiring",
    "experience",
    "fundamental",
    "shift",
    "enhance",
    "understanding",
    "space",
    "reality",
    "community",
    "distribution",
    "covid-19",
    "abstract",
    "personal",
    "tension",
    "promote",
    "power-dynamic",
    "struggle",
    "equality",
    "fairness",
    "future",
    "AI",
    "ML",
    "joy",
    "ethics",
    "enable",
    "transform",
    "aesthetic",
    "groundbreaking",
    "unprecedented",
    "interactive",
    "internet",
    "neural",
    "AR",
    "VR",
    "blockchain",
    "design",
    "critical",
    "culture",
    "network",
    "performance",
    "LED",
    "3D",
    "application",
    "identity",
    "system",
    "big data",
    "big tech",
    "industry",
    "capitalism",
    "exploitation",
]

const GIFS = [
    "https://i.imgur.com/sTFTUTG.gif",
    "https://i.imgur.com/aRMV3S1.gif",
    "https://i.imgur.com/OdVQUmY.gif",
    "https://i.imgur.com/hHfgZZd.gif",
    "https://i.imgur.com/cTzHKlB.gif",
    "https://i.imgur.com/Irr4RAk.gif",
    "https://i.imgur.com/NFSVDRO.gif",
    "https://i.imgur.com/uF0XZAH.gif",
    "https://i.imgur.com/kNoBVVS.gif",
    "https://i.imgur.com/YwYXa74.gif",
    "https://i.imgur.com/mpYw1zt.gif",
    "https://i.imgur.com/GBWwd8z.gif",
    "https://media.giphy.com/media/XyUmcq2yXff3spuvpw/giphy.gif",
    "https://media.giphy.com/media/1xNBjdWUErvYDRAM2u/giphy.gif",
    "https://media.giphy.com/media/nk04Q25wL6BxjVcW0M/giphy.gif",
    "https://media.giphy.com/media/ADgfsbHcS62Jy/giphy.gif",
    "https://media.giphy.com/media/12Eo7WogCAoj84/giphy.gif",
    "https://media.giphy.com/media/26tOYHUgZYoj2YKPe/giphy.gif",
    "https://media.giphy.com/media/f61hh6QisPuWJkZtin/giphy.gif",
    "https://media.giphy.com/media/GjzVGmqTfzRIc/giphy.gif",
    "https://media.giphy.com/media/CVgswLRgV3nqw/giphy.gif",
    "https://media.giphy.com/media/a6pzK009rlCak/giphy.gif",
    "https://media.giphy.com/media/Is0AJv4CEj9hm/giphy.gif",
    "https://media.giphy.com/media/26tPdwMm4jyClgxTq/giphy.gif",
    "https://media.giphy.com/media/3oz8xDp5mAEOAZXEPe/giphy.gif",
    "https://media.giphy.com/media/l41m6hqhosqjW2Rag/giphy.gif",
    "https://media.giphy.com/media/xT9IgjHkJczyL3Ujle/giphy.gif",
    "https://media.giphy.com/media/Ph0oIVQeuvh0k/giphy.gif",
    "https://media.giphy.com/media/TNqMlgTuv5jJ6/giphy.gif",
    "https://media.giphy.com/media/l2JJDdD7cv4xdGGis/giphy.gif",
    "https://media.giphy.com/media/3oEduLSwuxfMoTbMQg/giphy.gif",
]

let socket = io();
let users = {}


socket.on('connect', function() {
  console.log("Connected", socket.id);
  connected = true;
  users[socket.id] = 'Anonymous User'
});


socket.on('name', function(data) {
  users[data[0]] = data[1]
  renderUserList(users)
})

socket.on('names', function(data) {
  users = data
  renderUserList(users)
})

socket.on('connected', function(data) {
  users[data] = 'Anonymous User'
  renderUserList(users)
})

socket.on('disconnect', function(data) {
  delete users[data]
    renderUserList(users)

})

socket.on('score', function(data) {
  triggerScoreAnimation(data[0], data[1], 3)
})

socket.on('win', function(data) {
  triggerWinAnimation(data[0], 20)
})

function randomColor() {
  return '#' + Math.floor(Math.random()*16777215).toString(16);

}

function triggerScoreAnimation(id, score, countdown) {
  let p = document.getElementById(id)
  if (countdown > 0) {
    setTimeout(function() {
      p.style.color = randomColor();
      triggerScoreAnimation(id, score, countdown - 1)
    }, 100)
  } else {
     // p.style.fontSize = `${score + 11}pt`
    p.style.color = 'black'
  }
}

function triggerWinAnimation(id, countdown) {
  let p = document.getElementById(id)
  if (countdown > 0) {
    setTimeout(function() {
      p.style.color = randomColor();
      p.style.fontWeight = 700;
                p.style.fontSize = '2em';

      //p.style.fontSize = ((Math.random() * 10) + 30) + 'pt'
      triggerWinAnimation(id, countdown - 1)
    }, 100)
  } else {
      p.style.fontWeight = 300;
      p.style.color = 'black'
          p.style.fontSize = '1em';


  }
}

function renderUserList(users) {
  let list = document.getElementById('userList')
  list.innerHTML = `<p>Users online: ${Object.keys(users).length}`
  for(let i in users) {
    list.innerHTML += `<p id=${i}>${users[i]}</p>`
  }
}

var chart;

function resetChart() {
    words = _.sample(BINGO_WORDS, 25)
    prepareChart(words)
}

function prepareChart(words) {
    chart = []
    for(let i = 0; i < 25; i++) {
        chart[i] = {
            word: words[i],
            selected: false,
        }
        if (i == 12) {
            // Middle FREE square
            chart[i] = {
                word: 'FREE',
                selected: true
            }
        }
    }
}

function renderChart() {
    // Take chart and actually render the DOM elements
    for(let i = 0; i < 5; i++) {
        for(let j = 0; j < 5; j++) {
            let cell = document.getElementById(`${i}-${j}`)
            cell.style.backgroundImage = chart[i * 5 + j].selected ? cell.bgImage : ''
            cell.innerHTML = chart[i * 5 + j].word
            cell.className = chart[i * 5 + j].selected ? 'selected' : ''
        }
    }
}

function checkVictory() {
    // Check rows
    let rowVictory = true
    for(let i = 0; i < 5; i++) {
        rowVictory = true
        for(let j = 0; j < 5; j++) {
            rowVictory = rowVictory && chart[i * 5 + j].selected
        }
        if (rowVictory) {
            break;
        }
    }

    // Check Columns
    let colVictory = true
    for(let i = 0; i < 5; i++) {
        colVictory = true
        for(let j = 0; j < 5; j++) {
            colVictory = colVictory && chart[j * 5 + i].selected
        }
        if (colVictory) {
            break;
        }
    }

    // Check the two diagonals :P
    const diag1 = [0, 6, 12, 18, 24]
    let diag1Victory = true
    for(let i = 0; i < diag1.length; i++) {
        diag1Victory = diag1Victory && chart[diag1[i]].selected
        if (!diag1Victory) {
            break;
        }
    }

    const diag2 = [4, 8, 12, 16, 20]
    let diag2Victory = true
    for(let i = 0; i < diag2.length; i++) {
        diag2Victory = diag2Victory && chart[diag2[i]].selected
        if (!diag2Victory) {
            break;
        }
    }

    let vic = rowVictory || colVictory || diag1Victory || diag2Victory
    if (vic) {
        document.getElementById('victory').hidden = false
        socket.emit('win', '')
    }
}


window.onload = function(_) {


    let table = document.getElementById('table')
    for(let i = 0; i < 5; i++) {
        let tr = document.createElement('tr')
        for(let j = 0; j < 5; j++) {
            let id = `${i}-${j}`
            let cell = document.createElement('td')
            cell.id = id
            tr.appendChild(cell)
            if (i * 5 + j != 12) {
                cell.onclick = function() {
                    chart[i * 5 + j].selected = !chart[i * 5 + j].selected
                    if (chart[i * 5 + j].selected) {
                        cell.bgImage = `url(${GIFS[Math.floor(Math.random() * GIFS.length)]})`
                        let score = 0;
                        for(let i = 0; i < chart.length; i++) {
                          if (chart[i].selected) 
                            score += 1
                        }
                        socket.emit('score', score)
                    } else {
                        cell.bgImage = ''
                    }
                    checkVictory()
                    renderChart()

                    return false;
                }
            } else {
                cell.style.backgroundImage = `url(${GIFS[Math.floor(Math.random() * GIFS.length)]})`
            }
        }
        table.appendChild(tr)
    }
    resetChart()
    renderChart()
    renderUserList(users)
  
    document.getElementById('nameInput').oninput = function(e) {
      socket.emit('name', this.value)
    }
  
    document.getElementById('newGame').onclick = function(e) {
      resetChart();
      renderChart();
      document.getElementById('victory').hidden = true
    }
    for(let e of document.getElementsByClassName('background')) {
       e.style.backgroundColor = randomColor();
        e.style.transform = `rotate(${Math.random()*360}deg)`
    }
   

  
    
}