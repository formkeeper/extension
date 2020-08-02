import i18n from "../utils/i18n";

const msSec = 1000;
const msMin = msSec * 60;
const msHour = msMin * 60;
const msDay = msHour * 24;

/**
 * round takes a `n` parameter and rounds the number to 2 decimals. Keep in
 * mind the javascript floating point issues and don't use it for anything
 * that requires precision.
 *
 * @param {Number} n
 * @returns {Number}
 */
function round(n) {
  return +parseFloat(n).toFixed(2);
}

function prettify(n) {
  // remove decimals if any (2.02 => 2)
  return parseInt(n);
}

function prettifyDoubleDigits(n) {
  // prepend 0 and return last two numbers (8 => 08, 20 => 20)
  return ("0"+ n).slice(-2);
}

class TimeFormatter {
  /**
  * TimeFormatter takes two dates: the required date to be formatted and an
  * optional comparedDate (by default the current date). Then TimeFormatter
  * will prettify the given date diffing it with the comparedDate.
  *
  * TimeFormatter is opiniated as is coded for this use case:
  * - It's meant to be used for short-term times, so no "months" or "years" are
  * present.
  * - It's meant to be used for a history, so "tomorrow" is not present.
  *
  * Tweaking this for other use cases should be rudimentary.
  *
  * e.g. If comparedDate and Date only have a few minutes of difference it'll
  * return "X seconds ago".
  *
  * Options obj:
  * - HOUR_SEPARATOR: separtor between hours and minutes (defaults to `:`)
  *
  * @param {Date} date - date to be formatted
  * @param {Object} opts - Options object to use.
  *
  */
  constructor(date, opts) {
    this._date = date;
    this._opts = {
      HOUR_SEPARATOR: ":",
    };

    if (opts) {
      this._applyOpts(opts);
    }
  }

  _applyOpts(opts) {
    this._opts = {
      ...this._opts,
      ...opts,
    };
  }

  getDiff(compareDate) {
    const diff = Math.abs(compareDate - this._date);
    return {
      days: round(diff/msDay),
      hours: round(diff/msHour),
      mins: round(diff/msMin),
      secs: round(diff/msSec),
      ms: diff,
    };
  }

  /**
   * getPrettyString diffs date with compareDate and returns a pretty time
   * string. getPrettyString Uses chrome i18n locales.
   *
   * @param {Date} [compareDate] - optional date to diff the actual date with.
   * Defaults to current date.
   *
   * e.g. inputs/outputs:
   * <pre>- Date Object (set to 2/3/20 13:00) and compareDate Object (set to
   * 2/3/20 11:00) will return: `2 hours ago`.</pre>
   * <pre>- Date Object (set to 2/3/20 13:01) and compareDate Object (set to
   * 2/3/20 13:00) will return: `a minute ago`.</pre>
   * <pre>- Date Object (set to 6/3/20 8:05) and compareDate Object (set to
   * 2/3/20 13:00) will return: `6/3 8:05`.</pre>
   */
  getPrettyString(compareDate) {
    const diff = this.getDiff(compareDate || new Date());

    if (1 < diff.days && diff.days < 2) {
      return i18n.get(i18n.vars.yesterday);

    } else if (1 < diff.hours && diff.hours < 24) {
      if (diff.hours < 2) {
        return i18n.get(i18n.vars.one_hour_ago);
      }
      return i18n.get(i18n.vars.hours_ago, prettify(diff.hours));

    } else if (1 < diff.mins && diff.mins < 60) {
      if (diff.mins < 2) {
        return i18n.get(i18n.vars.one_min_ago);
      }
      return i18n.get(i18n.vars.mins_ago, prettify(diff.mins));

    } else if (1 < diff.secs && diff.secs < 60) {
      if (diff.secs < 2) {
        return i18n.get(i18n.vars.one_sec_ago);
      }
      return i18n.get(i18n.vars.secs_ago, prettify(diff.secs));

    } else if (0 < diff.ms && diff.ms < 1000) {
      return i18n.get(i18n.vars.just_now);

    } else {
      const d = this._date;
      const [day, month, hours, mins] = [
        d.getDate(), d.getMonth(), d.getHours(), d.getMinutes()
      ];

      const hhSep = this._opts.HOUR_SEPARATOR;
      const prettyMins = prettifyDoubleDigits(mins);
      const dayAndMonth = i18n.get(i18n.vars.day_and_month, day, month);
      return `${dayAndMonth} ${hours}${hhSep}${prettyMins}`;
    }
  }
}

export default TimeFormatter;