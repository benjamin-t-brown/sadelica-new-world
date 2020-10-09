const G_ACTORS_MAP = {};
const G_initActors = () => {
  const assignActor = (k, v) => {
    if (G_ACTORS_MAP[k]) {
      G_ACTORS_MAP[k].push(v);
    } else {
      G_ACTORS_MAP[k] = [v];
    }
  }

  assignActor('1,3,24,28', G_CH_ALINEA_DOCKMASTER_CLAIRE);
  assignActor('1,3,11,23', G_CH_ALINEA_BARTOLO_CALDEBURN);
  assignActor('1,3,34,19', G_CH_BARREL);
  assignActor('1,3,34,20', G_CH_BARREL);
  assignActor('1,3,35,19', G_CH_BARREL);
  assignActor('1,3,35,20', G_CH_BARREL);
  assignActor('1,3,49,19', G_CH_BARREL);
  assignActor('1,3,48,19', G_CH_BARREL);
  assignActor('1,3,49,20', G_CH_BARREL);
  assignActor('1,3,48,20', G_CH_BARREL);
  assignActor('1,3,49,21', G_CH_BARREL);
  assignActor('1,3,48,21', G_CH_BARREL);
  assignActor('1,3,49,22', G_CH_BARREL);
  assignActor('1,3,48,22', G_CH_BARREL);
  assignActor('1,3,49,23', G_CH_BARREL);
  assignActor('1,3,48,23', G_CH_BARREL);
  assignActor('1,3,49,24', G_CH_BARREL);
  assignActor('1,3,48,24', G_CH_BARREL);
  assignActor('1,3,44,35', G_CH_BARREL);
  assignActor('1,3,46,34', G_CH_BARREL);
  assignActor('1,3,45,32', G_CH_BARREL);
  assignActor('1,3,49,34', G_CH_BARREL);
  assignActor('1,3,48,30', G_CH_BARREL);
  assignActor('1,3,49,31', G_CH_BARREL);
  assignActor('1,3,47,32', G_CH_BARREL);
  assignActor('1,3,44,31', G_CH_CRATE);
  assignActor('1,3,34,23', G_CH_CRATE);
  assignActor('1,3,34,24', G_CH_CRATE);
  assignActor('1,3,35,24', G_CH_CRATE);
  assignActor('1,3,35,23', G_CH_CRATE);
  assignActor('1,3,16,29', G_CH_ALINEA_SIGN_REALM_EMBASSY);
  assignActor('1,3,26,46', G_CH_ALINEA_SOL);
  assignActor('1,3,15,26', G_CH_ALINEA_BARTENDER);
  assignActor('1,3,20,24', G_CH_ALINEA_SIGN_TAVERN);
  assignActor('1,3,24,31', G_CH_ALINEA_SIGN_DOCKS);
  assignActor('1,3,45,36', G_CH_ALINEA_SIGN_WAREHOUSE1);
  assignActor('1,3,45,29', G_CH_ALINEA_SIGN_WAREHOUSE1);
  assignActor('1,3,45,25', G_CH_ALINEA_SIGN_WAREHOUSE2);
  assignActor('1,3,45,18', G_CH_ALINEA_SIGN_WAREHOUSE2);
  assignActor('1,3,38,18', G_CH_ALINEA_SIGN_WAREHOUSE3);
  assignActor('1,3,38,25', G_CH_ALINEA_SIGN_WAREHOUSE3);
  assignActor('2,3,9,18', G_CH_ALINEA_SIGN_WAREHOUSE4);
  assignActor('2,3,9,25', G_CH_ALINEA_SIGN_WAREHOUSE4);
  assignActor('2,3,23,18', G_CH_ALINEA_SIGN_WAREHOUSE5);
  assignActor('2,3,23,25', G_CH_ALINEA_SIGN_WAREHOUSE5);
  assignActor('2,3,23,29', G_CH_ALINEA_SIGN_WAREHOUSE6);
  assignActor('2,3,23,36', G_CH_ALINEA_SIGN_WAREHOUSE6);
  assignActor('2,3,9,29', G_CH_ALINEA_SIGN_WAREHOUSE7);
  assignActor('2,3,9,36', G_CH_ALINEA_SIGN_WAREHOUSE7);
  assignActor('2,3,35,44', G_CH_ALINEA_SIGN_WAREHOUSE9);
  assignActor('1,3,14,7', G_CH_ALINEA_GUARD_STATIONARY);
  assignActor('1,3,11,7', G_CH_ALINEA_GUARD_STATIONARY);
  assignActor('1,3,7,44', G_CH_ALINEA_GUARD_STATIONARY);
  assignActor('1,3,53,8', G_CH_ALINEA_GUARD_STATIONARY);
  assignActor('1,3,53,17', G_CH_ALINEA_GUARD_STATIONARY);
  assignActor('1,3,57,27', G_CH_ALINEA_GUARD);
  assignActor('1,3,43,3', G_CH_ALINEA_GUARD);
  assignActor('1,3,7,3', G_CH_ALINEA_GUARD);
  assignActor('1,3,36,29', G_CH_ALINEA_GUARD);
  assignActor('1,3,8,36', G_CH_ALINEA_GUARD_CAPTAIN_MULLEN);
};
