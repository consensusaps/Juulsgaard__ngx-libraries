
export const IconProvider = {
  Material: 'mat',
  FontAwesome: 'fa'
} as const;

export type IconProviders = typeof IconProvider[keyof typeof IconProvider];
