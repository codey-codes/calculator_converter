let result = 0, lastOperation = 0, historyMarkup = '', conversion = '', fromUnit = '', toUnit = '', inputField = document.querySelector('.input-field'), resultField = document.querySelector('.result-field');
// lastOperation codes ==> 0 = none, 1 = add, 2 = subtract, 3 = multiply, 4 = divide, 5 = equals, 6 = scientific operations, 7 = 'x' to the powered 'n'

for (let i = 3; i >= 1; i--) document.querySelector('.buttons-left').insertAdjacentHTML('afterbegin', `<div onclick="changeInputField(${i})" class="btn-${i}">${i}</div>`);
for (let i = 6; i >= 4; i--) document.querySelector('.buttons-left').insertAdjacentHTML('afterbegin', `<div onclick="changeInputField(${i})" class="btn-${i}">${i}</div>`);
for (let i = 9; i >= 7; i--) document.querySelector('.buttons-left').insertAdjacentHTML('afterbegin', `<div onclick="changeInputField(${i})" class="btn-${i}">${i}</div>`);

for (let i = 0; i <= 1; i++) document.querySelectorAll('.sub-menu')[i].style.height = '0px';    // for some reasons, using CSS to define the initial height does not let the first addEventListener to work

[document.querySelector('.calculator'), document.querySelector('.converter')].forEach(e => {    // displaying/hiding the menu for converter and calculator
    e.addEventListener('click', () => {
        if (e.querySelector('.sub-menu').style.height === '0px') {
            e.querySelector('.sub-menu').style.height = 'auto';
            e.querySelector('.sub-menu').style.transform = 'translateX(0)';
        } else {
            e.querySelector('.sub-menu').style.height = '0px';
            e.querySelector('.sub-menu').style.transform = 'translateX(-510px)';
        }
    })
});

function toggleMenu() {     // for the whole menu to be displayed or hidden
    if (document.getElementById('selection').checked) {
        document.querySelector('.container-menu').style.left = '0';
    } else document.querySelector('.container-menu').style.left = '-500px';
};

function showHistory() {
    document.querySelector('.container-history').style.right = '0';
};

function closeHistory() {
    document.querySelector('.container-history').style.right = '-500px';
};

function clearHistory() {
    const children = document.querySelectorAll('.history');
    const parent = document.querySelector('.container-history');
    for (let i = 0; i <= children.length - 1; i++) parent.removeChild(children[i]);
    historyMarkup = '';
};

const clearValues = (keyIn, periodCheck) => {   // this function is used to clear the input field value. Also, if a key is pressed after getting result, instead of clearing the field, we can use this function to start changing the input fields
    result = 0;
    lastOperation = 0;
    resultField.innerHTML = '';
    if (!keyIn) inputField.innerHTML = '';
    else {
        if (keyIn === 'dot') {
            if (inputField.innerHTML === '') inputField.innerHTML = '0';    // if a period is pressed first, we add 0 to left of it to make it a proper decimal number e.g. 0.5 instead of .5
            if (periodCheck.length === 1) inputField.innerHTML += '.';
        } else inputField.innerHTML = keyIn;
    } 
    inputField.style.fontSize = '3rem';
    historyMarkup = '';
};

const calcSimple = () => {      // for the simple calculator buttons
    getReadyForConversion(false);   // this function is called here to clear the converter menu
    const simpleMarkup = `
                        <div onclick="changeInputField('add')" class="btn-add">&#43;</div>
                        <div onclick="changeInputField('sub')" class="btn-sub">&#45;</div>
                        <div onclick="changeInputField('prod')" class="btn-prod">x</div>
                        <div onclick="changeInputField('div')" class="btn-div">&#247;</div>`;
    document.querySelector('.buttons-right').insertAdjacentHTML('afterbegin', simpleMarkup);
};

