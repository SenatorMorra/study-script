// system
import detect_command from "./engine/system/detect_command.js";
import catch_error from "./engine/system/catch_error.js";
import garbage_collector from "./engine/system/garbage_collector.js";
import no_comments from "./engine/system/no_comments.js";

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

export default class Study_Script {
  #storage;

  constructor() {
    this.#storage = {};
    this.is_start = {
      status: false,
    };
    this.ignore = {
      status: false,
      deep_ignore: [],
    };

    // system
    this.detect_command = detect_command;
    this.catch_error = catch_error;
    this.garbage_collector = garbage_collector;
    this.no_comments = no_comments;

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
  }

  run(code) {
    let time = new Date().valueOf();

    code = code.split("\n");
    for (let i = 0; i < code.length; i++) {
      let line = this.no_comments(code[i]);
      line = line.split(" ");

      let status = this.detect_command(
        line,
        this,
        this.#storage,
        this.is_start,
        this.ignore
      );
      if (status === "finish") break;
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
