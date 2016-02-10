/*
 * Это простой редактор JavaScript.
 *
 * Введите JavaScript, затем щёлкните правой кнопкой или выберите из меню Выполнить:
 * 1. Запустить, чтобы исполнить выделенный текст (Ctrl+R),
 * 2. Исследовать, чтобы вызвать для результата Инспектор Объектов (Ctrl+I), или,
 * 3. Отобразить, чтобы вставить результат в комментарий после выделения. (Ctrl+L)
 */"use strict";
var digits = '0123456789';
var letters = 'abcdefghijklmnopqrstuvwxyz';
letters += letters.toUpperCase();
letters += '_$';
var quotes = '\'"';
var alphabeth = letters + digits;
var spaces = ' \t';
var is_log = false;

function returnHash(str) {
    var i = 0;
    var h = {
    };
    for (i = 0;i < str.length;i++)
        h[str[i]] = true;
    return h;
}

digits = returnHash(digits);
letters = returnHash(letters);
quotes = returnHash(quotes);
alphabeth = returnHash(alphabeth);
spaces = returnHash(spaces);
dividers = {
    ";" : true, "," : true
};

function getDivider(string, beg) {
    var i = beg;
    var res = {
    };
    while (alphabeth[string[i]]) {
        i++;
    }
    res = string.slice(beg, i);
    return {value : res, index : i, type : 'divider', error : ''}

}

function getWord(string, beg) {
    var i = beg;
    var res = {
    }
    while (alphabeth[string[i]]) {
        i++;
    }
    res = string.slice(beg, i);
    return {value : res, index : i, type : 'word', error : ''}
}

function getInteger(string, beg) {
    var i = beg;
    var res = '';
    while (digits[string[i]]) {
        i++;
    }
    res = string.slice(beg, i);
    return {value : res, index : i, type : 'number', subtype : 'integer', error : ''}
}

function getLiteral(string, beg) {
    var i = beg;
    var quot = string[beg];
    var curr = string[beg];
    var prev = '';
    var quote_closed = false;
    var string_ended = false;
    var error = '';
    while (!((string_ended || quote_closed))) {
        if (is_log)
            console.log('getLiteral: ' + i + " |" + string[i] + "| " + string_ended + " " + quote_closed);
        prev = string[i];
        i++;
        var backslash = "\\";
        curr = string[i];
        if (curr == backslash) {
            i++;
            prev = curr;
        }
        else if ((curr == quot) && (prev != backslash)) {
            if (is_log)
                console.log("getLiteral:quotemode curr = " + curr + " prev = " + prev)
            quote_closed = true;
            i++
        }
        if (i >= string.length) {
            error = "literal not ended"
            string_ended = true;
        }

    }
    // of while
    var res = string.slice(beg, i);
    res.error = '';
    if (!quote_closed)
        res.error = 1;
    res = {
        value : res, index : i, type : 'literal'
    };
    //if (!quote_closed) 
    res.error = error;

    return res;
}

function getElements(string) {
    var i = 0, prev_index = 0;
    var elements = [];
    var result = {
        elements : elements, error : false
    };
    var res = '';

    while (i < string.length) {
        while (spaces[string[i]])
            i++;
        if (is_log)
            console.log("getElements:index of " + i + " letter is " + string[i]);
        prev_index = i;
        res = {
        };
        if (!spaces[string[i]]) {
            if (letters[string[i]]) {
                res = getWord(string, i);

            }
            else if (quotes[string[i]]) {
                res = getLiteral(string, i);

            }
            else if (digits[string[i]]) {
                res = getInteger(string, i);
            }
            else if (dividers[string[i]]) {
                res = getDividers(string, i);
            }

            if (res.error != '') {
                result.error = res.error;

            }

            if ((!res.hasOwnProperty('value'))) {
                result.error = true;
                result.error = 'undefined position at ' + i;
                return result;

            }
            elements.push(res);
            i = res.index;
        };

    }
    return result;
}

var str = 'mov eax, 01 "Landmard of \\\" Sir \\\"  " 233\"';
console.log(getElements(str))

/*
Exception: SyntaxError: expected expression, got ';'
@Scratchpad/1:37
*/