import { ImageSourcePropType } from "react-native";

/** Native cover art ratio (1672×941). Card frames lock to this so nothing crops. */
export const CAPSULE_ART_ASPECT = 1672 / 941;

/** Cover art keyed by capsule code. Filenames are ASCII-safe JPGs in /img. */
export const capsuleArt: Partial<Record<string, ImageSourcePropType>> = {
  // CALM
  "C-01": require("../../img/calmme.jpg"),
  "C-02": require("../../img/Serene.jpg"),
  "C-03": require("../../img/tranquil.jpg"),
  "C-04": require("../../img/content.jpg"),
  "C-05": require("../../img/Kava.jpg"),
  "C-06": require("../../img/AntiMigraine.jpg"),
  "C-07": require("../../img/GrayBGone.jpg"),
  "C-08": require("../../img/aftermath.jpg"),

  // SLEEP
  "S-01": require("../../img/SleepingAngel.jpg"),
  "S-02": require("../../img/insomniac.jpg"),
  "S-03": require("../../img/delta.jpg"),
  "S-04": require("../../img/SoftFall.jpg"),
  "S-05": require("../../img/Anesthesia.jpg"),
  "S-06": require("../../img/Poppy.jpg"),
  "S-07": require("../../img/Morpheus.jpg"),

  // FOCUS
  "F-01": require("../../img/LaserFocus.jpg"),
  "F-02": require("../../img/beta.jpg"),
  "F-03": require("../../img/BrainPlus.jpg"),
  "F-04": require("../../img/condition.jpg"),
  "F-05": require("../../img/Confidence.jpg"),
  "F-06": require("../../img/Ginko.jpg"),
  "F-07": require("../../img/Gamma.jpg"),

  // EUPHORIA
  "E-01": require("../../img/Euphoria.jpg"),
  "E-02": require("../../img/Bliss.jpg"),
  "E-03": require("../../img/QuickHappy.jpg"),
  "E-04": require("../../img/AntiSad.jpg"),
  "E-05": require("../../img/Afterglow.jpg"),
  "E-06": require("../../img/Victory.jpg"),
  "E-07": require("../../img/5HTP.jpg"),
  "E-08": require("../../img/RAVE.jpg"),

  // RESET
  "R-01": require("../../img/Reset.jpg"),
  "R-02": require("../../img/hangovercure.jpg"),
  "R-03": require("../../img/QuitSmoking.jpg"),
  "R-04": require("../../img/Prozium.jpg"),
  "R-05": require("../../img/Extend.jpg"),

  // TRANCE
  "T-01": require("../../img/Genesis.jpg"),
  "T-02": require("../../img/Theta.jpg"),
  "T-03": require("../../img/alpha.jpg"),
  "T-04": require("../../img/Trip.jpg"),
  "T-05": require("../../img/DesertBloom.jpg"),
  "T-06": require("../../img/Oracle.jpg"),
  "T-07": require("../../img/Breakthrough.jpg"),
  "T-08": require("../../img/Lucy.jpg"),
  "T-09": require("../../img/Kaleidoscope.jpg"),
  "T-10": require("../../img/Weightless.jpg"),
  "T-11": require("../../img/SlowMotion.jpg"),
  "T-12": require("../../img/Sonoran.jpg"),
  "T-13": require("../../img/Epsilon.jpg"),
  "T-14": require("../../img/GodsTouch.jpg"),
  "T-15": require("../../img/GateOfHell.jpg"),
  "T-16": require("../../img/Mystery.jpg"),
  "T-17": require("../../img/YouChoose.jpg"),

  // DREAM
  "D-01": require("../../img/LucidDream.jpg"),
  "D-02": require("../../img/AstralProjection.jpg"),
  "D-03": require("../../img/AstralTravel.jpg"),
  "D-04": require("../../img/outofbody.jpg"),

  // ENERGY
  "N-01": require("../../img/energizer.jpg"),
  "N-02": require("../../img/Adrenaline.jpg"),
  "N-03": require("../../img/Rush.jpg"),
  "N-04": require("../../img/Sevoflurane.jpg"),
  "N-05": require("../../img/Isoflurane.jpg"),
  "N-06": require("../../img/Desflurane.jpg"),
  "N-07": require("../../img/Desflurane.jpg"),
  "N-08": require("../../img/Ignition.jpg"),
  "N-09": require("../../img/RedHot.jpg"),
  "N-10": require("../../img/Crossfire.jpg"),
  "N-11": require("../../img/JuiceIT.jpg"),
  "N-12": require("../../img/Excite.jpg"),
  "N-13": require("../../img/FrenchRoast.jpg"),
  "N-14": require("../../img/A-Bomb.jpg"),
  "N-15": require("../../img/Scarlet.jpg"),

  // CREATIVE
  "A-01": require("../../img/inspire.jpg"),
  "A-02": require("../../img/chakra.jpg"),
  "A-03": require("../../img/MorningGlory.jpg"),
  "A-04": require("../../img/blacksunshine.jpg"),
  "A-05": require("../../img/cliffHanger.jpg"),

  // GROUND
  "G-01": require("../../img/Nightcap.jpg"),
  "G-02": require("../../img/GreenFairy.jpg"),
  "G-03": require("../../img/BlackGold.jpg"),
  "G-04": require("../../img/MaryJane.jpg"),
  "G-05": require("../../img/Relief.jpg"),
  "G-06": require("../../img/Comfort.jpg"),
  "G-07": require("../../img/SlowBlue.jpg"),
  "G-08": require("../../img/Halothane.jpg"),
  "G-09": require("../../img/Ember.jpg"),
  "G-10": require("../../img/SweetAir.jpg"),
  "G-11": require("../../img/Vapor.jpg"),
  "G-12": require("../../img/ECT.jpg"),
  "G-13": require("../../img/Diet.jpg"),

  // PRO
  "P-01": require("../../img/Climax.jpg"),
  "P-02": require("../../img/Encore.jpg"),
  "P-03": require("../../img/Heat.jpg"),
  "P-04": require("../../img/BluePill.jpg"),
  "P-05": require("../../img/NightTide.jpg"),
  "P-06": require("../../img/FirstLove.jpg"),
  "P-07": require("../../img/Succubus.jpg"),
};

export function artForCode(code: string): ImageSourcePropType | undefined {
  return capsuleArt[code];
}
