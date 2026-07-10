
import activity from "@/assets/icons/activity.png";
import add from "@/assets/icons/add.png";
import adobe from "@/assets/icons/adobe.png";
import github from "@/assets/icons/github.png";
import home from "@/assets/icons/home.png";
import notion from "@/assets/icons/notion.png";
import setting from "@/assets/icons/setting.png";
import spotify from "@/assets/icons/spotify.png";
import wallet from "@/assets/icons/wallet.png";

export const icons = {
    home,
    wallet,
    activity,
    setting,
    add,
    spotify,
    notion,
    adobe,
    github,
} as const;

export type IconKey = keyof typeof icons;
