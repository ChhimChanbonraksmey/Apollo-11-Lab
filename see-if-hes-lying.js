/**
 * Modern translation of P63SPOT3/P63SPOT4 from THE_LUNAR_LANDING.agc.
 *
 * Each dependency represents hardware or crew interaction that the original
 * Apollo Guidance Computer accessed through channels and bank-called routines.
 */
async function prepareLandingRadar({
  isAntennaInPosition1,
  requestAstronautAction,
  initializeLandingRadar,
  startIgnitionSequence,
}) {
  while (true) {
    // IS THE LR ANTENNA IN POSITION 1 YET
    if (await isAntennaInPosition1()) {
      // BRANCH IF ANTENNA ALREADY IN POSITION 1
      break;
    }

    // ASTRONAUT: PLEASE CRANK THE
    // SILLY THING AROUND
    const action = await requestAstronautAction("00500");

    if (action === "TERMINATE") {
      // TERMINATE
      return { status: "terminated" };
    }

    if (action === "PROCEED") {
      // PROCEED SEE IF HE'S LYING
      continue;
    }

    if (action === "ENTER") {
      break;
    }

    throw new Error(`Unknown astronaut action: ${action}`);
  }

  // ENTER INITIALIZE LANDING RADAR
  await initializeLandingRadar();

  // OFF TO SEE THE WIZARD...
  return startIgnitionSequence();
}

module.exports = { prepareLandingRadar };
