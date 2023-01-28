import {ITimeObject} from "./interfaces/ITimeObject";
import {getDiff} from "./getDiff";
import {getUrlData} from "./getUrlData";
import {IScheldureObject} from "./interfaces/IScheldureObject";
import {broadcast} from "../module";

function getDate(): Promise<ITimeObject> {
    return new Promise((resolve, reject) => {
        getUrlData('https://api.aladhan.com/v1/timingsByCity?city=Zhytomyr&country=Ukraine&method=4')
            .then((res) => {
                if (res?.data?.timings) {
                    resolve(res.data.timings)
                } else {
                    reject('Invalid data got')
                }
            })
            .catch(e => reject(e))
    })
}


function getArr(time: ITimeObject): IScheldureObject[] {
    const timeOffset = (Number(process.env.TIME_OFFSET) | 0) * 3600000
    const res = []
    res.push({name: "Fajr", time: getDiff(time.Fajr) + timeOffset})
    res.push({name: "Dhuhr", time: getDiff(time.Dhuhr) + timeOffset})
    res.push({name: "Asr", time: getDiff(time.Asr) + timeOffset})
    res.push({name: "Maghrib", time: getDiff(time.Maghrib) + timeOffset})
    res.push({name: "Isha", time: getDiff(time.Isha) + timeOffset})
    return res
}

export async function getTiming(): Promise<IScheldureObject[]> {
    const time = await getDate()
    broadcast(`
Ассалам Алейкум!
Молитви на сьогодні:
[${time.Fajr}] - Fajr
[${time.Dhuhr}] - Dhuhr
[${time.Asr}] - Asr
[${time.Maghrib}] - Maghrib
[${time.Isha}] - Ish 
    `)
    return getArr(time)
}
