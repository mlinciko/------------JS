//объявляем переменные
let firstNum ="" ;
let secondNum = "";
let operation = "";
//максимальное допустмое и минимальное допустимое значение вычислений
const max = Number.MAX_SAFE_INTEGER;
const min = Number.MIN_SAFE_INTEGER;
//список ошибок
let errors = [
  'Ошибка 1: целая часть содержит не больше 7 цифр!',
  'Ошибка 2: дробная часть содержит не больше 2 цифр!',
  'Ошибка 3: деление на 0 запрещено!',
  `Ошибка 4: максимальное значение вычислений не больше ${max}`,
  `Ошибка 5: минимальное значение вычислений не меньше ${min}`
]
//получаем ссылку на поле ввода
let input = document.querySelector('input');
//перемеенная хранит значение в поле ввода
let value;
//переменная хранит массив, содержащий в первом элементе целую часть чсила, во втором - дробную
let parts;
//переменные хранят целую и дробную части числа соответственно
let integerPart, fractionalPart;

//событие для кнопки "С"
document.getElementById('clear').onclick = function() {location.reload()};

//создаем событие для кнопок
document.querySelectorAll('button').forEach(function (button) { button.addEventListener('click', function(e){
  switch(e.target.className){
    case 'digit':
      digitHandler(e.target);
      break;
    case 'operation':
      operationHandler(e.target);
      break;
    case 'equal':
      equalHandler(e.target);
      break;
    case 'dot':
      dotHandler(e.target);
      break;
    case 'clear__end':
      clear(e.target);
      break;
    default:
      break;
  }
} )});

//обработчик ввода числа
function digitHandler(event){
  //если число не было введено
  if (input.getAttribute('value') === '0'){
    input.setAttribute('value', `${event.innerHTML}`);
    return;
  }
  value = `${input.getAttribute('value')}${event.innerHTML}`;


  //проверяем валидность числа
  let valid = validateNumber(value)
  switch(valid){
    case 0:
      //выводим число в поле
      input.setAttribute('value', `${value}`);
      break;
    case 1:
      alert(errors[0]);
      break;
    case 2:
      alert(errors[1]);
      break;
  }
}

//обработчик ввода операции
function operationHandler(event){
  value = input.getAttribute('value');

  switch(value){
    case '':
      if (event.innerHTML === '-')
        input.setAttribute('value', '-');
      break;
    case '+':
    case '-':
    case '*':
    case '/':
      if (event.innerHTML === '-')
        input.setAttribute('value', `${value}(-`);
      break;
    case '0':
      if (event.innerHTML === '-')
        input.setAttribute('value', '-');
    default:
      operation = event.innerHTML;
      //убираем лишние знаки перед числом и задаем значения для первого операнда
      firstNum = getClearNumber(value, true);
      //выводим знак текущей операции
      input.setAttribute('value', operation);
      break;
  }


}

//обработчик ввода равно
function equalHandler(event){
  value = input.getAttribute('value');

  //если поле не пустое и первый операнд был введен
  if (value.match(/\d/g) !== null && firstNum !== ""){
    //убираем лишние знаки перед числом и задаем значение для второго операнда
    secondNum = getClearNumber(value, false);

    //производим арифметическую операцию
    let res = calculate(firstNum, secondNum, operation);
    //если была попытка разделить на 0
    if(res === ""){
      alert(errors[2]);
      input.setAttribute('value', '0');
      firstNum = "";
      secondNum = "";
      return;
    }
    //если полученное значение не соответствует требованиям о количестве цифр
    if(roundNumber(res) === ""){
      input.setAttribute('value', '0');
      firstNum="";
      secondNum="";
      return;
    }
    //выводим округленное число в поле
    else input.setAttribute('value', `${roundNumber(res)}`);
  }
  else return;
}

//обработчик ввода запятой
function dotHandler(event){
  value = input.getAttribute('value');
  //число в поле содержит "."
  if (value.indexOf('.') !== -1)
    return;
  switch(value){
    case '0':
      input.setAttribute('value', "0.");
      break;
    case '-':
      input.setAttribute('value', "-0.");
      break;
    default:
      input.setAttribute('value', `${value}.`);
      break;
  }
}

//очищение поля ввода
function clear(event){
  value = input.getAttribute('value');
  switch(value){
    case '0':
      break;
    case value.length === 1 ? value : "":
      input.setAttribute('value', '0');
      break;
    default:
      input.setAttribute('value', value.slice(0, value.length - 1));
      break;
  }
}

//функция проверяет валидность числа
function validateNumber(num){
  parts = getParts(num);
  //получаем целую и дробную часть числа
  integerPart = parts[0];
  fractionalPart = parts[1];

  if ((integerPart.length > 8 && integerPart.indexOf('-') !== -1) || 
  (integerPart.length > 7 && integerPart.indexOf('-') === -1))
    return 1;
  else if(fractionalPart.length > 2)
    return 2;
  else return 0;
}

//функция возвращает массив состоящий из двух элементов: целая и дробная часть числа
function getParts(num){

  integerPart = "";
  fractionalPart ="";

  //очищаем число от лишних символов
  num = getClearNumber(num);

  //если в числе есть символ "."
  if(num.indexOf('.') !== -1){
    //после "." есть числа
    if(num.indexOf('.') !== num.length-1){
      fractionalPart = num.slice(num.indexOf('.')+1);
    }
    integerPart = num.slice(0, num.indexOf('.'));
  }
  else integerPart = num;

  if(integerPart !== "" && fractionalPart !== ""){
    return [integerPart, fractionalPart];
  }
  else return [integerPart,""];
}

//функция убирающая лишние символы с начала числа
function getClearNumber(num, isFirst){

  if(num.charAt(1) === "(")
    return num.slice(2);
  else if (num.charAt(0) === '*' || num.charAt(0) === '/' || num.charAt(0) === '+' || num.charAt(0) === '-'){
    if (isFirst && num.charAt(0) === '-')
      return num;
    return num.slice(1);
  }
  return num;
}

//функция, выполняющая арифметическую операцию
function calculate(a, b, operation){
  a = Number(a);
  b = Number(b);

  switch(operation){
    case '+':
      return a + b;
      break;
    case '-':
      return a - b;
      break;
    case '*':
      return a * b;
    case '/':
      if(b == 0) {
        return "";
      }
      else return a / b;
      break;
  }
}

//функция, округляющая число
function roundNumber(num){
  parts = getParts(String(num));
  //записываем целую часть числа и дробную в разные переменные
  integerPart = parts[0];
  fractionalPart = parts[1];
  //полученное число слишком большое, либо слишком маленькое
  if (Number(integerPart) > max || Number(fractionalPart) > max){
    alert(errors[3]);
    return "";
  }
  else if (Number(integerPart) < min || Number(fractionalPart) < min){
    alert(errors[4]);
    return "";
  }
  //округление дробной части
  else if(fractionalPart.length > 2){
    //округляем число
    num = String(num.toFixed(2));
  }
  return num;
}


