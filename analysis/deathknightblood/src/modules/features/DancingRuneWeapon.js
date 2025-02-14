import { t } from '@lingui/macro';
import SPELLS from 'common/SPELLS';
import COVENANTS from 'game/shadowlands/COVENANTS';
import { SpellLink } from 'interface';
import Analyzer, { SELECTED_PLAYER } from 'parser/core/Analyzer';
import Events from 'parser/core/Events';
import Abilities from 'parser/core/modules/Abilities';
import SpellUsable from 'parser/shared/modules/SpellUsable';
import { Fragment } from 'react';

const ALLOWED_CASTS_DURING_DRW = [
  SPELLS.DEATH_STRIKE.id,
  SPELLS.HEART_STRIKE.id,
  SPELLS.BLOOD_BOIL.id,
  SPELLS.MARROWREND.id,
  SPELLS.CONSUMPTION_TALENT.id, // todo => test if new consumption talent actually works with DRW
];

class DancingRuneWeapon extends Analyzer {
  static dependencies = {
    spellUsable: SpellUsable,
    abilities: Abilities,
  };

  castsDuringDRW = [];

  DD_ABILITY = this.selectedCombatant.hasCovenant(COVENANTS.NIGHT_FAE.id)
    ? SPELLS.DEATHS_DUE
    : SPELLS.DEATH_AND_DECAY;

  constructor(options) {
    super(options);
    this.addEventListener(Events.cast.by(SELECTED_PLAYER), this.onCast);
  }

  onCast(event) {
    if (!this.selectedCombatant.hasBuff(SPELLS.DANCING_RUNE_WEAPON_BUFF.id)) {
      return;
    }

    //push all casts during DRW that were on the GCD in array
    if (
      event.ability.guid !== SPELLS.RAISE_ALLY.id && //probably usefull to rezz someone even if it's a personal DPS-loss
      event.ability.guid !== SPELLS.DANCING_RUNE_WEAPON.id && //because you get the DRW buff before the cast event since BFA
      this.abilities.getAbility(event.ability.guid) !== undefined &&
      this.abilities.getAbility(event.ability.guid).gcd
    ) {
      this.castsDuringDRW.push(event.ability.guid);
    }
  }

  get goodDRWCasts() {
    return this.castsDuringDRW.filter((val, index) => ALLOWED_CASTS_DURING_DRW.includes(val));
  }

  get SuggestionThresholds() {
    return {
      actual: this.goodDRWCasts.length / this.castsDuringDRW.length,
      isLessThan: {
        minor: 1,
        average: 0.9,
        major: 0.8,
      },
      style: 'percentage',
    };
  }

  spellLinks(id, index) {
    if (id === SPELLS.CONSUMPTION_TALENT.id) {
      return (
        <Fragment key={id}>
          and (if in AoE)
          <SpellLink id={id} />
        </Fragment>
      );
    } else if (index + 2 === ALLOWED_CASTS_DURING_DRW.length) {
      return (
        <Fragment key={id}>
          <SpellLink id={id} />{' '}
        </Fragment>
      );
    } else {
      return (
        <Fragment key={id}>
          <SpellLink id={id} />,{' '}
        </Fragment>
      );
    }
  }

  get goodDRWSpells() {
    return (
      <div>
        Try and prioritize {ALLOWED_CASTS_DURING_DRW.map((id, index) => this.spellLinks(id, index))}
      </div>
    );
  }

  suggestions(when) {
    when(this.SuggestionThresholds).addSuggestion((suggest, actual, recommended) =>
      suggest(
        <>
          Avoid casting spells during <SpellLink id={SPELLS.DANCING_RUNE_WEAPON.id} /> that don't
          benefit from the copies such as <SpellLink id={SPELLS.BLOODDRINKER_TALENT.id} /> and{' '}
          <SpellLink id={this.DD_ABILITY.id} />. Check the cooldown-tab below for more detailed
          breakdown.{this.goodDRWSpells}
        </>,
      )
        .icon(SPELLS.DANCING_RUNE_WEAPON.icon)
        .actual(
          t({
            id: 'deathknight.blood.suggestions.dancingRuneWeapon.numberCasts',
            message: `${this.goodDRWCasts.length} out of ${this.castsDuringDRW.length} casts during DRW were good`,
          }),
        )
        .recommended(`${this.castsDuringDRW.length} recommended`),
    );
  }
}

export default DancingRuneWeapon;
