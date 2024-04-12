import {IconConfig} from "./icon-models";

export const baseIconAliases = {
  close: {mat: 'close', fa: {icon: 'far fa-times', scale: 0.8}},
  search: {mat: 'search', fa: {icon: 'far fa-search', scale: 0.7}},
  visible: {mat: 'visibility_outline', fa: {icon: 'far fa-eye', scale: 0.8}},
  hidden: {mat: 'visibility_off_outline', fa: {icon: 'far fa-eye-slash', scale: 0.8}},
  upload: {mat: 'cloud_upload_outline', fa: 'fal fa-cloud-arrow-up'},
  download: {mat: 'cloud_download_outline', fa: 'fal fa-cloud-arrow-down'},
  help: {mat: 'help', fa: 'fas fa-question-circle'},
  date: {mat: 'today', fa: 'far fa-calendar-day'},
  time: {mat: 'schedule_outline', fa: 'far fa-clock'},
  reload: {mat: 'refresh', fa: 'far fa-arrow-rotate-right'},
  loading: {mat: 'cached', fa: 'far fa-arrows-rotate'},
  upgrade: {mat: 'arrow_circle_up', fa: 'fas fa-circle-up'},
  back: {mat: 'arrow_back_ios_new', fa: 'fas fa-chevron-left'},
  burger: {mat: 'menu', fa: 'fas fa-bars'},
  add: {mat: 'add', fa: 'far fa-plus'},
  warning: {mat: 'warning', fa: 'fas fa-exclamation-triangle'},
  valid: {mat: 'check_circle', fa: 'far fa-circle-check'},
  down: {mat: 'expand_more', fa: 'far fa-chevron-down'},
  up: {mat: 'expand_less', fa: 'far fa-chevron-up'},
  edit: {mat: 'edit', fa: 'far fa-pen'},
} as const;

export type BaseIconAliases = keyof typeof baseIconAliases;

export type AliasTranslation = {
  mat: string;
  fa: string|IconConfig;
}
