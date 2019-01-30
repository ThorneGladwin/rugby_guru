const rp = require("request-promise");
const $ = require("cheerio");
const { format, isBefore } = require("date-fns");
const { LIST_OF_TEAMS, MONTHS, PREM_FIXTURES_URL } = require("./constants");
let hasHome = false;
let hasAway = false;
let hasDate = false;
let fixture = {};
let allFixtures = [];

const processNodes = children => {
  if (children.type === "text" && children.data && (children.data !== "\n" && children.data !== "\n\n")) {
    const text = children.data;

    if (LIST_OF_TEAMS.includes(text)) {
      if (!hasHome) {
        fixture = {
          ...fixture,
          home: text
        };
        hasHome = true;
      } else if (!hasAway) {
        fixture = {
          ...fixture,
          away: text
        };
        hasAway = true;
      }
    } else {
      MONTHS.some(item => {
        if (text.includes(item)) {
          const dateFormat = new Date(text);
          const isPast = isBefore(dateFormat, new Date());
          fixture = {
            ...fixture,
            date: format(dateFormat, "DD-MM-YYYY"),
            isPast: isPast
          };
          hasDate = true;
          return true;
        }
      });
    }

    if (hasDate && hasHome && !hasAway && fixture.isPast && text.includes("–")) {
      const score = text.replace(/(\r\n|\n|\r)/gm, "");
      const [homeScore, awayScore] = score.split("–");
      fixture = {
        ...fixture,
        homeScore,
        awayScore
      };
    }

    if (hasHome && hasAway && hasDate) {
      allFixtures.push(fixture);
      fixture = {};
      hasHome = false;
      hasAway = false;
      hasDate = false;
    }
  }
  if (children.children && children.children.length > 0) {
    children.children.forEach(item => {
      processNodes(item);
    });
  }
};

const getAllFixtures = () => {
  rp(PREM_FIXTURES_URL)
    .then(function(html) {
      const elements = $('div[itemtype="http://schema.org/SportsEvent"]', html);
      for (i = 0; i < elements.length; i++) {
        processNodes(elements[i]);
      }
      // const northamptonFixtures = allFixtures.filter(item => item.home === "Northampton Saints" || item.away === "Northampton Saints");
      return allFixtures;
    })
    .catch(function(err) {
      console.error(err);
    });
};

module.exports = {
  getAllFixtures
};
