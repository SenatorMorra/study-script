const available_variable = '_0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.split('');
const available_number = '0123456789'.split('');

function check_variable_name(name) {
    if (available_number.indexOf(name[0]) != -1) return name;

    name = name
        .split('')
        .filter(x => {
            return available_variable.indexOf(x) == -1;
        })
        .join('');

    return name;
}

function check_number(number) {
    if (number[0] == '0') return number;

    number = number
        .split('')
        .filter(x => {
            return available_number.indexOf(x) == -1;
        })
        .join('');

    return number;
}

function check(sentence, command, type) {
    if (command == 'log') {
        if (type == 'string') {
            let missed_concat = new String(sentence);
            missed_concat = missed_concat.split('>>');
            for (let i = 0; i < missed_concat.length; i++) {
                while (missed_concat[i][0] == ' ') missed_concat[i] = missed_concat[i].slice(1);
                while (missed_concat[i].at(-1) == ' ') missed_concat[i] = missed_concat[i].slice(0, missed_concat[i].length - 1);
                if (missed_concat[i][0] == '"' && missed_concat[i].at(-1) == '"') {} // text
                if (missed_concat[i].indexOf(' ') != -1) return [false, 's007_0'];
            }

            sentence = sentence.replaceAll(' ', '').split('>>');
            for (let i = 0; i < sentence.length; i++) {
                if (sentence[i][0] == '"' && sentence[i].at(-1) == '"') {} // "text"
                else { // variable
                    if (check_variable_name(sentence[i]) != '') return [false, 's006_0'];
                }
            }
            
            return true;
        } else if (type == 'number') {
            let missed_concat = new String(sentence);
            missed_concat = missed_concat
                .split('+')
                .join('?')
                .split('-')
                .join('?')
                .split('?');
            for (let i = 0; i < missed_concat.length; i++) {
                while (missed_concat[i][0] == ' ') missed_concat[i] = missed_concat[i].slice(1);
                while (missed_concat[i].at(-1) == ' ') missed_concat[i] = missed_concat[i].slice(0, missed_concat[i].length - 1);
                if (missed_concat[i].indexOf(' ') != -1) return [false, 's007_1'];
            }

            sentence = sentence.replaceAll(' ', '')
                .split('+')
                .join('?')
                .split('-')
                .join('?')
                .split('?');
            
            for (let i = 0; i < sentence.length; i++) {
                if (!(check_number(sentence[i]) != -1 || check_variable_name(sentence[i]) != -1)) return [false, 's006_1'];
            }
            return true;
        } else return [false, 's001'];
    } else if (command == 'set') {
        sentence = sentence
            .split('-')
            .join('?')
            .split('+')
            .join('?')
            .split('?');
        
        for (let i = 0; i < sentence.length; i++) {
            while (sentence[i][0] == ' ') sentence[i] = sentence[i].slice(1);
            while (sentence[i].at(-1) == ' ') sentence[i] = sentence[i].slice(
                0,
                sentence[i].length - 1
            );

            if (sentence[i][0] == '"' && sentence[i].at(-1) == '"') {} // text
            else {
                if (sentence[i].indexOf(' ') != -1) return [false, 's208'];
                if (!(check_number(sentence[i]) != -1 || check_variable_name(sentence[i]) != -1)) return [false, 's207'];
            }
        }

        return true;
    }

    return [false, undefined];
}

export default function strict_policy(line) {
    line = line.split(' ');

    switch (line[0]) {
        case "":
            return true;
        case undefined:
            return true;
        case "log":
            if (['number', 'string'].indexOf(line[1]) == -1) return [false, 's001'];
            return check(line.slice(2).join(' '), line[0], line[1]);
        case "new":
            if (line.length != 3) return [false, 's104'];
            if (['number', 'string'].indexOf(line.at(-1)) == -1) return [false, 's102'];
            if (check_variable_name(line[1]) != '') return [false, 's105'];
            return true;
        case "set":
            if (check_variable_name(line[1]) != '') return [false, 's207'];
            return check(line.slice(2).join(' '), line[0]);
        case "delete":
            if (line.length != 2) return [false, 's303'];
            if (check_variable_name(line[1]) != '') return [false, 's304'];
            return true;
        case "start":
            if (line.length != 1) return [false, 's401'];
            return true;
        case "if":
            // #inwork
            return true;
        case "close":
            // #inwork
            return true;
        case "else":
            if (line.length != 1) return [false, 's701'];
            return true;
        case "finish":
            if (line.length != 1) return [false, 's801']
            return true;
        case "loop":
            // #inwork
            return true;
        case "end":
            // #inwork
            return true;
        default:
            return [false, 's0'];
    }
}