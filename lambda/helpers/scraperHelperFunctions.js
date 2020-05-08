const { getLastPremiershipResultForTeam, getNextPremiershipFixtureForTeam } = require("./scrapers/premiershipScraper");
const { getLastSixNationsResultForTeam, getNextSixNationsFixtureForTeam } = require("./scrapers/sixNationsScraper")
const { LIST_OF_PREM_TEAMS, LIST_OF_SIX_NATIONS_TEAMS } = require("../constants");

const getNextFixtureForTeam = team => {
  return new Promise((resolve, reject) => {
    if (team) {
      if(LIST_OF_PREM_TEAMS.includes(team)) {
        return getNextPremiershipFixtureForTeam(team)
            .then(result => resolve(result))
            .catch(error => reject(error));
      }
      
      if (LIST_OF_SIX_NATIONS_TEAMS.includes(team)) {
        return getNextSixNationsFixtureForTeam(team)
            .then(result => resolve(result))
            .catch(error => reject(error));
      }
    }
    return reject("getNextFixtureForTeam: No Team provided");
  });
};

const getLastResultForTeam = team => {
 return new Promise((resolve, reject) => {
  if (team) {
    if(LIST_OF_PREM_TEAMS.includes(team)) {
        return getLastPremiershipResultForTeam(team)
            .then(result => resolve(result))
            .catch(error => reject(error));
    }
    
    if(LIST_OF_SIX_NATIONS_TEAMS.includes(team)) {
        return getLastSixNationsResultForTeam(team)
            .then(result => resolve(result))
            .catch(error => reject(error));
    }
  }
  return reject("getLastResultForTeam: No Team provided");
 });
};

module.exports = {
  getNextFixtureForTeam,
  getLastResultForTeam
};