const calcScientific = () => {      // for the scientific calculator buttons
    getReadyForConversion(false);
    const scientificMarkup = 
                        `<div class="simple-operations">
                            <div onclick="changeInputField('add')" class="btn-add">&#43;</div>
                            <div onclick="changeInputField('sub')" class="btn-sub">&#45;</div>
                            <div onclick="changeInputField('prod')" class="btn-prod">x</div>
                            <div onclick="changeInputField('div')" class="btn-div">&#247;</div>
                        </div>
                        <div class="trig-operations">
                            <div onclick="changeInputField('sin')" class="sin">sin</div>
                            <div onclick="changeInputField('cos')" class="cos">cos</div>
                            <div onclick="changeInputField('tan')" class="tan">tan</div>
                        </div>
                        <div class="trig-inv-operations">
                            <div onclick="changeInputField('sin-inv')" class="sin-inv">sin<sup>-1</sup></div>
                            <div onclick="changeInputField('cos-inv')" class="cos-inv">cos<sup>-1</sup></div>
                            <div onclick="changeInputField('tan-inv')" class="tan-inv">tan<sup>-1</sup></div>
                        </div>
                        <div class="power-operations">
                            <div onclick="changeInputField('xp2')" class="x-power-2">x<sup>2</sup></div>
                            <div onclick="changeInputField('xp3')" class="x-power-3">x<sup>3</sup></div>
                            <div onclick="changeInputField('xpn')" class="x-power-n">x<sup>n</sup></div>
                            <div onclick="changeInputField('10pn')" class="10-power-n">10<sup>n</sup></div>
                        </div>`;
    document.querySelector('.buttons-right').insertAdjacentHTML('afterbegin', scientificMarkup);
};

const getReadyForConversion = ready => {    // for converter buttons. ready is true -> we get converter menu. If not, converter buttons are removed
    if (ready) {
        document.querySelector('.from-unit').style.display = 'flex';
        document.querySelector('.from-unit').innerHTML = '';
        document.querySelector('.to-unit').style.display = 'flex';
        document.querySelector('.to-unit').innerHTML = '';
        document.querySelector('.buttons-bottom').style.display = 'none';
        document.querySelector('.buttons').style.height = '60%';
        document.querySelector('.history-icon').style.display = 'none';
        resultField.style.display = 'block';
        inputField.style.borderBottom = 'none';
        inputField.style.height = '20%';
    } else {
        document.querySelector('.from-unit').style.display = 'none';
        document.querySelector('.to-unit').style.display = 'none';
        document.querySelector('.buttons').style.height = '80%';
        document.querySelector('.buttons-bottom').style.display = 'flex';        
        document.querySelector('.history-icon').style.display = 'flex';
        resultField.style.display = 'none';
        inputField.style.borderBottom = '1px solid var(--col-text)'; 
        document.querySelector('.buttons-right').innerHTML = '';
        inputField.style.height = '20%';
    }
};

function showUnits() {      // to show units in the input/result fields
    clearValues();
    fromUnit = document.querySelector('.from-select').value;
    toUnit = document.querySelector('.to-select').value;
    document.querySelector('.from-unit').innerHTML = fromUnit;
    document.querySelector('.to-unit').innerHTML = toUnit;
};

const converterMarkup = (u1, u2, u3, u4, u5) => {       // this function will decide which which buttons are to be shown
    document.querySelector('.buttons-right').innerHTML = '';
    const option1 = `<option value=${u1}>${u1}</option>`;
    const option1From = `<option value=${u1} selected>${u1}</option>`;
    const option2 = `<option value=${u2}>${u2}</option>`;
    const option3 = `<option value=${u3}>${u3}</option>`;
    const option3To = `<option value=${u3} selected>${u3}</option>`;
    let option4, option5;

    if (u4) {   // this is for temperature as we have only 3 units to convert, we wont show any blank options. If its not temperature, we can show all of the 5 units
        option4 = `<option value=${u4}>${u4}</option>`;
        option5 = `<option value=${u5}>${u5}</option>`;
    } else {
        option4 = '';
        option5 = '';
    }

    const markup = `
                <p class="from-text">from</p>
                <select class="from-select">
                    ${option1From}
                    ${option2}
                    ${option3}
                    ${option4}
                    ${option5}
                </select>
                <p class="to-text">to</p>
                <select class="to-select">
                    ${option1}
                    ${option2}
                    ${option3To}
                    ${option4}
                    ${option5}
                </select>
                <p onclick="showUnits()" class="start">Convert</p>`;
    document.querySelector('.buttons-right').insertAdjacentHTML('afterbegin', markup);
};

