import SPELLS from 'common/SPELLS';
import { SpellList } from 'common/SPELLS/Spell';

const SHARED_ABILITY_COOLDOWNS: SpellList[] = [
  SPELLS.CRIMSON_VIAL,
  SPELLS.SPRINT,
  SPELLS.KIDNEY_SHOT,
  SPELLS.EVASION,
  SPELLS.FEINT,
  SPELLS.BLIND,
  SPELLS.CLOAK_OF_SHADOWS,
  SPELLS.TRICKS_OF_THE_TRADE,
  SPELLS.SHROUD_OF_CONCEALMENT,
];

export const SUBTLETY_ABILITY_COOLDOWNS: SpellList[] = [
  SPELLS.SHADOWSTEP,
  SPELLS.SHADOW_DANCE,
  SPELLS.SYMBOLS_OF_DEATH,
  SPELLS.SHADOW_BLADES,
  ...SHARED_ABILITY_COOLDOWNS,
];

export const ASSASSINATION_ABILITY_COOLDOWNS: SpellList[] = [
  SPELLS.SHADOWSTEP,
  SPELLS.VENDETTA,
  ...SHARED_ABILITY_COOLDOWNS,
];

export const OUTLAW_ABILITY_COOLDOWNS: SpellList[] = [
  SPELLS.BETWEEN_THE_EYES,
  SPELLS.BLADE_FLURRY,
  SPELLS.ROLL_THE_BONES,
  SPELLS.ADRENALINE_RUSH,
  SPELLS.GRAPPLING_HOOK,
  ...SHARED_ABILITY_COOLDOWNS,
];

export const ASSASSINATION_BLEED_DEBUFFS = [
  SPELLS.GARROTE,
  SPELLS.RUPTURE,
  SPELLS.CRIMSON_TEMPEST_TALENT,
  SPELLS.INTERNAL_BLEEDING_TALENT,
];

//region Legendaries
// 1 second per 30 energy cost
export const ASS_VEN_CDR_PER_ENERGY = 1000 / 30;
//endregion
