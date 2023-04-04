let chosenDigits = 0;
let number = -1;
let userAnswer = 0;
let successInARow = 0;

document.querySelector("div.btn-group").addEventListener("click", function (event) {
    if (event.target.type === "radio") {
        chosenDigits = event.target.value;
    }
});

start_button.addEventListener('click', e => {
    // in case no digits chosen, number of digits is set randomly
    if (chosenDigits === 0) {
        chosenDigits = Math.round(Math.random() * 4 + 1);
    }
    number = generate(chosenDigits);
    playNumber(number);
    answer.focus();

    // playNumber(6006);

    if (result.children.length > 0) {
        result.removeChild(result.firstElementChild);
    }
});

repeat_button.addEventListener('click', e => {
    if (number > 0) {
        playNumber(number);
        answer.focus();
    }
});

answer_button.addEventListener('click', e => submitAnswer());
answer.addEventListener('keyup', e => {
    if (e.key === 'Enter') {
        submitAnswer();
    }
});

function generate(digits) {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits;
    return min + Math.round(Math.random() * (max - min));
}


function playNumber(number) {
    // console.log(`number is ${number}`);
    if (number < 11) {
        playBeforeTen(number);
    } else if (number < 20) {
        // playDigit(number % 10);
        // play.addEventListener('ended', (e) => playDigit('1-'), {once: true});
        createPlaylist(number).play();
    } else if (number < 100) {
        if ((number % 10) > 0) {
            createPlaylist(getComponentOfNumber(number, 2), number % 10).play();
        } else {
            createPlaylist(number).play();
        }
    } else if (number < 1000) {
        if ((number % 10) > 0) {
            if (getComponentOfNumber(number, 2) === 10) {
                createPlaylist(getComponentOfNumber(number, 3),
                    (getComponentOfNumber(number, 2) + number % 10)).play();
            } else {
                createPlaylist(getComponentOfNumber(number, 3),
                    getComponentOfNumber(number, 2), number % 10).play();
            }
        } else if (number % 100 === 0) {
            createPlaylist(number).play();
        } else {
            createPlaylist(getComponentOfNumber(number, 3), 'v',
                getComponentOfNumber(number, 2)).play();
        }
    } else if (number < 10000) {
        if ((number % 10) > 0) {
            // for numbers: xx1x;
            if (getComponentOfNumber(number, 2) === 10) {
                createPlaylist(getComponentOfNumber(number, 4), getComponentOfNumber(number, 3),
                    (getComponentOfNumber(number, 2) + number % 10)).play();
            } else {
                // for numbers: xxxx;
                createPlaylist(getComponentOfNumber(number, 4),
                    getComponentOfNumber(number, 3), getComponentOfNumber(number, 2),
                    number % 10).play();
            }
        } else if (number % 1000 === 0) {
            //for numbers: x000;
            createPlaylist(number).play();
        } else if (number % 100 === 0) {
            // for numbers: xx00;
            createPlaylist(getComponentOfNumber(number, 4), getComponentOfNumber(number, 3)).play();
        } else {
            // for numbers: xxx0;
            createPlaylist(getComponentOfNumber(number, 4), getComponentOfNumber(number, 3),
                'v', getComponentOfNumber(number, 2)).play();
        }
    }

}


function pathMaker(digit) {
    const path = './audio/count/';
    const ext = '.m4a';
    return path + digit + ext;
}

function getComponentOfNumber(number, componentIndex) {
    const stringNumber = number.toString();
    let component = stringNumber.charAt(stringNumber.length - componentIndex);
    return component * 10 ** (componentIndex - 1);
}

function createPlaylist(...digits) {
    const playlist = new Gapless5();
    playlist.setCrossfade(140);
    digits.filter(digit => digit !== 0).forEach(num => {
        playlist.addTrack(pathMaker(num))
    });
    return playlist;
}

function playBeforeTen(digit) {
    const path = './audio/count/1-10/';
    const ext = '.m4a';
    const player = document.getElementById('play');
    player.autoplay;
    player.src = path + digit + ext;
    player.type = "audio/x-m4a";
}


function submitAnswer() {
    if (answer.value && isFinite(answer.value)) {
        userAnswer = +answer.value;
        checkResult();
        answer.value = '';
    }
}


function checkResult() {
    let textResult = '';

    if (userAnswer === number) {
        successInARow++;
        textResult = document.createTextNode('Верно!');
    } else {
        textResult = document.createTextNode(`Правильный ответ: ${number}`);
        successInARow = 0;
    }
    const par = document.createElement('p');
    par.appendChild(textResult);

    if (result.children.length > 0) {
        result.replaceChild(par, result.firstElementChild);
    } else {
        result.appendChild(par);
    }
    showSuccess();
}

function showSuccess() {
    const h3 = document.createElement('h3');
    h3.style.marginBottom = '0px';
    h3.style.marginLeft = '2px';
    h3.style.marginTop = '0';
    let textSuccess = document.createTextNode(successInARow);
    h3.appendChild(textSuccess);
    if (success.children.length > 2) {
        success.replaceChild(h3, success.lastElementChild);
    } else {
        success.appendChild(h3);
    }
}

// function playDigit(digit) {
//     const path = './audio/count/';
//     const ext = '.m4a';
//     const player = document.getElementById('play');
//     player.autoplay;
//     player.src = path + digit + ext;
//     player.type = "audio/x-m4a";
//     // player.type = "audio/wav";
// }
//
//
// function createPlaylist11_19(number) {
//     const playlist = new Gapless5();
//     playlist.setCrossfade(130);
//     playlist.addTrack(pathMaker('1-10/' + number % 10));
//     playlist.addTrack(pathMaker(10));
//     return playlist;
// }
//
// function createPlaylist21_99(number) {
//     const playlist = new Gapless5();
//     playlist.setCrossfade(80);
//     playlist.addTrack(pathMaker(number - number % 10));
//     if ((number % 10) > 0) {
//         playlist.addTrack(pathMaker(number % 10));
//     }
//     console.log(playlist.getTracks());
//     return playlist;
// }
//
// function createPlaylist100_999(number) {
//     const playlist = new Gapless5();
//     playlist.setCrossfade(80);
//     playlist.addTrack(pathMaker(number - number % 10));
//     if ((number % 10) > 0) {
//         playlist.addTrack(pathMaker(number % 10));
//     }
//     console.log(playlist.getTracks());
//     return playlist;
// }