const getResult = keyIn => {     // for the operations
    const makeHistory = thing => {      // If a user presses more than 1 operation between 2 numbers, this function makes sure that no more than 1 operator is shown in the same operation e.g. '25 -/+* 2 = 50' must be '25 * 2 = 50' 
        historyMarkup = historyMarkup.toString().split('');
        if (historyMarkup[historyMarkup.length-1] === '+' || historyMarkup[historyMarkup.length-1] === '-' || historyMarkup[historyMarkup.length-1] === '*' || historyMarkup[historyMarkup.length-1] === '/' || historyMarkup[historyMarkup.length-1] === '=') {    // if we already have an operator at the end of historyMarkup
            historyMarkup.pop();    // to remove the last operator
        }
        historyMarkup.push(thing);      // then adding the currently pressed operator
        historyMarkup = historyMarkup.join('');     // then joining the historyMarkup into a single string
    };

    if (inputField.innerHTML) { // if the user enters two or more operators without entering a number in between. For example: 5 + * 3; In this case, * is to be used as the operator
        if (lastOperation === 0) result = parseFloat(parseFloat(inputField.innerHTML).toFixed(5));
        if (lastOperation === 1) result += parseFloat(parseFloat(inputField.innerHTML).toFixed(5));
        if (lastOperation === 2) result -= parseFloat(parseFloat(inputField.innerHTML).toFixed(5));
        if (lastOperation === 3) result *= parseFloat(parseFloat(inputField.innerHTML).toFixed(5));
        if (lastOperation === 4) result /= parseFloat(parseFloat(inputField.innerHTML).toFixed(5));
        if (lastOperation === 7) {
            result = Math.pow(result, keyIn);
            historyMarkup += keyIn + ' = ';
        }
    }

    if (keyIn === 'add') {
        lastOperation = 1;
        makeHistory('+');
    }
    if (keyIn === 'sub') {
        lastOperation = 2;
        makeHistory('-');
    }
    if (keyIn === 'prod') {
        lastOperation = 3;
        makeHistory('*');
    }
    if (keyIn === 'div') {
        lastOperation = 4;
        makeHistory('/');
    }
    if (keyIn === 'equals') {
        lastOperation = 5;
        makeHistory('=');
    }
    if (keyIn === 'xpn') {
        lastOperation = 7;
    }
    inputField.innerHTML = '';
};

