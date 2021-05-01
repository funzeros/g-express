export class RoleDTO {
  roleName = ""; // 角色姓名
  avatarUrl = ""; // 角色头像 url
  userId = 0;
  level = 1;
  pom = "1"; // 偏物理还是魔法
  aod = "1"; // 偏攻击还是防御
  str = 5;
  strg = 0;
  mind = 5;
  mindg = 0;
  vit = 5;
  vitg = 0;
  will = 5;
  willg = 0;
  mhp = 20;
  atk = 0;
  satk = 0;
  def = 0;
  sdef = 0;
  dod = 5;
  hit = 0;
  cri = 5;
  crd = 150;
  add = 0;
  fin = 0;
  red = 5;
  ign = 0;
  fen = 0;
  fre = 0;
  ien = 0;
  ere = 0;
  len = 0;
  lre = 0;
  den = 0;
  dre = 0;
  blockXY: number[][] = [
    [0, 0],
    [8, 8],
  ];
  blockXYS = "[[0,0],[8,8]]";
}