// declare class DEFAULT {
//     DEFAULT_THROTTLE_RATES: {
//         user: any;
//         anon: any;
//     };
// }

interface THROTTLE_RATES {
    user: any;
    anon: any;
}

declare interface DEFAULT_SETTINGS {
    DEFAULT_THROTTLE_RATES: THROTTLE_RATES
}


declare let DEFAULT: DEFAULT_SETTINGS


module.exports = DEFAULT