import SPELLS from 'common/SPELLS';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import EventEmitter from 'parser/core/modules/EventEmitter';
import Combatants from 'parser/shared/modules/Combatants';

import { BEACON_TYPES } from '../../constants';

const BEACONS = Object.values(BEACON_TYPES);

const debug = false;

class BeaconTargets extends Analyzer {
  static dependencies = {
    eventEmitter: EventEmitter,
    combatants: Combatants,
  };

  currentBeaconTargets = [];
  maxBeacons = 1;

  hasBeacon(playerId) {
    return this.currentBeaconTargets.includes(playerId);
  }
  get numBeaconsActive() {
    return this.currentBeaconTargets.length;
  }
  get numMaxBeacons() {
    return this.maxBeacons;
  }

  constructor(options) {
    super(options);
    if (this.selectedCombatant.hasTalent(SPELLS.BEACON_OF_FAITH_TALENT.id)) {
      this.maxBeacons = 2;
    } else if (this.selectedCombatant.hasTalent(SPELLS.BEACON_OF_VIRTUE_TALENT.id)) {
      this.maxBeacons = 4;
    }

    this.addEventListener(Events.applybuff.by(SELECTED_PLAYER), this.onApplyBuff);
    this.addEventListener(Events.removebuff.by(SELECTED_PLAYER), this.onRemoveBuff);
  }

  onApplyBuff(event) {
    const spellId = event.ability.guid;
    if (!BEACONS.includes(spellId)) {
      return;
    }
    const targetId = event.targetID;
    if (!this.currentBeaconTargets.includes(targetId)) {
      this.currentBeaconTargets.push(targetId);
      debug &&
        console.log(
          `%c${this.combatants.players[targetId].name} gained a beacon`,
          'color:green',
          this.currentBeaconTargets,
        );
      this.eventEmitter.fabricateEvent(
        {
          type: 'beacon_applied',
          timestamp: event.timestamp,
          sourceID: event.sourceID,
          targetID: event.targetID,
        },
        event,
      );
    } else {
      debug &&
        console.error(
          `Trying to assign a beacon to ${
            this.combatants.players[event.sourceID].name
          }, but he already has one.`,
          this.currentBeaconTargets,
        );
    }
  }
  onRemoveBuff(event) {
    const spellId = event.ability.guid;
    if (!BEACONS.includes(spellId)) {
      return;
    }
    const targetId = event.targetID;
    this.currentBeaconTargets = this.currentBeaconTargets.filter((id) => id !== targetId);
    debug &&
      console.log(
        `%c${this.combatants.players[targetId].name} lost a beacon`,
        'color:red',
        this.currentBeaconTargets,
      );
    this.eventEmitter.fabricateEvent(
      {
        type: 'beacon_removed',
        timestamp: event.timestamp,
        sourceID: event.sourceID,
        targetID: event.targetID,
      },
      event,
    );
  }
}

export default BeaconTargets;
