import {IconConfig} from "./icon-models";

export const baseIconAliases = {
  close: {mat: 'close', fa: 'far fa-times'},
  search: {mat: 'search', fa: {icon: 'far fa-search', scale: 0.7}},
  visible: {mat: 'visibility_outline', fa: 'far fa-eye'},
  hidden: {mat: 'visibility_off_outline', fa: 'far fa-eye-slash'},
  upload: {mat: 'cloud_upload_outline', fa: 'far cloud-arrow-up'},
  download: {mat: 'cloud_download_outline', fa: 'far fa-cloud-arrow-down'},
  help: {mat: 'help', fa: 'fas fa-question-circle'},
  date: {mat: 'calendar_month_outline', fa: 'far fa-calendar'},
  time: {mat: 'schedule_outline', fa: 'far fa-clock'},
  reload: {mat: 'refresh', fa: 'far fa-arrow-rotate-right'},
  loading: {mat: 'cached', fa: 'far fa-arrows-rotate'},
  upgrade: {mat: 'arrow_circle_up', fa: 'fas fa-circle-up'},
} as const;

export type BaseIconAliases = keyof typeof baseIconAliases;

export type AliasTranslation = {
  mat: string;
  fa: string|IconConfig;
}