function changeInputField(keyIn) {      // this is where everything is started
    let periodCheck = inputField.innerHTML.toString().split('.');   // to make sure a period is not entered more than once in a number
    let del = inputField.innerHTML.toString().split('');    // for backspace

    if (lastOperation === 6) clearValues();     // clearing the values right after the scientific opertations

    if (keyIn === 'add' || keyIn === 'sub' || keyIn === 'prod' || keyIn === 'div') {
        if (!inputField.innerHTML && lastOperation === 0  && keyIn === 'sub') {     // if minus is pressed first to make the number negative
            inputField.innerHTML = '-';
        } else if (!inputField.innerHTML && lastOperation === 0) {   // if other operators are pressed first, nothing happens in this case
            inputField.innerHTML = '';
        } else {
            historyMarkup += inputField.innerHTML;
            getResult(keyIn);
        }
    } else if (keyIn === 'equals') {
        if (lastOperation !== 0) {      // perform execution only when 1 or more operators are in the equation
            if (lastOperation === 7) {  // power function is a bit tricky. That's why a special number has been given to it. This if block tests for power operation
                if (inputField.innerHTML) {     // if power button is pressed AFTER a number
                    getResult(inputField.innerHTML);
                    lastOperation = 6;
                } else inputField.innerHTML = '';       // if not, then just do nothing
            } else {
                historyMarkup += inputField.innerHTML;
                getResult(keyIn);
            }
            inputField.innerHTML = result;
            historyMarkup += result;
            document.querySelector('.container-history').insertAdjacentHTML('beforeend', `<div class="history">${historyMarkup}</div>`);   // the equation is added to history after equals sign is pressed
            historyMarkup = '';     // then we clear the markup
        }
    } else if (keyIn === 'reset') {
        clearValues();
    } else if (keyIn === 'clear' || (keyIn === 0 && !inputField.innerHTML)) {   // if 0 is pressed first, we don't show zeros on left of a number
        inputField.innerHTML = '';
    } else if (keyIn === 'del') {
        del.pop();
        inputField.innerHTML = del.join('');
        if (lastOperation === 5) lastOperation = 0;      // this will let us start editing the result obtained right away without clearing the input field
    } else if (keyIn === 'sin' || keyIn === 'cos' || keyIn === 'tan') {
        if (inputField.innerHTML) {     // if sin/cos/tan ar epressed after some number in the field
            if (keyIn === 'sin') {
                historyMarkup = 'sin(' + inputField.innerHTML + ') = ' + Math.sin(inputField.innerHTML).toFixed(5);
                inputField.innerHTML = Math.sin(inputField.innerHTML).toFixed(5);   
            }
            if (keyIn === 'cos') {
                historyMarkup = 'cos(' + inputField.innerHTML + ') = ' + Math.cos(inputField.innerHTML).toFixed(5);
                inputField.innerHTML = Math.cos(inputField.innerHTML).toFixed(5);           
            }
            if (keyIn === 'tan') {
                historyMarkup = 'tan(' + inputField.innerHTML + ') = ' + Math.tan(inputField.innerHTML).toFixed(5);
                inputField.innerHTML = Math.tan(inputField.innerHTML).toFixed(5);              
            }
            lastOperation = 6;
            document.querySelector('.container-history').insertAdjacentHTML('beforeend', `<div class="history">${historyMarkup}</div>`);   
        } else inputField.innerHTML = '';
    } else if (keyIn === 'sin-inv' || keyIn === 'cos-inv' || keyIn === 'tan-inv') {
        if (inputField.innerHTML <= 1) {    // sin/cos/tan inverse only works on numbers less than 1
            if (keyIn === 'sin-inv') {
                historyMarkup = 'sin<sup>-1</sup>(' + inputField.innerHTML + ') = ' + Math.asin(inputField.innerHTML).toFixed(5);
                inputField.innerHTML = Math.asin(inputField.innerHTML).toFixed(5);              
            }
            if (keyIn === 'cos-inv') {
                historyMarkup = 'cos<sup>-1</sup>(' + inputField.innerHTML + ') = ' + Math.acos(inputField.innerHTML).toFixed(5);
                inputField.innerHTML = Math.acos(inputField.innerHTML).toFixed(5);              
            }
            if (keyIn === 'tan-inv') {
                historyMarkup = 'tan<sup>-1</sup>(' + inputField.innerHTML + ') = ' + Math.atan(inputField.innerHTML).toFixed(5);
                inputField.innerHTML = Math.atan(inputField.innerHTML).toFixed(5);              
            }
            lastOperation = 6;
            document.querySelector('.container-history').insertAdjacentHTML('beforeend', `<div class="history">${historyMarkup}</div>`);   
        } else {
            inputField.style.fontSize = '1.4rem';
            inputField.innerHTML = 'inf';
            lastOperation = 5;
        }
    } else if (keyIn === 'xp2' || keyIn === 'xp3' || keyIn === 'xpn' || keyIn === '10pn') {     // for power operations
        if (inputField.innerHTML) {
            if (keyIn === 'xp2') {
                let powerSquared = (inputField.innerHTML * inputField.innerHTML);
                historyMarkup = inputField.innerHTML + ' ^ 2 = ' + powerSquared;
                inputField.innerHTML = powerSquared;  
            }
            if (keyIn === 'xp3') {
                let powerCubed = Math.pow(inputField.innerHTML, 3);
                historyMarkup = inputField.innerHTML + ' ^ 3 = ' + powerCubed;
                inputField.innerHTML = powerCubed;
            }
            if (keyIn === 'xpn') {
                historyMarkup = inputField.innerHTML + ' ^ ';                
                getResult('xpn');
            }
            if (keyIn === '10pn') {
                let tenPowered = Math.pow(10, inputField.innerHTML);
                historyMarkup = '10 ^ ' + inputField.innerHTML + ' = ' + tenPowered;
                inputField.innerHTML = tenPowered;  
            }
        } else inputField.innerHTML = '';
        if (keyIn !== 'xpn') {
            lastOperation = 6;
            document.querySelector('.container-history').insertAdjacentHTML('beforeend', `<div class="history">${historyMarkup}</div>`);      
        }
    } else {
        if (lastOperation === 5) clearValues(keyIn, periodCheck);    // if a number is pressed right after the equals sign, we treat it as a new number entry. If an opertion is selected, we start that operation right away on the last result
        else {
            if (keyIn === 'dot') { 
                if (inputField.innerHTML === '') inputField.innerHTML = '0';    // if a period is pressed first, we add 0 to left of it to make it a proper decimal number e.g. 0.5 instead of .5
                if (periodCheck.length === 1) inputField.innerHTML += '.';
            } else  {
                inputField.innerHTML += keyIn;
                if (conversion) {   // if conversion value exists, we start converting
                    let convResult;
                    resultField.innerHTML = '';
                    if (conversion === 'temperature') {     // because temperature conversions are a bit complicated with all the different formulae, we do them here
                        const tempFactor = weAreConvertingBoys();
                        if (tempFactor === 'CtoK') convResult = 273.15 + parseFloat(parseFloat(inputField.innerHTML).toFixed(5));
                        if (tempFactor === 'CtoF') convResult = 32 + (parseFloat(parseFloat(inputField.innerHTML).toFixed(5)) * 1.8);
                        if (tempFactor === 'FtoK') convResult = 273.15 + (parseFloat(parseFloat(inputField.innerHTML).toFixed(5)) - 32) * 0.556;
                        if (tempFactor === 'FtoC') convResult = (parseFloat(parseFloat(inputField.innerHTML).toFixed(5)) - 32) * 0.556;
                        if (tempFactor === 'KtoF') convResult = (parseFloat(parseFloat(inputField.innerHTML).toFixed(5)) - 273.15) * 1.8 + 32;
                        if (tempFactor === 'KtoC') convResult = parseFloat(parseFloat(inputField.innerHTML).toFixed(5)) - 273.15;
                        if (tempFactor === 1) convResult = inputField.innerHTML;
                    } else convResult = weAreConvertingBoys() * parseFloat(parseFloat(inputField.innerHTML).toFixed(5));  // for other conversions
                    resultField.innerHTML += convResult;
                }
            }
        }
    }
};

