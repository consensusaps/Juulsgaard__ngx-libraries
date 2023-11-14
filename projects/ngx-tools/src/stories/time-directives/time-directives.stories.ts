import {Meta, StoryObj} from "@storybook/angular";
import {TimeDirectivePreviewComponent} from "./time-directive-preview/time-directive-preview.component";

export default {
  title: 'Time Directives',
  component: TimeDirectivePreviewComponent,
  render: (args) => ({props: args}),
  decorators: []
} satisfies Meta;

type Story = StoryObj<TimeDirectivePreviewComponent>;



const dayBefore = new Date();
dayBefore.setDate(dayBefore.getDate() - 1);
dayBefore.setHours(dayBefore.getHours() - 1);

const hoursBefore = new Date();
hoursBefore.setHours(hoursBefore.getHours() - 2);

const minutesBefore = new Date();
minutesBefore.setMinutes(minutesBefore.getMinutes() - 10);

const minutesAfter = new Date();
minutesAfter.setMinutes(minutesAfter.getMinutes() + 2);

const hoursAfter = new Date();
hoursAfter.setHours(hoursAfter.getHours() + 2);

const dayAfter = new Date();
dayAfter.setDate(dayAfter.getDate() + 1);
dayAfter.setHours(dayAfter.getHours() + 1);

export const Minutes: Story = {
  args: {countdown: minutesAfter, timeAgo: minutesBefore}
};

export const Hours: Story = {
  args: {countdown: hoursAfter, timeAgo: hoursBefore}
};

export const Days: Story = {
  args: {countdown: dayAfter, timeAgo: dayBefore}
};
