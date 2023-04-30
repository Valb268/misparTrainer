let chosenDigits = 0;
let number = -1;
let userAnswer = 0;
let successInARow = 0;
let isSubmitted = false;
const container = document.getElementById("container");
resizeMargin();
window.addEventListener('resize', resizeMargin);
function resizeMargin() {
    container.style.marginTop = `${Math.round((visualViewport.height - container.clientHeight) / 2)}px`;
}

document.querySelector("div.btn-group").addEventListener("click", function (event) {
    if (event.target.type === "radio") {
        chosenDigits = event.target.value;
    }
});

let start_button = document.getElementById('start_button');
start_button.addEventListener('click', e => {
    // in case no digits chosen, number of digits is set randomly
    if (chosenDigits === 0) {
        chosenDigits = Math.round(Math.random() * 4 + 1);
    }
    number = generate(chosenDigits);
    playNumber(number);
    answer.focus();
    isSubmitted = false;
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
    if (number < 11) {
        playBeforeTen(number);
    } else if (number < 20) {
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
        isSubmitted = true;
        answer.value = '';
    }
}


function checkResult() {
    let textResult = '';
    const par = document.createElement('p');
    par.style.marginTop = '0';

    if (userAnswer === number) {
        if (!isSubmitted) {
            successInARow++;
        }
        textResult = document.createTextNode('Correct!');
        par.style.color = 'green';

    } else {
        textResult = document.createTextNode(`The right answer is: ${number}`);
        par.style.color = 'red';
        successInARow = 0;
    }
    par.appendChild(textResult);

    if (result.children.length > 0) {
        result.replaceChild(par, result.firstElementChild);
    } else {
        result.appendChild(par);
    }
    showSuccess();
}

function showSuccess() {
    const div = document.createElement('div');
    // h3.style.marginBottom = '0px';
    // div.style.marginLeft = '10px';
    // h3.style.marginTop = '0';
    let textSuccess = document.createTextNode(successInARow);
    div.appendChild(textSuccess);
    if (inARow.children.length) {
        inARow.replaceChild(div, inARow.lastElementChild);
    } else {
        inARow.appendChild(div);
    }
}
