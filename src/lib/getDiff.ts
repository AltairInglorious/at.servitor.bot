export function getDiff(time: string) {
    const _time = time.split(':')
    const now = new Date();
    const desiredTime = new Date();
    desiredTime.setHours(Number(_time[0]));
    desiredTime.setMinutes(Number(_time[1]));

    return desiredTime.getTime() - now.getTime()
}
