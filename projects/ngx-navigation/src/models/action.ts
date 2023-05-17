export interface NavAction {
  name: string;
  icon: string;
  color?: string;
  action?: unknown;
  route?: string[];
}