const weAreConvertingBoys = () => {     // all the converting factors are defined here
    let convFactor;
    if (conversion === 'length') {
        if (fromUnit === toUnit) convFactor = 1;
        else {
            if (fromUnit === 'in') {
                if (toUnit === 'cm') convFactor = 2.54;
                if (toUnit === 'ft') convFactor = (1/12);
                if (toUnit === 'm') convFactor = 0.0254;
                if (toUnit === 'km') convFactor = 0.0000254;
            }
            if (fromUnit === 'ft') {
                if (toUnit === 'cm') convFactor = 30.48;
                if (toUnit === 'in') convFactor = 12;
                if (toUnit === 'm') convFactor = 0.3048;
                if (toUnit === 'km') convFactor = 0.0003048;
            }
            if (fromUnit === 'cm') {
                if (toUnit === 'in') convFactor = 0.3937;
                if (toUnit === 'ft') convFactor = 0.03281;
                if (toUnit === 'm') convFactor = 0.01;
                if (toUnit === 'km') convFactor = 0.00001;
            }
            if (fromUnit === 'm') {
                if (toUnit === 'cm') convFactor = 100;
                if (toUnit === 'ft') convFactor = 3.281;
                if (toUnit === 'in') convFactor = 39.37;
                if (toUnit === 'km') convFactor = 0.001;
            }
            if (fromUnit === 'km') {
                if (toUnit === 'cm') convFactor = 100000;
                if (toUnit === 'ft') convFactor = 3280.84;
                if (toUnit === 'm') convFactor = 1000;
                if (toUnit === 'in') convFactor = 39370.1;
            }
        }    
    }
    if (conversion === 'mass') {
        if (fromUnit === toUnit) convFactor = 1;
        else {
            if (fromUnit === 'kg') {
                if (toUnit === 'g') convFactor = 1000;
                if (toUnit === 'lb') convFactor = 2.205;
                if (toUnit === 'oz') convFactor = 35.274;
                if (toUnit === 'stone') convFactor = 0.1575;
            }
            if (fromUnit === 'g') {
                if (toUnit === 'kg') convFactor = 0.001;
                if (toUnit === 'lb') convFactor = 0.002205;
                if (toUnit === 'oz') convFactor = 0.035274;
                if (toUnit === 'stone') convFactor = 0.0001575
            }
            if (fromUnit === 'lb') {
                if (toUnit === 'g') convFactor = 453.6;
                if (toUnit === 'kg') convFactor = 0.454;
                if (toUnit === 'oz') convFactor = 16;
                if (toUnit === 'stone') convFactor = 0.07143;
            }
            if (fromUnit === 'oz') {
                if (toUnit === 'g') convFactor = 28.35;
                if (toUnit === 'lb') convFactor = 0.0625;
                if (toUnit === 'kg') convFactor = 0.02835;
                if (toUnit === 'stone') convFactor = 0.00446;
            }
            if (fromUnit === 'stone') {
                if (toUnit === 'g') convFactor = 6350.29;
                if (toUnit === 'lb') convFactor = 14;
                if (toUnit === 'oz') convFactor = 224;
                if (toUnit === 'kg') convFactor = 6.35;
            }
        }    
    }
    if (conversion === 'temperature') {
        if (fromUnit === toUnit) convFactor = 1;
        else {
            if (fromUnit === 'C') {
                if (toUnit === 'K') convFactor = 'CtoK';
                if (toUnit === 'F') convFactor = 'CtoF';
            }
            if (fromUnit === 'K') {
                if (toUnit === 'C') convFactor = 'KtoC';
                if (toUnit === 'F') convFactor = 'KtoF';
            }
            if (fromUnit === 'F') {
                if (toUnit === 'K') convFactor = 'FtoK';
                if (toUnit === 'C') convFactor = 'FtoC';
            }
        }
    }
    if (conversion === 'speed') {
        if (fromUnit === toUnit) convFactor = 1;
        else {
            if (fromUnit === 'km/h') {
                if (toUnit === 'm/s') convFactor = 0.2778;
                if (toUnit === 'mph') convFactor = 0.6214;
                if (toUnit === 'knot') convFactor = 0.54;
                if (toUnit === 'ft/s') convFactor = 0.911;
            }
            if (fromUnit === 'm/s') {
                if (toUnit === 'km/h') convFactor = 3.6;
                if (toUnit === 'mph') convFactor = 2.237;
                if (toUnit === 'knot') convFactor = 1.944;
                if (toUnit === 'ft/s') convFactor = 3.281;
            }
            if (fromUnit === 'mph') {
                if (toUnit === 'm/s') convFactor = 0.447;
                if (toUnit === 'km/h') convFactor = 1.609;
                if (toUnit === 'knot') convFactor = 0.869;
                if (toUnit === 'ft/s') convFactor = 1.467;
            }
            if (fromUnit === 'knot') {
                if (toUnit === 'm/s') convFactor = 0.514;
                if (toUnit === 'mph') convFactor = 1.151;
                if (toUnit === 'km/h') convFactor = 1.852;
                if (toUnit === 'ft/s') convFactor = 1.688;
            }
            if (fromUnit === 'ft/s') {
                if (toUnit === 'm/s') convFactor = 0.305;
                if (toUnit === 'mph') convFactor = 0.682;
                if (toUnit === 'knot') convFactor = 0.593;
                if (toUnit === 'km/h') convFactor = 1.097;
            }
        }
    }
    return convFactor;
};

