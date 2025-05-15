// system
import detect_command from "./engine/system/detect_command.js";
import strict_policy from './engine/system/strict_policy.js';
import catch_error from "./engine/system/catch_error.js";
import garbage_collector from "./engine/system/garbage_collector.js";
import no_comments from "./engine/system/no_comments.js";
import computer from './engine/system/computer.js';

// commands
import log from "./engine/command/log.js";
import new_variable from "./engine/command/new.js";
import set_variable from "./engine/command/set.js";
import delete_variable from "./engine/command/delete.js";
import start from "./engine/command/start.js";
import if_sentence from "./engine/command/if.js";
import close from "./engine/command/close.js";
import else_sentence from "./engine/command/else.js";
import finish from "./engine/command/finish.js";
import loop from "./engine/command/loop.js";
import end from "./engine/command/end.js";

export default class Study_Script {
  #storage;
  #loops;

  constructor() {
    this.setup = new computer();

    this.#storage = this.setup.storage();
    this.#loops = this.setup.loops();
    this.is_start = this.setup.is_start();
    this.ignore = this.setup.ignore();

    // system
    this.detect_command = detect_command;
    this.catch_error = catch_error;
    this.garbage_collector = garbage_collector;
    this.no_comments = no_comments;
    this.strict_policy = strict_policy;

    // commands
    this.log = log;
    this.new = new_variable;
    this.set = set_variable;
    this.delete = delete_variable;
    this.start = start;
    this.if = if_sentence;
    this.close = close;
    this.else = else_sentence;
    this.finish = finish;
    this.loop = loop;
    this.end = end;
  }

  run(code) {
    let time = new Date().valueOf();

    code = code.split("\n");
    for (let i = 0; i < code.length; i++) {
      let line = this.no_comments(code[i]);
      let correct_syntax = this.strict_policy(line);

      if (this.catch_error(correct_syntax, i + 1, line)) {
        return false;
      }

      if (
        this.ignore.ignore_until != false &&
        this.ignore.ignore_until.indexOf(line) == -1
      ) {
        continue;
      }

      line = line.split(" ");

      let status = this.detect_command(
        i,
        line,
        this,
        this.#storage,
        this.#loops,
        this.is_start,
        this.ignore
      );
      if (status === "finish") {
        this.#storage = this.setup.storage();
        this.#loops = this.setup.loops();
        this.is_start = this.setup.is_start();
        this.ignore = this.setup.ignore();
        break;
      }
      if (typeof status == "number") i = status;
      if (this.catch_error(status, i + 1, line)) {
        return false;
      }
    }

    console.log("\x1b[32m", "> program finished");
    console.log(
      "\x1b[32m",
      `\tcompilation time: ${new Date().valueOf() - time}ms.`
    );
    console.log(
      "\x1b[32m",
      `\tforgotten garbage size: ${this.garbage_collector(this.#storage)} bites`
    );

    return true;
  }
}

function translate(studyscript) {
    const js = [];
    const lines = studyscript.split('\n');
    let indentLevel = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue; // пропуск пустых строк и комментов

        const parts = trimmed.split(' ');
        const command = parts[0];
        const indent = '  '.repeat(indentLevel); // отступ

        switch (command) {
            case 'start':
            case 'delete':
            case 'finish':
                break;

            case 'new':
                if (parts.length >= 3) {
                    js.push(`${indent}let ${parts[1]};`);
                }
                break;

            case 'set':
                if (parts.length >= 3) {
                    const value = parts.slice(2).join(' ');
                    js.push(`${indent}${parts[1]} = ${value};`);
                }
                break;

            case 'log':
                if (parts.length >= 3) {
                    const value = parts.slice(2).join(' ');
                    js.push(`${indent}console.log(${value});`);
                }
                break;

            // if {
            case 'if':
                if (parts.length >= 2) {
                    const condition = parts.slice(1).join(' ');
                    js.push(`${indent}if (${condition}) {`);
                    indentLevel++; // Увеличиваем отступ для тела if
                }
                break;

            // loop -> while {
            case 'loop':
                if (parts.length >= 2) {
                    const condition = parts.slice(1).join(' ');
                    js.push(`${indent}while (${condition}) {`);
                    indentLevel++; // Увеличиваем отступ для тела цикла
                }
                break;

            // Закрытие блоков (if/loop) -> }
            case 'close':
            case 'end':
                indentLevel = Math.max(0, indentLevel - 1); // Уменьшаем отступ
                js.push(`${'  '.repeat(indentLevel)}}`);
                break;

            // Блок else -> } else {
            case 'else':
                indentLevel = Math.max(0, indentLevel - 1);
                js.push(`${'  '.repeat(indentLevel)}} else {`);
                indentLevel++;
                break;

            default:
                js.push(`${indent}${trimmed}`);
        }
    }

    return js.join('\n');
}
function reverseTranslate(javascriptCode) {
    const lines = javascriptCode.split('\n');
    const output = ['start'];
    let loopCounter = 0;
    const variables = new Set();

    // Обработка объявлений переменных
    function processDeclaration(line) {
        const varMatch = line.match(/(let|var|const)\s+(\w+)\s*=\s*(.+);?/);
        if (!varMatch) return false;

        const [, , varName, value] = varMatch;
        variables.add(varName);

        // Определяем тип
        let type = 'number';
        if (value.includes('"') || value.includes("'") || value.includes('new String')) {
            type = 'string';
        }

        output.push(`new ${varName} ${type}`);
        output.push(`set ${varName} ${value.replace(/['"new String\(\)]/g, '').trim()}`);
        return true;
    }

    // Обработка циклов
    function processLoop(line) {
        const whileMatch = line.match(/while\s*\((.+)\)\s*\{/);
        if (!whileMatch) return false;

        const condition = whileMatch[1];
        output.push(`loop loop_${loopCounter} ${condition}`);
        loopCounter++;
        return true;
    }

    // Обработка условий
    function processIf(line) {
        const ifMatch = line.match(/if\s*\((.+)\)\s*\{/);
        if (!ifMatch) return false;

        output.push(`if ${ifMatch[1]}`);
        return true;
    }

    // Обработка console.log
    function processLog(line) {
        const logMatch = line.match(/console\.log\((.+)\);?/);
        if (!logMatch) return false;

        const content = logMatch[1];
        let type = 'number';
        if (content.includes('"') || content.includes("'")) {
            type = 'string';
        }

        output.push(`log ${type} ${content}`);
        return true;
    }

    // Основной цикл обработки
    for (let line of lines) {
        line = line.trim();
        if (!line) continue;

        // Пропускаем комментарии
        if (line.startsWith('//')) {
            output.push(`# ${line.substring(2).trim()}`);
            continue;
        }

        // Обработка конструкций
        if (processDeclaration(line)) continue;
        if (processLoop(line)) continue;
        if (processIf(line)) continue;
        if (processLog(line)) continue;

        // Обработка закрывающих скобок
        if (line === '}') {
            output.push('end');
            continue;
        }

        // Обработка присваиваний
        const assignmentMatch = line.match(/(\w+)\s*=\s*(.+);?/);
        if (assignmentMatch && variables.has(assignmentMatch[1])) {
            output.push(`set ${assignmentMatch[1]} ${assignmentMatch[2]}`);
            continue;
        }

        // Если не распознано, оставляем как есть
        output.push(`# ${line}`);
    }

    // Добавляем delete для всех переменных
    variables.forEach(varName => {
        output.push(`delete ${varName}`);
    });

    output.push('finish');
    return output.join('\n');
}


console.log(reverseTranslate(code));
