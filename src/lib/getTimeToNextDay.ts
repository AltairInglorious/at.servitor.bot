export function getTimeToNextDay(): number {
    const currentDate = new Date();
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    nextDate.setHours(0, 5)
    return nextDate.getTime() - currentDate.getTime();
}
