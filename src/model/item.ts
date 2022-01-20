export interface Item {
  name: string;
  stackable?: boolean;
  onUse?: () => void;
  onEquip?: () => void;
}