function selectMode(type) {     // for the modes --> simple or scientific for calculator and temp, length, mass etc. for converter
    document.getElementById('selection').checked = false;
    toggleMenu();
    clearValues();
    if (type === 'simple') {
        calcSimple();
    } else if (type === 'scientific') {
        calcScientific();
    } else {
        let u1, u2, u3, u4, u5;     // units for conversion which are used in converterMarkup function      
        conversion = type;

        // folowing if statements are for the respective markups to be added on the right side
        if (conversion === 'length') {
            u1 = 'in';
            u2 = 'ft';
            u3 = 'cm';
            u4 = 'm';
            u5 = 'km';
        }
        if (conversion === 'mass') {
            u1 = 'kg';
            u2 = 'g';
            u3 = 'lb';
            u4 = 'oz';
            u5 = 'stone';
        }
        if (conversion === 'temperature') {
            u1 = 'C';
            u2 = 'K';
            u3 = 'F';
            u4 = '';
            u5 = '';
        }
        if (conversion === 'speed') {
            u1 = 'km/h';
            u2 = 'm/s';
            u3 = 'mph';
            u4 = 'knot';
            u5 = 'ft/s';
        }
        getReadyForConversion(true);
        converterMarkup(u1, u2, u3, u4, u5); 
        showUnits();
    }
};

calcSimple();