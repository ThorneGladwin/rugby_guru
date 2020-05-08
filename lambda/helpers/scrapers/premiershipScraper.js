const rp = require("request-promise");
const $ = require("cheerio");
const { format, isBefore, min, max, isValid } = require("date-fns");
const { LIST_OF_PREM_TEAMS, MONTHS, PREM_FIXTURES_URL } = require("../../constants");
let hasHome = false;
let hasAway = false;
let hasDate = false;
let hasScore = false;
let fixture = {};
let allFixtures = [];

const processNodes = children => {
  if (children.type === "text" && children.data && (children.data !== "\n" && children.data !== "\n\n")) {
    const textBlock = children.data;

    if (!hasHome || !hasAway) {
      if (LIST_OF_PREM_TEAMS.includes(textBlock)) {
        if (!hasHome) {
          fixture = {
            ...fixture,
            home: textBlock
          };
          hasHome = true;
        } else if (!hasAway) {
          fixture = {
            ...fixture,
            away: textBlock
          };
          hasAway = true;
        }
      }
    }

    if (!hasDate) {
      MONTHS.some(month => {
        if (textBlock.includes(month)) {
          const date = new Date(textBlock);
          if (isValid(date)) {
            const isPast = isBefore(date, new Date());
            fixture = {
              ...fixture,
              date: format(date, "DD-MM-YYYY"),
              isPast: isPast
            };
            hasDate = true;
            return true;
          }
        }
      });  
    }

    if (!hasScore) {
      if (textBlock.includes("–")) {
        let score = textBlock.replace(/(\r\n|\n|\r)/gm, "");
        const [homeScore, awayScore] = score.split("–");
        
        if (/\d/.test(homeScore) && /\d/.test(awayScore)){
          fixture = {
            ...fixture,
            homeScore,
            awayScore
          };
          hasScore = true;
        }
      }
    }

    if (hasHome && hasAway && ((hasDate && fixture.isPast && hasScore) || hasDate && !fixture.isPast)) {
      allFixtures.push(fixture);
      fixture = {};
      hasHome = false;
      hasAway = false;
      hasDate = false;
      hasScore = false;
    }
  }

  if (children.children && children.children.length > 0) {
    children.children.forEach(item => {
      processNodes(item);
    });
  }
};

const getPremiershipFixturesForTeam = team => {
  if (team) {
    return rp(PREM_FIXTURES_URL)
    .then(function(html) {
      const elements = $('div[itemtype="http://schema.org/SportsEvent"]', html);
      for (i = 0; i < elements.length; i++) {
        processNodes(elements[i]);
      }
      return allFixtures.filter(item => item.home === team || item.away === team);
    })
    .catch(function(err) {
      console.error(err);
      return [];
    });
  }
  console.error("getFixturesForTeam: No Team provided");
  return [];
};

const getNextPremiershipFixtureForTeam = team => {
  return new Promise((resolve, reject) => {
    if (team) {
      return getPremiershipFixturesForTeam(team)
        .then(allFixtures => {
          const nextFixtures = allFixtures.filter(i => !i.isPast);
          let dates = [];
          nextFixtures.forEach(fixture => {
            let [day, month, year] = fixture.date.split("-");
            dates.push(new Date(`${year}/${month}/${day}`));
          });
          const nextFixtureDate = min(...dates);
          const nextFixtureDateFormatted = format(nextFixtureDate, "DD-MM-YYYY");
          const nextFixture = nextFixtures.find(i => i.date === nextFixtureDateFormatted);
          return resolve(nextFixture);
        })
        .catch(error => {
          return reject(error);
        });
    }
    return reject("getNextPremiershipFixtureForTeam: No Team provided");
  });
};

const getLastPremiershipResultForTeam = team => {
 return new Promise((resolve, reject) => {
  if (team) {
    return getPremiershipFixturesForTeam(team)
      .then(allFixtures => {
        const results = allFixtures.filter(i => i.isPast);
        let dates = [];
        results.forEach(fixture => {
          let [day, month, year] = fixture.date.split("-");
          dates.push(new Date(`${year}/${month}/${day}`));
        });
        const lastResultDate = max(...dates);
        const lastResultDateFormatted = format(lastResultDate, "DD-MM-YYYY");
        const lastResult = results.find(i => i.date === lastResultDateFormatted);
        return resolve(lastResult);
      })
      .catch(error => {
        return reject(error);
      });
  }
  return reject("getLastPremiershipResultForTeam: No Team provided");
 });
};

module.exports = {
  getNextPremiershipFixtureForTeam,
  getLastPremiershipResultForTeam
};
