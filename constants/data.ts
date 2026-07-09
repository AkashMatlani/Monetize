import { icons } from './icons';

export const tabs = [

    { name: 'index', title: "Home", icon: icons.home },
    { name: 'subscriptions', title: "Subscriptions", icon: icons.wallet },
    { name: 'insights', title: "Insights", icon: icons.activity },
    { name: 'settings', title: "Settings", icon: icons.setting },

];

export const UPCOMING_SUBSCRPTIONS: UpcomingSubscription[] = [
 {
        id: "spotify",
        icon: icons.spotify,
        name: "Spotify",
        price: 5.99,
        currency: "USD",
        daysLeft: 2,
    },
       {
        id: "notion",
        icon: icons.notion,
        name: "Notion",
        price: 12.0,
        currency: "USD",
        daysLeft: 4,
    },
]